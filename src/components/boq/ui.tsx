import { cn } from "@/lib/utils";
import type { DiffStatus, Severity } from "@/lib/boq-types";

export function DarkCard({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-xl border border-white/10 bg-white/[0.03] shadow-inset-hair",
        className
      )}
      {...props}
    />
  );
}

const statusStyle: Record<DiffStatus, string> = {
  Added: "bg-emerald-500/15 text-emerald-300 border-emerald-400/25",
  Removed: "bg-accent/15 text-red-300 border-accent/30",
  Modified: "bg-amber-500/15 text-amber-300 border-amber-400/25",
  "Quantity Change": "bg-sky-500/15 text-sky-300 border-sky-400/25",
  "Unit Change": "bg-violet-500/15 text-violet-300 border-violet-400/25",
  "Rate Change": "bg-orange-500/15 text-orange-300 border-orange-400/25",
  "Scope Change": "bg-teal-500/15 text-teal-300 border-teal-400/25",
  Unchanged: "bg-white/5 text-white/45 border-white/10",
};

export function StatusBadge({ status }: { status: DiffStatus }) {
  return (
    <span
      className={cn(
        "inline-flex items-center whitespace-nowrap rounded-full border px-2 py-0.5 text-[11px] font-medium",
        statusStyle[status]
      )}
    >
      {status}
    </span>
  );
}

const sevStyle: Record<Severity, string> = {
  High: "bg-accent/15 text-red-300 border-accent/30",
  Medium: "bg-amber-500/15 text-amber-300 border-amber-400/25",
  Low: "bg-emerald-500/15 text-emerald-300 border-emerald-400/25",
};
const sevDot: Record<Severity, string> = {
  High: "bg-accent",
  Medium: "bg-amber-400",
  Low: "bg-emerald-400",
};

export function SeverityBadge({ severity }: { severity: Severity }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[11px] font-semibold",
        sevStyle[severity]
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", sevDot[severity])} />
      {severity}
    </span>
  );
}

export function DarkSelect({
  className,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cn(
        "h-9 rounded-md border border-white/10 bg-navy-800 px-3 text-sm text-white/80 outline-none focus:border-accent/50",
        className
      )}
      {...props}
    />
  );
}
