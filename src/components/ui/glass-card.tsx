import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type Surface = "glass" | "strong" | "solid" | "navy";
type Pad = "none" | "sm" | "md" | "lg";

const surfaces: Record<Surface, string> = {
  glass: "glass",
  strong: "glass-strong",
  solid: "bg-white shadow-soft border border-white",
  navy: "bg-brand-800 text-white shadow-soft border border-white/10",
};
const pads: Record<Pad, string> = { none: "", sm: "p-4", md: "p-5 sm:p-6", lg: "p-6 sm:p-8" };

interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  surface?: Surface;
  pad?: Pad;
}

/** Superfície base do design system. Cantos generosos + vidro fosco. */
export function GlassCard({ surface = "glass", pad = "md", className, ...props }: GlassCardProps) {
  return <div className={cn("rounded-[28px]", surfaces[surface], pads[pad], className)} {...props} />;
}

export function SectionTitle({
  title,
  hint,
  action,
  className,
}: {
  title: string;
  hint?: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mb-4 flex items-start justify-between gap-3", className)}>
      <div>
        <h2 className="text-lg font-semibold">{title}</h2>
        {hint && <p className="mt-0.5 text-sm text-ink-soft">{hint}</p>}
      </div>
      {action}
    </div>
  );
}
