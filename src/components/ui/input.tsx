import { Search } from "lucide-react";
import type { InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const field =
  "glass-chip h-11 w-full rounded-full bg-white/55 px-5 text-[0.95rem] text-ink " +
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
