import {
  Upload,
  SearchCheck,
  TriangleAlert,
  Info,
  FileText,
} from "lucide-react";
import { Topbar } from "@/components/app/topbar";

const kpis = [
  ["Missing scope", "9", "text-red-600", "specified, not in BOQ"],
  ["Spec conflicts", "5", "text-[#9a6c00]", "contradictory clauses"],
  ["Technical deviations", "7", "text-[#9a6c00]", "BOQ vs. spec mismatch"],
  ["Unpriced requirements", "EGP 3.4M", "text-accent", "est. exposure"],
] as const;

const findings = [
  ["07 84 13", "Fire-resistive joint systems to all penetrations", "Specified, no matching BOQ item", ["red", "Missing"], "1,150,000", ["red", "High"]],
  ["09 91 23", "Intumescent coating — 90 min rating", "BOQ specifies 60 min — deviation", ["amber", "Deviation"], "680,000", ["red", "High"]],
  ["03 30 00", "Concrete C40/50 to substructure", "Spec §3 says C40, §7 says C50 — conflict", ["amber", "Conflict"], "420,000", ["amber", "Medium"]],
  ["22 07 00", "Pipe insulation to all DCW risers", "Risers removed in BOQ Rev B", ["red", "Missing"], "510,000", ["red", "High"]],
  ["08 44 00", "Curtain wall — U-value ≤ 1.4 W/m²K", "BOQ product sheet shows 1.8 — deviation", ["amber", "Deviation"], "640,000", ["amber", "Medium"]],
] as const;

const tone: Record<string, string> = {
  red: "bg-red-50 text-red-700",
  amber: "bg-construction-soft text-[#9a6c00]",
  steel: "bg-navy-100 text-navy-700",
};
const dot: Record<string, string> = {
  red: "bg-red-500",
  amber: "bg-construction",
  steel: "bg-steel",
};

