"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  FileText,
  Boxes,
  Sparkles,
  Home,
  Library,
  Shield,
  CornerDownLeft,
} from "lucide-react";
import { documents, projects } from "@/lib/demo-data";
import { cn } from "@/lib/utils";

type Item = {
  id: string;
  label: string;
  hint: string;
  href: string;
  icon: typeof Home;
};

export function CommandPalette() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const pages: Item[] = [
    { id: "home", label: "Home", hint: "Overview", href: "/dashboard", icon: Home },
    { id: "projects", label: "Projects", hint: "Workspaces", href: "/dashboard/projects", icon: Boxes },
    { id: "documents", label: "Documents", hint: "All files", href: "/dashboard/documents", icon: FileText },
    { id: "kb", label: "Knowledge Base", hint: "Search everything", href: "/dashboard/knowledge-base", icon: Library },
    { id: "assistant", label: "AI Assistant", hint: "Ask Claude", href: "/dashboard/assistant", icon: Sparkles },
    { id: "admin", label: "Admin Panel", hint: "Manage", href: "/dashboard/admin", icon: Shield },
  ];

  const docItems: Item[] = documents.map((d) => ({
    id: d.id,
    label: d.name,
    hint: d.projectName,
    href: `/dashboard/documents/${d.id}`,
    icon: FileText,
  }));

  const projItems: Item[] = projects.map((p) => ({
    id: p.id,
    label: p.name,
    hint: "Workspace",
    href: `/dashboard/projects/${p.id}`,
    icon: Boxes,
  }));

  const all = [...pages, ...projItems, ...docItems];
  const filtered = query
    ? all.filter((i) => i.label.toLowerCase().includes(query.toLowerCase()))
    : all.slice(0, 8);

  function go(item: Item) {
    setOpen(false);
    setQuery("");
    router.push(item.href);
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="flex h-9 w-64 items-center gap-2 rounded-md border border-border bg-muted/50 px-3 text-sm text-muted-foreground transition-colors hover:bg-muted"
      >
        <Search className="h-4 w-4" />
        <span className="flex-1 text-left">Search everywhere…</span>
        <kbd className="rounded border border-border bg-card px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
          ⌘K
        </kbd>
      </button>
    );
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-navy-950/40 p-4 pt-[12vh] backdrop-blur-sm"
      onClick={() => setOpen(false)}
    >
      <div
        className="w-full max-w-xl overflow-hidden rounded-xl border border-border bg-card shadow-elevated animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 border-b border-border px-4">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            autoFocus
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActive(0);
            }}
            onKeyDown={(e) => {
              if (e.key === "ArrowDown")
                setActive((a) => Math.min(a + 1, filtered.length - 1));
              if (e.key === "ArrowUp") setActive((a) => Math.max(a - 1, 0));
              if (e.key === "Enter" && filtered[active]) go(filtered[active]);
            }}
            placeholder="Search projects, documents, pages…"
            className="h-12 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
          <kbd className="rounded border border-border bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">
            ESC
          </kbd>
        </div>
        <div className="max-h-80 overflow-y-auto p-2">
          {filtered.length === 0 && (
            <div className="px-3 py-8 text-center text-sm text-muted-foreground">
              No results for “{query}”
            </div>
          )}
          {filtered.map((item, i) => (
            <button
              key={item.id}
              onMouseEnter={() => setActive(i)}
              onClick={() => go(item)}
              className={cn(
                "flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-left text-sm transition-colors",
                i === active ? "bg-muted" : "hover:bg-muted/60"
              )}
            >
              <item.icon className="h-4 w-4 shrink-0 text-graphite-400" />
              <span className="flex-1 truncate font-medium text-graphite-800">
                {item.label}
              </span>
              <span className="text-xs text-muted-foreground">{item.hint}</span>
              {i === active && (
                <CornerDownLeft className="h-3.5 w-3.5 text-muted-foreground" />
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
