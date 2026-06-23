"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileSearch,
  GitCompareArrows,
  ReceiptText,
  ClipboardCheck,
  Building2,
  BarChart3,
  Shield,
  CircleDot,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { projects } from "@/lib/demo-data";

type NavLink = { href: string; label: string; icon: typeof LayoutDashboard };

const overview: NavLink[] = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
];

const applications: NavLink[] = [
  { href: "/dashboard/documents", label: "Document Intelligence", icon: FileSearch },
  { href: "/dashboard/boq-intelligence", label: "BOQ Intelligence", icon: GitCompareArrows },
  { href: "/dashboard/ipc-merger", label: "Payment Certificate Engine", icon: ReceiptText },
  { href: "/dashboard/spec-intelligence", label: "Specification Intelligence", icon: ClipboardCheck },
  { href: "/dashboard/technical-office", label: "Technical Office", icon: Building2 },
];

const controls: NavLink[] = [
  { href: "/dashboard/analytics", label: "Reports", icon: BarChart3 },
  { href: "/dashboard/admin", label: "Admin", icon: Shield },
];

/** Engineering structure mark — steel/navy, deliberately not an AI/robot glyph. */
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

export function Sidebar() {
  const pathname = usePathname();
  const isActive = (href: string) =>
    href === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(href);

  const activeProject = projects[1] ?? projects[0];

  return (
    <aside className="relative flex h-full w-64 flex-col overflow-hidden bg-gradient-to-b from-navy-800 to-navy-950 text-white">
      <div className="absolute inset-y-0 right-0 w-px bg-white/10" />

      {/* Brand */}
      <div className="relative flex h-16 items-center gap-3 border-b border-white/10 px-5">
        <Link href="/dashboard" className="flex items-center gap-3">
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
      </div>

      <nav className="relative flex-1 overflow-y-auto px-3 py-4">
        <NavSection label="Overview" items={overview} isActive={isActive} />
        <NavSection
          label="Intelligence Applications"
          items={applications}
          isActive={isActive}
          className="mt-6"
        />
        <NavSection label="Controls" items={controls} isActive={isActive} className="mt-6" />
      </nav>

      {/* Active project footer */}
      <div className="relative border-t border-white/10 p-3">
        <div className="rounded-lg border border-white/10 bg-white/[0.04] p-3 shadow-inset-hair">
          <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-white/40">
            Active project
          </div>
          <div className="mt-1 flex items-center gap-2">
            <span
              className="h-2 w-2 shrink-0 rounded-sm ring-1 ring-white/20"
              style={{ backgroundColor: activeProject?.color }}
            />
            <span className="truncate text-[12.5px] font-semibold text-white">
              {activeProject?.name}
            </span>
          </div>
          <div className="mt-2.5 flex items-center gap-2 text-[10.5px] text-white/55">
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2 py-0.5 font-semibold text-emerald-300">
              <CircleDot className="h-2.5 w-2.5" />
              Live
            </span>
            <span>{projects.length} projects · 38 users</span>
          </div>
        </div>
      </div>
    </aside>
  );
}

function NavSection({
  label,
  items,
  isActive,
  className,
}: {
  label: string;
  items: NavLink[];
  isActive: (href: string) => boolean;
  className?: string;
}) {
  return (
    <div className={className}>
      <p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-white/35">
        {label}
      </p>
      <div className="space-y-0.5">
        {items.map(({ href, label, icon: Icon }) => {
          const active = isActive(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "group relative flex items-center gap-3 rounded-md px-3 py-2 text-[13px] font-medium transition-all",
                active
                  ? "bg-navy-700 text-white shadow-inset-hair ring-1 ring-steel/40"
                  : "text-white/55 hover:bg-white/5 hover:text-white"
              )}
            >
              {active && (
                <span className="absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-full bg-accent shadow-[0_0_8px_1px_rgba(232,83,26,0.6)]" />
              )}
              <Icon
                className={cn(
                  "h-[18px] w-[18px] transition-colors",
                  active ? "text-accent" : "text-white/45 group-hover:text-white/80"
                )}
                strokeWidth={1.9}
              />
              <span className="truncate">{label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
