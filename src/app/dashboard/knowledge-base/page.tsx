"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, Library, Sparkles, FileText } from "lucide-react";
import { Topbar } from "@/components/app/topbar";
import { Card, Badge } from "@/components/ui/primitives";
import { FileIcon } from "@/components/ui/file-icon";
import { Input } from "@/components/ui/input";
import { documents, projects } from "@/lib/demo-data";
import { formatBytes } from "@/lib/utils";

const categories = [
  "SOPs",
  "Technical Documents",
  "Project Reports",
  "Client Documents",
  "Meeting Notes",
];

export default function KnowledgeBasePage() {
  const [query, setQuery] = useState("");
  const results = query
    ? documents.filter((d) =>
        d.name.toLowerCase().includes(query.toLowerCase())
      )
    : documents;

  return (
    <>
      <Topbar title="Knowledge Base" />
      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-5xl px-6 py-10">
          <div className="text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-navy-800 text-white">
              <Library className="h-6 w-6" />
            </div>
            <h2 className="mt-4 text-2xl font-bold tracking-tight text-navy-900">
              Company Knowledge Base
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              One searchable memory across every project. Answers are retrieved
              only from indexed RME documents.
            </p>

            <div className="relative mx-auto mt-6 max-w-2xl">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search across all documents and projects…"
                className="h-14 pl-12 pr-4 text-base"
              />
            </div>

            {query && (
              <Link
                href={`/dashboard/assistant`}
                className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-accent hover:text-accent-hover"
              >
                <Sparkles className="h-4 w-4" />
                Ask the assistant: “{query}”
              </Link>
            )}
          </div>

          {/* Categories */}
          <div className="mt-9 flex flex-wrap justify-center gap-2">
            {categories.map((c) => (
              <span
                key={c}
                className="rounded-full border border-border bg-card px-3.5 py-1.5 text-xs font-medium text-graphite-600 shadow-sm"
              >
                {c}
              </span>
            ))}
          </div>

          {/* Sources by project */}
          <div className="mt-9 grid gap-4 sm:grid-cols-2">
            {projects.map((p) => (
              <Link key={p.id} href={`/dashboard/projects/${p.id}`}>
                <Card className="flex items-center gap-3 p-4 transition-colors hover:bg-muted/40">
                  <span
                    className="flex h-9 w-9 items-center justify-center rounded-lg text-white"
                    style={{ backgroundColor: p.color }}
                  >
                    <FileText className="h-4 w-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-semibold text-navy-900">
                      {p.name}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {p.documentCount} indexed documents
                    </div>
                  </div>
                  <Badge tone="navy">Indexed</Badge>
                </Card>
              </Link>
            ))}
          </div>

          {/* Search results */}
          {query && (
            <div className="mt-8">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {results.length} matching documents
              </p>
              <Card className="divide-y divide-border">
                {results.map((d) => (
                  <Link
                    key={d.id}
                    href={`/dashboard/documents/${d.id}`}
                    className="flex items-center gap-3 px-5 py-3 transition-colors hover:bg-muted/50"
                  >
                    <FileIcon type={d.type} size={34} />
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm font-medium text-graphite-800">
                        {d.name}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {d.projectName} · {formatBytes(d.size)}
                      </div>
                    </div>
                  </Link>
                ))}
              </Card>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
