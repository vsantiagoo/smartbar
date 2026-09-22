import { notFound } from "next/navigation";
import { CheckoutScreen } from "@/components/guest/sections/checkout-screen";
import { getGuestRepo } from "@/lib/data";

export const dynamic = "force-dynamic";
export const metadata = { title: "Finalizar pedido" };

/** TELA · Checkout do hóspede  →  /h/[hotelId]/q/[roomId]/checkout */
export default async function CheckoutPage({ params }: { params: Promise<{ hotelId: string; roomId: string }> }) {
  const { hotelId, roomId } = await params;
  const repo = getGuestRepo();
  const ctx = await repo.getGuestContext(hotelId, roomId);
  if (!ctx) notFound();
  const catalog = await repo.getCatalog(ctx.room.id);

  return (
    <CheckoutScreen
      catalog={catalog}
      hotelId={ctx.hotel.id}
      roomId={ctx.room.id}
      canChargeToRoom={ctx.canChargeToRoom}
      baseHref={`/h/${hotelId}/q/${roomId}`}
    />
  );
}
