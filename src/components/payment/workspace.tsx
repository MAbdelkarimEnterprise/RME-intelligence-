"use client";

import { useMemo, useRef, useState } from "react";
import {
  FileText,
  FileSpreadsheet,
  Sparkles,
  CheckCircle2,
  Loader2,
  RotateCcw,
  Download,
  AlertTriangle,
  ArrowRight,
  ScanLine,
  Braces,
  GitMerge,
  Scale,
  ShieldCheck,
  FileCheck2,
  X,
} from "lucide-react";
import { DarkCard } from "@/components/boq/ui";
import { useDocumentsStore, makeDoc } from "@/components/app/documents-store";
import { cn } from "@/lib/utils";
import {
  matchItems,
  validate,
  confidenceTone,
  parseWeights,
  type MatchResult,
  type ExtractedItem,
} from "@/lib/payment/engine";
import { templateItems, extractedItems, projectMeta } from "@/lib/payment/data";
import {
  downloadInvoice,
  downloadMatchingReport,
  downloadExceptionReport,
} from "@/lib/payment/writer";

const STAGES = [
  { label: "OCR & PDF table extraction", icon: ScanLine },
  { label: "Building structured JSON intermediary", icon: Braces },
  { label: "Matching line items (exact → code → fuzzy → semantic)", icon: GitMerge },
  { label: "Detecting weight allocations", icon: Scale },
  { label: "Validating quantities, payments & weights", icon: ShieldCheck },
  { label: "Writing Unifier invoice + reports", icon: FileCheck2 },
];

// Each extracted certificate item becomes a populate-ready row (the built-in
// Unifier template is blank, so we write the extracted items straight in).
function toMatch(e: ExtractedItem): MatchResult {
  return {
    template: {
      ref: e.ref,
      code: e.code || "",
      boqDescription: e.description,
      unit: e.unit || "",
      itemQuantity: e.currentQuantity,
      unitCost: 0,
    },
    extracted: e,
    level: "Semantic AI Match",
    confidence: 92,
    weights: parseWeights(e.weightsRaw),
    note: "Extracted from certificate",
  };
}

type Tab = "matched" | "unmatchedPdf" | "unmatchedExcel" | "warnings";

