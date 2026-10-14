import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export type BadgeTone = "neutral" | "info" | "ok" | "warn" | "danger" | "gold";

const tones: Record<BadgeTone, { wrap: string; dot: string }> = {
  neutral: { wrap: "bg-ink/8 text-ink", dot: "bg-ink-faint" },
  info: { wrap: "bg-brand-700/10 text-brand-700 dark:bg-white/10 dark:text-white", dot: "bg-brand-500" },
  ok: { wrap: "bg-ok-500/12 text-ok-600", dot: "bg-ok-500" },
  warn: { wrap: "bg-gold-500/15 text-gold-600", dot: "bg-gold-500" },
  danger: { wrap: "bg-crimson-500/10 text-crimson-600", dot: "bg-crimson-500" },
  gold: { wrap: "bg-gold-500 text-ink", dot: "bg-brand-950" },
};

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: BadgeTone;
  dot?: boolean;
  pulse?: boolean;
}

export function Badge({ tone = "neutral", dot, pulse, className, children, ...props }: BadgeProps) {
  const t = tones[tone];
  return (
    <span
      className={cn(
        "glass-chip inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold",
        t.wrap,
        className,
      )}
      {...props}
    >
      {dot && (
        <span className="relative flex size-1.5">
          {pulse && <span className={cn("absolute inset-0 animate-pulse-ring rounded-full", t.dot)} />}
          <span className={cn("relative size-1.5 rounded-full", t.dot)} />
        </span>
      )}
      {children}
    </span>
  );
}
