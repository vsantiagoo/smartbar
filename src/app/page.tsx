import { cookies } from "next/headers";
import { EdgeGlow } from "@/components/marketing/edge-glow";
import { FinalCta } from "@/components/marketing/final-cta";
import { Hero } from "@/components/marketing/hero";
import { HomeBridge } from "@/components/marketing/home-bridge";
import { ImpactStats } from "@/components/marketing/impact-stats";
import { PlansGrid } from "@/components/marketing/plans-grid";
import { ProductReveal } from "@/components/marketing/product-reveal";
import { QuickLinks } from "@/components/marketing/quick-links";
import { ScrollStory } from "@/components/marketing/scroll-story";
import { SiteHeader } from "@/components/marketing/site-header";
import { APPEARANCE_COOKIE } from "@/lib/appearance";
import { I18nProvider } from "@/lib/i18n/client";
import { LANG_COOKIE, parseLang } from "@/lib/i18n/config";

/**
 * Site público (landing) do SmartBar, estilo Orbit: hero em glassmorfismo,
 * telas que acompanham o scroll, menu flutuante fixo. Cada seção é um
 * componente independente em src/components/marketing/ — mova/edite livremente.
 *
 * Textos: dicionário em src/lib/i18n/dictionaries (chaves `site.*`).
 * Estrutura (ordem, âncoras, preços): src/lib/content/copy.ts.
 */
export default async function HomePage() {
  const jar = await cookies();
  // Mesmo cookie da vitrine e do painel: o idioma segue o visitante.
  const saved = parseLang(jar.get(LANG_COOKIE)?.value);
  // E o mesmo cookie de aparência da vitrine: quem escolheu escuro lá chega
  // aqui no escuro. Lido no servidor para a primeira pintura já vir certa.
  const dark = jar.get(APPEARANCE_COOKIE)?.value === "dark";

  return (
    <I18nProvider initialLang={saved ?? "pt"} hasLangCookie={saved !== null}>
      {/*
        Casca de tema do site. É ela que o <ThemeToggle> procura ao subir no
        DOM, e é daqui que os tokens escuros passam a valer — o modo escuro não
        vaza para o painel nem para outras rotas.
      */}
      {/*
        `text-ink` aqui não é decoração: `color` é herdado pelo VALOR já
        calculado, e o <body> fica fora desta casca — sem isto, todo texto que
        não declara cor própria herdaria o tom escuro do modo claro e ficaria
        ilegível no escuro (medido: contraste 1,83). Declarar o token na casca
        faz a cor ser recalculada já dentro do escopo do tema.
      */}
      <main
        className="relative text-ink"
        data-theme-root=""
        data-theme={dark ? "dark" : undefined}
      >
        <SiteHeader initialDark={dark} />
        <EdgeGlow />
        <Hero />
        <HomeBridge />
        <ScrollStory />
        <ImpactStats />
        <PlansGrid />
        <QuickLinks />
        <ProductReveal />
        <FinalCta />
      </main>
    </I18nProvider>
  );
}
