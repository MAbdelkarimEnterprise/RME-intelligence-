# RME · Engineering Intelligence Platform

An internal, AI-powered knowledge platform for **Rowad Modern Engineering (RME)**.
Upload engineering documents, organize them into project workspaces, and query
organizational knowledge through **Anthropic Claude** with retrieval-augmented
generation (RAG) — grounded answers, with citations, no hallucinations.

Built to feel like ChatGPT Enterprise × Claude Projects × Notion, with an
executive, engineering-grade visual identity.

---

## ✨ What's included

| Area | Status |
|------|--------|
| Premium landing page (engineering grid hero) | ✅ |
| Enterprise login — email + Microsoft SSO-ready + password recovery | ✅ |
| Dashboard shell — sidebar, topbar, ⌘K command palette | ✅ |
| Drag & drop upload (PDF/DOCX/XLSX/PPTX/TXT) with progress + indexing states | ✅ |
| Project workspaces (each = its own knowledge base) | ✅ |
| Split-screen document viewer + AI chat (Claude Projects style) | ✅ |
| Company knowledge base + search-everywhere | ✅ |
| AI assistant with confidence indicators + source citations | ✅ |
| Analytics (uploads, conversations, top docs, active users) | ✅ |
| Admin panel — users, roles, projects, files, audit log | ✅ |
| Supabase schema + pgvector + RLS migration | ✅ |
| Claude RAG API route (retrieval → grounded answer) | ✅ |
| Ingestion pipeline (chunk → embed → store) | ✅ |

The app runs **out of the box in demo mode** (no keys) so every screen is
navigable. Add keys to switch on live auth + RAG.

---

## 🧱 Tech stack

- **Next.js 15** (App Router) · **TypeScript** · **Tailwind CSS**
- **Supabase** — Auth, Storage, Postgres + **pgvector**
- **Anthropic Claude API** — answering
- **Voyage AI** — embeddings (Anthropic's recommended RAG embedder)
- **Vercel** — deployment target

---

## 🚀 Getting started

```bash
cd rme-platform
npm install
cp .env.example .env.local      # optional for demo mode
npm run dev                     # http://localhost:3000
```

Visit `/` for the landing page, then **Launch Platform → Sign in** (any email
works in demo mode) to reach `/dashboard`.

---

## 🔌 Going live (full RAG)

### 1. Supabase
1. Create a project at [supabase.com](https://supabase.com).
2. SQL editor → paste & run `supabase/migrations/0001_init.sql`
   (enables pgvector, creates tables, RLS, and the `match_chunks` function).
3. Create a **Storage bucket** named `documents` (private).
4. Copy your Project URL, anon key and service-role key into `.env.local`.

### 2. Anthropic + embeddings
- Add `ANTHROPIC_API_KEY` ([console.anthropic.com](https://console.anthropic.com)).
- Add `VOYAGE_API_KEY` ([voyageai.com](https://www.voyageai.com)) for embeddings.
- Keep `EMBED_DIMENSIONS` in `.env.local` equal to the `vector(N)` dimension in
  the migration (default **1024** for `voyage-3`).

### 3. Flip the switch
Set `NEXT_PUBLIC_DEMO_MODE=false`. With keys present the app uses real
Supabase auth and live RAG automatically.

---

## 🧠 How RAG works here

```
Upload ─► Storage ─► parse (LangChain loaders) ─► chunk ─► embed (Voyage)
                                                              │
                                                              ▼
                                                     pgvector (chunks)
User question ─► embed query ─► match_chunks() ─► top-k context
                                                              │
                                                              ▼
                              Claude (grounded system prompt) ─► cited answer
```

- **Retrieval** — `src/lib/ai/retrieval.ts` (`match_chunks` cosine search).
- **Answering** — `src/app/api/chat/route.ts` + `src/lib/ai/claude.ts`.
  The system prompt forces Claude to answer **only** from retrieved context and
  to cite sources; if the answer isn't in the documents, it says so.
- **Ingestion** — `src/lib/ai/ingest.ts` (chunk + embed + store).

### To finish file ingestion
`src/app/api/upload/route.ts` has the wiring points marked: upload to Storage →
insert `documents` row → extract text via the matching LangChain loader
(`pdf-parse`/`mammoth`/`xlsx`/pptx) → `await ingestDocument(...)`. Run ingestion
in a background job for large files.

---

## 🎨 Branding — swap in the real RME assets

- **Logo:** drop `rme-logo.svg` into `/public` and replace the monogram in
  `src/components/brand/logo.tsx` (one marked line).
- **Accent color:** edit `accent` in `tailwind.config.ts` to RME's official hex
  (currently a placeholder brick-red). The navy/graphite/steel palette is
  already set per the brief.
- **Font:** Inter is wired via `next/font`. Swap for IBM Plex Sans / Geist in
  `src/app/layout.tsx` if preferred.

---

## 🔐 Security model

Four roles — **Admin · Manager · Engineer · Viewer** — enforced through Supabase
Row Level Security (`is_admin()`, `can_access_project()`), per-project
membership, an audit log table, and encryption at rest/in transit via Supabase.

---

## 📁 Structure

```
src/
├── app/
│   ├── page.tsx                  Landing
│   ├── login/ · recover/         Auth
│   ├── dashboard/                Home, projects, documents, kb,
│   │                             assistant, analytics, admin, settings
│   │   ├── documents/[id]/       Split-screen viewer + chat
│   │   └── projects/[id]/        Workspace + scoped assistant
│   └── api/chat · api/upload     RAG + ingestion endpoints
├── components/  brand · ui · app
├── lib/
│   ├── ai/        claude · embeddings · retrieval · ingest
│   ├── supabase/  client · server
│   ├── demo-data.ts · types.ts · utils.ts · env.ts
└── middleware.ts                 Session refresh + route guard
supabase/migrations/0001_init.sql  Schema + pgvector + RLS
```

---

© Rowad Modern Engineering — internal platform. Version 1.
