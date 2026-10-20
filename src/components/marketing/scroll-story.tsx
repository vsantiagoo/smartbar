import { ArrowUpRight } from "lucide-react";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Logo } from "@/components/ui/logo";
import { MarkRoomCode, MarkShelf, MarkUnlock } from "@/components/ui/marks";
import { Reveal } from "@/components/ui/reveal";
import { BackToTop } from "./back-to-top";
import { CenterAnchor } from "./center-anchor";
import { marketingCopy } from "@/lib/content/copy";
import { getT } from "@/lib/i18n/server";

/* Sinais próprios (ver `ui/marks.tsx`), no lugar do icon set genérico. */
const ICONS = { qr: MarkRoomCode, lock: MarkUnlock, stock: MarkShelf } as const;

/**
 * SEÇÃO · "Como funciona" — bloco escuro com sobrescrita, título e três cards
 * de vidro (glassmorfismo). Layout estático, alinhado à esquerda.
 * Texto em `marketingCopy(await getT()).story`.
 */
export async function ScrollStory() {
  const c = marketingCopy(await getT()).story;
  return (
    <section
      id="como-funciona"
      className="relative overflow-hidden bg-brand-950 px-6 py-20 text-white sm:px-10 sm:py-28"
    >
      {/* Esta seção cabe inteira na tela: o menu para com ela no meio, não no topo. */}
      <CenterAnchor target="como-funciona" />
      <BackToTop tone="light" />
      <Reveal weight="lead" className="mx-auto max-w-6xl">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Eyebrow tone="dark">{c.eyebrow}</Eyebrow>
          {/* Só a partir de 640px: no celular o selo disputava a linha com a sobrescrita. */}
          <span className="hidden items-center gap-2 text-[0.7rem] font-semibold uppercase tracking-[0.08em] text-white/55 sm:inline-flex">
            <Logo tone="light" intro="inview" wordmarkClassName="hidden" className="[--logo-size:1.25rem]" />
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

        <div className="mt-10 grid gap-3 lg:grid-cols-3">
          {c.cards.map((card) => {
            const Icon = ICONS[card.icon as keyof typeof ICONS] ?? MarkRoomCode;
            return (
              <div
                key={card.n}
                className="glass lift flex items-center gap-3.5 rounded-card px-5 py-4"
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
    </section>
  );
}
