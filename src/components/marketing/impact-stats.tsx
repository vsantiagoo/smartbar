import { Eyebrow } from "@/components/ui/eyebrow";
import { Reveal } from "@/components/ui/reveal";
import { marketingCopy } from "@/lib/content/copy";
import { getT } from "@/lib/i18n/server";
import { BackToTop } from "./back-to-top";
import { Seam } from "./seam";
import { GlowBackdrop } from "./glow-backdrop";

/** SEÇÃO · Números de referência do mercado, em cards de vidro (bloco emocional do Orbit). */
export async function ImpactStats() {
  const c = marketingCopy(await getT()).stats;
  return (
    <section id="resultados" className="relative isolate px-6 py-16 sm:px-10 sm:py-20">
      <BackToTop />
      <GlowBackdrop />
      <Seam className="mx-auto max-w-6xl text-center">
        <Reveal weight="lead">
          <Eyebrow centered>{c.kicker}</Eyebrow>
          <h2 className="mt-5 text-[2.4rem] font-bold leading-[1.1] sm:text-[3.2rem]">
            {c.title} <span className="text-gold-500">{c.titleAccent}</span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-ink-soft">{c.subtitle}</p>
        </Reveal>

        <div className="mt-14 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {c.items.map((item, i) => (
            <Reveal key={item.label} weight="aside" delay={i * 90} className="h-full">
              <div className="glass shake-hover h-full rounded-card px-4 py-7">
                {/* Plus Jakarta Sans, a mesma da logo: o número vira um gesto da marca. */}
                <span
                  className="tabular block font-extrabold leading-none tracking-tight text-ink text-[2.4rem] sm:text-[2.8rem]"
                  style={{ fontFamily: "var(--font-heading), 'Plus Jakarta Sans', sans-serif" }}
                >
                  {item.value}
                </span>
                <p className="mt-2 text-sm text-ink-soft">{item.label}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Seam>
    </section>
  );
}
