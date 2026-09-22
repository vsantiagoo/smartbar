import { FinalCta } from "@/components/marketing/final-cta";
import { Hero } from "@/components/marketing/hero";
import { ImpactStats } from "@/components/marketing/impact-stats";
import { PlansGrid } from "@/components/marketing/plans-grid";
import { QuickLinks } from "@/components/marketing/quick-links";
import { ScrollStory } from "@/components/marketing/scroll-story";
import { SiteHeader } from "@/components/marketing/site-header";

/**
 * Site público (landing) do SmartBar, estilo Orbit: hero em glassmorfismo,
 * telas que acompanham o scroll, menu flutuante fixo. Cada seção é um
 * componente independente em src/components/marketing/ — mova/edite livremente.
 * Textos em src/lib/content/copy.ts (marketingCopy).
 */
export default function HomePage() {
  return (
    <main className="relative">
      <SiteHeader />
      <Hero />
      <ScrollStory />
      <ImpactStats />
      <PlansGrid />
      <QuickLinks />
      <FinalCta />
    </main>
  );
}
