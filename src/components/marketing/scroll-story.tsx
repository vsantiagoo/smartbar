import { ArrowUpRight, Boxes, Lock, QrCode, type LucideIcon } from "lucide-react";
import { LogoMark } from "@/components/ui/logo";
import { Reveal } from "@/components/ui/reveal";
import { CenterAnchor } from "./center-anchor";
import { marketingCopy } from "@/lib/content/copy";

const ICONS: Record<string, LucideIcon> = { qr: QrCode, lock: Lock, stock: Boxes };

/**
 * SEÇÃO · "Como funciona" — bloco escuro com sobrescrita, título e três cards
 * de vidro (glassmorfismo). Layout estático, alinhado à esquerda.
 * Texto em `marketingCopy.story`.
 */
export function ScrollStory() {
  const c = marketingCopy.story;
  return (
    <section
      id="como-funciona"
      className="relative overflow-hidden bg-brand-950 px-6 py-20 text-white sm:px-10 sm:py-28"
    >
      {/* Esta seção cabe inteira na tela: o menu para com ela no meio, não no topo. */}
      <CenterAnchor target="como-funciona" />
      <Reveal className="mx-auto max-w-6xl">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-white/55">{c.eyebrow}</span>
          {/* Só a partir de 640px: no celular o selo disputava a linha com a sobrescrita. */}
          <span className="hidden items-center gap-2 text-[0.7rem] font-semibold uppercase tracking-[0.08em] text-white/55 sm:inline-flex">
            <LogoMark className="size-5 text-white" />
            {c.signLabel}
          </span>
        </div>

        {/* Título à esquerda; texto de apoio no bloco estreito à direita. */}
        <div className="mt-8 flex flex-col gap-5 md:flex-row md:items-end md:justify-between md:gap-10">
          <h2
            className="max-w-3xl text-white"
            // letter-spacing em `em`: dá exatamente -2,8px no tamanho máximo (64px) e encolhe junto no celular.
            style={{ fontSize: "clamp(38px,4.4vw,64px)", fontWeight: 400, lineHeight: 1.08, letterSpacing: "-0.04375em" }}
          >
            {c.title} <span className="text-gold-400">{c.titleAccent}</span>
          </h2>

          <p
            className="max-w-xs shrink-0 text-white/70 md:text-right"
            style={{ fontSize: "12px", lineHeight: 1.9 }}
          >
            {c.subtitle}
          </p>
        </div>

        <div className="mt-10 grid gap-3 sm:grid-cols-3">
          {c.cards.map((card) => {
            const Icon = ICONS[card.icon] ?? QrCode;
            return (
              <div
                key={card.n}
                className="glass flex items-center gap-3.5 rounded-3xl px-5 py-4 transition duration-300 hover:-translate-y-1 hover:bg-white/20"
              >
                <span className="tabular text-sm font-bold text-white/45">{card.n}</span>
                <Icon className="size-6 shrink-0 text-gold-400" aria-hidden />
                <div className="min-w-0 flex-1">
                  <strong className="block text-[0.95rem] font-semibold text-white">{card.title}</strong>
                  <small className="text-[0.8rem] text-white/60">{card.text}</small>
                </div>
                <ArrowUpRight className="hidden size-4 shrink-0 text-white/40 sm:block" aria-hidden />
              </div>
            );
          })}
        </div>
      </Reveal>

      {/* Dissolve o azul-marinho na seção clara seguinte (sem corte seco). */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-brand-950 to-transparent"
        aria-hidden
      />
    </section>
  );
}
