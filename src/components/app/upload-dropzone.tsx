"use client";

import { useCallback, useRef, useState } from "react";
import { UploadCloud, CheckCircle2, Loader2, X } from "lucide-react";
import { FileIcon } from "@/components/ui/file-icon";
import { formatBytes, cn } from "@/lib/utils";
import { projects, currentUser } from "@/lib/demo-data";
import type { FileType, DocumentItem } from "@/lib/types";

type Uploading = {
  id: string;
  name: string;
  size: number;
  type: FileType;
  progress: number;
  done: boolean;
};

const ACCEPTED = ".pdf,.docx,.xlsx,.pptx,.txt";

function extToType(name: string): FileType {
  const ext = name.split(".").pop()?.toLowerCase();
  if (ext === "pdf") return "pdf";
  if (ext === "docx" || ext === "doc") return "docx";
  if (ext === "xlsx" || ext === "xls" || ext === "csv") return "xlsx";
  if (ext === "pptx" || ext === "ppt") return "pptx";
  return "txt";
}

export function UploadDropzone({
  defaultProject,
  onConfirm,
}: {
  defaultProject?: string;
  /** Called when the user confirms an uploaded file should be added. */
  onConfirm?: (doc: DocumentItem) => void;
}) {
  const [drag, setDrag] = useState(false);
  const [files, setFiles] = useState<Uploading[]>([]);
  const [project, setProject] = useState(defaultProject ?? projects[0].id);
  const inputRef = useRef<HTMLInputElement>(null);

  function confirmFile(f: Uploading) {
    const proj = projects.find((p) => p.id === project);
    onConfirm?.({
      id: f.id,
      name: f.name,
      type: f.type,
      size: f.size,
      projectId: project,
      projectName: proj?.name ?? "Unassigned",
      uploadedAt: new Date().toISOString(),
      uploadedBy: currentUser.name,
      status: "ready",
    });
    setFiles((prev) => prev.filter((x) => x.id !== f.id));
  }

  const addFiles = useCallback((list: FileList | null) => {
    if (!list) return;
    const next: Uploading[] = Array.from(list).map((f) => ({
      id: crypto.randomUUID(),
      name: f.name,
      size: f.size,
      type: extToType(f.name),
      progress: 0,
      done: false,
    }));
    setFiles((prev) => [...next, ...prev]);

    // Simulate upload + ingestion progress. With Supabase Storage configured,
    // this is where you'd POST to /api/upload and stream real progress.
    next.forEach((file) => {
      const tick = setInterval(() => {
        setFiles((prev) =>
          prev.map((f) => {
            if (f.id !== file.id) return f;
            const p = Math.min(f.progress + Math.random() * 22, 100);
            return { ...f, progress: p, done: p >= 100 };
          })
        );
      }, 320);
      setTimeout(() => clearInterval(tick), 5200);
    });
  }, []);

  return (
    <div>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDrag(true);
        }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDrag(false);
          addFiles(e.dataTransfer.files);
        }}
        onClick={() => inputRef.current?.click()}
        className={cn(
          "relative flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-12 text-center transition-colors",
          drag
            ? "border-accent bg-accent-soft/40"
            : "border-border bg-muted/30 hover:border-navy-300 hover:bg-muted/50"
        )}
      >
        <input
          ref={inputRef}
          type="file"
          multiple
          accept={ACCEPTED}
          className="hidden"
          onChange={(e) => addFiles(e.target.files)}
        />
        <div
          className={cn(
            "flex h-14 w-14 items-center justify-center rounded-full transition-colors",
            drag ? "bg-accent text-white" : "bg-navy-50 text-navy-700"
          )}
        >
          <UploadCloud className="h-7 w-7" strokeWidth={1.7} />
        </div>
        <p className="mt-4 text-sm font-semibold text-navy-900">
          {drag ? "Drop to upload" : "Drag & drop documents here"}
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          or <span className="font-medium text-accent">browse files</span> · PDF,
          DOCX, XLSX, PPTX, TXT
        </p>

        <div
          className="mt-5 flex items-center gap-2"
          onClick={(e) => e.stopPropagation()}
        >
          <span className="text-xs text-muted-foreground">Assign to</span>
          <select
            value={project}
            onChange={(e) => setProject(e.target.value)}
            className="rounded-md border border-border bg-card px-2.5 py-1.5 text-xs font-medium text-graphite-700 outline-none focus:border-navy-400"
          >
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {files.length > 0 && (
        <div className="mt-5 space-y-2">
          {files.map((f) => (
            <div
              key={f.id}
              className="flex items-center gap-3 rounded-lg border border-border bg-card p-3 shadow-card"
            >
              <FileIcon type={f.type} size={38} />
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="truncate text-sm font-medium text-graphite-800">
                    {f.name}
                  </span>
                  <span className="shrink-0 text-xs text-muted-foreground">
                    {formatBytes(f.size)}
                  </span>
                </div>
                <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className={cn(
                      "h-full rounded-full transition-all duration-300",
                      f.done ? "bg-emerald-500" : "bg-navy-700"
                    )}
                    style={{ width: `${f.progress}%` }}
                  />
                </div>
              </div>
              {f.done ? (
                <button
                  onClick={() => confirmFile(f)}
                  className="inline-flex items-center gap-1.5 rounded-md bg-accent px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-accent-hover"
                >
                  <CheckCircle2 className="h-3.5 w-3.5" /> Confirm &amp; add
                </button>
              ) : (
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  {Math.round(f.progress)}%
                </span>
              )}
              <button
                onClick={() =>
                  setFiles((prev) => prev.filter((x) => x.id !== f.id))
                }
                className="text-graphite-400 hover:text-accent"
                aria-label="Remove"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
