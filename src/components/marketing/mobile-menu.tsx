"use client";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { buttonClasses } from "@/components/ui/button";
import { marketingCopy } from "@/lib/content/copy";
import { useActiveSection } from "@/lib/marketing/use-active-section";
import { cn } from "@/lib/utils";

/**
 * Cabeçalho em telas menores que 1024px: botão de entrar + botão de menu, que
 * abre as seções num painel de vidro. Fecha ao escolher, ao tocar fora, com
 * Esc ou ao rolar a página.
 */
export function MobileMenu({ className }: { className?: string }) {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const c = marketingCopy.header;
  const active = useActiveSection(marketingCopy.nav.map((n) => n.id));

  useEffect(() => {
    if (!open) return;
    const close = () => setOpen(false);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    const onDown = (e: PointerEvent) => {
      if (root.current && !root.current.contains(e.target as Node)) close();
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("scroll", close, { passive: true });
    document.addEventListener("pointerdown", onDown);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("scroll", close);
      document.removeEventListener("pointerdown", onDown);
    };
  }, [open]);

  return (
    <div ref={root} className={cn("relative", className)}>
      <div className="glass-dark flex items-center gap-1 rounded-full p-1.5 text-white">
        <Link href="/admin" className={buttonClasses("accent", "sm", "shrink-0")}>
          <span className="sm:hidden">{c.ctaShort}</span>
          <span className="hidden sm:inline">{c.cta}</span>
        </Link>
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-controls="menu-secoes"
          aria-label={open ? c.closeMenu : c.openMenu}
          className="grid size-9 shrink-0 place-items-center rounded-full text-white/85 transition hover:bg-white/10 hover:text-white"
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {open && (
        <nav
          id="menu-secoes"
          aria-label="Seções da página"
          className="glass-dark absolute right-0 top-[calc(100%+0.625rem)] w-[min(17rem,calc(100vw-3rem))] animate-fade-up rounded-3xl bg-brand-950/80 p-2 text-white"
        >
          {marketingCopy.nav.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              onClick={() => setOpen(false)}
              aria-current={active === item.id ? "true" : undefined}
              className={cn(
                "flex h-12 items-center rounded-2xl px-4 text-[0.95rem] font-semibold transition",
                active === item.id ? "bg-white/85 text-ink" : "text-white/80 hover:bg-white/10 hover:text-white",
              )}
            >
              {item.label}
            </a>
          ))}
        </nav>
      )}
    </div>
  );
}
