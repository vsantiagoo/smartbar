import { notFound } from "next/navigation";
import type { CSSProperties, ReactNode } from "react";
import { CartProvider } from "@/components/guest/cart-context";
import { GuestHeader } from "@/components/guest/sections/guest-header";
import { getGuestRepo } from "@/lib/data";
import { themeToVars } from "@/lib/theme";

/**
 * Casca do Web App do Hóspede (rota pública, sem login).
 *  /h/{hotel}/q/{quarto}  → QR Code colado no quarto.
 *
 * Whitelabel (plano Premium): se o hotel tiver marca própria, sobrescreve só as
 * escalas de primária e destaque nesta área. Nos demais planos vale o tema do
 * produto (src/lib/theme.ts / editor em /design-system).
 */
export default async function GuestLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ hotelId: string; roomId: string }>;
}) {
  const { hotelId, roomId } = await params;
  const ctx = await getGuestRepo().getGuestContext(hotelId, roomId);
  if (!ctx) notFound();

  const { plan, brand } = ctx.hotel;
  const whitelabel =
    plan === "premium" && (brand.primary || brand.accent)
      ? (() => {
          const all = themeToVars({ primary: brand.primary, accent: brand.accent });
          return Object.fromEntries(Object.entries(all).filter(([k]) => k.startsWith("--brand-") || k.startsWith("--gold-")));
        })()
      : {};

  return (
    <div style={whitelabel as CSSProperties} className="mx-auto flex min-h-dvh w-full max-w-lg flex-col px-4 pb-32 pt-4">
      <GuestHeader hotelName={ctx.hotel.name} roomNumber={ctx.room.number} />
      <CartProvider roomId={ctx.room.id}>{children}</CartProvider>
    </div>
  );
}
