import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Download, Share2 } from "lucide-react";
import { ChatPanel } from "@/components/app/chat-panel";
import { FileIcon, fileTypeLabel } from "@/components/ui/file-icon";
import { Badge } from "@/components/ui/primitives";
import { documents } from "@/lib/demo-data";
import { formatBytes, formatDate } from "@/lib/utils";

export default async function DocumentViewer({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const doc = documents.find((d) => d.id === id);
  if (!doc) notFound();

  const pages = doc.pages ?? 1;

  return (
    <div className="flex h-screen flex-col">
      {/* Viewer header */}
      <header className="flex h-16 shrink-0 items-center justify-between border-b border-border bg-card px-5">
        <div className="flex min-w-0 items-center gap-3">
          <Link
            href="/dashboard/documents"
            className="flex h-8 w-8 items-center justify-center rounded-md text-graphite-500 hover:bg-muted hover:text-navy-800"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <FileIcon type={doc.type} size={34} />
          <div className="min-w-0">
            <div className="truncate text-sm font-semibold text-navy-900">
              {doc.name}
            </div>
            <div className="text-xs text-muted-foreground">
              {doc.projectName} · {formatBytes(doc.size)} ·{" "}
              {formatDate(doc.uploadedAt)}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge tone="green">Indexed</Badge>
          <button className="flex h-9 w-9 items-center justify-center rounded-md text-graphite-500 hover:bg-muted hover:text-navy-800">
            <Share2 className="h-4 w-4" />
          </button>
          <button className="flex h-9 w-9 items-center justify-center rounded-md text-graphite-500 hover:bg-muted hover:text-navy-800">
            <Download className="h-4 w-4" />
          </button>
        </div>
      </header>

      {/* Split screen */}
      <div className="grid min-h-0 flex-1 grid-cols-1 lg:grid-cols-[1.1fr_1fr]">
        {/* Document preview */}
        <div className="hidden min-h-0 flex-col border-r border-border bg-graphite-50 lg:flex">
          <div className="flex items-center justify-between border-b border-border bg-card px-5 py-2.5">
            <span className="text-xs font-medium text-graphite-600">
              {fileTypeLabel(doc.type)} preview
            </span>
            <span className="text-xs text-muted-foreground">
              {pages} page{pages > 1 ? "s" : ""}
            </span>
          </div>
          <div className="flex-1 overflow-y-auto p-8">
            <div className="mx-auto max-w-md space-y-5">
              {Array.from({ length: Math.min(pages, 4) }).map((_, i) => (
                <div
                  key={i}
                  className="aspect-[1/1.3] rounded-md border border-border bg-white p-6 shadow-card"
                >
                  <div className="mb-4 h-3 w-1/3 rounded bg-navy-100" />
                  <div className="space-y-2">
                    {Array.from({ length: 9 }).map((_, j) => (
                      <div
                        key={j}
                        className="h-2 rounded bg-graphite-100"
                        style={{ width: `${70 + ((i + j) % 4) * 8}%` }}
                      />
                    ))}
                  </div>
                  <div className="mt-5 mb-2 h-2 w-1/4 rounded bg-graphite-200" />
                  <div className="space-y-2">
                    {Array.from({ length: 5 }).map((_, j) => (
                      <div
                        key={j}
                        className="h-2 rounded bg-graphite-100"
                        style={{ width: `${60 + ((i * j) % 5) * 7}%` }}
                      />
                    ))}
                  </div>
                  <div className="mt-6 text-center text-[10px] text-graphite-300">
                    Page {i + 1}
                  </div>
                </div>
              ))}
              <p className="pt-2 text-center text-xs text-muted-foreground">
                Rendered preview · connect Supabase Storage for live file
                rendering.
              </p>
            </div>
          </div>
        </div>

        {/* AI chat — grounded in this document */}
        <div className="flex min-h-0 flex-col">
          <ChatPanel scope={`“${doc.name}”`} compact />
        </div>
      </div>
    </div>
  );
}
