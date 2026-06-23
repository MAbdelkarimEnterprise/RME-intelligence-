import { Building2, Download, RefreshCw, CheckCircle2 } from "lucide-react";
import { Topbar } from "@/components/app/topbar";

const disciplines = [
  ["Civil", 20, "#0c1424", "312 items · 64% complete"],
  ["Structural", 27, "#3c5174", "408 items · 81% complete"],
  ["Architectural", 15, "#6e8ca8", "276 items · 39% complete"],
  ["MEP", 18, "#E8531A", "389 items · 58% complete"],
  ["Infrastructure", 9, "#c2ccd8", "141 items · 47% complete"],
  ["Finishes", 11, "#E8A400", "198 items · 31% complete"],
  ["Landscape", 5, "#1f7a52", "74 items · 18% complete"],
  ["External Works", 5, "#123459", "63 items · 22% complete"],
] as const;

const lines = [
  ["03.20.00", "Reinforced concrete — C40, columns", "Structural", "#3c5174", "11,104,000", "1.16%", "99.6%"],
  ["31.23.00", "Excavation & disposal — bulk", "Civil", "#0c1424", "6,265,000", "0.65%", "99.9%"],
  ["26.05.00", "Cable tray & containment", "MEP", "#E8531A", "3,500,000", "0.37%", "98.8%"],
  ["08.44.00", "Unitized curtain wall system", "Architectural", "#6e8ca8", "23,544,000", "2.46%", "99.2%"],
  ["32.90.00", "Soft landscape & irrigation", "Landscape", "#1f7a52", "2,180,000", "0.23%", "94.1%"],
] as const;

export default function TechnicalOfficePage() {
  return (
    <>
      <Topbar title="Technical Office" />
      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-7xl px-6 py-6">
          {/* head */}
          <div className="mb-5 flex flex-wrap items-end gap-4">
            <div className="flex-1">
              <h1 className="font-heading text-[22px] font-bold tracking-tight text-navy-900">
                Technical Office
              </h1>
              <p className="mt-1 max-w-2xl text-[13px] text-graphite-600">
                Work Package Intelligence — every BOQ line automatically categorized across eight
                construction disciplines, with weight distribution and progress per package.
              </p>
            </div>
            <div className="flex gap-2.5">
              <button className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-3 py-2 text-xs font-medium text-graphite-700 hover:bg-muted">
                <Download className="h-3.5 w-3.5" /> Export WBS
              </button>
              <button className="inline-flex items-center gap-2 rounded-md bg-accent px-3 py-2 text-xs font-semibold text-white shadow-sm hover:bg-accent-hover">
                <RefreshCw className="h-3.5 w-3.5" /> Re-categorize
              </button>
            </div>
          </div>

          {/* discipline cards */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {disciplines.map(([name, pct, color, meta]) => (
              <div key={name} className="rounded-xl border border-border bg-card p-4 shadow-card">
                <div className="mb-2.5 flex items-center gap-2.5">
                  <span className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: color }} />
                  <b className="text-[13px] text-navy-900">{name}</b>
                  <span className="numeric ml-auto text-muted-foreground">{pct}%</span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                  <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: color }} />
                </div>
                <div className="mt-2 text-[11px] text-muted-foreground">{meta}</div>
              </div>
            ))}
          </div>

          {/* auto-categorized table */}
          <div className="mt-4 overflow-hidden rounded-xl border border-border bg-card shadow-card">
            <div className="flex flex-wrap items-center gap-2.5 border-b border-border px-5 py-3.5">
              <span className="flex h-7 w-7 items-center justify-center rounded-md bg-navy-100 text-navy-700">
                <Building2 className="h-4 w-4" />
              </span>
              <h3 className="font-heading text-[13.5px] font-semibold text-navy-900">
                Auto-categorized BOQ lines
              </h3>
              <span className="ml-auto inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">
                <CheckCircle2 className="h-3.5 w-3.5" /> Instant categorization · 99.1% confidence
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-[12.5px]">
                <thead>
                  <tr className="bg-muted/60 text-[10.5px] uppercase tracking-wide text-muted-foreground">
                    <th className="px-3 py-2.5 text-left font-semibold">Item</th>
                    <th className="px-3 py-2.5 text-left font-semibold">Description</th>
                    <th className="px-3 py-2.5 text-left font-semibold">Assigned package</th>
                    <th className="px-3 py-2.5 text-right font-semibold">Value (EGP)</th>
                    <th className="px-3 py-2.5 text-right font-semibold">Weight</th>
                    <th className="px-3 py-2.5 text-left font-semibold">Confidence</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {lines.map(([code, desc, pkg, color, value, weight, conf]) => (
                    <tr key={code as string} className="hover:bg-muted/40">
                      <td className="numeric px-3 py-2.5 font-semibold text-steel">{code}</td>
                      <td className="px-3 py-2.5 text-graphite-700">{desc}</td>
                      <td className="px-3 py-2.5">
                        <span className="inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-semibold"
                          style={{ backgroundColor: `${color}1f`, color }}>
                          <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: color }} />
                          {pkg}
                        </span>
                      </td>
                      <td className="numeric px-3 py-2.5 text-right text-navy-900">{value}</td>
                      <td className="numeric px-3 py-2.5 text-right text-navy-900">{weight}</td>
                      <td className={`numeric px-3 py-2.5 font-semibold ${parseFloat(conf as string) >= 96 ? "text-emerald-600" : "text-[#9a6c00]"}`}>{conf}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
