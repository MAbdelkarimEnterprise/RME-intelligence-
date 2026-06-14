"use client";

import {
  TrendingUp,
  TrendingDown,
  PlusCircle,
  MinusCircle,
  PencilLine,
  AlertTriangle,
  FileDown,
  Boxes,
} from "lucide-react";
import { DarkCard } from "./ui";
import {
  execSummary,
  workPackages,
  conflicts,
  tenderProject,
  formatEGP,
} from "@/lib/boq-data";
import { exportWord, exportPDF } from "@/lib/export";
import { cn } from "@/lib/utils";

export function ExecSummary({ onNavigate }: { onNavigate: (t: string) => void }) {
  const s = execSummary;
  const up = s.valueDelta >= 0;

  function reportHtml() {
    return `
      <h1>BOQ &amp; Specification Intelligence — Executive Report</h1>
      <div class="sub">${tenderProject.name} · ${tenderProject.client}</div>
      <h2>Commercial Summary</h2>
      <table>
        <tr><th>Metric</th><th>Value</th></tr>
        <tr><td>BOQ A total value</td><td>${formatEGP(s.valueA)}</td></tr>
        <tr><td>BOQ B total value</td><td>${formatEGP(s.valueB)}</td></tr>
        <tr><td>Net change</td><td>${up ? "+" : ""}${formatEGP(s.valueDelta)}</td></tr>
        <tr><td>Items added / removed / changed</td><td>${s.added} / ${s.removed} / ${s.changed}</td></tr>
        <tr><td>Conflicts (High / Medium / Low)</td><td>${s.bySeverity.High} / ${s.bySeverity.Medium} / ${s.bySeverity.Low}</td></tr>
      </table>
      <h2>Top Conflicts</h2>
      <table>
        <tr><th>Severity</th><th>Type</th><th>Section</th><th>Issue</th></tr>
        ${conflicts
          .slice()
          .sort((a, b) => (a.severity === "High" ? -1 : 1))
          .map(
            (c) =>
              `<tr><td>${c.severity}</td><td>${c.type}</td><td>${c.section}</td><td>${c.description}</td></tr>`
          )
          .join("")}
      </table>
      <h2>Work Package Breakdown</h2>
      <table>
        <tr><th>Package</th><th>BOQ Items</th><th>Spec Sections</th><th>Conflicts</th></tr>
        ${workPackages
          .map(
            (w) =>
              `<tr><td>${w.name}</td><td>${w.boqItems}</td><td>${w.specSections}</td><td>${w.conflicts}</td></tr>`
          )
          .join("")}
      </table>`;
  }

  const kpis = [
    {
      label: "Net commercial change",
      value: `${up ? "+" : ""}${formatEGP(s.valueDelta)}`,
      sub: `${formatEGP(s.valueA)} → ${formatEGP(s.valueB)}`,
      icon: up ? TrendingUp : TrendingDown,
      tone: up ? "text-emerald-300" : "text-red-300",
    },
    {
      label: "Items added",
      value: s.added,
      sub: "New scope in Rev. B",
      icon: PlusCircle,
      tone: "text-emerald-300",
    },
    {
      label: "Items removed",
      value: s.removed,
      sub: "Dropped from Rev. B",
      icon: MinusCircle,
      tone: "text-red-300",
    },
    {
      label: "Items changed",
      value: s.changed,
      sub: "Qty / rate / unit / scope",
      icon: PencilLine,
      tone: "text-sky-300",
    },
  ];

  return (
    <div className="space-y-6">
      {/* header + export */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white">
            Executive Summary
          </h2>
          <p className="text-sm text-white/50">{tenderProject.name}</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => exportWord("RME_BOQ_Executive_Report", "BOQ Intelligence Report", reportHtml())}
            className="inline-flex items-center gap-2 rounded-md border border-white/15 bg-white/5 px-3 py-2 text-sm font-medium text-white/80 hover:bg-white/10"
          >
            <FileDown className="h-4 w-4" /> Word
          </button>
          <button
            onClick={() => exportPDF("BOQ Intelligence Report", reportHtml())}
            className="inline-flex items-center gap-2 rounded-md bg-accent px-3 py-2 text-sm font-semibold text-white hover:bg-accent-hover"
          >
            <FileDown className="h-4 w-4" /> PDF
          </button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((k) => (
          <DarkCard key={k.label} className="p-5">
            <k.icon className={cn("h-5 w-5", k.tone)} />
            <div className="mt-3 text-2xl font-bold text-white">{k.value}</div>
            <div className="text-xs text-white/50">{k.label}</div>
            <div className="mt-1 text-[11px] text-white/35">{k.sub}</div>
          </DarkCard>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Conflict severity */}
        <DarkCard className="p-5">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white">
              Conflict exposure
            </h3>
            <AlertTriangle className="h-4 w-4 text-amber-400" />
          </div>
          <div className="mt-4 space-y-3">
            {([["High", "bg-accent"], ["Medium", "bg-amber-400"], ["Low", "bg-emerald-400"]] as const).map(
              ([sev, color]) => {
                const count = s.bySeverity[sev];
                const pct = (count / s.conflicts) * 100;
                return (
                  <div key={sev}>
                    <div className="mb-1 flex justify-between text-xs">
                      <span className="text-white/70">{sev} severity</span>
                      <span className="text-white/50">{count}</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-white/10">
                      <div className={cn("h-full rounded-full", color)} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              }
            )}
          </div>
          <button
            onClick={() => onNavigate("conflicts")}
            className="mt-4 text-xs font-medium text-accent hover:text-red-300"
          >
            View all {s.conflicts} conflicts →
          </button>
        </DarkCard>

        {/* Work package mix */}
        <DarkCard className="p-5 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white">
              Work package distribution
            </h3>
            <Boxes className="h-4 w-4 text-white/40" />
          </div>
          <div className="mt-4 space-y-2.5">
            {workPackages.map((w) => {
              const max = Math.max(...workPackages.map((x) => x.boqItems));
              return (
                <button
                  key={w.key}
                  onClick={() => onNavigate("packages")}
                  className="block w-full text-left"
                >
                  <div className="mb-1 flex justify-between text-xs">
                    <span className="font-medium text-white/80">{w.name}</span>
                    <span className="text-white/45">
                      {w.boqItems} items · {w.specSections} specs
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-white/10">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${(w.boqItems / max) * 100}%`, backgroundColor: w.color }}
                    />
                  </div>
                </button>
              );
            })}
          </div>
        </DarkCard>
      </div>
    </div>
  );
}
