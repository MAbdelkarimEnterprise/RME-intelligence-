import Link from "next/link";
import {
  ArrowRight,
  Check,
  TriangleAlert,
  ShieldCheck,
  FileSearch,
  GitCompareArrows,
  ReceiptText,
  ClipboardCheck,
  Building2,
  BarChart3,
  Upload,
  ListTree,
  LineChart,
  FileCheck2,
  Lock,
  Globe,
} from "lucide-react";
import { Button } from "@/components/ui/button";

/** Engineering structure mark — steel/navy, not an AI/robot glyph. */
function BrandMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path
        d="M3 21h18M5 21V8l7-4 7 4v13M9 21v-6h6v6"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinejoin="round"
      />
    </svg>
  );
}

const applications = [
  {
    icon: GitCompareArrows,
    title: "BOQ Intelligence",
    body: "Compare BOQ revisions line-by-line. Surface scope changes, quantity variations, and cost impact in seconds.",
    feats: ["Scope & quantity variation", "Cost impact & risk assessment"],
  },
  {
    icon: ClipboardCheck,
    title: "Specification Intelligence",
    body: "Cross-reference specifications against the BOQ to catch missing scope, conflicts, and unpriced requirements.",
    feats: ["Specification conflicts", "Unpriced requirements & risk"],
  },
  {
    icon: ReceiptText,
    title: "Interim Payment Certificate Engine",
    body: "Turn technical office submissions into certified valuations — quantities complete, progress %, and certified amount.",
    feats: ["Automated progress valuation", "Primavera Unifier-ready output"],
  },
  {
    icon: FileSearch,
    title: "Document Intelligence",
    body: "Ingest contracts, invoices, RFIs, and submittals. Extract structured data, classify, and route — at scale.",
    feats: ["Extraction & classification", "10,000+ pages processed daily"],
  },
  {
    icon: Building2,
    title: "Work Package Intelligence",
    body: "Automatically categorize every line into Civil, Structural, Architectural, MEP, Infrastructure, Finishes, and more.",
    feats: ["8-discipline categorization", "Weight distribution per package"],
  },
  {
    icon: BarChart3,
    title: "Reports & Project Controls",
    body: "Board-ready commercial and progress reporting, generated from live project intelligence and exportable on demand.",
    feats: ["Commercial & progress reporting", "One-click export (PDF / XLSX)"],
  },
];

const flow = [
  { icon: Upload, title: "1. Ingest", body: "Upload PDFs, BOQs, specs, drawings & invoices — or sync from your DMS." },
  { icon: ListTree, title: "2. Extract", body: "Structure every line item, quantity, rate, and clause with full traceability." },
  { icon: LineChart, title: "3. Analyze", body: "Compare, classify, value, and risk-assess against scope and prior revisions." },
  { icon: FileCheck2, title: "4. Certify & Export", body: "Review, approve, and export to Primavera Unifier or your ERP." },
];

const credibility = [
  { v: "99.8%", l: "BOQ comparison accuracy" },
  { v: "97.4%", l: "Specification classification" },
  { v: "10,000+", l: "Pages processed daily" },
  { v: "Instant", l: "Work-package categorization" },
];

