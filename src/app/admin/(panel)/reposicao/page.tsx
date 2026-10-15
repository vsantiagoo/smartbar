import { RestockBoard } from "@/components/admin/sections/restock-board";
import { requireAdmin } from "@/lib/auth/session";
import { getAdminRepo } from "@/lib/data";
import { getT } from "@/lib/i18n/server";

/** Título da aba no idioma do visitante (lê o cookie, como o resto do painel). */
export async function generateMetadata() {
  const t = await getT();
  return { title: t("admin.restock.title") };
}

/** TELA · Painel de Reposição (Governança) → /admin/reposicao */
export default async function AdminRestockPage() {
  const { hotel } = await requireAdmin();
  const needs = await (await getAdminRepo()).listRestockNeeds(hotel.id);
  return <RestockBoard hotelId={hotel.id} needs={needs} />;
}
