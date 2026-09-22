import { guestCopy } from "@/lib/content/copy";

/** SEÇÃO · Abertura da vitrine. Texto em src/lib/content/copy.ts (guestCopy.catalog). */
export function CatalogHero({ roomNumber }: { roomNumber: string }) {
  const c = guestCopy.catalog;
  return (
    <section className="px-1 pb-5">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-500">{c.eyebrow(roomNumber)}</p>
      <h1 className="mt-2 text-[2rem] font-bold leading-[1.1] text-brand-800">{c.title}</h1>
      <p className="mt-3 max-w-sm text-[0.95rem] text-ink-soft">{c.subtitle}</p>
    </section>
  );
}
