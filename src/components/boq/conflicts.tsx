"use client";

import { useMemo, useState } from "react";
import {
  AlertTriangle,
  FileDown,
  ArrowRightLeft,
  FileWarning,
  Lightbulb,
} from "lucide-react";
import { DarkCard, SeverityBadge, DarkSelect } from "./ui";
import { conflicts, workPackages, workPackageLabels } from "@/lib/boq-data";
import { useBoqAnalysis } from "./analysis-context";
import { exportWord, exportPDF } from "@/lib/export";
import type { Conflict, Severity } from "@/lib/boq-types";
import { cn } from "@/lib/utils";

const order: Record<Severity, number> = { High: 0, Medium: 1, Low: 2 };

export function Conflicts() {
  const analysis = useBoqAnalysis();
  const [sev, setSev] = useState<string>("all");
  const [wp, setWp] = useState<string>("all");

  const list = useMemo(
    () =>
      conflicts
        .filter(
          (c) =>
            (sev === "all" || c.severity === sev) &&
            (wp === "all" || c.workPackage === wp)
        )
        .sort((a, b) => order[a.severity] - order[b.severity]),
    [sev, wp]
  );

  const counts = useMemo(() => {
    const c: Record<string, number> = { High: 0, Medium: 0, Low: 0 };
    conflicts.forEach((x) => (c[x.severity] += 1));
    return c;
  }, []);

  // On a real run, spec-vs-BOQ conflict detection needs the Specifications
  // PDF + Claude — wired in the next build step. Show an honest state.
  if (analysis) {
    return (
      <div className="mx-auto max-w-xl py-16 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-white/5 text-amber-300">
          <AlertTriangle className="h-6 w-6" />
        </div>
        <h2 className="mt-4 text-lg font-semibold text-white">
          Specification conflict analysis
        </h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-white/55">
          Your BOQ numbers are live. To detect spec-vs-BOQ conflicts (e.g.
          “spec requires C40 but BOQ says C35”), add a Specifications PDF on the
          intake screen — the Claude-powered conflict reader is the next step
          now that your API key is set.
        </p>
      </div>
    );
  }

  function reportHtml(items: Conflict[]) {
    return `<h1>Conflict Intelligence Report</h1>
      <div class="sub">Specification ↔ BOQ cross-reference · ${items.length} findings</div>
      <table>
        <tr><th>Severity</th><th>Type</th><th>Section</th><th>Specification</th><th>BOQ</th><th>Issue</th><th>Recommended action</th></tr>
        ${items
          .map(
            (c) =>
              `<tr><td>${c.severity}</td><td>${c.type}</td><td>${c.section}</td><td>${c.specRef}</td><td>${c.boqRef}</td><td>${c.description}</td><td>${c.recommendedAction}</td></tr>`
          )
          .join("")}
      </table>`;
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="flex items-center gap-2 text-xl font-bold tracking-tight text-white">
            <AlertTriangle className="h-5 w-5 text-amber-400" />
            Conflict Intelligence
          </h2>
          <p className="text-sm text-white/50">
            Cross-referenced specifications, BOQs and scope — {conflicts.length}{" "}
            inconsistencies detected.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => exportWord("RME_Conflict_Report", "Conflict Intelligence", reportHtml(list))}
            className="inline-flex items-center gap-2 rounded-md border border-white/15 bg-white/5 px-3 py-2 text-sm font-medium text-white/80 hover:bg-white/10"
          >
            <FileDown className="h-4 w-4" /> Word
          </button>
          <button
            onClick={() => exportPDF("Conflict Intelligence", reportHtml(list))}
            className="inline-flex items-center gap-2 rounded-md bg-accent px-3 py-2 text-sm font-semibold text-white hover:bg-accent-hover"
          >
            <FileDown className="h-4 w-4" /> PDF
          </button>
        </div>
      </div>

      {/* severity summary */}
      <div className="grid grid-cols-3 gap-3">
        {(["High", "Medium", "Low"] as Severity[]).map((s) => (
          <button
            key={s}
            onClick={() => setSev(sev === s ? "all" : s)}
            className={cn(
              "rounded-xl border p-4 text-left transition-colors",
              sev === s ? "border-accent/50 bg-accent/[0.07]" : "border-white/10 bg-white/[0.03] hover:bg-white/[0.05]"
            )}
          >
            <div className="flex items-center justify-between">
              <span
                className={cn(
                  "h-2.5 w-2.5 rounded-full",
                  s === "High" ? "bg-accent" : s === "Medium" ? "bg-amber-400" : "bg-emerald-400"
                )}
              />
              <span className="text-2xl font-bold text-white">{counts[s]}</span>
            </div>
            <div className="mt-1 text-xs text-white/55">{s} severity</div>
          </button>
        ))}
      </div>

      {/* filters */}
      <div className="flex items-center gap-2">
        <DarkSelect value={sev} onChange={(e) => setSev(e.target.value)}>
          <option value="all">All severities</option>
          <option>High</option>
          <option>Medium</option>
          <option>Low</option>
        </DarkSelect>
        <DarkSelect value={wp} onChange={(e) => setWp(e.target.value)}>
          <option value="all">All work packages</option>
          {workPackages.map((w) => (
            <option key={w.key} value={w.key}>
              {w.name}
            </option>
          ))}
        </DarkSelect>
      </div>

      {/* conflict cards */}
      <div className="grid gap-4 lg:grid-cols-2">
        {list.map((c) => (
          <DarkCard key={c.id} className="p-5">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2">
                {c.type === "Missing BOQ Item" ? (
                  <FileWarning className="h-4 w-4 text-amber-400" />
                ) : (
                  <ArrowRightLeft className="h-4 w-4 text-sky-300" />
                )}
                <span className="text-sm font-semibold text-white">{c.type}</span>
              </div>
              <SeverityBadge severity={c.severity} />
            </div>

            <p className="mt-3 text-sm leading-relaxed text-white/70">
              {c.description}
            </p>

            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              <Ref label="Specification" value={c.specRef} />
              <Ref label="BOQ" value={c.boqRef} />
            </div>

            <div className="mt-4 flex items-start gap-2 rounded-lg border border-white/10 bg-white/[0.03] p-3">
              <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-amber-300" />
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-wide text-white/40">
                  Recommended action
                </div>
                <p className="mt-0.5 text-xs text-white/70">{c.recommendedAction}</p>
              </div>
            </div>

            <div className="mt-3 text-[11px] text-white/35">
              {c.section} · {workPackageLabels[c.workPackage]}
            </div>
          </DarkCard>
        ))}
      </div>

      {list.length === 0 && (
        <p className="py-10 text-center text-sm text-white/40">
          No conflicts match these filters.
        </p>
      )}
    </div>
  );
}

function Ref({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-white/10 bg-navy-800/60 p-2.5">
      <div className="text-[10px] font-semibold uppercase tracking-wide text-white/35">
        {label}
      </div>
      <div className="mt-0.5 text-xs text-white/75">{value}</div>
    </div>
  );
}
