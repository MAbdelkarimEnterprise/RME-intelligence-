"use client";

import { useState } from "react";
import {
  LayoutDashboard,
  GitCompareArrows,
  AlertTriangle,
  Boxes,
  RotateCcw,
} from "lucide-react";
import { Intake } from "./intake";
import { ExecSummary } from "./exec-summary";
import { Comparison } from "./comparison";
import { Conflicts } from "./conflicts";
import { WorkPackagesView } from "./work-packages";
import { execSummary } from "@/lib/boq-data";
import { cn } from "@/lib/utils";

type Tab = "summary" | "comparison" | "conflicts" | "packages";

const tabs: { key: Tab; label: string; icon: typeof Boxes; badge?: string }[] = [
  { key: "summary", label: "Executive Summary", icon: LayoutDashboard },
  { key: "comparison", label: "BOQ Comparison", icon: GitCompareArrows },
  { key: "conflicts", label: "Conflict Intelligence", icon: AlertTriangle },
  { key: "packages", label: "Work Packages", icon: Boxes },
];

export function BoqWorkspace() {
  const [analyzed, setAnalyzed] = useState(false);
  const [tab, setTab] = useState<Tab>("summary");

  return (
    <div className="min-h-full bg-navy-900 text-white">
      {/* top bar */}
      <div className="sticky top-0 z-20 border-b border-white/10 bg-navy-900/90 backdrop-blur">
        <div className="flex h-14 items-center justify-between px-6">
          <div className="flex items-center gap-2.5">
            <span className="flex h-7 w-7 items-center justify-center rounded-md bg-accent text-white shadow-glow">
              <GitCompareArrows className="h-4 w-4" />
            </span>
            <div>
              <div className="text-sm font-semibold leading-tight">
                BOQ &amp; Specification Intelligence
              </div>
              <div className="text-[11px] leading-tight text-white/40">
                Tender intelligence engine
              </div>
            </div>
          </div>
          {analyzed && (
            <button
              onClick={() => setAnalyzed(false)}
              className="inline-flex items-center gap-1.5 rounded-md border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-medium text-white/70 hover:bg-white/10"
            >
              <RotateCcw className="h-3.5 w-3.5" /> New analysis
            </button>
          )}
        </div>

        {/* tabs */}
        {analyzed && (
          <div className="flex items-center gap-1 overflow-x-auto px-4">
            {tabs.map((t) => {
              const on = tab === t.key;
              const count =
                t.key === "conflicts" ? execSummary.conflicts : undefined;
              return (
                <button
                  key={t.key}
                  onClick={() => setTab(t.key)}
                  className={cn(
                    "relative flex items-center gap-2 whitespace-nowrap px-4 py-2.5 text-sm font-medium transition-colors",
                    on ? "text-white" : "text-white/45 hover:text-white/75"
                  )}
                >
                  <t.icon className="h-4 w-4" />
                  {t.label}
                  {count != null && (
                    <span className="rounded-full bg-accent px-1.5 py-0.5 text-[10px] font-bold text-white">
                      {count}
                    </span>
                  )}
                  {on && (
                    <span className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-accent" />
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* body */}
      <div className="px-6 py-7">
        {!analyzed ? (
          <Intake onComplete={() => setAnalyzed(true)} />
        ) : (
          <div className="animate-fade-in">
            {tab === "summary" && (
              <ExecSummary
                onNavigate={(t) =>
                  setTab(t === "packages" ? "packages" : (t as Tab))
                }
              />
            )}
            {tab === "comparison" && <Comparison />}
            {tab === "conflicts" && <Conflicts />}
            {tab === "packages" && <WorkPackagesView />}
          </div>
        )}
      </div>
    </div>
  );
}
