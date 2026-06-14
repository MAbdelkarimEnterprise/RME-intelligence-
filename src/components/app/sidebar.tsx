"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Boxes,
  FileText,
  Library,
  Sparkles,
  Settings,
  Shield,
  BarChart3,
  GitCompareArrows,
  FileCheck2,
} from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { cn } from "@/lib/utils";
import { projects } from "@/lib/demo-data";

const nav = [
  { href: "/dashboard", label: "Home", icon: Home },
  { href: "/dashboard/projects", label: "Projects", icon: Boxes },
  { href: "/dashboard/documents", label: "Documents", icon: FileText },
  { href: "/dashboard/knowledge-base", label: "Knowledge Base", icon: Library },
  { href: "/dashboard/assistant", label: "AI Assistant", icon: Sparkles },
];

const intelligence = [
  {
    href: "/dashboard/boq-intelligence",
    label: "BOQ Intelligence",
    icon: GitCompareArrows,
  },
  {
    href: "/dashboard/ipc-merger",
    label: "IPC Merger",
    icon: FileCheck2,
  },
];

const admin = [
  { href: "/dashboard/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/dashboard/admin", label: "Admin Panel", icon: Shield },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const isActive = (href: string) =>
    href === "/dashboard"
      ? pathname === "/dashboard"
      : pathname.startsWith(href);

  return (
    <aside className="relative flex h-full w-64 flex-col overflow-hidden bg-gradient-to-b from-navy-800 to-navy-900 text-white">
      {/* brand motif accent — top-right corner */}
      <div className="pointer-events-none absolute -right-6 top-10 h-24 w-24 rotate-12 bars-motif opacity-[0.10]" />
      <div className="absolute inset-y-0 right-0 w-px bg-white/10" />

      <div className="relative flex h-16 items-center border-b border-white/10 px-5">
        <Link href="/dashboard">
          <Logo variant="light" showSub={false} />
        </Link>
      </div>

      <nav className="relative flex-1 overflow-y-auto px-3 py-4">
        <div className="space-y-0.5">
          {nav.map(({ href, label, icon: Icon }) => (
            <NavItem
              key={href}
              href={href}
              label={label}
              Icon={Icon}
              active={isActive(href)}
            />
          ))}
        </div>

        <div className="mt-6">
          <p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-white/35">
            Tender Intelligence
          </p>
          <div className="space-y-0.5">
            {intelligence.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  "group relative flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-all",
                  isActive(href)
                    ? "bg-white/10 text-white shadow-inset-hair"
                    : "text-white/55 hover:bg-white/5 hover:text-white"
                )}
              >
                {isActive(href) && (
                  <span className="absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-full bg-accent shadow-[0_0_8px_1px_rgba(200,16,46,0.6)]" />
                )}
                <Icon
                  className={cn(
                    "h-4 w-4",
                    isActive(href) ? "text-accent" : "text-white/40 group-hover:text-white/80"
                  )}
                  strokeWidth={1.9}
                />
                {label}
                <span className="ml-auto rounded-full bg-accent/20 px-1.5 py-0.5 text-[9px] font-bold uppercase text-accent">
                  New
                </span>
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-6">
          <p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-white/35">
            Workspaces
          </p>
          <div className="space-y-0.5">
            {projects.slice(0, 5).map((p) => {
              const on = pathname === `/dashboard/projects/${p.id}`;
              return (
                <Link
                  key={p.id}
                  href={`/dashboard/projects/${p.id}`}
                  className={cn(
                    "group flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    on
                      ? "bg-white/10 text-white"
                      : "text-white/55 hover:bg-white/5 hover:text-white"
                  )}
                >
                  <span
                    className="h-2 w-2 shrink-0 rounded-sm ring-1 ring-white/20"
                    style={{ backgroundColor: p.color }}
                  />
                  <span className="truncate">{p.name}</span>
                </Link>
              );
            })}
          </div>
        </div>

        <div className="mt-6">
          <p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-white/35">
            Administration
          </p>
          <div className="space-y-0.5">
            {admin.map(({ href, label, icon: Icon }) => (
              <NavItem
                key={href}
                href={href}
                label={label}
                Icon={Icon}
                active={isActive(href)}
              />
            ))}
          </div>
        </div>
      </nav>

      <div className="relative border-t border-white/10 p-3">
        <div className="rounded-lg border border-white/10 bg-white/[0.04] p-3 shadow-inset-hair">
          <div className="flex items-center justify-between text-xs">
            <span className="font-medium text-white/80">Storage</span>
            <span className="text-white/45">12.4 / 100 GB</span>
          </div>
          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
            <div className="h-full w-[12%] rounded-full bg-accent" />
          </div>
        </div>
      </div>
    </aside>
  );
}

function NavItem({
  href,
  label,
  Icon,
  active,
}: {
  href: string;
  label: string;
  Icon: typeof Home;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "group relative flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-all",
        active
          ? "bg-white/10 text-white shadow-inset-hair"
          : "text-white/55 hover:bg-white/5 hover:text-white"
      )}
    >
      {active && (
        <span className="absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-full bg-accent shadow-[0_0_8px_1px_rgba(200,16,46,0.6)]" />
      )}
      <Icon
        className={cn(
          "h-4 w-4 transition-colors",
          active ? "text-accent" : "text-white/40 group-hover:text-white/80"
        )}
        strokeWidth={1.9}
      />
      {label}
    </Link>
  );
}
