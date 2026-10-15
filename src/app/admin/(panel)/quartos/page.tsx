import { RoomsExplorer } from "@/components/admin/sections/rooms-explorer";
import { requireAdmin } from "@/lib/auth/session";
import { getAdminRepo } from "@/lib/data";
import { getT } from "@/lib/i18n/server";

/** Título da aba no idioma do visitante (lê o cookie, como o resto do painel). */
export async function generateMetadata() {
  const t = await getT();
  return { title: t("admin.rooms.title") };
}

/** TELA · Gestão por Quarto (lista + busca) → /admin/quartos */
export default async function AdminRoomsPage() {
  const { hotel } = await requireAdmin();
  const rooms = await (await getAdminRepo()).listRoomSummaries(hotel.id);
  return <RoomsExplorer hotelId={hotel.id} rooms={rooms} />;
}
