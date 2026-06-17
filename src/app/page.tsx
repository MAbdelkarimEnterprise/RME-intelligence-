import Link from "next/link";
import {
  ArrowRight,
  ShieldCheck,
  FileSearch,
  Boxes,
  Sparkles,
  Lock,
  Network,
} from "lucide-react";
import { Logo } from "@/components/brand/logo";
import ShaderBackground from "@/components/ui/shader-background";
import { Button } from "@/components/ui/button";

const capabilities = [
  {
    icon: FileSearch,
    title: "Document Intelligence",
    body: "Upload PDFs, schedules, BOQs and contracts. Ask questions and get grounded answers with source citations — never hallucinated.",
  },
  {
    icon: Boxes,
    title: "Project Knowledge Bases",
    body: "Every workspace — Primavera, QualiSense, Infrastructure — becomes its own searchable memory, isolated and permissioned.",
  },
  {
    icon: Sparkles,
    title: "Claude-Powered Assistant",
    body: "Summarize contracts, surface project risks, extract deadlines and stakeholders, and compare document versions in seconds.",
  },
  {
    icon: Network,
    title: "Retrieval-Augmented",
    body: "Answers are generated only from your uploaded organizational data using pgvector retrieval over the company knowledge base.",
  },
  {
    icon: ShieldCheck,
    title: "Enterprise Security",
    body: "Role-based access, audit logs and encryption at rest. Admin, Manager, Engineer and Viewer roles enforced end to end.",
  },
  {
    icon: Lock,
    title: "Your Data Stays Yours",
    body: "Hosted on your Supabase instance. Documents never train external models. Built for engineering-grade confidentiality.",
  },
];

