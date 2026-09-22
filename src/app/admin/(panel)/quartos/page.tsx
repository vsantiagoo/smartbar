import { RoomsExplorer } from "@/components/admin/sections/rooms-explorer";
import { requireAdmin } from "@/lib/auth/session";
import { getAdminRepo } from "@/lib/data";

export const metadata = { title: "Quartos" };

/** TELA · Gestão por Quarto (lista + busca) → /admin/quartos */
export default async function AdminRoomsPage() {
  const { hotel } = await requireAdmin();
  const rooms = await (await getAdminRepo()).listRoomSummaries(hotel.id);
  return <RoomsExplorer hotelId={hotel.id} rooms={rooms} />;
}
