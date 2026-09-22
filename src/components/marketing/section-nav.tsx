"use client";
import { marketingCopy } from "@/lib/content/copy";
import { useActiveSection } from "@/lib/marketing/use-active-section";
import { cn } from "@/lib/utils";

/**
 * SEÇÃO · Menu das seções, com o item ativo aceso pelo scroll.
 * Fica centralizado dentro do cabeçalho (`site-header.tsx`) — o vidro é o da
 * própria barra, por isso aqui o container é transparente.
 */
export function SectionNav({ className }: { className?: string }) {
  const ids = marketingCopy.nav.map((n) => n.id);
  const active = useActiveSection(ids);

  return (
    <nav
      aria-label="Seções da página"
      className={cn("scroll-hide flex max-w-full gap-0.5 overflow-x-auto text-white", className)}
    >
      {marketingCopy.nav.map((item) => (
        <a
          key={item.id}
          href={`#${item.id}`}
          aria-current={active === item.id ? "true" : undefined}
          className={cn(
            "shrink-0 rounded-full px-3 py-1.5 text-sm font-semibold transition whitespace-nowrap",
            active === item.id
              ? "glass-tint border-white/70 bg-white/85 text-ink"
              : "border border-transparent text-white/70 hover:border-white/15 hover:bg-white/10 hover:text-white",
          )}
        >
          {item.label}
        </a>
      ))}
    </nav>
  );
}
