"use client";
import { useRef, useState } from "react";
import { marketingCopy } from "@/lib/content/copy";
import { pinnedProgress, smoothstep, usePrefersReducedMotion, useSmoothScroll } from "@/lib/marketing/use-scroll-progress";
import { cn } from "@/lib/utils";

const PANEL_BG = [
  "from-brand-950 via-brand-900 to-brand-800", // 01 — hóspede escolhe
  "from-ok-600 via-brand-900 to-brand-950", // 02 — pagamento confirma
  "from-gold-600 via-brand-900 to-brand-950", // 03 — trava libera
];

/**
 * Trecho de cada passo em que a troca acontece. Fora dele a tela fica parada
 * (0.22 → os primeiros e últimos 22% de cada passo seguram a tela inteira).
 */
const HOLD = 0.22;

/**
 * SEÇÃO · "Telas que acompanham o scroll" (scrollytelling), estilo Orbit:
 * a viewport fica presa (`sticky`) enquanto o usuário rola por dentro desta
 * seção; a cada trecho, o fundo e o texto trocam em crossfade.
 *
 * Fluidez: o progresso é amortecido (useSmoothScroll) e a troca usa curva S
 * com pausa em cada tela; os estilos são escritos direto no DOM a cada quadro,
 * sem re-render. O texto sobe/desce em parallax e o fundo faz um leve zoom.
 *
 * Com "reduzir movimento" ativo, cai para 3 blocos empilhados normais —
 * sem sticky nem crossfade.
 */
export function ScrollStory() {
  const ref = useRef<HTMLElement>(null);
  const panels = useRef<(HTMLDivElement | null)[]>([]);
  const contents = useRef<(HTMLDivElement | null)[]>([]);
  const { steps } = marketingCopy.story;
  const reduced = usePrefersReducedMotion();
  const [active, setActive] = useState(0);

  useSmoothScroll(
    () => pinnedProgress(ref.current),
    (progress) => {
      const pos = progress * (steps.length - 1);
      steps.forEach((_, i) => {
        // d: distância (em passos) entre a tela i e a posição atual, já com a pausa aplicada.
        const raw = pos - i;
        const base = Math.floor(raw);
        const d = base + smoothstep(HOLD, 1 - HOLD, raw - base);
        const opacity = Math.max(0, 1 - Math.abs(d));
        const panel = panels.current[i];
        const content = contents.current[i];
        if (panel) {
          panel.style.opacity = String(opacity);
          panel.style.visibility = opacity < 0.002 ? "hidden" : "visible";
          panel.style.transform = `scale(${1 + Math.abs(d) * 0.06})`;
        }
        if (content) {
          content.style.transform = `translate3d(0, ${d * -56}px, 0)`;
        }
      });
      setActive(Math.min(steps.length - 1, Math.round(pos)));
    },
  );

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
    <section id="como-funciona" ref={ref} className="relative scroll-mt-24" style={{ height: `${steps.length * 110}dvh` }}>
      <div className="sticky top-0 h-dvh overflow-hidden bg-brand-950">
        {steps.map((s, i) => (
          <div
            key={s.n}
            ref={(el) => {
              panels.current[i] = el;
            }}
            className={cn(
              "absolute inset-0 flex items-center justify-center bg-gradient-to-br px-6 will-change-[opacity,transform]",
              PANEL_BG[i],
            )}
            style={{ opacity: i === 0 ? 1 : 0, visibility: i === 0 ? "visible" : "hidden" }}
            aria-hidden={active !== i}
          >
            <div
              ref={(el) => {
                contents.current[i] = el;
              }}
              className="max-w-2xl text-white will-change-transform"
            >
              <Panel step={s} kicker={i === 0 ? marketingCopy.story.kicker : undefined} />
            </div>
          </div>
        ))}

        <div className="pointer-events-none absolute inset-x-0 bottom-10 flex justify-center gap-2">
          {steps.map((s, i) => (
            <span
              key={s.n}
              className={cn(
                "h-1.5 rounded-full bg-white/30 transition-all duration-500 ease-out",
                i === active ? "w-8 bg-white" : "w-1.5",
              )}
            />
          ))}
        </div>
      </div>
      {/* Degradê que dissolve o azul-marinho na seção clara seguinte (sem corte seco). */}
      <div className="pointer-events-none absolute inset-x-0 top-[calc(100%-2px)] h-48 bg-gradient-to-b from-brand-950 via-brand-950/40 to-transparent" aria-hidden />
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
