"use client";

import { useMemo, useState } from "react";
import { Search, FileDown, ArrowRight, Sparkles } from "lucide-react";
import { DarkCard, StatusBadge, DarkSelect } from "./ui";
import { boqRows, workPackages, workPackageLabels } from "@/lib/boq-data";
import { exportCSV, exportExcel } from "@/lib/export";
import type { BoqRow, DiffStatus } from "@/lib/boq-types";
import { cn } from "@/lib/utils";

const STATUSES: DiffStatus[] = [
  "Added",
  "Removed",
  "Modified",
  "Quantity Change",
  "Unit Change",
  "Rate Change",
  "Scope Change",
  "Unchanged",
];

function fmtQty(q: number | null, unit: string) {
  if (q == null) return "—";
  return `${q.toLocaleString()} ${unit}`;
}

function diffLabel(r: BoqRow) {
  if (r.status === "Added") return "New item";
  if (r.status === "Removed") return "Removed";
  if (r.qtyA != null && r.qtyB != null && r.qtyA !== r.qtyB) {
    const d = r.qtyB - r.qtyA;
    return `${d > 0 ? "+" : ""}${d.toLocaleString()} ${r.unit}`;
  }
  if (r.rateA != null && r.rateB != null && r.rateA !== r.rateB) {
    const pct = (((r.rateB - r.rateA) / r.rateA) * 100).toFixed(0);
    return `${Number(pct) > 0 ? "+" : ""}${pct}% rate`;
  }
  if (r.status === "Unit Change") return "Unit differs";
  if (r.status === "Modified") return "Description";
  return "—";
}

export function Comparison() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<string>("all");
  const [wp, setWp] = useState<string>("all");

  const rows = useMemo(
    () =>
      boqRows.filter(
        (r) =>
          (status === "all" || r.status === status) &&
          (wp === "all" || r.workPackage === wp) &&
          (r.item.toLowerCase().includes(query.toLowerCase()) ||
            r.section.toLowerCase().includes(query.toLowerCase()))
      ),
    [query, status, wp]
  );

  const cols = [
    { header: "Item", value: (r: BoqRow) => r.item },
    { header: "Section", value: (r: BoqRow) => r.section },
    { header: "Work Package", value: (r: BoqRow) => workPackageLabels[r.workPackage] },
    { header: "Unit", value: (r: BoqRow) => r.unit },
    { header: "BOQ A Qty", value: (r: BoqRow) => r.qtyA ?? "" },
    { header: "BOQ B Qty", value: (r: BoqRow) => r.qtyB ?? "" },
    { header: "BOQ A Rate", value: (r: BoqRow) => r.rateA ?? "" },
    { header: "BOQ B Rate", value: (r: BoqRow) => r.rateB ?? "" },
    { header: "Difference", value: (r: BoqRow) => diffLabel(r) },
    { header: "Status", value: (r: BoqRow) => r.status },
  ];

  const counts = useMemo(() => {
    const c: Record<string, number> = {};
    boqRows.forEach((r) => (c[r.status] = (c[r.status] ?? 0) + 1));
    return c;
  }, []);

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white">
            BOQ Comparison Dashboard
          </h2>
          <p className="text-sm text-white/50">
            Semantic line-item matching across Rev. A and Rev. B —{" "}
            {boqRows.length} items reconciled.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => exportCSV("RME_BOQ_Comparison", rows, cols)}
            className="inline-flex items-center gap-2 rounded-md border border-white/15 bg-white/5 px-3 py-2 text-sm font-medium text-white/80 hover:bg-white/10"
          >
            <FileDown className="h-4 w-4" /> CSV
          </button>
          <button
            onClick={() => exportExcel("RME_BOQ_Comparison", "BOQ Comparison", rows, cols)}
            className="inline-flex items-center gap-2 rounded-md bg-accent px-3 py-2 text-sm font-semibold text-white hover:bg-accent-hover"
          >
            <FileDown className="h-4 w-4" /> Excel
          </button>
        </div>
      </div>

      {/* status chips */}
      <div className="flex flex-wrap gap-2">
        <Chip active={status === "all"} onClick={() => setStatus("all")}>
          All ({boqRows.length})
        </Chip>
        {STATUSES.filter((st) => counts[st]).map((st) => (
          <Chip key={st} active={status === st} onClick={() => setStatus(st)}>
            {st} ({counts[st]})
          </Chip>
        ))}
      </div>

      {/* filters */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search items or sections…"
            className="h-9 w-full rounded-md border border-white/10 bg-navy-800 pl-9 pr-3 text-sm text-white placeholder:text-white/35 outline-none focus:border-accent/50"
          />
        </div>
        <DarkSelect value={wp} onChange={(e) => setWp(e.target.value)}>
          <option value="all">All work packages</option>
          {workPackages.map((w) => (
            <option key={w.key} value={w.key}>
              {w.name}
            </option>
          ))}
        </DarkSelect>
      </div>

      {/* table */}
      <DarkCard className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 text-left text-[11px] uppercase tracking-wider text-white/40">
                <th className="px-4 py-3 font-medium">Item</th>
                <th className="px-4 py-3 font-medium">BOQ A</th>
                <th className="px-4 py-3 font-medium" />
                <th className="px-4 py-3 font-medium">BOQ B</th>
                <th className="px-4 py-3 font-medium">Difference</th>
                <th className="px-4 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.06]">
              {rows.map((r) => (
                <tr key={r.id} className="group transition-colors hover:bg-white/[0.03]">
                  <td className="px-4 py-3">
                    <div className="font-medium text-white/90">{r.item}</div>
                    <div className="text-[11px] text-white/40">
                      {r.section} · {workPackageLabels[r.workPackage]}
                    </div>
                    {r.note && (
                      <div className="mt-1 flex items-center gap-1 text-[11px] text-accent/80">
                        <Sparkles className="h-3 w-3" /> {r.note}
                      </div>
                    )}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-white/70">
                    {fmtQty(r.qtyA, r.unit)}
                    {r.rateA != null && (
                      <div className="text-[11px] text-white/35">
                        @ {r.rateA.toLocaleString()}
                      </div>
                    )}
                  </td>
                  <td className="px-2 py-3 text-white/20">
                    <ArrowRight className="h-3.5 w-3.5" />
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-white/70">
                    {fmtQty(r.qtyB, r.unit)}
                    {r.rateB != null && (
                      <div className="text-[11px] text-white/35">
                        @ {r.rateB.toLocaleString()}
                      </div>
                    )}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 font-medium text-white/85">
                    {diffLabel(r)}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={r.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {rows.length === 0 && (
          <p className="py-10 text-center text-sm text-white/40">
            No items match these filters.
          </p>
        )}
      </DarkCard>
    </div>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
        active
          ? "border-accent bg-accent text-white"
          : "border-white/15 bg-white/[0.03] text-white/60 hover:bg-white/10"
      )}
    >
      {children}
    </button>
  );
}