export default function SpecIntelligencePage() {
  return (
    <>
      <Topbar title="Specification Intelligence" />
      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-7xl px-6 py-6">
          {/* head */}
          <div className="mb-5 flex flex-wrap items-end gap-4">
            <div className="flex-1">
              <h1 className="font-heading text-[22px] font-bold tracking-tight text-navy-900">
                Specification Intelligence
              </h1>
              <p className="mt-1 max-w-2xl text-[13px] text-graphite-600">
                Cross-reference specifications against the BOQ to catch missing scope, conflicts,
                technical deviations, unpriced requirements, and contractor risks before they cost you.
              </p>
            </div>
            <div className="flex gap-2.5">
              <button className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-3 py-2 text-xs font-medium text-graphite-700 hover:bg-muted">
                <Upload className="h-3.5 w-3.5" /> Upload specification
              </button>
              <button className="inline-flex items-center gap-2 rounded-md bg-accent px-3 py-2 text-xs font-semibold text-white shadow-sm hover:bg-accent-hover">
                <SearchCheck className="h-3.5 w-3.5" /> Run cross-reference
              </button>
            </div>
          </div>

          {/* context callout */}
          <div className="mb-4 flex items-start gap-3 rounded-md border border-navy-200 bg-navy-50 px-4 py-3 text-[12.5px] text-navy-800">
            <FileText className="mt-0.5 h-4 w-4 shrink-0" />
            <div>
              <b>Specification_R7_TechVol2.pdf</b> (412 pages) cross-referenced against{" "}
              <b>BOQ Rev B</b> (1,861 items). Analysis complete.
            </div>
          </div>

          {/* KPIs */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {kpis.map(([label, value, color, sub]) => (
              <div key={label} className="rounded-xl border border-border bg-card p-4 shadow-card">
                <div className="text-[11.5px] font-medium text-muted-foreground">{label}</div>
                <div className={`mt-2 font-heading text-[26px] font-bold leading-none tracking-tight ${color}`}>{value}</div>
                <div className="mt-2 text-[11.5px] text-muted-foreground">{sub}</div>
              </div>
            ))}
          </div>

          {/* findings table */}
          <div className="mt-4 overflow-hidden rounded-xl border border-border bg-card shadow-card">
            <div className="flex items-center gap-2.5 border-b border-border px-5 py-3.5">
              <span className="flex h-7 w-7 items-center justify-center rounded-md bg-red-50 text-red-600">
                <TriangleAlert className="h-4 w-4" />
              </span>
              <h3 className="font-heading text-[13.5px] font-semibold text-navy-900">
                Findings — prioritized by contractor risk
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-[12.5px]">
                <thead>
                  <tr className="bg-muted/60 text-[10.5px] uppercase tracking-wide text-muted-foreground">
                    <th className="px-3 py-2.5 text-left font-semibold">Spec ref.</th>
                    <th className="px-3 py-2.5 text-left font-semibold">Requirement</th>
                    <th className="px-3 py-2.5 text-left font-semibold">Finding</th>
                    <th className="px-3 py-2.5 text-left font-semibold">BOQ link</th>
                    <th className="px-3 py-2.5 text-right font-semibold">Est. impact</th>
                    <th className="px-3 py-2.5 text-left font-semibold">Risk</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {findings.map(([ref, req, finding, link, impact, risk]) => (
                    <tr key={ref as string} className="hover:bg-muted/40">
                      <td className="numeric px-3 py-2.5 font-semibold text-steel">{ref}</td>
                      <td className="px-3 py-2.5 text-graphite-700">{req}</td>
                      <td className="px-3 py-2.5 text-graphite-700">{finding}</td>
                      <td className="px-3 py-2.5">
                        <Pill tone={link[0]} label={link[1]} />
                      </td>
                      <td className="numeric px-3 py-2.5 text-right font-semibold text-red-600">−{impact}</td>
                      <td className="px-3 py-2.5">
                        <Pill tone={risk[0]} label={risk[1]} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* coverage + actions */}
          <div className="mt-4 grid gap-4 lg:grid-cols-2">
            <div className="rounded-xl border border-border bg-card p-5 shadow-card">
              <h3 className="font-heading text-[13.5px] font-semibold text-navy-900">Coverage map</h3>
              <p className="mb-3.5 mt-1 text-[11.5px] text-muted-foreground">
                How much of the specification is matched to priced BOQ items.
              </p>
              <div className="flex items-center gap-5">
                <svg viewBox="0 0 120 120" className="h-[130px] w-[130px]">
                  <circle cx="60" cy="60" r="46" fill="none" stroke="#eef2f7" strokeWidth="16" />
                  <circle cx="60" cy="60" r="46" fill="none" stroke="#1f7a52" strokeWidth="16" strokeDasharray="260 29" transform="rotate(-90 60 60)" />
                  <text x="60" y="65" textAnchor="middle" fontSize="19" fontWeight="700" fill="#16202e" fontFamily="var(--font-plex), sans-serif">90%</text>
                </svg>
                <div className="flex-1">
                  <CoverRow color="#1f7a52" label="Matched & priced" value="90.0%" />
                  <CoverRow color="#c2ccd8" label="Unmatched / at risk" value="10.0%" />
                  <CoverRow color="#3c5174" label="Classification accuracy" value="97.4%" last />
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-card p-5 shadow-card">
              <h3 className="mb-3 font-heading text-[13.5px] font-semibold text-navy-900">Recommended actions</h3>
              <Action text={<><b>Raise a variation</b> for fire-stopping scope (07 84 13) before it becomes a back-charge — EGP 1.15M.</>} />
              <Action text={<><b>Resolve C40/C50 conflict</b> via RFI — affects substructure pour scheduled in 9 days.</>} />
              <div className="flex items-start gap-3 rounded-md border border-navy-200 bg-navy-50 px-4 py-3 text-[12.5px] text-navy-800">
                <Info className="mt-0.5 h-4 w-4 shrink-0" />
                <div>21 findings exportable as a clarification log for the consultant.</div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

function Pill({ tone: t, label }: { tone: string; label: string }) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-semibold ${tone[t]}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${dot[t]}`} />
      {label}
    </span>
  );
}

function CoverRow({ color, label, value, last }: { color: string; label: string; value: string; last?: boolean }) {
  return (
    <div className={`flex items-center gap-2.5 py-1.5 text-[12.5px] ${last ? "" : "border-b border-border/60"}`}>
      <span className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: color }} />
      <span className="flex-1 text-graphite-700">{label}</span>
      <span className="numeric font-semibold text-navy-900">{value}</span>
    </div>
  );
}

function Action({ text }: { text: React.ReactNode }) {
  return (
    <div className="mb-2.5 flex items-start gap-3 rounded-md border border-[#f3d2c4] bg-accent-soft px-4 py-3 text-[12.5px] text-accent-hover">
      <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0" />
      <div>{text}</div>
    </div>
  );
}
