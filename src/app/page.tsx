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
  // Mesmo cookie da vitrine e do painel: o idioma segue o visitante.
  const saved = parseLang((await cookies()).get(LANG_COOKIE)?.value);

  return (
    <I18nProvider initialLang={saved ?? "pt"} hasLangCookie={saved !== null}>
      <main className="relative">
        <SiteHeader />
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
