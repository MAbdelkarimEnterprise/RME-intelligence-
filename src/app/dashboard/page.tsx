import Link from "next/link";
import {
  Activity,
  ReceiptText,
  TriangleAlert,
  CalendarClock,
  TrendingUp,
  TrendingDown,
  Minus,
  RefreshCw,
  Download,
  ArrowRight,
} from "lucide-react";
import { Topbar } from "@/components/app/topbar";

const kpis = [
  {
    label: "Project Health",
    value: "86",
    suffix: "/100",
    icon: Activity,
    tone: "emerald",
    delta: "+3 vs last week · On track",
    dir: "up" as const,
  },
  {
    label: "Certified to Date",
    value: "EGP 612",
    suffix: "M",
    icon: ReceiptText,
    tone: "steel",
    delta: "IPC 14 · 64% of contract value",
    dir: "up" as const,
  },
  {
    label: "Open Commercial Risks",
    value: "7",
    icon: TriangleAlert,
    tone: "accent",
    delta: "2 high · EGP 4.1M exposure",
    dir: "down" as const,
  },
  {
    label: "Pending RFIs",
    value: "12",
    icon: CalendarClock,
    tone: "construction",
    delta: "4 overdue · avg 6.2 days open",
    dir: "flat" as const,
  },
];

const toneBg: Record<string, string> = {
  emerald: "bg-emerald-50 text-emerald-700",
  steel: "bg-navy-100 text-navy-700",
  accent: "bg-accent-soft text-accent-hover",
  construction: "bg-construction-soft text-[#9a6c00]",
};

const workPackages = [
  ["Structural", 27, "#0c1424"],
  ["Civil", 20, "#3c5174"],
  ["MEP", 18, "#E8531A"],
  ["Architectural", 15, "#6e8ca8"],
  ["Finishes", 11, "#E8A400"],
  ["Infrastructure", 9, "#c2ccd8"],
] as const;

const boqChanges = [
  ["03.20.00", "RC C40 — columns", "+148 m³", "pos"],
  ["07.84.00", "Fireproofing", "NEW", "pos"],
  ["09.51.00", "Acoustic ceiling", "−490 m²", "neg"],
  ["22.11.00", "Water riser", "REMOVED", "neg"],
  ["26.05.00", "Cable tray", "+820 m", "pos"],
] as const;

