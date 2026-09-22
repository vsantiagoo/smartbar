import { Search } from "lucide-react";
import type { InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const field =
  "h-11 w-full rounded-full border border-white/80 bg-white/70 px-5 text-[0.95rem] text-brand-900 shadow-[inset_0_1px_2px_rgba(20,44,84,0.06)] " +
  "placeholder:text-ink-faint transition focus:border-brand-300 focus:bg-white focus:outline-none focus:ring-4 focus:ring-brand-700/10";

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn(field, className)} {...props} />;
}

export function SearchField({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className={cn("relative", className)}>
      <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-ink-faint" />
      <input type="search" className={cn(field, "pl-11")} {...props} />
    </div>
  );
}
