/**
 * ESTRUTURA do site público — a ordem das seções, os ids de âncora, as rotas e
 * os NÚMEROS (preços, percentuais, faixas de implantação).
 *
 * Os TEXTOS não moram mais aqui: vêm do dicionário (src/lib/i18n/dictionaries),
 * nos três idiomas. Para reescrever uma frase, edite a chave `site.*` lá; para
 * mudar um preço ou a ordem dos cards, edite este arquivo.
 *
 * Como usar:
 *   server component → const c = marketingCopy(await getT());
 *   client component → const c = marketingCopy(useI18n().t);
 *
 * Tom (Brandbook): profissional, direto, orientado a resultado, empático com a
 * operação. Sem jargão técnico.
 */
import type { TFunction } from "@/lib/i18n/translate";

/**
 * Site público (landing) — src/app/page.tsx.
 * Estilo de referência: Orbit (glassmorfismo, hero em vídeo, telas que
 * acompanham o scroll). Números vêm do Plano de Negócios / PRD; são
 * referência de mercado, não medições de um cliente específico.
 */
export function marketingCopy(t: TFunction) {
  return {
    nav: [
      { id: "inicio", label: t("site.nav.inicio") },
      { id: "como-funciona", label: t("site.nav.comoFunciona") },
      { id: "resultados", label: t("site.nav.resultados") },
      { id: "planos", label: t("site.nav.planos") },
      { id: "explorar", label: t("site.nav.explorar") },
    ],
    header: {
      cta: t("site.header.cta"),
      ctaShort: t("site.header.ctaShort"),
    },
    hero: {
      eyebrow: t("site.hero.eyebrow"),
      /* As quebras de linha (\n) são propositais — ver `whitespace-pre-line` em hero.tsx. */
      title: t("site.hero.title"),
      subtitle: t("site.hero.subtitle"),
      primaryCta: t("site.hero.primaryCta"),
      secondaryCta: t("site.hero.secondaryCta"),
      scrollHint: t("site.hero.scrollHint"),
    },
    /** Declaração da marca, sozinha na tela clara entre o hero e o "Como funciona". */
    statement: {
      title: t("site.statement.title"),
      titleAccent: t("site.statement.titleAccent"),
    },
    story: {
      eyebrow: t("site.story.eyebrow"),
      signLabel: t("site.story.signLabel"),
      title: t("site.story.title"),
      titleAccent: t("site.story.titleAccent"),
      subtitle: t("site.story.subtitle"),
      cards: [
        { n: "01", icon: "qr", title: t("site.story.1.title"), text: t("site.story.1.text") },
        { n: "02", icon: "lock", title: t("site.story.2.title"), text: t("site.story.2.text") },
        { n: "03", icon: "stock", title: t("site.story.3.title"), text: t("site.story.3.text") },
      ],
    },
    stats: {
      kicker: t("site.stats.kicker"),
      title: t("site.stats.title"),
      titleAccent: t("site.stats.titleAccent"),
      subtitle: t("site.stats.subtitle"),
      items: [
        { value: "-95%", label: t("site.stats.1") },
        { value: "75%", label: t("site.stats.2") },
        { value: "60%", label: t("site.stats.3") },
        { value: "60×", label: t("site.stats.4") },
      ],
    },
    /**
     * Planos — Plano de Negócios, seções 6 a 9.
     *
     * A matriz original cruza 5 perfis de cliente × 3 módulos. Uma tabela dessas
     * na landing afasta em vez de vender, então ela virou UM seletor de perfil
     * que troca só os preços dos três cards: o visitante vê o valor dele, e o
     * desconto por porte fica evidente ao trocar de aba.
     *
     * `segments[].prices` segue SEMPRE a ordem de `tiers` (Básico, Plus, Premium).
     */
    plans: {
      kicker: t("site.plans.kicker"),
      title: t("site.plans.title"),
      subtitle: t("site.plans.subtitle"),
      segmentLabel: t("site.plans.segmentLabel"),
      segments: [
        {
          id: "anfitriao",
          label: t("site.plans.seg.anfitriao"),
          note: t("site.plans.seg.anfitriao.note"),
          unit: t("site.plans.seg.anfitriao.unit"),
          prices: [
            { price: "R$ 14,90", minimum: t("site.plans.min", { value: "R$ 149" }) },
            { price: "R$ 24,90", minimum: t("site.plans.min", { value: "R$ 249" }) },
            { price: "R$ 39,90", minimum: t("site.plans.min", { value: "R$ 490" }) },
          ],
        },
        {
          id: "temporada",
          label: t("site.plans.seg.temporada"),
          note: t("site.plans.seg.temporada.note"),
          unit: t("site.plans.seg.temporada.unit"),
          prices: [
            { price: "R$ 19,90", minimum: t("site.plans.price.basicControl") },
            { price: "R$ 34,90", minimum: t("site.plans.price.automation") },
            { price: t("site.plans.price.onRequest"), minimum: t("site.plans.price.talk") },
          ],
        },
        {
          id: "pequeno",
          label: t("site.plans.seg.pequeno"),
          note: t("site.plans.seg.pequeno.note"),
          unit: t("site.plans.seg.unitRoom"),
          prices: [
            { price: "R$ 14,90", minimum: t("site.plans.min", { value: "R$ 299" }) },
            { price: "R$ 24,90", minimum: t("site.plans.min", { value: "R$ 490" }) },
            { price: "R$ 39,90", minimum: t("site.plans.min", { value: "R$ 990" }) },
          ],
        },
        {
          id: "medio",
          label: t("site.plans.seg.medio"),
          note: t("site.plans.seg.medio.note"),
          unit: t("site.plans.seg.unitRoom"),
          prices: [
            { price: "R$ 12,90", minimum: t("site.plans.min", { value: "R$ 650" }) },
            { price: "R$ 21,90", minimum: t("site.plans.min", { value: "R$ 1.100" }) },
            { price: "R$ 34,90", minimum: t("site.plans.min", { value: "R$ 1.750" }) },
          ],
        },
        {
          id: "grande",
          label: t("site.plans.seg.grande"),
          note: t("site.plans.seg.grande.note"),
          unit: t("site.plans.seg.unitRoom"),
          prices: [
            { price: "R$ 10,90", minimum: t("site.plans.min", { value: "R$ 1.100" }) },
            { price: "R$ 18,90", minimum: t("site.plans.min", { value: "R$ 1.900" }) },
            { price: "R$ 29,90", minimum: t("site.plans.min", { value: "R$ 3.000" }) },
          ],
        },
      ],
      tiers: [
        {
          tier: t("site.plans.tier.basic"),
          tagline: t("site.plans.tier.basic.tagline"),
          features: [t("site.plans.tier.basic.f1"), t("site.plans.tier.basic.f2"), t("site.plans.tier.basic.f3"), t("site.plans.tier.basic.f4")],
          highlight: false,
        },
        {
          tier: t("site.plans.tier.plus"),
          tagline: t("site.plans.tier.plus.tagline"),
          features: [t("site.plans.tier.plus.f1"), t("site.plans.tier.plus.f2"), t("site.plans.tier.plus.f3"), t("site.plans.tier.plus.f4")],
          highlight: true,
        },
        {
          tier: t("site.plans.tier.premium"),
          tagline: t("site.plans.tier.premium.tagline"),
          features: [
            t("site.plans.tier.premium.f1"),
            t("site.plans.tier.premium.f2"),
            t("site.plans.tier.premium.f3"),
            t("site.plans.tier.premium.f4"),
          ],
          highlight: false,
        },
      ],
      /** Taxa única, cobrada na implantação (seção 8 do Plano de Negócios). */
      setup: {
        title: t("site.plans.setup.title"),
        text: t("site.plans.setup.text"),
        items: [
          { label: t("site.plans.setup.1"), value: "R$ 350 a R$ 600" },
          { label: t("site.plans.setup.2"), value: "R$ 1.200 a R$ 1.800" },
          { label: t("site.plans.setup.3"), value: "R$ 2.000 a R$ 4.500" },
        ],
        note: t("site.plans.setup.note"),
      },
      /** Funcionalidades fora do padrão (seção 8 do Plano de Negócios). */
      custom: {
        title: t("site.plans.custom.title"),
        text: t("site.plans.custom.text"),
        note: t("site.plans.custom.note"),
      },
      cta: t("site.plans.cta"),
    },
    explore: {
      kicker: t("site.explore.kicker"),
      title: t("site.explore.title"),
      items: [
        { title: t("site.explore.guest.title"), text: t("site.explore.guest.text"), route: "guest" },
        { title: t("site.explore.admin.title"), text: t("site.explore.admin.text"), route: "admin" },
        { title: t("site.explore.design.title"), text: t("site.explore.design.text"), route: "design" },
      ],
    },
    finalCta: {
      title: t("site.finalCta.title"),
      subtitle: t("site.finalCta.subtitle"),
      backToTop: t("site.finalCta.backToTop"),
    },
  };
}

/** Ids das âncoras da navegação — não dependem do idioma. */
export const SECTION_IDS = ["inicio", "como-funciona", "resultados", "planos", "explorar"] as const;
