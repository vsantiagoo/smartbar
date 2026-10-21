import { LoaderCircle } from "lucide-react";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "accent" | "danger" | "glass" | "soft" | "ghost";
type ButtonSize = "sm" | "md" | "lg" | "icon";

const base =
  "inline-flex select-none items-center justify-center gap-2 whitespace-nowrap rounded-full font-semibold transition " +
  "duration-200 active:scale-[0.97] disabled:pointer-events-none disabled:opacity-50";

/** Todas as variantes são vidro (ver .glass-tint em globals.css); a cor fica translúcida. */
const variants: Record<ButtonVariant, string> = {
  primary: "glass-tint bg-brand-700/85 text-white hover:bg-brand-800/90",
  accent: "glass-tint bg-gold-500/85 text-ink hover:bg-gold-400/90",
  danger: "glass-tint bg-crimson-500/85 text-white hover:bg-crimson-600/90",
  glass: "glass text-ink hover:bg-white/80",
  soft: "glass-tint border-white/60 bg-white/40 text-ink hover:bg-white/60",
  ghost: "border border-transparent text-ink hover:border-white/60 hover:bg-white/50 hover:backdrop-blur-md",
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
