"use client";

import { useRef, useState } from "react";
import {
  FileSpreadsheet,
  FileText,
  ScrollText,
  PencilRuler,
  CheckCircle2,
  UploadCloud,
  Sparkles,
  Loader2,
  X,
  AlertTriangle,
} from "lucide-react";
import { DarkCard } from "./ui";
import { useDocumentsStore, makeDoc } from "@/components/app/documents-store";
import { cn } from "@/lib/utils";
import type { BoqAnalysis } from "@/lib/boq/analyze";

const slots = [
  { key: "boqA", label: "BOQ Version A", icon: FileSpreadsheet, required: true, hint: "Baseline bill of quantities", accept: ".xlsx,.xls,.csv" },
  { key: "boqB", label: "BOQ Version B", icon: FileSpreadsheet, required: true, hint: "Revised bill of quantities", accept: ".xlsx,.xls,.csv" },
  { key: "spec", label: "Project Specifications", icon: FileText, required: false, hint: "Technical specs (PDF) — for conflict analysis", accept: ".pdf,.docx,.doc" },
  { key: "tender", label: "Tender Documents", icon: ScrollText, required: false, hint: "Conditions & scope of works", accept: ".pdf,.docx,.doc" },
  { key: "drawings", label: "Drawings", icon: PencilRuler, required: false, hint: "Optional — for reference", accept: ".pdf,.dwg,.png,.jpg" },
  { key: "more", label: "Additional files", icon: UploadCloud, required: false, hint: "Any extra reference documents", accept: "*" },
] as const;

const STAGES = [
  "Reading workbooks (SheetJS)",
  "Extracting BOQ line items across all sheets",
  "Matching items A ↔ B (code + description)",
  "Computing quantity / rate / scope differences",
  "Classifying into work packages",
  "Compiling results",
];

type Entry = { file: File; confirmed: boolean };

