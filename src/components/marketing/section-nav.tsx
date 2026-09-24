"use client";
import { useEffect, useRef, useState } from "react";
import { marketingCopy } from "@/lib/content/copy";
import { useActiveSection } from "@/lib/marketing/use-active-section";
import { cn } from "@/lib/utils";

/** Quanto do menu some no esmaecimento de cada ponta. */
const FADE = "28px";

function maskFor(left: boolean, right: boolean): string | undefined {
  if (!left && !right) return undefined;
  const start = left ? `transparent, #000 ${FADE}` : "#000";
  const end = right ? `#000 calc(100% - ${FADE}), transparent` : "#000";
  return `linear-gradient(to right, ${start}, ${end})`;
}

/**
 * SEÇÃO · Menu das seções, com o item ativo aceso pelo scroll. Fica dentro do
 * cabeçalho (`site-header.tsx`) — o vidro é o da barra, por isso aqui o
 * container é transparente.
 *
 * Quando não cabe (celular), desliza na horizontal: as pontas esmaecem para
 * mostrar que há mais itens, e o item aceso se centraliza sozinho conforme a
 * página rola.
 */
export function SectionNav({ className }: { className?: string }) {
  const ids = marketingCopy.nav.map((n) => n.id);
  const active = useActiveSection(ids);
  const navRef = useRef<HTMLElement>(null);
  const activeRef = useRef<HTMLAnchorElement>(null);
  const [edges, setEdges] = useState({ left: false, right: false });

  useEffect(() => {
    const el = navRef.current;
    if (!el) return;
    const update = () => {
      const max = el.scrollWidth - el.clientWidth;
      setEdges({ left: el.scrollLeft > 4, right: el.scrollLeft < max - 4 });
    };
    update();
    el.addEventListener("scroll", update, { passive: true });
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", update);
      ro.disconnect();
    };
  }, []);

  useEffect(() => {
    const el = navRef.current;
    const item = activeRef.current;
    if (!el || !item) return;
    // scrollLeft direto (e não scrollIntoView) para nunca mexer na rolagem da página.
    el.scrollTo({ left: Math.max(0, item.offsetLeft - (el.clientWidth - item.offsetWidth) / 2), behavior: "smooth" });
  }, [active]);

  const mask = maskFor(edges.left, edges.right);

  return (
    <nav
      ref={navRef}
      aria-label="Seções da página"
      className={cn("scroll-hide flex max-w-full gap-1 overflow-x-auto text-white", className)}
      style={mask ? { maskImage: mask, WebkitMaskImage: mask } : undefined}
    >
      {marketingCopy.nav.map((item) => {
        const on = active === item.id;
        return (
          <a
            key={item.id}
            ref={on ? activeRef : undefined}
            href={`#${item.id}`}
            aria-current={on ? "true" : undefined}
            className={cn(
              "shrink-0 whitespace-nowrap rounded-full px-2.5 py-1 text-[0.78rem] font-semibold transition sm:px-3.5 sm:py-1.5 sm:text-sm",
              on
                ? "glass-tint border-white/70 bg-white/85 text-ink"
                : "border border-transparent text-white/70 hover:border-white/15 hover:bg-white/10 hover:text-white",
            )}
          >
            {item.label}
          </a>
        );
      })}
    </nav>
  );
}
