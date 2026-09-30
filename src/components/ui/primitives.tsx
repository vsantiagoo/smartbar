import type { LucideIcon } from "lucide-react";
import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Skeleton({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div aria-hidden className={cn("animate-pulse rounded-2xl bg-brand-700/10", className)} {...props} />;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col items-center px-6 py-12 text-center", className)}>
      <span className="mb-4 grid size-14 place-items-center rounded-3xl glass-chip bg-brand-700/10 text-brand-700">
        <Icon className="size-6" />
      </span>
      <p className="text-base font-semibold text-ink">{title}</p>
      {description && <p className="mt-1 max-w-xs text-sm text-ink-soft">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

/** Barra de progresso/nível. `tone` muda conforme a criticidade. */
export function Meter({
  value,
  max,
  tone = "info",
  label,
  className,
}: {
  value: number;
  max: number;
  tone?: "info" | "ok" | "warn" | "danger";
  label: string;
  className?: string;
}) {
  const pct = max <= 0 ? 0 : Math.min(100, Math.round((value / max) * 100));
  const fill = { info: "bg-brand-600", ok: "bg-ok-500", warn: "bg-gold-500", danger: "bg-crimson-500" }[tone];
  return (
    <div
      role="meter"
      aria-label={label}
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={max}
      className={cn("glass-chip h-2 w-full overflow-hidden rounded-full bg-brand-700/10", className)}
    >
      <div className={cn("h-full rounded-full transition-all duration-500", fill)} style={{ width: `${pct}%` }} />
    </div>
  );
}

/** Ponto pulsante "ao vivo" (Realtime). */
export function LiveDot({ tone = "ok", className }: { tone?: "ok" | "warn"; className?: string }) {
  const c = tone === "ok" ? "bg-ok-500" : "bg-gold-500";
  return (
    <span className={cn("relative flex size-2.5", className)} aria-hidden>
      <span className={cn("absolute inset-0 animate-pulse-ring rounded-full", c)} />
      <span className={cn("relative size-2.5 rounded-full", c)} />
    </span>
  );
}

/** Número em fonte pontilhada (ref.: cards de valor do Design System). */
export function DotNumber({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={cn("tabular font-dot font-extrabold leading-none tracking-tight text-ink", className)}
      style={{ fontFamily: "var(--font-dot), ui-monospace, SFMono-Regular, monospace" }}
    >
      {children}
    </span>
  );
}

export function KpiCard({
  label,
  value,
  hint,
  icon: Icon,
  tone = "info",
  className,
}: {
  label: string;
  value: ReactNode;
  hint?: ReactNode;
  icon: LucideIcon;
  tone?: "info" | "gold" | "danger" | "ok";
  className?: string;
}) {
  const iconTone = {
    info: "bg-brand-700/10 text-brand-700",
    gold: "bg-gold-500/15 text-gold-600",
    danger: "bg-crimson-500/10 text-crimson-600",
    ok: "bg-ok-500/12 text-ok-600",
  }[tone];
  return (
    <div className={cn("glass rounded-[28px] p-5", className)}>
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-medium text-ink-soft">{label}</p>
        <span className={cn("glass-chip grid size-9 place-items-center rounded-2xl", iconTone)}>
          <Icon className="size-[18px]" />
        </span>
      </div>
      <div className="mt-3 text-[2.1rem]">{value}</div>
      {hint && <p className="mt-2 text-xs text-ink-soft">{hint}</p>}
    </div>
  );
}
