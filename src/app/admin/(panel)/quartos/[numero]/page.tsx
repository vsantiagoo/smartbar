import { notFound } from "next/navigation";
import { RoomLiveRefresh } from "@/components/admin/room-live-refresh";
import { CheckoutSummary } from "@/components/admin/sections/checkout-summary";
import { RoomHeader } from "@/components/admin/sections/room-header";
import { RoomInventory } from "@/components/admin/sections/room-inventory";
import { StayHistory } from "@/components/admin/sections/stay-history";
import { requireAdmin } from "@/lib/auth/session";
import { getAdminRepo } from "@/lib/data";

export async function generateMetadata({ params }: { params: Promise<{ numero: string }> }) {
  const { numero } = await params;
  return { title: `Quarto ${numero}` };
}

/** TELA · Detalhe do quarto → /admin/quartos/[numero] */
export default async function AdminRoomPage({ params }: { params: Promise<{ numero: string }> }) {
  const { numero } = await params;
  const { hotel } = await requireAdmin();
  const detail = await (await getAdminRepo()).getRoomDetail(hotel.id, numero);
  if (!detail) notFound();

  return (
    <div className="space-y-5">
      <RoomLiveRefresh hotelId={hotel.id} />
      <RoomHeader detail={detail} />
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1.4fr_1fr]">
        <div className="space-y-5">
          <StayHistory transactions={detail.transactions} />
          <RoomInventory lines={detail.inventory} />
        </div>
        <CheckoutSummary detail={detail} />
      </div>
    </div>
  );
}
