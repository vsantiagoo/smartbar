"use client";
import { marketingCopy } from "@/lib/content/copy";
import { useActiveSection } from "@/lib/marketing/use-active-section";
import { cn } from "@/lib/utils";

/** SEÇÃO · Menu flutuante em pílula de vidro, fixo, com o item ativo aceso pelo scroll. */
export function FloatingNav() {
  const ids = marketingCopy.nav.map((n) => n.id);
  const active = useActiveSection(ids);

  return (
    <nav
      aria-label="Seções da página"
      className="glass-dark scroll-hide fixed inset-x-0 bottom-6 z-40 mx-auto flex w-fit max-w-[92vw] gap-1 overflow-x-auto rounded-full p-1.5 text-white"
    >
      {marketingCopy.nav.map((item) => (
        <a
          key={item.id}
          href={`#${item.id}`}
          aria-current={active === item.id ? "true" : undefined}
          className={cn(
            "shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition whitespace-nowrap",
            active === item.id ? "bg-white text-brand-900" : "text-white/70 hover:bg-white/10 hover:text-white",
          )}
        >
          {item.label}
        </a>
      ))}
    </nav>
  );
}
