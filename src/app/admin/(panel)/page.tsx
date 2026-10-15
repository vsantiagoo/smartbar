import { LiveDashboard } from "@/components/admin/live-dashboard";
import { requireAdmin } from "@/lib/auth/session";
import { simulationAllowed } from "@/lib/config";
import { getAdminRepo } from "@/lib/data";
import { getT } from "@/lib/i18n/server";

/** Título da aba no idioma do visitante (lê o cookie, como o resto do painel). */
export async function generateMetadata() {
  const t = await getT();
  return { title: t("admin.dashboard.title") };
}

/** TELA · Dashboard da Recepção → /admin  (SSR do snapshot + Realtime no cliente) */
export default async function AdminDashboardPage() {
  const { hotel } = await requireAdmin();
  const snapshot = await (await getAdminRepo()).getDashboardSnapshot(hotel.id);
  return <LiveDashboard hotelId={hotel.id} hotelName={hotel.name} initial={snapshot} showDemoTools={simulationAllowed} />;
}
