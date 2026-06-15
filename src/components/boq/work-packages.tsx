"use client";

import { useState } from "react";
import { ArrowLeft, FileText, AlertTriangle, Layers, ChevronRight } from "lucide-react";
import { DarkCard, StatusBadge, SeverityBadge } from "./ui";
import {
  workPackages as demoWps,
  boqRows as demoRows,
  conflicts as demoConflicts,
} from "@/lib/boq-data";
import { useBoqAnalysis } from "./analysis-context";
import type { WorkPackage } from "@/lib/boq-types";

export function WorkPackagesView() {
  const analysis = useBoqAnalysis();
  const workPackages = analysis ? analysis.workPackages : demoWps;
  const rows = analysis ? analysis.rows : demoRows;
  const conflicts = analysis ? [] : demoConflicts;
  const [active, setActive] = useState<WorkPackage | null>(null);

  if (active) {
    const items = rows.filter((r) => r.workPackage === active.key);
    const wpConflicts = conflicts.filter((c) => c.workPackage === active.key);
    return (
      <div className="space-y-5">
        <button
          onClick={() => setActive(null)}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-white/55 hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" /> All work packages
        </button>

        <div className="flex items-center gap-3">
          <span
            className="flex h-11 w-11 items-center justify-center rounded-xl text-base font-bold text-white"
            style={{ backgroundColor: active.color }}
          >
            {active.name[0]}
          </span>
          <div>
            <h2 className="text-xl font-bold tracking-tight text-white">
              {active.name}
            </h2>
            <p className="text-sm text-white/50">
              {active.boqItems} BOQ items · {active.specSections} specification
              sections · {active.subPackages.join(", ")}
            </p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* BOQ items in package */}
          <DarkCard className="lg:col-span-2">
            <div className="border-b border-white/10 p-4">
              <h3 className="flex items-center gap-2 text-sm font-semibold text-white">
                <FileText className="h-4 w-4 text-white/40" /> Related BOQ items
              </h3>
            </div>
            <div className="divide-y divide-white/[0.06]">
              {items.map((r) => (
                <div key={r.id} className="flex items-center gap-3 px-4 py-3">
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-medium text-white/85">
                      {r.item}
                    </div>
                    <div className="text-[11px] text-white/40">{r.section}</div>
                  </div>
                  <StatusBadge status={r.status} />
                </div>
              ))}
              {items.length === 0 && (
                <p className="px-4 py-8 text-center text-sm text-white/40">
                  No items mapped in this sample.
                </p>
              )}
            </div>
          </DarkCard>

          {/* conflicts + specs in package */}
          <div className="space-y-6">
            <DarkCard>
              <div className="border-b border-white/10 p-4">
                <h3 className="flex items-center gap-2 text-sm font-semibold text-white">
                  <AlertTriangle className="h-4 w-4 text-amber-400" /> Related
                  conflicts
                </h3>
              </div>
              <div className="space-y-3 p-4">
                {wpConflicts.length === 0 && (
                  <p className="text-center text-sm text-emerald-300/80">
                    No conflicts in this package ✓
                  </p>
                )}
                {wpConflicts.map((c) => (
                  <div key={c.id} className="rounded-lg border border-white/10 bg-white/[0.03] p-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-white/80">
                        {c.type}
                      </span>
                      <SeverityBadge severity={c.severity} />
                    </div>
                    <p className="mt-1.5 text-[11px] leading-relaxed text-white/55">
                      {c.description}
                    </p>
                  </div>
                ))}
              </div>
            </DarkCard>

            <DarkCard className="p-4">
              <h3 className="flex items-center gap-2 text-sm font-semibold text-white">
                <Layers className="h-4 w-4 text-white/40" /> Sub-packages
              </h3>
              <div className="mt-3 flex flex-wrap gap-2">
                {active.subPackages.map((s) => (
                  <span
                    key={s}
                    className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-xs text-white/65"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </DarkCard>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold tracking-tight text-white">
          Project Breakdown
        </h2>
        <p className="text-sm text-white/50">
          Every BOQ item and specification section auto-classified into work
          packages. Click to explore.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {workPackages.map((w) => (
          <button
            key={w.key}
            onClick={() => setActive(w)}
            className="group text-left"
          >
            <DarkCard className="h-full p-5 transition-all hover:-translate-y-0.5 hover:border-white/20">
              <div className="flex items-start justify-between">
                <span
                  className="flex h-10 w-10 items-center justify-center rounded-lg text-sm font-bold text-white"
                  style={{ backgroundColor: w.color }}
                >
                  {w.name[0]}
                </span>
                {w.conflicts > 0 ? (
                  <span className="inline-flex items-center gap-1 rounded-full border border-amber-400/25 bg-amber-500/10 px-2 py-0.5 text-[11px] font-medium text-amber-300">
                    <AlertTriangle className="h-3 w-3" /> {w.conflicts}
                  </span>
                ) : (
                  <span className="text-[11px] text-emerald-300/70">clean</span>
                )}
              </div>
              <h3 className="mt-3 text-sm font-semibold text-white group-hover:text-accent">
                {w.name}
              </h3>
              <div className="mt-3 flex items-center gap-4 text-xs text-white/50">
                <span>
                  <span className="font-semibold text-white/80">{w.boqItems}</span>{" "}
                  BOQ items
                </span>
                <span>
                  <span className="font-semibold text-white/80">
                    {w.specSections}
                  </span>{" "}
                  specs
                </span>
              </div>
              <div className="mt-3 flex items-center gap-1 text-[11px] font-medium text-white/40 group-hover:text-accent">
                Explore <ChevronRight className="h-3 w-3" />
              </div>
            </DarkCard>
          </button>
        ))}
      </div>
    </div>
  );
}