const compliance = [
  { icon: ShieldCheck, t: "ISO 27001", d: "Information security" },
  { icon: FileCheck2, t: "ISO 19650", d: "BIM information mgmt." },
  { icon: Lock, t: "SOC 2 Type II", d: "Audited controls" },
  { icon: Globe, t: "Data residency", d: "Regional hosting" },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* ===== NAV ===== */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-navy-900/90 backdrop-blur-xl">
        <div className="container flex h-16 items-center gap-8">
          <Link href="/" className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/15 bg-gradient-to-br from-steel to-navy-600 text-white">
              <BrandMark className="h-[18px] w-[18px]" />
            </span>
            <span className="leading-none">
              <span className="block font-heading text-[15px] font-bold tracking-tight text-white">
                RME Intelligence
              </span>
              <span className="mt-1 block text-[9px] font-semibold uppercase tracking-[0.18em] text-steel-light">
                Engineering Platform
              </span>
            </span>
          </Link>
          <nav className="hidden items-center gap-7 text-sm font-medium text-white/60 md:flex">
            <a href="#applications" className="transition-colors hover:text-white">Applications</a>
            <a href="#how" className="transition-colors hover:text-white">How it works</a>
            <a href="#credibility" className="transition-colors hover:text-white">Accuracy</a>
            <a href="#security" className="transition-colors hover:text-white">Security</a>
          </nav>
          <div className="ml-auto flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" size="sm" className="text-white/80 hover:bg-white/10 hover:text-white">
                Sign in
              </Button>
            </Link>
            <a href="#demo">
              <Button variant="accent" size="sm">Request Demo</Button>
            </a>
          </div>
        </div>
      </header>

      {/* ===== HERO ===== */}
      <section
        className="relative overflow-hidden text-white"
        style={{
          background:
            "radial-gradient(120% 120% at 80% -10%, #16395f 0%, #0c1424 45%, #070d18 100%)",
        }}
      >
        <div className="dark-grid absolute inset-0 opacity-60 radial-fade" />
        <div className="absolute inset-x-0 top-0 h-px accent-hairline" />
        <div className="container relative grid items-center gap-12 py-20 md:grid-cols-[1.05fr_.95fr] md:py-24">
          <div className="animate-fade-in">
            <span className="inline-flex items-center gap-2 rounded-full border border-construction/30 bg-construction/10 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.1em] text-construction">
              <ShieldCheck className="h-3.5 w-3.5" />
              Trusted by commercial &amp; technical office teams
            </span>
            <h1 className="mt-5 text-balance text-4xl font-bold leading-[1.05] tracking-tight text-white md:text-[46px]">
              Engineering Intelligence for Modern Construction
            </h1>
            <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-white/65">
              Transform project documents, BOQs, specifications, invoices, payment
              applications, and technical submissions into structured, actionable
              intelligence — with engineering-grade accuracy your team can certify.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#demo">
                <Button variant="accent" size="lg" className="group shadow-glow">
                  Request a Demo
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Button>
              </a>
              <Link href="/login">
                <Button variant="outline" size="lg" className="border-white/20 bg-white/5 text-white hover:bg-white/10">
                  <BarChart3 className="h-4 w-4" />
                  View Live Dashboard
                </Button>
              </Link>
            </div>
            <div className="mt-9 flex flex-wrap gap-8 border-t border-white/10 pt-6">
              {[
                ["99.8%", "BOQ comparison accuracy"],
                ["10,000+", "Pages processed daily"],
                ["8", "Work-package disciplines"],
              ].map(([v, l]) => (
                <div key={l}>
                  <div className="font-heading text-2xl font-bold text-white">{v}</div>
                  <div className="mt-1 text-[11.5px] text-white/55">{l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* hero preview card */}
          <div className="animate-fade-in rounded-2xl border border-white/12 bg-white/[0.04] p-5 shadow-elevated backdrop-blur">
            <div className="mb-4 flex items-center gap-2 border-b border-white/10 pb-3">
              <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
              <span className="ml-2 text-xs font-semibold text-white/70">
                Progress Valuation — IPC No. 14
              </span>
              <span className="ml-auto inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10.5px] font-semibold text-emerald-300">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> Certified
              </span>
            </div>
            {[
              ["Concrete Works — Substructure", 92, "bg-emerald-400"],
              ["Structural Steel — Frame", 74, "bg-steel-light"],
              ["MEP — First Fix", 58, "bg-steel-light"],
              ["Architectural Finishes", 31, "bg-construction"],
            ].map(([label, pct, color]) => (
              <div key={label as string} className="flex items-center justify-between border-b border-white/[0.06] py-2.5 text-[12.5px] text-white/70 last:border-none">
                <span>{label}</span>
                <span className="flex items-center gap-3">
                  <span className="h-1.5 w-28 overflow-hidden rounded-full bg-white/10">
                    <span className={`block h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
                  </span>
                  <b className="numeric w-9 text-right text-white">{pct as number}%</b>
                </span>
              </div>
            ))}
            <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-3">
              <span className="text-[11.5px] text-white/55">Certified this period</span>
              <span className="numeric text-lg font-bold text-white">EGP 42.8M</span>
            </div>
            <div className="mt-2 flex items-center gap-1.5 text-[10.5px] text-white/45">
              <Check className="h-3.5 w-3.5 text-emerald-400" />
              Primavera Unifier-ready export generated
            </div>
          </div>
        </div>
      </section>

      {/* ===== PLATFORM OVERVIEW ===== */}
      <section className="container pt-16">
        <SectionLabel>The Platform</SectionLabel>
        <SectionTitle>One intelligence layer across the entire project lifecycle</SectionTitle>
        <SectionIntro>
          RME Intelligence reads the documents your teams already produce — and returns structured,
          auditable outputs that planning, commercial, and technical office teams can act on immediately.
        </SectionIntro>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["6", "Engineering applications"],
            ["30+", "Document & drawing formats"],
            ["99.8%", "Comparison accuracy"],
            ["ISO 19650", "Information management aligned"],
          ].map(([v, l]) => (
            <div key={l} className="rounded-xl border border-border bg-card p-5 text-center shadow-card">
              <div className="font-heading text-[26px] font-bold tracking-tight text-navy-900">{v}</div>
              <div className="mt-1.5 text-[12.5px] text-muted-foreground">{l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ===== APPLICATIONS ===== */}
      <section id="applications" className="container pt-20">
        <SectionLabel>Engineering Applications</SectionLabel>
        <SectionTitle>Purpose-built for how construction teams actually work</SectionTitle>
        <SectionIntro>
          Each application is tuned to a discipline — no generic chatbot, no guesswork.
        </SectionIntro>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {applications.map(({ icon: Icon, title, body, feats }) => (
            <div
              key={title}
              className="group relative overflow-hidden rounded-xl border border-border bg-card p-6 shadow-card transition-all hover:-translate-y-1 hover:border-steel/40 hover:shadow-elevated"
            >
              <div className="absolute inset-x-0 top-0 h-0.5 scale-x-0 bg-accent transition-transform duration-300 group-hover:scale-x-100" />
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-navy-900 text-accent">
                <Icon className="h-6 w-6" strokeWidth={1.8} />
              </div>
              <h3 className="mt-4 font-heading text-base font-semibold text-navy-900">{title}</h3>
              <p className="mt-2 text-[13px] leading-relaxed text-graphite-600">{body}</p>
              <div className="mt-3 space-y-1.5">
                {feats.map((f) => (
                  <div key={f} className="flex items-center gap-2 text-[12px] text-graphite-700">
                    <Check className="h-3.5 w-3.5 shrink-0 text-emerald-600" strokeWidth={2.5} />
                    {f}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section id="how" className="container pt-20">
        <SectionLabel>Document Intelligence Flow</SectionLabel>
        <SectionTitle>From raw submission to certified output</SectionTitle>
        <SectionIntro>A transparent, auditable pipeline — every output traces back to the source document.</SectionIntro>
        <div className="rounded-xl border border-border bg-card p-8 shadow-card">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {flow.map(({ icon: Icon, title, body }) => (
              <div key={title} className="text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-navy-900 text-accent">
                  <Icon className="h-6 w-6" strokeWidth={1.8} />
                </div>
                <h4 className="mt-3 font-heading text-sm font-semibold text-navy-900">{title}</h4>
                <p className="mt-1 text-[12px] leading-relaxed text-graphite-600">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== SAMPLE RESULTS ===== */}
      <section className="container pt-20">
        <SectionLabel>Sample Analysis Results</SectionLabel>
        <SectionTitle>What a BOQ comparison actually returns</SectionTitle>
        <SectionIntro>Real output from a BOQ Revision A → Revision B comparison. Every variance is quantified and costed.</SectionIntro>
        <div className="overflow-hidden rounded-xl border border-border bg-card shadow-card">
          <div className="flex flex-wrap items-center gap-3 border-b border-border px-5 py-4">
            <span className="flex h-8 w-8 items-center justify-center rounded-md bg-navy-100 text-navy-700">
              <GitCompareArrows className="h-4 w-4" />
            </span>
            <h3 className="font-heading text-sm font-semibold text-navy-900">
              BOQ Comparison — Rev A → Rev B
              <span className="font-normal text-muted-foreground"> · New Capital · District R7 Towers</span>
            </h3>
            <span className="ml-auto inline-flex items-center gap-1.5 rounded-full bg-construction-soft px-2.5 py-1 text-[11px] font-semibold text-[#9a6c00]">
              <span className="h-1.5 w-1.5 rounded-full bg-construction" /> 6 changes flagged
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-[12.5px]">
              <thead>
                <tr className="bg-muted/60 text-[10.5px] uppercase tracking-wide text-muted-foreground">
                  <Th>Item</Th><Th>Description</Th><Th>Unit</Th>
                  <Th right>Qty A</Th><Th right>Qty B</Th><Th right>Variance</Th>
                  <Th right>Cost impact (EGP)</Th><Th>Status</Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                <Row code="03.20.00" desc="Reinforced concrete — C40, columns" unit="m³" a="1,240" b="1,388" v="+148" vc="pos" cost="+1,184,000" cc="pos" status={["amber","Qty up"]} />
                <Row code="05.12.00" desc="Structural steel — primary frame" unit="ton" a="420" b="420" v="0" cost="—" status={["muted","No change"]} />
                <Row code="07.84.00" desc="Intumescent fireproofing to steel" unit="m²" a="—" b="3,150" v="NEW" vc="pos" cost="+945,000" cc="pos" status={["steel","New item"]} />
                <Row code="09.51.00" desc="Suspended acoustic ceiling — Type 2" unit="m²" a="2,800" b="2,310" v="−490" vc="neg" cost="−367,500" cc="neg" status={["amber","Qty down"]} />
                <Row code="22.11.00" desc="Domestic water piping — riser" unit="m" a="1,650" b="—" v="REMOVED" vc="neg" cost="−498,000" cc="neg" status={["red","Removed"]} />
              </tbody>
            </table>
          </div>
          <div className="flex flex-wrap items-center gap-4 border-t border-border px-5 py-4">
            <div className="flex flex-1 items-start gap-3 rounded-md border border-[#f3d2c4] bg-accent-soft px-4 py-3 text-[12.5px] text-accent-hover">
              <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0" />
              <div>
                <b>Net cost impact: +EGP 1.26M.</b> Removed riser scope (22.11.00) may indicate a
                coordination gap — verify against the MEP package before certifying.
              </div>
            </div>
            <div className="text-right">
              <div className="text-[11.5px] text-muted-foreground">Net cost impact</div>
              <div className="numeric text-xl font-bold text-accent">+EGP 1,263,500</div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== CREDIBILITY ===== */}
      <section id="credibility" className="container pt-20">
        <SectionLabel>Trusted Engineering Logic</SectionLabel>
        <SectionTitle>Accuracy you can put your name on</SectionTitle>
        <SectionIntro>Benchmarked against expert quantity surveyors and technical office reviewers across live RME projects.</SectionIntro>
        <div className="grid gap-6 rounded-2xl bg-graphite-900 p-10 sm:grid-cols-2 lg:grid-cols-4">
          {credibility.map(({ v, l }) => (
            <div key={l} className="relative pl-4">
              <span className="absolute left-0 top-1 h-[calc(100%-0.5rem)] w-[3px] rounded bg-accent" />
              <div className="font-heading text-[40px] font-bold leading-none tracking-tight text-white">{v}</div>
              <div className="mt-2 text-[13px] font-medium text-graphite-300">{l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ===== SECURITY ===== */}
      <section id="security" className="container pt-20">
        <SectionLabel>Security &amp; Compliance</SectionLabel>
        <SectionTitle>Enterprise-grade by default</SectionTitle>
        <SectionIntro>Your project data stays yours. Encrypted in transit and at rest, with full role-based access control and audit logging.</SectionIntro>
        <div className="flex flex-wrap justify-center gap-4">
          {compliance.map(({ icon: Icon, t, d }) => (
            <div key={t} className="flex min-w-[210px] items-center gap-3 rounded-xl border border-border bg-card px-5 py-4 shadow-card">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
                <Icon className="h-5 w-5" strokeWidth={1.9} />
              </span>
              <div>
                <b className="block text-[13.5px] text-navy-900">{t}</b>
                <span className="text-[11.5px] text-muted-foreground">{d}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ===== DEMO CTA ===== */}
      <section id="demo" className="container py-20">
        <div className="relative overflow-hidden rounded-2xl px-8 py-14 text-center shadow-elevated"
          style={{ background: "radial-gradient(120% 140% at 20% 0%, #16395f, #0c1424 60%)" }}>
          <div className="dark-grid absolute inset-0 opacity-40 radial-fade" />
          <div className="relative">
            <h2 className="font-heading text-3xl font-bold tracking-tight text-white">
              See RME Intelligence on your project
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-white/65">
              Bring a BOQ, a specification, or a payment application. We&apos;ll run it live and
              show you the hours it saves.
            </p>
            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <Link href="/login">
                <Button variant="accent" size="lg" className="shadow-glow">Explore the Platform</Button>
              </Link>
              <Link href="/login">
                <Button variant="outline" size="lg" className="border-white/20 bg-white/5 text-white hover:bg-white/10">
                  Try BOQ Comparison
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="border-t border-border bg-card">
        <div className="container flex flex-col items-center justify-between gap-4 py-8 md:flex-row">
          <div className="flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-navy-900 text-white">
              <BrandMark className="h-4 w-4" />
            </span>
            <span className="font-heading text-sm font-bold text-navy-900">RME Intelligence</span>
          </div>
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Rowad Modern Engineering · Engineering Intelligence Platform
          </p>
          <div className="flex gap-5 text-xs text-muted-foreground">
            <span>Privacy</span><span>Security</span><span>Status</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* ---------- small presentational helpers ---------- */
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-center text-[11.5px] font-semibold uppercase tracking-[0.13em] text-steel">
      {children}
    </p>
  );
}
function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mx-auto mt-2.5 max-w-2xl text-center font-heading text-3xl font-bold tracking-tight text-navy-900">
      {children}
    </h2>
  );
}
function SectionIntro({ children }: { children: React.ReactNode }) {
  return (
    <p className="mx-auto mb-11 mt-3 max-w-2xl text-center text-[15px] leading-relaxed text-graphite-600">
      {children}
    </p>
  );
}
function Th({ children, right }: { children: React.ReactNode; right?: boolean }) {
  return (
    <th className={`px-3 py-2.5 font-semibold ${right ? "text-right" : "text-left"}`}>{children}</th>
  );
}

const toneMap: Record<string, string> = {
  amber: "bg-construction-soft text-[#9a6c00]",
  red: "bg-red-50 text-red-700",
  steel: "bg-navy-100 text-navy-700",
  muted: "bg-muted text-muted-foreground",
  green: "bg-emerald-50 text-emerald-700",
};
const dotMap: Record<string, string> = {
  amber: "bg-construction",
  red: "bg-red-500",
  steel: "bg-steel",
  muted: "bg-graphite-400",
  green: "bg-emerald-500",
};

function Row({
  code, desc, unit, a, b, v, vc, cost, cc, status,
}: {
  code: string; desc: string; unit: string; a: string; b: string;
  v: string; vc?: "pos" | "neg"; cost: string; cc?: "pos" | "neg";
  status: [string, string];
}) {
  const col = (t?: "pos" | "neg") =>
    t === "pos" ? "text-emerald-600" : t === "neg" ? "text-red-600" : "text-navy-900";
  return (
    <tr className="hover:bg-muted/40">
      <td className="numeric px-3 py-2.5 font-semibold text-steel">{code}</td>
      <td className="px-3 py-2.5 text-graphite-700">{desc}</td>
      <td className="px-3 py-2.5 text-muted-foreground">{unit}</td>
      <td className="numeric px-3 py-2.5 text-right text-navy-900">{a}</td>
      <td className="numeric px-3 py-2.5 text-right text-navy-900">{b}</td>
      <td className={`numeric px-3 py-2.5 text-right font-semibold ${col(vc)}`}>{v}</td>
      <td className={`numeric px-3 py-2.5 text-right font-semibold ${col(cc)}`}>{cost}</td>
      <td className="px-3 py-2.5">
        <span className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-semibold ${toneMap[status[0]]}`}>
          <span className={`h-1.5 w-1.5 rounded-full ${dotMap[status[0]]}`} />
          {status[1]}
        </span>
      </td>
    </tr>
  );
}
