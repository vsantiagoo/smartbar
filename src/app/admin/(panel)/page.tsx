import { LiveDashboard } from "@/components/admin/live-dashboard";
import { requireAdmin } from "@/lib/auth/session";
import { simulationAllowed } from "@/lib/config";
import { getAdminRepo } from "@/lib/data";

export const metadata = { title: "Visão geral" };

/** TELA · Dashboard da Recepção → /admin  (SSR do snapshot + Realtime no cliente) */
export default async function AdminDashboardPage() {
  const { hotel } = await requireAdmin();
  const snapshot = await (await getAdminRepo()).getDashboardSnapshot(hotel.id);
  return <LiveDashboard hotelId={hotel.id} hotelName={hotel.name} initial={snapshot} showDemoTools={simulationAllowed} />;
}