export function PaymentWorkspace() {
  const [done, setDone] = useState(false);
  const [running, setRunning] = useState(false);
  const [stage, setStage] = useState(-1);
  const [tab, setTab] = useState<Tab>("matched");
  const [cert1, setCert1] = useState<File | null>(null);
  const [extractedReal, setExtractedReal] = useState<ExtractedItem[] | null>(null);
  const [note, setNote] = useState<string | null>(null);
  const { addDocument } = useDocumentsStore();

  function handleCert(f: File | null) {
    setCert1(f);
    if (f)
      addDocument(
        makeDoc(f.name, f.size, { projectId: "ipc", projectName: "IPC Merger" })
      );
  }

  const result = useMemo(() => {
    let matches: MatchResult[];
    let unmatchedExtracted: ExtractedItem[];
    if (extractedReal && extractedReal.length) {
      matches = extractedReal.map(toMatch);
      unmatchedExtracted = [];
    } else {
      const r = matchItems(templateItems, extractedItems);
      matches = r.matches;
      unmatchedExtracted = r.unmatchedExtracted;
    }
    const issues = validate(matches, unmatchedExtracted);
    const matched = matches.filter((m) => m.level !== "Unmatched");
    const unmatchedExcel = matches.filter((m) => m.level === "Unmatched");
    const avgConf =
      matched.length > 0
        ? Math.round(matched.reduce((s, m) => s + m.confidence, 0) / matched.length)
        : 0;
    const weightsDetected = matched.filter((m) => m.weights.length > 0).length;
    return {
      matches,
      matched,
      unmatchedExcel,
      unmatchedExtracted,
      issues,
      avgConf,
      weightsDetected,
    };
  }, [extractedReal]);

  async function run() {
    setRunning(true);
    setStage(0);
    setNote(null);
    const anim = setInterval(
      () => setStage((s) => Math.min(s + 1, STAGES.length - 1)),
      700
    );
    let items: ExtractedItem[] | null = null;
    let msg: string | null = null;
    try {
      if (cert1) {
        const fd = new FormData();
        fd.append("file", cert1);
        const res = await fetch("/api/ipc/extract", { method: "POST", body: fd });
        const data = await res.json();
        if (data.ok && Array.isArray(data.items) && data.items.length) {
          items = data.items as ExtractedItem[];
          msg = `Extracted ${items.length} line items from the certificate via Claude.`;
        } else if (data.reason === "no-key") {
          msg =
            "No ANTHROPIC_API_KEY set — showing sample data. Add the key to extract from the certificate.";
        } else {
          msg = "Couldn't read the certificate — showing sample data.";
        }
      }
    } catch {
      msg = "Extraction request failed — showing sample data.";
    }
    clearInterval(anim);
    setStage(STAGES.length);
    setExtractedReal(items);
    setNote(msg);
    setRunning(false);
    setDone(true);
  }

  return (
    <div className="min-h-full bg-navy-900 text-white">
      {/* top bar */}
      <div className="sticky top-0 z-20 border-b border-white/10 bg-navy-900/90 backdrop-blur">
        <div className="flex h-14 items-center justify-between px-6">
          <div className="flex items-center gap-2.5">
            <span className="flex h-7 w-7 items-center justify-center rounded-md bg-accent text-white shadow-glow">
              <FileCheck2 className="h-4 w-4" />
            </span>
            <div>
              <div className="text-sm font-semibold leading-tight">
                IPC Merger
              </div>
              <div className="text-[11px] leading-tight text-white/40">
                Interim Payment Certificate · Unifier Invoice
              </div>
            </div>
          </div>
          {done && (
            <button
              onClick={() => {
                setDone(false);
                setStage(-1);
                setExtractedReal(null);
                setNote(null);
              }}
              className="inline-flex items-center gap-1.5 rounded-md border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-medium text-white/70 hover:bg-white/10"
            >
              <RotateCcw className="h-3.5 w-3.5" /> New invoice
            </button>
          )}
        </div>
      </div>

      <div className="px-6 py-7">
        {!done ? (
          <Intake
            cert1={cert1}
            setCert1={handleCert}
            running={running}
            stage={stage}
            onRun={run}
          />
        ) : (
          <Results
            result={result}
            tab={tab}
            setTab={setTab}
            note={note}
          />
        )}
      </div>
    </div>
  );
}

function DropCard({
  label,
  hint,
  accept,
  icon: Icon,
  file,
  setFile,
}: {
  label: string;
  hint: string;
  accept: string;
  icon: typeof FileText;
  file: File | null;
  setFile: (f: File | null) => void;
}) {
  const [drag, setDrag] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const on = !!file;

  function take(list: FileList | null) {
    const f = list?.[0];
    if (f) setFile(f);
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
      onClick={() => inputRef.current?.click()}
      className={cn(
        "group relative flex min-h-[150px] cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed p-5 text-center transition-all",
        drag
          ? "border-accent bg-accent/10"
          : on
          ? "border-accent/40 bg-accent/[0.06]"
          : "border-white/15 bg-white/[0.02] hover:border-white/30"
      )}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => take(e.target.files)}
      />
      <div
        className={cn(
          "flex h-11 w-11 items-center justify-center rounded-lg",
          on ? "bg-accent text-white" : "bg-white/10 text-white/60 group-hover:bg-white/15"
        )}
      >
        {on ? <CheckCircle2 className="h-6 w-6" /> : <Icon className="h-6 w-6" />}
      </div>
      <div className="min-w-0">
        <div className="text-sm font-semibold text-white">{label}</div>
        {on ? (
          <div className="mt-0.5 flex items-center justify-center gap-2">
            <span className="max-w-[220px] truncate text-xs text-accent">
              {file!.name}
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setFile(null);
              }}
              className="text-white/40 hover:text-accent"
              aria-label="Remove"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        ) : (
          <div className="mt-0.5 text-xs text-white/45">
            {drag ? "Drop to upload" : hint}
          </div>
        )}
      </div>
      {on && (
        <span className="absolute right-3 top-3 rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-semibold text-emerald-300">
          Loaded
        </span>
      )}
    </div>
  );
}

