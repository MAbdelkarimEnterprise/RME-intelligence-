-- ════════════════════════════════════════════════════════════════
-- RME Engineering Intelligence Platform — initial schema
-- Postgres + pgvector (Supabase)
-- Run in the Supabase SQL editor, or via `supabase db push`.
-- ════════════════════════════════════════════════════════════════

create extension if not exists "vector";
create extension if not exists "pgcrypto";

-- ── Enums ───────────────────────────────────────────────────────
do $$ begin
  create type user_role as enum ('Admin', 'Manager', 'Engineer', 'Viewer');
exception when duplicate_object then null; end $$;

do $$ begin
  create type doc_status as enum ('uploading', 'processing', 'ready', 'failed');
exception when duplicate_object then null; end $$;

-- ── Profiles (extends auth.users) ───────────────────────────────
create table if not exists profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  full_name   text not null default '',
  email       text not null,
  role        user_role not null default 'Viewer',
  department  text default '',
  created_at  timestamptz not null default now()
);

-- ── Projects (workspaces) ───────────────────────────────────────
create table if not exists projects (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  description text default '',
  color       text default '#243a6b',
  created_by  uuid references profiles(id) on delete set null,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- ── Project membership (permissions) ────────────────────────────
create table if not exists project_members (
  project_id uuid references projects(id) on delete cascade,
  user_id    uuid references profiles(id) on delete cascade,
  role       user_role not null default 'Engineer',
  primary key (project_id, user_id)
);

-- ── Documents ───────────────────────────────────────────────────
create table if not exists documents (
  id           uuid primary key default gen_random_uuid(),
  project_id   uuid not null references projects(id) on delete cascade,
  name         text not null,
  file_type    text not null,
  size_bytes   bigint not null default 0,
  storage_path text,                       -- Supabase Storage object path
  pages        int,
  status       doc_status not null default 'processing',
  uploaded_by  uuid references profiles(id) on delete set null,
  created_at   timestamptz not null default now()
);

-- ── Chunks (vector store) ───────────────────────────────────────
-- NOTE: keep vector(1024) in sync with EMBED_DIMENSIONS (voyage-3 = 1024).
create table if not exists chunks (
  id          uuid primary key default gen_random_uuid(),
  document_id uuid not null references documents(id) on delete cascade,
  project_id  uuid not null references projects(id) on delete cascade,
  content     text not null,
  page        int,
  embedding   vector(1024),
  created_at  timestamptz not null default now()
);

-- Approximate-nearest-neighbour index (cosine).
create index if not exists chunks_embedding_idx
  on chunks using ivfflat (embedding vector_cosine_ops) with (lists = 100);
create index if not exists chunks_project_idx on chunks(project_id);
create index if not exists documents_project_idx on documents(project_id);

-- ── Conversations + messages ────────────────────────────────────
create table if not exists conversations (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid references profiles(id) on delete cascade,
  project_id uuid references projects(id) on delete set null,
  title      text default 'New conversation',
  created_at timestamptz not null default now()
);

create table if not exists messages (
  id              uuid primary key default gen_random_uuid(),
  conversation_id uuid references conversations(id) on delete cascade,
  role            text not null check (role in ('user','assistant')),
  content         text not null,
  citations       jsonb default '[]'::jsonb,
  confidence      real,
  created_at      timestamptz not null default now()
);

-- ── Audit log ───────────────────────────────────────────────────
create table if not exists audit_log (
  id         uuid primary key default gen_random_uuid(),
  actor_id   uuid references profiles(id) on delete set null,
  actor_name text,
  action     text not null,
  target     text,
  created_at timestamptz not null default now()
);

-- ════════════════════════════════════════════════════════════════
-- Vector similarity search (RAG retrieval), optionally project-scoped
-- ════════════════════════════════════════════════════════════════
create or replace function match_chunks(
  query_embedding vector(1024),
  match_count int default 8,
  filter_project uuid default null
)
returns table (
  id uuid,
  content text,
  document_id uuid,
  document_name text,
  page int,
  similarity float
)
language sql stable
as $$
  select
    c.id,
    c.content,
    c.document_id,
    d.name as document_name,
    c.page,
    1 - (c.embedding <=> query_embedding) as similarity
  from chunks c
  join documents d on d.id = c.document_id
  where filter_project is null or c.project_id = filter_project
  order by c.embedding <=> query_embedding
  limit match_count;
$$;

-- ════════════════════════════════════════════════════════════════
-- Row Level Security
-- ════════════════════════════════════════════════════════════════
alter table profiles        enable row level security;
alter table projects        enable row level security;
alter table project_members enable row level security;
alter table documents       enable row level security;
alter table chunks          enable row level security;
alter table conversations   enable row level security;
alter table messages        enable row level security;
alter table audit_log       enable row level security;

-- Helper: is the current user an Admin?
create or replace function is_admin()
returns boolean language sql stable as $$
  select exists(
    select 1 from profiles
    where id = auth.uid() and role = 'Admin'
  );
$$;

-- Helper: can the current user access a project?
create or replace function can_access_project(p uuid)
returns boolean language sql stable as $$
  select is_admin() or exists(
    select 1 from project_members
    where project_id = p and user_id = auth.uid()
  );
$$;

-- Profiles: a user sees their own profile; Admins see all.
create policy "profiles self/admin read" on profiles
  for select using (id = auth.uid() or is_admin());
create policy "profiles self update" on profiles
  for update using (id = auth.uid());

-- Projects: members + admins.
create policy "projects member read" on projects
  for select using (can_access_project(id));
create policy "projects admin write" on projects
  for all using (is_admin()) with check (is_admin());

-- Project members: admins manage; users see their own memberships.
create policy "members read" on project_members
  for select using (user_id = auth.uid() or is_admin());
create policy "members admin write" on project_members
  for all using (is_admin()) with check (is_admin());

-- Documents: accessible if you can access the project.
create policy "documents read" on documents
  for select using (can_access_project(project_id));
create policy "documents write" on documents
  for insert with check (can_access_project(project_id));

-- Chunks: read scoped to accessible projects (writes go via service role).
create policy "chunks read" on chunks
  for select using (can_access_project(project_id));

-- Conversations + messages: owner only.
create policy "conversations own" on conversations
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "messages own" on messages
  for all using (
    exists (select 1 from conversations c
            where c.id = conversation_id and c.user_id = auth.uid())
  );

-- Audit log: Admins read; inserts via service role.
create policy "audit admin read" on audit_log
  for select using (is_admin());

-- ── Auto-create a profile on signup ─────────────────────────────
create or replace function handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into profiles (id, email, full_name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'full_name',''));
  return new;
end; $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();