export default function DashboardHome() {
  return (
    <>
      <Topbar title="Dashboard" />
      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-7xl px-6 py-6">
          {/* Page head */}
          <div className="mb-5 flex flex-wrap items-end gap-4">
            <div className="flex-1">
              <h1 className="font-heading text-[22px] font-bold tracking-tight text-navy-900">
                Project Command Center
              </h1>
              <p className="mt-1 max-w-2xl text-[13px] text-graphite-600">
                New Capital — District R7 Towers · Live status across commercial,
                technical, and progress controls.
              </p>
            </div>
            <div className="flex gap-2.5">
              <button className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-3 py-2 text-xs font-medium text-graphite-700 hover:bg-muted">
                <RefreshCw className="h-3.5 w-3.5" /> Last sync 4 min ago
              </button>
              <button className="inline-flex items-center gap-2 rounded-md bg-gradient-to-b from-navy-700 to-navy-900 px-3 py-2 text-xs font-semibold text-white shadow-card hover:from-navy-600 hover:to-navy-800">
                <Download className="h-3.5 w-3.5" /> Export brief
              </button>
            </div>
          </div>

          {/* KPI row */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {kpis.map(({ label, value, suffix, icon: Icon, tone, delta, dir }) => (
              <div key={label} className="rounded-xl border border-border bg-card p-4 shadow-card">
                <div className="flex items-center gap-2.5 text-[11.5px] font-medium text-muted-foreground">
                  <span className={`flex h-6 w-6 items-center justify-center rounded-md ${toneBg[tone]}`}>
                    <Icon className="h-3.5 w-3.5" strokeWidth={2} />
                  </span>
                  {label}
                </div>
                <div className="mt-2.5 font-heading text-[27px] font-bold leading-none tracking-tight text-navy-900">
                  {value}
                  {suffix && <span className="text-base font-medium text-muted-foreground">{suffix}</span>}
                </div>
                <div
                  className={`mt-2 flex items-center gap-1.5 text-[11.5px] font-semibold ${
                    dir === "up" ? "text-emerald-600" : dir === "down" ? "text-red-600" : "text-muted-foreground"
                  }`}
                >
                  {dir === "up" ? <TrendingUp className="h-3.5 w-3.5" /> : dir === "down" ? <TrendingDown className="h-3.5 w-3.5" /> : <Minus className="h-3.5 w-3.5" />}
                  {delta}
                </div>
              </div>
            ))}
          </div>

          {/* Mid row: progress + work packages */}
          <div className="mt-4 grid gap-4 lg:grid-cols-3">
            {/* Progress S-curve */}
            <div className="rounded-xl border border-border bg-card shadow-card lg:col-span-2">
              <CardHead
                title="Progress Tracking"
                sub="· planned vs. actual (S-curve)"
                badge={["amber", "2.4% behind plan"]}
              />
              <div className="p-5">
                <svg viewBox="0 0 560 220" className="h-auto w-full">
                  <defs>
                    <linearGradient id="ga" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0" stopColor="#3c5174" stopOpacity="0.22" />
                      <stop offset="1" stopColor="#3c5174" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <g stroke="#eef2f7" strokeWidth="1">
                    <line x1="40" y1="20" x2="40" y2="180" />
                    <line x1="40" y1="180" x2="545" y2="180" />
                    <line x1="40" y1="140" x2="545" y2="140" />
                    <line x1="40" y1="100" x2="545" y2="100" />
                    <line x1="40" y1="60" x2="545" y2="60" />
                  </g>
                  <g fontSize="9" fill="#8194a8" fontFamily="var(--font-plex-mono), monospace">
                    <text x="14" y="183">0</text><text x="10" y="143">25</text>
                    <text x="10" y="103">50</text><text x="10" y="63">75</text><text x="6" y="24">100</text>
                    <text x="44" y="195">Jan</text><text x="128" y="195">Mar</text><text x="212" y="195">May</text>
                    <text x="296" y="195">Jul</text><text x="380" y="195">Sep</text><text x="464" y="195">Nov</text>
                  </g>
                  <polyline fill="none" stroke="#8194a8" strokeWidth="2" strokeDasharray="5 4"
                    points="40,176 110,168 180,150 250,120 320,84 390,56 460,38 545,28" />
                  <path d="M40,176 110,170 180,156 250,132 320,104 390,88 L390,180 L40,180 Z" fill="url(#ga)" />
                  <polyline fill="none" stroke="#3c5174" strokeWidth="2.5"
                    points="40,176 110,170 180,156 250,132 320,104 390,88" />
                  <circle cx="390" cy="88" r="4" fill="#E8531A" />
                  <line x1="390" y1="20" x2="390" y2="180" stroke="#E8531A" strokeWidth="1" strokeDasharray="3 3" opacity="0.5" />
                  <text x="396" y="30" fontSize="9" fill="#E8531A" fontFamily="var(--font-plex-mono), monospace">Today · 61% actual</text>
                </svg>
                <div className="mt-3 flex flex-wrap gap-4">
                  <Legend color="#3c5174" label="Actual progress (61%)" />
                  <Legend color="#8194a8" label="Planned progress (63.4%)" />
                </div>
              </div>
            </div>

            {/* Work package donut */}
            <div className="rounded-xl border border-border bg-card shadow-card">
              <CardHead title="Work Package Distribution" />
              <div className="flex flex-col items-center p-5">
                <svg viewBox="0 0 120 120" className="h-[150px] w-[150px]">
                  <circle cx="60" cy="60" r="46" fill="none" stroke="#eef2f7" strokeWidth="16" />
                  <circle cx="60" cy="60" r="46" fill="none" stroke="#0c1424" strokeWidth="16" strokeDasharray="78 211" transform="rotate(-90 60 60)" />
                  <circle cx="60" cy="60" r="46" fill="none" stroke="#3c5174" strokeWidth="16" strokeDasharray="58 231" strokeDashoffset="-78" transform="rotate(-90 60 60)" />
                  <circle cx="60" cy="60" r="46" fill="none" stroke="#E8531A" strokeWidth="16" strokeDasharray="52 237" strokeDashoffset="-136" transform="rotate(-90 60 60)" />
                  <circle cx="60" cy="60" r="46" fill="none" stroke="#6e8ca8" strokeWidth="16" strokeDasharray="43 246" strokeDashoffset="-188" transform="rotate(-90 60 60)" />
                  <circle cx="60" cy="60" r="46" fill="none" stroke="#E8A400" strokeWidth="16" strokeDasharray="33 256" strokeDashoffset="-231" transform="rotate(-90 60 60)" />
                  <circle cx="60" cy="60" r="46" fill="none" stroke="#c2ccd8" strokeWidth="16" strokeDasharray="25 264" strokeDashoffset="-264" transform="rotate(-90 60 60)" />
                  <text x="60" y="57" textAnchor="middle" fontSize="11" fontWeight="700" fill="#16202e" fontFamily="var(--font-plex), sans-serif">EGP</text>
                  <text x="60" y="72" textAnchor="middle" fontSize="13" fontWeight="700" fill="#16202e" fontFamily="var(--font-plex-mono), monospace">958M</text>
                </svg>
                <div className="mt-2 w-full">
                  {workPackages.map(([name, pct, color]) => (
                    <div key={name} className="flex items-center gap-2.5 border-b border-border/60 py-1.5 text-[12.5px] last:border-none">
                      <span className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: color }} />
                      <span className="flex-1 text-graphite-700">{name}</span>
                      <span className="numeric font-semibold text-navy-900">{pct}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Bottom row */}
          <div className="mt-4 grid gap-4 lg:grid-cols-3">
            {/* Commercial risks */}
            <div className="rounded-xl border border-border bg-card shadow-card">
              <CardHead title="Commercial Risks" iconTone="accent" />
              <div className="px-5 pb-2 pt-1">
                <RiskRow tone="red" title="Riser scope removed in BOQ Rev B" meta="MEP coordination gap · EGP 2.1M" level="High" />
                <RiskRow tone="red" title="Fireproofing unpriced in spec" meta="Section 07.84 · EGP 2.0M exposure" level="High" />
                <RiskRow tone="amber" title="Concrete qty variance +12%" meta="Item 03.20.00 · pending review" level="Medium" />
              </div>
            </div>

            {/* Recent BOQ changes */}
            <div className="rounded-xl border border-border bg-card shadow-card">
              <CardHead title="Recent BOQ Changes" />
              <div className="px-5 pb-3 pt-1">
                {boqChanges.map(([code, name, val, tone]) => (
                  <div key={code} className="flex items-center gap-3 border-b border-border/60 py-2.5 text-[12.5px] last:border-none">
                    <span className="numeric rounded bg-muted px-1.5 py-0.5 text-[11px] text-muted-foreground">{code}</span>
                    <span className="flex-1 text-graphite-700">{name}</span>
                    <span className={`numeric font-semibold ${tone === "pos" ? "text-emerald-600" : "text-red-600"}`}>{val}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Payment status */}
            <div className="rounded-xl border border-border bg-card shadow-card">
              <CardHead title="Payment Status" iconTone="emerald" />
              <div className="p-5">
                <PayBar label="Certified to date" value="EGP 612M" pct={64} color="bg-emerald-500" />
                <PayBar label="IPC 14 — this period" value="EGP 42.8M" pct={42} color="bg-steel" />
                <PayBar label="Retention held" value="EGP 30.6M" pct={18} color="bg-accent" />
                <Link
                  href="/dashboard/ipc-merger"
                  className="mt-4 flex items-center justify-center gap-2 rounded-md border border-border bg-card py-2 text-xs font-semibold text-navy-800 hover:bg-muted"
                >
                  Open Payment Engine <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

/* ---------- helpers ---------- */
const badgeTone: Record<string, string> = {
  amber: "bg-construction-soft text-[#9a6c00]",
  green: "bg-emerald-50 text-emerald-700",
  red: "bg-red-50 text-red-700",
};
const badgeDot: Record<string, string> = {
  amber: "bg-construction",
  green: "bg-emerald-500",
  red: "bg-red-500",
};

function CardHead({
  title,
  sub,
  badge,
  iconTone = "steel",
}: {
  title: string;
  sub?: string;
  badge?: [string, string];
  iconTone?: string;
}) {
  return (
    <div className="flex items-center gap-2.5 border-b border-border px-5 py-3.5">
      <span className={`flex h-7 w-7 items-center justify-center rounded-md ${toneBg[iconTone]}`}>
        <Activity className="h-4 w-4" strokeWidth={2} />
      </span>
      <h3 className="font-heading text-[13.5px] font-semibold text-navy-900">
        {title}
        {sub && <span className="font-normal text-muted-foreground"> {sub}</span>}
      </h3>
      {badge && (
        <span className={`ml-auto inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ${badgeTone[badge[0]]}`}>
          <span className={`h-1.5 w-1.5 rounded-full ${badgeDot[badge[0]]}`} />
          {badge[1]}
        </span>
      )}
    </div>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-2 text-[12px] text-graphite-700">
      <span className="h-3 w-3 rounded-sm" style={{ backgroundColor: color }} />
      {label}
    </div>
  );
}

function RiskRow({ tone, title, meta, level }: { tone: string; title: string; meta: string; level: string }) {
  return (
    <div className="flex items-center gap-3 border-b border-border/60 py-3 last:border-none">
      <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${tone === "red" ? "bg-red-50 text-red-600" : "bg-construction-soft text-[#9a6c00]"}`}>
        <TriangleAlert className="h-4 w-4" />
      </span>
      <div className="min-w-0 flex-1">
        <div className="truncate text-[13px] font-semibold text-navy-900">{title}</div>
        <div className="text-[11.5px] text-muted-foreground">{meta}</div>
      </div>
      <span className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-semibold ${badgeTone[tone]}`}>
        <span className={`h-1.5 w-1.5 rounded-full ${badgeDot[tone]}`} />
        {level}
      </span>
    </div>
  );
}

function PayBar({ label, value, pct, color }: { label: string; value: string; pct: number; color: string }) {
  return (
    <div className="mb-3.5 last:mb-0">
      <div className="mb-1.5 flex items-center justify-between text-[12px]">
        <span className="text-muted-foreground">{label}</span>
        <b className="numeric text-navy-900">{value}</b>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-muted">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