const trustedSystems = [
  "Oracle ERP",
  "Primavera P6",
  "Primavera Unifier",
  "CostOS",
  "HITS",
  "Autodesk BIM 360",
  "Power BI",
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Nav */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-navy-900/80 backdrop-blur-xl">
        <div className="container flex h-16 items-center justify-between">
          <Logo variant="light" showSub={false} />
          <nav className="hidden items-center gap-8 text-sm font-medium text-white/60 md:flex">
            <a href="#capabilities" className="transition-colors hover:text-white">
              Capabilities
            </a>
            <a href="#security" className="transition-colors hover:text-white">
              Security
            </a>
            <a href="#systems" className="transition-colors hover:text-white">
              Ecosystem
            </a>
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button
                variant="ghost"
                size="sm"
                className="text-white/80 hover:bg-white/10 hover:text-white"
              >
                Sign in
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="accent" size="sm">
                Launch Platform
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative min-h-screen overflow-hidden">
        <ShaderBackground />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/50" />
        <div className="absolute inset-x-0 top-0 h-px accent-hairline" />
        <div className="container relative z-10 py-24 md:py-36">
          <div className="mx-auto max-w-3xl text-center animate-fade-in">
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 text-xs font-medium text-white/70">
              <span className="h-1.5 w-1.5 rounded-full bg-accent shadow-[0_0_8px_2px_rgba(225,29,60,0.7)]" />
              Engineering Intelligence Platform · Internal
            </div>
            <h1 className="text-balance text-4xl font-bold leading-[1.05] tracking-tight md:text-6xl">
              <span className="text-gradient-light">RME Intelligence</span>
            </h1>
            <p className="mt-4 text-lg font-semibold tracking-wide text-accent-glow">
              AI-Powered Construction Intelligence Platform
            </p>
            <p className="mx-auto mt-5 max-w-xl text-balance text-lg leading-relaxed text-white/65">
              Analyze BOQs, compare specifications, automate payment
              applications, and prepare Oracle Unifier-ready deliverables from
              one workspace.
            </p>
            <div className="mt-10 flex items-center justify-center gap-3">
              <Link href="/login">
                <Button variant="accent" size="lg" className="group shadow-glow">
                  Launch Platform
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Button>
              </Link>
              <a href="#capabilities">
                <Button
                  variant="outline"
                  size="lg"
                  className="border-white/20 bg-white/5 text-white hover:bg-white/10"
                >
                  Explore capabilities
                </Button>
              </a>
            </div>
          </div>

          {/* Floating product frame */}
          <div className="mx-auto mt-16 max-w-4xl animate-fade-in">
            <div className="overflow-hidden rounded-xl border border-white/10 bg-navy-800/70 shadow-elevated backdrop-blur">
              <div className="flex items-center gap-2 border-b border-white/10 bg-white/5 px-4 py-2.5">
                <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
                <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
                <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
                <span className="ml-3 text-xs text-white/40">
                  rowad.intelligence / assistant
                </span>
              </div>
              <div className="grid gap-0 md:grid-cols-[1fr_1.2fr]">
                <div className="border-r border-white/10 p-5">
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-white/40">
                    Knowledge Base
                  </div>
                  <div className="mt-3 space-y-2">
                    {["Alamein Towers — Schedule", "Damietta BOQ", "ITP Rev.04", "Risk Register Q2"].map(
                      (d) => (
                        <div
                          key={d}
                          className="flex items-center gap-2 rounded-md border border-white/10 bg-white/[0.03] px-3 py-2 text-xs text-white/70"
                        >
                          <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                          {d}
                        </div>
                      )
                    )}
                  </div>
                </div>
                <div className="space-y-3 p-5">
                  <div className="ml-auto max-w-[85%] rounded-lg rounded-br-sm bg-accent px-3.5 py-2.5 text-xs text-white shadow-glow">
                    Summarize the top three risks in the Q2 programme.
                  </div>
                  <div className="max-w-[92%] rounded-lg rounded-bl-sm border border-white/10 bg-white/[0.04] px-3.5 py-2.5 text-xs leading-relaxed text-white/75">
                    The register flags three high-severity risks: critical-path
                    slippage on structural works, supply delays on imported
                    façade units, and resource contention across concurrent
                    sites…
                    <div className="mt-2 flex items-center gap-1.5 text-[10px] text-white/40">
                      <FileSearch className="h-3 w-3" />
                      Risk Register Q2 2026 · p.4 · 92% confidence
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Capabilities — light premium */}
      <section
        id="capabilities"
        className="relative bg-background py-20 text-foreground md:py-28"
      >
        <div className="container">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
              Capabilities
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-navy-900 md:text-4xl">
              One platform for the whole engineering organization
            </h2>
            <p className="mt-4 text-graphite-600">
              From the PMO to the site office — a single, trustworthy source of
              truth powered by Anthropic Claude.
            </p>
          </div>
          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {capabilities.map(({ icon: Icon, title, body }) => (
              <div
                key={title}
                className="group relative overflow-hidden rounded-xl border border-border bg-card p-6 shadow-card transition-all hover:-translate-y-1 hover:shadow-elevated"
              >
                <div className="absolute inset-x-0 top-0 h-0.5 scale-x-0 bg-accent transition-transform duration-300 group-hover:scale-x-100" />
                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-navy-900 text-white transition-colors group-hover:bg-accent">
                  <Icon className="h-5 w-5" strokeWidth={1.8} />
                </div>
                <h3 className="mt-4 text-base font-semibold text-navy-900">
                  {title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-graphite-600">
                  {body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Security band — dark */}
      <section
        id="security"
        className="relative overflow-hidden dark-panel py-20 text-white"
      >
        <div className="absolute inset-0 dark-grid opacity-50" />
        <div className="container relative grid items-center gap-10 md:grid-cols-2">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-medium text-white/70">
              <ShieldCheck className="h-3.5 w-3.5 text-accent" />
              Enterprise-grade by default
            </div>
            <h2 className="mt-5 text-3xl font-bold tracking-tight md:text-4xl">
              Built for engineering-grade trust
            </h2>
            <p className="mt-4 max-w-md leading-relaxed text-white/65">
              Authentication, granular roles and permissions, full audit logs,
              and encryption — so the right people reach the right knowledge,
              and nothing leaves your control.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              ["Authentication", "Supabase Auth + SSO-ready"],
              ["4 Roles", "Admin · Manager · Engineer · Viewer"],
              ["Audit Logs", "Every action, fully traceable"],
              ["Encryption", "At rest and in transit"],
            ].map(([t, d]) => (
              <div
                key={t}
                className="rounded-xl border border-white/10 bg-white/[0.04] p-4 shadow-inset-hair"
              >
                <div className="text-sm font-semibold">{t}</div>
                <div className="mt-1 text-xs text-white/55">{d}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Ecosystem — light */}
      <section id="systems" className="bg-background py-16">
        <div className="container text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Complements ROWAD&apos;s digital ecosystem
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
            {trustedSystems.map((s) => (
              <span key={s} className="text-sm font-semibold text-graphite-400">
                {s}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* CTA — dark */}
      <section className="bg-background pb-24 pt-4">
        <div className="container">
          <div className="relative overflow-hidden rounded-2xl dark-panel px-8 py-16 text-center shadow-elevated">
            <div className="absolute inset-0 dark-grid opacity-40 radial-fade" />
            <div className="absolute inset-x-0 top-0 h-px accent-hairline" />
            <div className="relative">
              <h2 className="text-3xl font-bold tracking-tight text-white md:text-4xl">
                Put your organizational knowledge to work
              </h2>
              <p className="mx-auto mt-4 max-w-lg text-white/65">
                Launch the platform and start building ROWAD&apos;s engineering
                memory today.
              </p>
              <Link href="/login" className="mt-8 inline-block">
                <Button variant="accent" size="lg" className="group shadow-glow">
                  Launch Platform
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer — dark */}
      <footer className="border-t border-white/10 bg-navy-900 py-10">
        <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
          <Logo variant="light" showSub={false} />
          <p className="text-xs text-white/40">
            © {new Date().getFullYear()} ROWAD Modern Engineering · Internal
            platform. For authorized personnel only.
          </p>
        </div>
      </footer>
    </div>
  );
}
