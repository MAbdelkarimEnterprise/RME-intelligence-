import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, FileText, Users, Sparkles } from "lucide-react";
import { Topbar } from "@/components/app/topbar";
import { UploadDropzone } from "@/components/app/upload-dropzone";
import { ChatPanel } from "@/components/app/chat-panel";
import { FileIcon } from "@/components/ui/file-icon";
import { Badge, Card } from "@/components/ui/primitives";
import { projects, documents } from "@/lib/demo-data";
import { formatBytes, timeAgo } from "@/lib/utils";

export default async function ProjectDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const project = projects.find((p) => p.id === id);
  if (!project) notFound();

  const docs = documents.filter((d) => d.projectId === id);

  return (
    <>
      <Topbar />
      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-7xl px-6 py-7">
          <Link
            href="/dashboard/projects"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-navy-800"
          >
            <ArrowLeft className="h-4 w-4" />
            All projects
          </Link>

          <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-start gap-4">
              <span
                className="flex h-12 w-12 items-center justify-center rounded-xl text-lg font-bold text-white"
                style={{ backgroundColor: project.color }}
              >
                {project.name[0]}
              </span>
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-navy-900">
                  {project.name}
                </h2>
                <p className="mt-1 max-w-xl text-sm text-muted-foreground">
                  {project.description}
                </p>
                <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <FileText className="h-3.5 w-3.5" />
                    {project.documentCount} documents
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Users className="h-3.5 w-3.5" />
                    {project.members} members
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-7 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
            <div className="space-y-6">
              <Card className="p-6">
                <h3 className="text-sm font-semibold text-navy-900">
                  Add documents
                </h3>
                <div className="mt-4">
                  <UploadDropzone defaultProject={project.id} />
                </div>
              </Card>

              <Card>
                <div className="border-b border-border p-5">
                  <h3 className="text-sm font-semibold text-navy-900">
                    Documents in this workspace
                  </h3>
                </div>
                <div className="divide-y divide-border">
                  {docs.length === 0 && (
                    <p className="px-5 py-8 text-center text-sm text-muted-foreground">
                      No documents yet. Upload above to start building this
                      knowledge base.
                    </p>
                  )}
                  {docs.map((d) => (
                    <Link
                      key={d.id}
                      href={`/dashboard/documents/${d.id}`}
                      className="flex items-center gap-3 px-5 py-3 transition-colors hover:bg-muted/50"
                    >
                      <FileIcon type={d.type} size={36} />
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-sm font-medium text-graphite-800">
                          {d.name}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {formatBytes(d.size)} · {timeAgo(d.uploadedAt)}
                        </div>
                      </div>
                      {d.status === "ready" ? (
                        <Badge tone="green">Ready</Badge>
                      ) : (
                        <Badge tone="amber">Processing</Badge>
                      )}
                    </Link>
                  ))}
                </div>
              </Card>
            </div>

            {/* Scoped assistant */}
            <Card className="flex h-[640px] flex-col overflow-hidden">
              <div className="flex items-center gap-2 border-b border-border p-4">
                <span className="flex h-7 w-7 items-center justify-center rounded-md bg-navy-800 text-white">
                  <Sparkles className="h-4 w-4" />
                </span>
                <div>
                  <div className="text-sm font-semibold text-navy-900">
                    Workspace assistant
                  </div>
                  <div className="text-[11px] text-muted-foreground">
                    Grounded in {project.name}
                  </div>
                </div>
              </div>
              <div className="min-h-0 flex-1">
                <ChatPanel scope={`the ${project.name} workspace`} compact />
              </div>
            </Card>
          </div>
        </div>
      </main>
    </>
  );
}
