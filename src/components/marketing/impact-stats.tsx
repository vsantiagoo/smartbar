import { DotNumber } from "@/components/ui/primitives";
import { marketingCopy } from "@/lib/content/copy";

/** SEÇÃO · Números de referência do mercado, em tipografia grande (como o bloco emocional do Orbit). */
export function ImpactStats() {
  const c = marketingCopy.stats;
  return (
    <section id="resultados" className="scroll-mt-24 bg-white px-6 py-24 sm:py-32">
      <div className="mx-auto max-w-4xl text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-500">{c.kicker}</p>
        <h2 className="mt-3 text-[2.4rem] font-bold leading-[1.1] sm:text-[3.2rem]">
          {c.title} <span className="text-gold-500">{c.titleAccent}</span>
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-ink-soft">{c.subtitle}</p>

        <div className="mt-14 grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-4">
          {c.items.map((item) => (
            <div key={item.label}>
              <DotNumber className="text-[2.6rem] sm:text-[3rem]">{item.value}</DotNumber>
              <p className="mt-2 text-sm text-ink-soft">{item.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