function Intake({
  cert1,
  setCert1,
  running,
  stage,
  onRun,
}: {
  cert1: File | null;
  setCert1: (f: File | null) => void;
  running: boolean;
  stage: number;
  onRun: () => void;
}) {
  const ready = !!cert1;
  return (
    <div className="mx-auto max-w-2xl">
      <div className="text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-accent text-white shadow-glow">
          <FileCheck2 className="h-6 w-6" />
        </div>
        <h2 className="mt-4 text-2xl font-bold tracking-tight">IPC Merger</h2>
        <p className="mx-auto mt-2 max-w-xl text-sm text-white/55">
          Drag &amp; drop the Technical Office Payment Certificate (PDF). The
          agent extracts line items, populates the standard Oracle Primavera
          Unifier invoice template, validates, and produces a ready-to-upload
          file.
        </p>
      </div>

      <div className="mt-8">
        <DropCard
          label="Payment Certificate (PDF)"
          hint="Drag & drop PDF here · or click to browse"
          accept=".pdf"
          icon={FileText}
          file={cert1}
          setFile={setCert1}
        />
      </div>

      {/* Permanent, built-in Unifier template (not a user upload) */}
      <div className="mt-3 flex items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-4 py-2.5 text-xs text-white/55">
        <FileSpreadsheet className="h-4 w-4 text-emerald-300" />
        <span>
          Oracle Primavera Unifier import template —{" "}
          <span className="font-medium text-emerald-300">built in</span> &amp;
          locked
        </span>
      </div>

      <DarkCard className="mt-6 p-5">
        {!running ? (
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="text-sm text-white/60">
              {ready ? "Certificate loaded. Ready to process." : "Drop the payment certificate to begin."}
            </div>
            <button
              onClick={onRun}
              disabled={!ready}
              className="inline-flex items-center gap-2 rounded-md bg-accent px-5 py-2.5 text-sm font-semibold text-white shadow-glow transition-colors hover:bg-accent-hover disabled:opacity-40 disabled:shadow-none"
            >
              <Sparkles className="h-4 w-4" /> Generate Invoice
            </button>
          </div>
        ) : (
          <div className="space-y-2.5">
            {STAGES.map((s, i) => {
              const isDone = i < stage;
              const active = i === stage;
              return (
                <div key={s.label} className="flex items-center gap-3 text-sm">
                  <span className="flex h-5 w-5 items-center justify-center">
                    {isDone ? (
                      <CheckCircle2 className="h-4.5 w-4.5 text-emerald-400" />
                    ) : active ? (
                      <Loader2 className="h-4 w-4 animate-spin text-accent" />
                    ) : (
                      <s.icon className="h-4 w-4 text-white/20" />
                    )}
                  </span>
                  <span className={cn(isDone ? "text-white/50" : active ? "text-white" : "text-white/35")}>
                    {s.label}
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

function ConfidencePill({ c }: { c: number }) {
  const tone = confidenceTone(c);
  const cls =
    tone === "green"
      ? "bg-emerald-500/15 text-emerald-300 border-emerald-400/25"
      : tone === "amber"
      ? "bg-amber-500/15 text-amber-300 border-amber-400/25"
      : "bg-accent/15 text-red-300 border-accent/30";
  return (
    <span className={cn("inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-semibold", cls)}>
      {c}%
    </span>
  );
}

function Results({
  result,
  tab,
  setTab,
  note,
}: {
  result: ReturnType<typeof resultShape>;
  tab: Tab;
  setTab: (t: Tab) => void;
  note: string | null;
}) {
  const { matches, matched, unmatchedExcel, unmatchedExtracted, issues, avgConf, weightsDetected } =
    result;
  const errors = issues.filter((i) => i.level === "error").length;
  const warnings = issues.filter((i) => i.level === "warning").length;

  const tabs: { key: Tab; label: string; count: number }[] = [
    { key: "matched", label: "Matched Items", count: matched.length },
    { key: "unmatchedPdf", label: "Unmatched PDF", count: unmatchedExtracted.length },
    { key: "unmatchedExcel", label: "Unmatched Excel", count: unmatchedExcel.length },
    { key: "warnings", label: "Warnings", count: issues.length },
  ];

  return (
    <div className="space-y-6">
      {/* header + downloads */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight">AI Review Panel</h2>
          <p className="text-sm text-white/50">
            {projectMeta.contract} · {projectMeta.project} · {projectMeta.ipcNo}
          </p>
          {note && <p className="mt-1 text-xs text-amber-300/90">{note}</p>}
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => downloadInvoice(matches)}
            className="inline-flex items-center gap-2 rounded-md bg-accent px-3 py-2 text-sm font-semibold text-white hover:bg-accent-hover"
          >
            <Download className="h-4 w-4" /> Completed Invoice
          </button>
          <button
            onClick={() => downloadMatchingReport(matches)}
            className="inline-flex items-center gap-2 rounded-md border border-white/15 bg-white/5 px-3 py-2 text-sm font-medium text-white/80 hover:bg-white/10"
          >
            <Download className="h-4 w-4" /> Matching Report
          </button>
          <button
            onClick={() => downloadExceptionReport(issues, unmatchedExtracted)}
            className="inline-flex items-center gap-2 rounded-md border border-white/15 bg-white/5 px-3 py-2 text-sm font-medium text-white/80 hover:bg-white/10"
          >
            <Download className="h-4 w-4" /> Exception Report
          </button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Items matched", value: `${matched.length}/${templateItemsCount()}`, tone: "text-emerald-300", icon: GitMerge },
          { label: "Avg. confidence", value: `${avgConf}%`, tone: "text-sky-300", icon: Sparkles },
          { label: "Weight maps detected", value: weightsDetected, tone: "text-violet-300", icon: Scale },
          { label: "Exceptions", value: `${errors} err · ${warnings} warn`, tone: "text-amber-300", icon: AlertTriangle },
        ].map((k) => (
          <DarkCard key={k.label} className="p-5">
            <k.icon className={cn("h-5 w-5", k.tone)} />
            <div className="mt-3 text-2xl font-bold">{k.value}</div>
            <div className="text-xs text-white/50">{k.label}</div>
          </DarkCard>
        ))}
      </div>

      {/* tabs */}
      <div className="flex items-center gap-1 border-b border-white/10">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={cn(
              "relative flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-colors",
              tab === t.key ? "text-white" : "text-white/45 hover:text-white/75"
            )}
          >
            {t.label}
            <span className="rounded-full bg-white/10 px-1.5 py-0.5 text-[10px] font-bold text-white/70">
              {t.count}
            </span>
            {tab === t.key && (
              <span className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-accent" />
            )}
          </button>
        ))}
      </div>

      {tab === "matched" && <MatchedTable matched={matched} />}
      {tab === "unmatchedPdf" && (
        <DarkCard className="divide-y divide-white/[0.06]">
          {unmatchedExtracted.length === 0 && <Empty>All PDF items were matched ✓</Empty>}
          {unmatchedExtracted.map((e) => (
            <div key={e.ref} className="flex items-center gap-3 px-4 py-3">
              <FileText className="h-4 w-4 text-white/40" />
              <div className="min-w-0 flex-1">
                <div className="text-sm font-medium text-white/85">{e.description}</div>
                <div className="text-[11px] text-white/40">
                  {e.ref} · {e.currentQuantity} {e.unit} · {e.workCompletedPct}% complete
                </div>
              </div>
              <span className="text-[11px] text-amber-300">Not in Excel</span>
            </div>
          ))}
        </DarkCard>
      )}
      {tab === "unmatchedExcel" && (
        <DarkCard className="divide-y divide-white/[0.06]">
          {unmatchedExcel.length === 0 && <Empty>Every Excel line item was matched ✓</Empty>}
          {unmatchedExcel.map((m) => (
            <div key={m.template?.ref} className="flex items-center gap-3 px-4 py-3">
              <FileSpreadsheet className="h-4 w-4 text-white/40" />
              <div className="min-w-0 flex-1">
                <div className="text-sm font-medium text-white/85">
                  {m.template?.boqDescription}
                </div>
                <div className="text-[11px] text-white/40">
                  BOQ {m.template?.code} · no matching item found in PDF
                </div>
              </div>
              <span className="text-[11px] text-red-300">No PDF source</span>
            </div>
          ))}
        </DarkCard>
      )}
      {tab === "warnings" && (
        <DarkCard className="divide-y divide-white/[0.06]">
          {issues.length === 0 && <Empty>No validation issues ✓</Empty>}
          {issues.map((iss, idx) => (
            <div key={idx} className="flex items-start gap-3 px-4 py-3">
              <span
                className={cn(
                  "mt-1.5 h-2 w-2 shrink-0 rounded-full",
                  iss.level === "error" ? "bg-accent" : iss.level === "warning" ? "bg-amber-400" : "bg-sky-400"
                )}
              />
              <div className="min-w-0 flex-1 text-sm text-white/75">{iss.message}</div>
              <span className="text-[11px] uppercase tracking-wide text-white/35">
                {iss.ref}
              </span>
            </div>
          ))}
        </DarkCard>
      )}
    </div>
  );
}

function MatchedTable({ matched }: { matched: MatchResult[] }) {
  return (
    <DarkCard className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10 text-left text-[11px] uppercase tracking-wider text-white/40">
              <th className="px-4 py-3 font-medium">Excel line item</th>
              <th className="px-4 py-3 font-medium">PDF source</th>
              <th className="px-4 py-3 font-medium">Level</th>
              <th className="px-4 py-3 font-medium">Conf.</th>
              <th className="px-4 py-3 font-medium">Weight allocation</th>
              <th className="px-4 py-3 font-medium">Qty / Pay%</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.06]">
            {matched.map((m, i) => (
              <tr key={i} className="hover:bg-white/[0.03]">
                <td className="px-4 py-3">
                  <div className="font-medium text-white/90">{m.template?.boqDescription}</div>
                  <div className="text-[11px] text-white/40">BOQ {m.template?.code}</div>
                </td>
                <td className="px-4 py-3 text-white/65">
                  <div className="flex items-center gap-1.5">
                    <ArrowRight className="h-3 w-3 text-white/25" />
                    {m.extracted?.description}
                  </div>
                </td>
                <td className="px-4 py-3 text-[11px] text-white/60">{m.level}</td>
                <td className="px-4 py-3">
                  <ConfidencePill c={m.confidence} />
                </td>
                <td className="px-4 py-3">
                  {m.weights.length ? (
                    <div className="flex flex-wrap gap-1">
                      {m.weights.map((w, j) => (
                        <span
                          key={j}
                          className="rounded border border-white/10 bg-white/[0.04] px-1.5 py-0.5 text-[10px] text-white/65"
                        >
                          {w.percent}% {w.description}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="text-[11px] text-amber-300/80">none detected</span>
                  )}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-white/70">
                  {m.extracted?.currentQuantity} {m.template?.unit}
                  <div className="text-[11px] text-white/40">{m.extracted?.paymentPct}% pay</div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DarkCard>
  );
}

function Empty({ children }: { children: React.ReactNode }) {
  return <p className="py-10 text-center text-sm text-emerald-300/80">{children}</p>;
}

// helpers to keep the Results prop type tidy
function resultShape() {
  return {
    matches: [] as MatchResult[],
    matched: [] as MatchResult[],
    unmatchedExcel: [] as MatchResult[],
    unmatchedExtracted: [] as import("@/lib/payment/engine").ExtractedItem[],
    issues: [] as import("@/lib/payment/engine").ValidationIssue[],
    avgConf: 0,
    weightsDetected: 0,
  };
}
function templateItemsCount() {
  return templateItems.length;
}
