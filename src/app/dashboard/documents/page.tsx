"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, LayoutGrid, List as ListIcon, Filter } from "lucide-react";
import { Topbar } from "@/components/app/topbar";
import { UploadDropzone } from "@/components/app/upload-dropzone";
import { FileIcon } from "@/components/ui/file-icon";
import { Badge, Card } from "@/components/ui/primitives";
import { Input } from "@/components/ui/input";
import { projects } from "@/lib/demo-data";
import { useDocumentsStore } from "@/components/app/documents-store";
import { formatBytes, formatDate, cn } from "@/lib/utils";

export default function DocumentsPage() {
  const [query, setQuery] = useState("");
  const [view, setView] = useState<"grid" | "list">("list");
  const [project, setProject] = useState<string>("all");
  const { docs, addDocument, setDocumentText } = useDocumentsStore();

  const filtered = docs.filter(
    (d) =>
      (project === "all" || d.projectId === project) &&
      d.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <>
      <Topbar title="Documents" />
      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-7xl px-6 py-7">
          <Card className="p-6">
            <h2 className="text-sm font-semibold text-navy-900">
              Upload to the knowledge base
            </h2>
            <p className="mt-1 text-xs text-muted-foreground">
              Files are parsed, chunked and embedded for retrieval. Supported:
              PDF, DOCX, XLSX, PPTX, TXT.
            </p>
            <div className="mt-4">
              <UploadDropzone onConfirm={(d) => addDocument(d)} onText={setDocumentText} />
            </div>
          </Card>

          {/* Toolbar */}
          <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative w-full sm:max-w-xs">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search documents…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Filter className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                <select
                  value={project}
                  onChange={(e) => setProject(e.target.value)}
                  className="h-10 rounded-md border border-border bg-card pl-8 pr-3 text-sm text-graphite-700 outline-none focus:border-navy-400"
                >
                  <option value="all">All projects</option>
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex rounded-md border border-border bg-card p-0.5">
                <button
                  onClick={() => setView("list")}
                  className={cn(
                    "rounded p-1.5",
                    view === "list"
                      ? "bg-navy-800 text-white"
                      : "text-graphite-400 hover:text-navy-700"
                  )}
                >
                  <ListIcon className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setView("grid")}
                  className={cn(
                    "rounded p-1.5",
                    view === "grid"
                      ? "bg-navy-800 text-white"
                      : "text-graphite-400 hover:text-navy-700"
                  )}
                >
                  <LayoutGrid className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Results */}
          {view === "list" ? (
            <Card className="mt-4 overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-xs uppercase tracking-wider text-muted-foreground">
                    <th className="px-5 py-3 font-medium">Name</th>
                    <th className="hidden px-5 py-3 font-medium md:table-cell">
                      Project
                    </th>
                    <th className="hidden px-5 py-3 font-medium sm:table-cell">
                      Size
                    </th>
                    <th className="hidden px-5 py-3 font-medium lg:table-cell">
                      Uploaded
                    </th>
                    <th className="px-5 py-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filtered.map((d) => (
                    <tr
                      key={d.id}
                      className="group transition-colors hover:bg-muted/50"
                    >
                      <td className="px-5 py-3">
                        <Link
                          href={`/dashboard/documents/${d.id}`}
                          className="flex items-center gap-3"
                        >
                          <FileIcon type={d.type} size={36} />
                          <div className="min-w-0">
                            <div className="truncate font-medium text-graphite-800 group-hover:text-navy-900">
                              {d.name}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {d.uploadedBy}
                            </div>
                          </div>
                        </Link>
                      </td>
                      <td className="hidden px-5 py-3 text-graphite-600 md:table-cell">
                        {d.projectName}
                      </td>
                      <td className="hidden px-5 py-3 text-graphite-600 sm:table-cell">
                        {formatBytes(d.size)}
                      </td>
                      <td className="hidden px-5 py-3 text-graphite-600 lg:table-cell">
                        {formatDate(d.uploadedAt)}
                      </td>
                      <td className="px-5 py-3">
                        <StatusBadge status={d.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
          ) : (
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((d) => (
                <Link key={d.id} href={`/dashboard/documents/${d.id}`}>
                  <Card className="p-5 transition-all hover:-translate-y-0.5 hover:shadow-elevated">
                    <div className="flex items-start justify-between">
                      <FileIcon type={d.type} size={44} />
                      <StatusBadge status={d.status} />
                    </div>
                    <div className="mt-4 line-clamp-2 text-sm font-medium text-graphite-800">
                      {d.name}
                    </div>
                    <div className="mt-2 text-xs text-muted-foreground">
                      {d.projectName} · {formatBytes(d.size)}
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          )}

          {filtered.length === 0 && (
            <div className="mt-10 text-center text-sm text-muted-foreground">
              No documents match your search.
            </div>
          )}
        </div>
      </main>
    </>
  );
}

function StatusBadge({ status }: { status: string }) {
  if (status === "ready") return <Badge tone="green">Ready</Badge>;
  if (status === "processing") return <Badge tone="amber">Processing</Badge>;
  if (status === "uploading") return <Badge tone="navy">Uploading</Badge>;
  return <Badge tone="muted">{status}</Badge>;
}
