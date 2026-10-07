import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import type { CSSProperties, ReactNode } from "react";
import { CartProvider } from "@/components/guest/cart-context";
import { GuestProvider, type GuestRoomInfo } from "@/components/guest/guest-context";
import { GuestHeader } from "@/components/guest/sections/guest-header";
import { GuestNav } from "@/components/guest/sections/guest-nav";
import { getGuestRepo } from "@/lib/data";
import { LANGS, LANG_COOKIE, type Lang } from "@/lib/i18n/guest";
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

  const saved = (await cookies()).get(LANG_COOKIE)?.value;
  const hasLangCookie = (LANGS as readonly string[]).includes(saved ?? "");
  const room: GuestRoomInfo = {
    hotelId: ctx.hotel.id,
    hotelName: ctx.hotel.name,
    roomId: ctx.room.id,
    roomNumber: ctx.room.number,
    hasLock: ctx.hotel.segment !== "host" && Boolean(ctx.room.deviceId),
    lockOnline: ctx.room.deviceOnline,
    anonymous: ctx.hotel.segment === "motel",
    guestFirstName: ctx.guestFirstName,
    whatsapp: ctx.hotel.whatsapp ?? null,
  };

  return (
    <div style={whitelabel as CSSProperties} className="relative min-h-dvh overflow-x-hidden">
      <GuestProvider initialLang={hasLangCookie ? (saved as Lang) : "pt"} hasLangCookie={hasLangCookie} room={room}>
        {/* Zona escura de topo: cabeçalho + hero do catálogo */}
        <div className="guest-hero-zone relative pb-28">
          <div className="px-4 pt-4 sm:px-6">
            <GuestHeader />
          </div>
        </div>
        <div className="mx-auto -mt-24 flex w-full max-w-lg flex-col px-4 pb-40 print:pb-4">
          <CartProvider roomId={ctx.room.id}>{children}</CartProvider>
          <GuestNav baseHref={`/h/${hotelId}/q/${roomId}`} />
        </div>
      </GuestProvider>
    </div>
  );
}
