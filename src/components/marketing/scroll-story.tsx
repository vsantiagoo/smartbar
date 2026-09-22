"use client";
import { useRef } from "react";
import { marketingCopy } from "@/lib/content/copy";
import { useScrollProgress, usePrefersReducedMotion } from "@/lib/marketing/use-scroll-progress";
import { cn } from "@/lib/utils";

const PANEL_BG = [
  "from-brand-950 via-brand-900 to-brand-800", // 01 — hóspede escolhe
  "from-ok-600 via-brand-900 to-brand-950", // 02 — pagamento confirma
  "from-gold-600 via-brand-900 to-brand-950", // 03 — trava libera
];

/**
 * SEÇÃO · "Telas que acompanham o scroll" (scrollytelling), estilo Orbit:
 * a viewport fica presa (`sticky`) enquanto o usuário rola por dentro desta
 * seção; a cada trecho, o fundo e o texto trocam em crossfade.
 *
 * Com "reduzir movimento" ativo, cai para 3 blocos empilhados normais —
 * sem sticky nem crossfade.
 */
export function ScrollStory() {
  const ref = useRef<HTMLDivElement>(null);
  const { steps } = marketingCopy.story;
  const reduced = usePrefersReducedMotion();
  const { index, local } = useScrollProgress(ref, steps.length);

  if (reduced) {
    return (
      <section id="como-funciona" className="scroll-mt-24 space-y-3 px-4 py-3">
        {steps.map((s, i) => (
          <div key={s.n} className={cn("rounded-[40px] bg-gradient-to-br p-10 text-white sm:p-16", PANEL_BG[i])}>
            <Panel step={s} kicker={i === 0 ? marketingCopy.story.kicker : undefined} />
          </div>
        ))}
      </section>
    );
  }

  return (
    <section id="como-funciona" ref={ref} className="relative scroll-mt-24" style={{ height: `${steps.length * 100}dvh` }}>
      <div className="sticky top-0 h-dvh overflow-hidden">
        {steps.map((s, i) => {
          const opacity = i === index ? 1 - local : i === index + 1 ? local : 0;
          if (opacity <= 0.001) return null;
          return (
            <div
              key={s.n}
              className={cn("absolute inset-0 flex items-center justify-center bg-gradient-to-br px-6", PANEL_BG[i])}
              style={{ opacity }}
              aria-hidden={opacity < 0.5}
            >
              <div className="max-w-2xl -translate-y-2 text-white" style={{ transform: `translateY(${(1 - opacity) * 16}px)` }}>
                <Panel step={s} kicker={i === 0 ? marketingCopy.story.kicker : undefined} />
              </div>
            </div>
          );
        })}

        <div className="pointer-events-none absolute inset-x-0 bottom-10 flex justify-center gap-2">
          {steps.map((s, i) => (
            <span
              key={s.n}
              className={cn("h-1.5 rounded-full bg-white/30 transition-all", i === index ? "w-8 bg-white" : "w-1.5")}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function Panel({ step, kicker }: { step: (typeof marketingCopy.story.steps)[number]; kicker?: string }) {
  return (
    <div className="text-center">
      {kicker && <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-white/60">{kicker}</p>}
      <span className="tabular text-sm font-bold text-white/50">{step.n}</span>
      <h3 className="mt-2 text-[2.1rem] font-bold leading-[1.15] text-white sm:text-[2.75rem]">{step.title}</h3>
      <p className="mx-auto mt-4 max-w-md text-white/75">{step.text}</p>
    </div>
  );
}