export function Intake({
  onComplete,
}: {
  onComplete: (analysis: BoqAnalysis) => void;
}) {
  const [entries, setEntries] = useState<Record<string, Entry | undefined>>({});
  const [running, setRunning] = useState(false);
  const [stage, setStage] = useState(-1);
  const [error, setError] = useState<string | null>(null);
  const { addDocument } = useDocumentsStore();

  const ready =
    !!entries.boqA?.confirmed && !!entries.boqB?.confirmed;

  function setFile(key: string, file: File) {
    setEntries((p) => ({ ...p, [key]: { file, confirmed: false } }));
  }
  function confirm(key: string) {
    const e = entries[key];
    if (!e) return;
    addDocument(
      makeDoc(e.file.name, e.file.size, {
        projectId: "boq",
        projectName: "BOQ Intelligence",
      })
    );
    setEntries((p) =>
      p[key] ? { ...p, [key]: { ...p[key]!, confirmed: true } } : p
    );
  }
  function remove(key: string) {
    setEntries((p) => ({ ...p, [key]: undefined }));
  }

  async function run() {
    setRunning(true);
    setStage(0);
    setError(null);
    try {
      const fa = entries.boqA?.file;
      const fb = entries.boqB?.file;
      if (!fa || !fb) throw new Error("Both BOQ files are required.");

      setStage(1);
      const [bufA, bufB] = await Promise.all([fa.arrayBuffer(), fb.arrayBuffer()]);
      const { parseBoqWorkbook } = await import("@/lib/boq/parse");
      const [itemsA, itemsB] = await Promise.all([
        parseBoqWorkbook(bufA),
        parseBoqWorkbook(bufB),
      ]);
      if (itemsA.length === 0 && itemsB.length === 0)
        throw new Error(
          "No priced line items found. Check the files have Description + Quantity columns."
        );

      setStage(3);
      const { analyzeBoq } = await import("@/lib/boq/analyze");
      const analysis = analyzeBoq(itemsA, itemsB);

      setStage(5);
      await new Promise((r) => setTimeout(r, 400));
      onComplete(analysis);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Analysis failed.");
      setRunning(false);
      setStage(-1);
    }
  }

  return (
    <div className="mx-auto max-w-4xl">
      <div className="text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-accent text-white shadow-glow">
          <Sparkles className="h-6 w-6" />
        </div>
        <h2 className="mt-4 text-2xl font-bold tracking-tight text-white">
          BOQ &amp; Specification Intelligence
        </h2>
        <p className="mx-auto mt-2 max-w-xl text-sm text-white/55">
          Drag &amp; drop two BOQ revisions. The engine reads every sheet,
          extracts the real line items, and computes the actual quantity, rate
          and scope differences — true numbers from your files.
        </p>
      </div>

      <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {slots.map((s) => (
          <Slot
            key={s.key}
            label={s.label}
            Icon={s.icon}
            required={s.required}
            hint={s.hint}
            accept={s.accept}
            entry={entries[s.key]}
            onFile={(file) => setFile(s.key, file)}
            onConfirm={() => confirm(s.key)}
            onRemove={() => remove(s.key)}
          />
        ))}
      </div>

      <DarkCard className="mt-6 p-5">
        {!running ? (
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="text-sm text-white/60">
              {error ? (
                <span className="flex items-center gap-2 text-red-300">
                  <AlertTriangle className="h-4 w-4" /> {error}
                </span>
              ) : ready ? (
                "Both BOQ revisions deployed. Ready to analyze."
              ) : (
                "Drop & confirm BOQ A and BOQ B to begin."
              )}
            </div>
            <button
              onClick={run}
              disabled={!ready}
              className="inline-flex items-center gap-2 rounded-md bg-accent px-5 py-2.5 text-sm font-semibold text-white shadow-glow transition-colors hover:bg-accent-hover disabled:opacity-40 disabled:shadow-none"
            >
              <Sparkles className="h-4 w-4" />
              Run Intelligence Analysis
            </button>
          </div>
        ) : (
          <div className="space-y-2.5">
            {STAGES.map((s, i) => {
              const done = i < stage;
              const active = i === stage;
              return (
                <div key={s} className="flex items-center gap-3 text-sm">
                  <span className="flex h-5 w-5 items-center justify-center">
                    {done ? (
                      <CheckCircle2 className="h-4.5 w-4.5 text-emerald-400" />
                    ) : active ? (
                      <Loader2 className="h-4 w-4 animate-spin text-accent" />
                    ) : (
                      <span className="h-2 w-2 rounded-full bg-white/15" />
                    )}
                  </span>
                  <span className={cn(done ? "text-white/50" : active ? "text-white" : "text-white/35")}>
                    {s}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </DarkCard>
    </div>
  );
}

function Slot({
  label,
  Icon,
  required,
  hint,
  accept,
  entry,
  onFile,
  onConfirm,
  onRemove,
}: {
  label: string;
  Icon: typeof FileText;
  required: boolean;
  hint: string;
  accept: string;
  entry: Entry | undefined;
  onFile: (file: File) => void;
  onConfirm: () => void;
  onRemove: () => void;
}) {
  const [drag, setDrag] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const pending = !!entry && !entry.confirmed;
  const confirmed = !!entry?.confirmed;

  function take(list: FileList | null) {
    const f = list?.[0];
    if (f) onFile(f);
  }

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setDrag(true);
      }}
      onDragLeave={() => setDrag(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDrag(false);
        take(e.dataTransfer.files);
      }}
      onClick={() => {
        if (!entry) inputRef.current?.click();
      }}
      className={cn(
        "group relative flex min-h-[112px] flex-col justify-between gap-2 rounded-xl border-2 border-dashed p-4 text-left transition-all",
        drag
          ? "border-accent bg-accent/10"
          : confirmed
          ? "border-accent/40 bg-accent/[0.06]"
          : pending
          ? "border-amber-400/40 bg-amber-400/[0.06]"
          : "cursor-pointer border-white/15 bg-white/[0.02] hover:border-white/30"
      )}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => take(e.target.files)}
      />

      <div className="flex w-full items-center justify-between">
        <div
          className={cn(
            "flex h-9 w-9 items-center justify-center rounded-lg",
            confirmed ? "bg-accent text-white" : pending ? "bg-amber-400/20 text-amber-300" : "bg-white/10 text-white/60"
          )}
        >
          {confirmed ? <CheckCircle2 className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
        </div>
        {required ? (
          <span className="text-[10px] font-semibold uppercase tracking-wide text-accent">
            Required
          </span>
        ) : (
          <span className="text-[10px] font-medium uppercase tracking-wide text-white/35">
            Optional
          </span>
        )}
      </div>

      <div className="min-w-0">
        <div className="text-sm font-semibold text-white">{label}</div>

        {confirmed ? (
          <div className="mt-0.5 flex items-center gap-2">
            <span className="truncate text-xs text-emerald-300">
              ✓ Deployed · {entry!.file.name}
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onRemove();
              }}
              className="shrink-0 text-white/40 hover:text-accent"
              aria-label="Remove"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        ) : pending ? (
          <div className="mt-1.5 space-y-1.5">
            <div className="truncate text-xs text-white/70">{entry!.file.name}</div>
            <div className="flex items-center gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onConfirm();
                }}
                className="inline-flex items-center gap-1 rounded-md bg-accent px-2.5 py-1 text-[11px] font-semibold text-white hover:bg-accent-hover"
              >
                <CheckCircle2 className="h-3 w-3" /> Confirm &amp; deploy
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove();
                }}
                className="text-[11px] text-white/40 hover:text-accent"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="text-xs text-white/45">
            {drag ? "Drop to upload" : hint}
          </div>
        )}
      </div>
    </div>
  );
}
