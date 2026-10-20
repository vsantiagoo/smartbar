"use client";
import { Check } from "lucide-react";
import { useState } from "react";
import { buttonClasses } from "@/components/ui/button";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Reveal } from "@/components/ui/reveal";
import { Segmented } from "@/components/ui/segmented";
import { marketingCopy } from "@/lib/content/copy";
import { useI18n } from "@/lib/i18n/client";
import { cn } from "@/lib/utils";
import { BackToTop } from "./back-to-top";
import { GlowBackdrop } from "./glow-backdrop";

/**
 * SEÇÃO · Planos (cards de vidro, padrão "próximos capítulos" do Orbit).
 *
 * O seletor de perfil troca apenas os preços dos três cards — os módulos são
 * os mesmos para todo mundo, o que muda é quanto custa em cada porte. Ver a
 * matriz completa em `marketingCopy.plans`.
 */
interface FactBlock {
  title: string;
  text: string;
  /** Opcional: sem eles a faixa fica só com o título e a ressalva. */
  items?: readonly { label: string; value: string }[];
  note: string;
}

/** Faixa de vidro com fatos curtos e uma ressalva — usada pelos custos extras. */
function FactStrip({ block, delay }: { block: FactBlock; delay: number }) {
  const hasItems = Boolean(block.items?.length);
  return (
    <Reveal weight="aside" delay={delay} className="mt-5">
      <div className="glass rounded-panel p-7">
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <p className="text-sm font-semibold uppercase tracking-wide text-brand-500">{block.title}</p>
          <p className="text-sm text-ink-soft">{block.text}</p>
        </div>
        {hasItems && (
          <dl className="mt-5 grid gap-4 sm:grid-cols-3">
            {block.items!.map((item) => (
              <div key={item.label}>
                <dt className="text-sm text-ink-soft">{item.label}</dt>
                <dd className="mt-0.5 text-lg font-bold text-ink">{item.value}</dd>
              </div>
            ))}
          </dl>
        )}
        <p className={cn("text-xs leading-relaxed text-ink-faint", hasItems ? "mt-5" : "mt-4")}>{block.note}</p>
      </div>
    </Reveal>
  );
}

export function PlansGrid() {
  const { t } = useI18n();
  const c = marketingCopy(t).plans;
  const [segmentId, setSegmentId] = useState<string>(c.segments[2]!.id);
  const segment = c.segments.find((s) => s.id === segmentId) ?? c.segments[0]!;

  return (
    /*
      -scroll-mt: esta seção é mais alta que a janela, então o link do menu
      entra 56px para dentro dela — o respiro do topo encolhe e cabe mais
      conteúdo na primeira tela, sem mostrar nada da seção anterior.
    */
    <section id="planos" className="relative isolate px-6 py-16 sm:-scroll-mt-14 sm:px-10 sm:py-20">
      <BackToTop />
      <GlowBackdrop flip />
      <div className="mx-auto max-w-6xl">
        {/* Caixa mais larga que a das outras seções: o título daqui é uma frase
            inteira e, em `max-w-xl`, quebraria em quatro linhas apertadas. */}
        <Reveal weight="lead" className="max-w-3xl">
          <Eyebrow>{c.kicker}</Eyebrow>
          <h2 className="mt-5 text-[2.1rem] font-bold leading-[1.15] sm:text-[2.6rem]">{c.title}</h2>
          <p className="mt-4 max-w-xl text-ink-soft">{c.subtitle}</p>
        </Reveal>

        <Reveal weight="aside" delay={80} className="mt-8">
          <Segmented
            label={c.segmentLabel}
            options={c.segments.map((s) => ({ value: s.id, label: s.label }))}
            value={segmentId}
            onChange={setSegmentId}
          />
          {/* Só alguns perfis têm ressalva; quando não há, a linha não ocupa espaço. */}
          {segment.note && <p className="mt-2.5 text-xs text-ink-faint">{segment.note}</p>}
        </Reveal>

        <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-3">
          {c.tiers.map((plan, i) => {
            const valor = segment.prices[i]!;
            return (
              <Reveal key={plan.tier} weight="aside" delay={i * 110} className="h-full">
                <div
                  className={cn(
                    "lift flex h-full flex-col rounded-panel p-7",
                    plan.highlight ? "glass-navy text-white" : "glass",
                  )}
                >
                  <p
                    className={cn(
                      "text-sm font-semibold uppercase tracking-wide",
                      plan.highlight ? "text-gold-400" : "text-brand-500",
                    )}
                  >
                    {plan.tier}
                  </p>
                  <p className={cn("mt-1 text-xs", plan.highlight ? "text-white/55" : "text-ink-faint")}>
                    {plan.tagline}
                  </p>

                  <p className="mt-4 flex flex-wrap items-baseline gap-x-1.5">
                    <span className="whitespace-nowrap text-[2rem] font-bold">{valor.price}</span>
                    <span className={cn("whitespace-nowrap text-sm", plan.highlight ? "text-white/60" : "text-ink-soft")}>
                      {segment.unit}
                    </span>
                  </p>
                  <p className={cn("text-xs", plan.highlight ? "text-white/50" : "text-ink-faint")}>{valor.minimum}</p>

                  <ul className="mt-6 flex-1 space-y-2.5">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-2.5 text-sm">
                        <Check className={cn("mt-0.5 size-4 shrink-0", plan.highlight ? "text-gold-400" : "text-ok-500")} />
                        <span className={plan.highlight ? "text-white/85" : "text-ink"}>{f}</span>
                      </li>
                    ))}
                  </ul>

                  <a
                    href="#explorar"
                    className={buttonClasses(plan.highlight ? "accent" : "soft", "md", "mt-7 w-full justify-center")}
                  >
                    {c.cta}
                  </a>
                </div>
              </Reveal>
            );
          })}
        </div>

        {/*
          Os dois custos que não cabem no card de plano: a taxa de implantação e
          o desenvolvimento fora do padrão. São o custo real da decisão — melhor
          ditos aqui do que só na proposta.
        */}
        <FactStrip block={c.setup} delay={120} />
        <FactStrip block={c.custom} delay={160} />
      </div>
    </section>
  );
}
