"use client";
import { cn } from "@/lib/utils";

interface Option<T extends string> {
  value: T;
  label: string;
  count?: number;
}

interface SegmentedProps<T extends string> {
  options: readonly Option<T>[];
  value: T;
  onChange: (value: T) => void;
  label: string;
  className?: string;
}

/** Abas em pílula de vidro (ref.: barra flutuante do Design System). */
export function Segmented<T extends string>({ options, value, onChange, label, className }: SegmentedProps<T>) {
  return (
    <div
      role="tablist"
      aria-label={label}
      className={cn("scroll-hide glass inline-flex max-w-full gap-1 overflow-x-auto rounded-full p-1", className)}
    >
      {options.map((o) => {
        const active = o.value === value;
        return (
          <button
            key={o.value}
            role="tab"
            aria-selected={active}
            onClick={() => onChange(o.value)}
            className={cn(
              "inline-flex h-9 shrink-0 items-center gap-2 rounded-full px-4 text-sm font-semibold transition",
              active ? "glass-tint bg-brand-700/80 text-white" : "text-ink-soft hover:bg-white/70 hover:text-ink",
            )}
          >
            {o.label}
            {o.count !== undefined && (
              <span
                className={cn(
                  "tabular rounded-full px-1.5 text-xs",
                  active ? "bg-white/20 text-white" : "bg-brand-700/10 text-brand-700",
                )}
              >
                {o.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
