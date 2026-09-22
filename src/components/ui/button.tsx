import { LoaderCircle } from "lucide-react";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

export type ButtonVariant = "primary" | "accent" | "danger" | "glass" | "soft" | "ghost";
export type ButtonSize = "sm" | "md" | "lg" | "icon";

const base =
  "inline-flex select-none items-center justify-center gap-2 whitespace-nowrap rounded-full font-semibold transition " +
  "duration-200 active:scale-[0.97] disabled:pointer-events-none disabled:opacity-50";

const variants: Record<ButtonVariant, string> = {
  primary: "bg-brand-700 text-white shadow-press hover:bg-brand-800",
  accent: "bg-gold-500 text-brand-950 shadow-[0_8px_20px_-8px_rgb(var(--gold-500)/0.7)] hover:bg-gold-400",
  danger: "bg-crimson-500 text-white shadow-[0_8px_20px_-8px_rgb(var(--crimson-500)/0.6)] hover:bg-crimson-600",
  glass: "glass text-brand-800 hover:bg-white/80",
  soft: "bg-brand-700/10 text-brand-800 hover:bg-brand-700/15",
  ghost: "text-brand-800 hover:bg-white/60",
};

const sizes: Record<ButtonSize, string> = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-6 text-[0.95rem]", // 44px — alvo de toque do Brandbook
  lg: "h-14 px-8 text-base",
  icon: "size-11",
};

export function buttonClasses(variant: ButtonVariant = "primary", size: ButtonSize = "md", className?: string): string {
  return cn(base, variants[variant], sizes[size], className);
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  icon?: ReactNode;
}

export function Button({ variant, size, loading, icon, className, children, disabled, ...props }: ButtonProps) {
  return (
    <button className={buttonClasses(variant, size, className)} disabled={disabled || loading} {...props}>
      {loading ? <LoaderCircle className="size-4 animate-spin" /> : icon}
      {children}
    </button>
  );
}
