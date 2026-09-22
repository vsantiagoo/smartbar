"use client";
import { X } from "lucide-react";
import { useEffect, type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SheetProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
}

/** Bottom sheet mobile-first (carrinho). Fecha com Esc, clique fora e botão. */
export function Sheet({ open, onClose, title, children, footer }: SheetProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center" role="dialog" aria-modal="true" aria-label={title}>
      <button aria-label="Fechar" className="absolute inset-0 bg-brand-950/40 backdrop-blur-[3px]" onClick={onClose} />
      <div
        className={cn(
          "glass-strong relative flex max-h-[88dvh] w-full max-w-lg animate-sheet-up flex-col rounded-t-[36px] sm:rounded-[36px]",
        )}
      >
        <div className="mx-auto mt-3 h-1 w-10 rounded-full bg-brand-700/20 sm:hidden" />
        <header className="flex items-center justify-between px-6 pb-2 pt-4">
          <h2 className="text-xl font-semibold">{title}</h2>
          <button onClick={onClose} aria-label="Fechar" className="grid size-10 place-items-center rounded-full hover:bg-brand-700/10">
            <X className="size-5" />
          </button>
        </header>
        <div className="scroll-hide flex-1 overflow-y-auto px-6 py-2">{children}</div>
        {footer && <footer className="border-t border-white/70 px-6 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-4">{footer}</footer>}
      </div>
    </div>
  );
}
