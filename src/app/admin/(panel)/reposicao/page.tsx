import { RestockBoard } from "@/components/admin/sections/restock-board";
import { requireAdmin } from "@/lib/auth/session";
import { getAdminRepo } from "@/lib/data";

export const metadata = { title: "Reposição" };

/** TELA · Painel de Reposição (Governança) → /admin/reposicao */
export default async function AdminRestockPage() {
  const { hotel } = await requireAdmin();
  const needs = await (await getAdminRepo()).listRestockNeeds(hotel.id);
  return <RestockBoard hotelId={hotel.id} needs={needs} />;
}
