import { DotNumber } from "@/components/ui/primitives";
import { Reveal } from "@/components/ui/reveal";
import { marketingCopy } from "@/lib/content/copy";
import { GlowBackdrop } from "./glow-backdrop";

/** SEÇÃO · Números de referência do mercado, em cards de vidro (bloco emocional do Orbit). */
export function ImpactStats() {
  const c = marketingCopy.stats;
  return (
    <section id="resultados" className="relative isolate scroll-mt-24 px-6 py-24 sm:py-32">
      <GlowBackdrop />
      <div className="mx-auto max-w-5xl text-center">
        <Reveal>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-500">{c.kicker}</p>
          <h2 className="mt-3 text-[2.4rem] font-bold leading-[1.1] sm:text-[3.2rem]">
            {c.title} <span className="text-gold-500">{c.titleAccent}</span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-ink-soft">{c.subtitle}</p>
        </Reveal>

        <div className="mt-14 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {c.items.map((item, i) => (
            <Reveal key={item.label} delay={i * 90} className="h-full">
              <div className="glass h-full rounded-[28px] px-4 py-7">
                <DotNumber className="text-[2.4rem] sm:text-[2.8rem]">{item.value}</DotNumber>
                <p className="mt-2 text-sm text-ink-soft">{item.label}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
