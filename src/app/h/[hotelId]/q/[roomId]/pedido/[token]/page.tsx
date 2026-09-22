import { notFound } from "next/navigation";
import { OrderTracker } from "@/components/guest/sections/order-tracker";
import { simulationAllowed } from "@/lib/config";
import { getGuestRepo } from "@/lib/data";

export const dynamic = "force-dynamic";
export const metadata = { title: "Seu pedido" };

/** TELA · Pedido (Pix aguardando / cartão aguardando / trava liberada). */
export default async function OrderPage({ params }: { params: Promise<{ hotelId: string; roomId: string; token: string }> }) {
  const { hotelId, roomId, token } = await params;
  const tx = await getGuestRepo().getPublicTransaction(token);
  if (!tx) notFound();

  return (
    <main>
      <OrderTracker initial={tx} baseHref={`/h/${hotelId}/q/${roomId}`} showDemoTools={simulationAllowed} />
    </main>
  );
}
