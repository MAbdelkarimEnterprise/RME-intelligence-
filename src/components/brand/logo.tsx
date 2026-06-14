import { cn } from "@/lib/utils";

/**
 * ROWAD Modern Engineering — official mark, rebuilt as scalable SVG so it
 * themes cleanly (brand red monogram on any background; wordmark switches
 * navy ↔ white). To use an exact official asset instead, drop
 * `rowad-logo.svg` into /public and render it in place of <RowadMark/>.
 */

const BRAND_RED = "#C8102E";

export function RowadMark({
  className,
  red = BRAND_RED,
}: {
  className?: string;
  red?: string;
}) {
  return (
    <svg
      viewBox="8 12 100 114"
      className={cn("h-9 w-auto", className)}
      role="img"
      aria-label="ROWAD Modern Engineering"
      fill="none"
    >
      {/* two long bars sweeping down to the right */}
      <polygon points="18,16 104,44 104,63 18,35" fill={red} />
      <polygon points="12,50 98,78 98,97 12,69" fill={red} />
      {/* bottom row: shorter bar (right) + triangle (left, pointing right) */}
      <polygon points="58,86 104,102 104,121 58,105" fill={red} />
      <polygon points="14,92 14,110 30,101" fill={red} />
      <text x="34" y="108" fontFamily="Arial, sans-serif" fontSize="10" fill={red}>
        ®
      </text>
    </svg>
  );
}

export function Logo({
  className,
  variant = "default",
  showSub = true,
  size = "md",
}: {
  className?: string;
  variant?: "default" | "light";
  showSub?: boolean;
  size?: "sm" | "md" | "lg";
}) {
  const light = variant === "light";
  const markH = size === "lg" ? "h-11" : size === "sm" ? "h-7" : "h-9";
  const wordSize =
    size === "lg" ? "text-2xl" : size === "sm" ? "text-base" : "text-lg";
  const subSize = size === "lg" ? "text-[11px]" : "text-[9px]";

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <RowadMark className={markH} />
      <div className="leading-none">
        <div
          className={cn(
            "font-extrabold tracking-tight",
            wordSize,
            light ? "text-white" : "text-navy-900"
          )}
        >
          ROWAD
        </div>
        {showSub && (
          <div
            className={cn(
              "mt-1 font-semibold uppercase tracking-[0.22em]",
              subSize,
              light ? "text-white/55" : "text-steel"
            )}
          >
            Modern Engineering
          </div>
        )}
      </div>
    </div>
  );
}
