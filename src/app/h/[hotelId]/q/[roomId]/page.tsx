import { notFound } from "next/navigation";
import { CartBar } from "@/components/guest/sections/cart-bar";
import { CatalogHero } from "@/components/guest/sections/catalog-hero";
import { HowItWorks } from "@/components/guest/sections/how-it-works";
import { PricePromise } from "@/components/guest/sections/price-promise";
import { ProductList } from "@/components/guest/sections/product-list";
import { getGuestRepo } from "@/lib/data";

export const dynamic = "force-dynamic"; // estoque muda a cada compra

/**
 * TELA · Vitrine do Hóspede  →  /h/[hotelId]/q/[roomId]
 * Server Component: lê catálogo + estoque DAQUELE quarto direto do banco.
 * Cada bloco visual é uma seção independente em components/guest/sections.
 */
export default async function GuestCatalogPage({ params }: { params: Promise<{ hotelId: string; roomId: string }> }) {
  const { hotelId, roomId } = await params;
  const repo = getGuestRepo();
  const ctx = await repo.getGuestContext(hotelId, roomId);
  if (!ctx) notFound();
  const catalog = await repo.getCatalog(ctx.room.id);

  const base = `/h/${hotelId}/q/${roomId}`;
  return (
    <main>
      <CatalogHero />
      <PricePromise />
      <ProductList catalog={catalog} />
      <HowItWorks />
      <CartBar catalog={catalog} checkoutHref={`${base}/checkout`} />
    </main>
  );
}
