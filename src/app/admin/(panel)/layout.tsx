import type { ReactNode } from "react";
import { AdminBottomNav, AdminSidebar } from "@/components/admin/admin-nav";
import { requireAdmin } from "@/lib/auth/session";
import { isDemoMode } from "@/lib/config";
import { getAdminRepo } from "@/lib/data";

export const dynamic = "force-dynamic";

/** Casca do Painel Admin. Exige sessão (middleware + requireAdmin + RLS). */
export default async function AdminPanelLayout({ children }: { children: ReactNode }) {
  const { hotel, email } = await requireAdmin();
  const needs = await (await getAdminRepo()).listRestockNeeds(hotel.id);
  const restockRooms = new Set(needs.map((n) => n.roomId)).size;

  return (
    <div className="min-h-dvh">
      <AdminSidebar hotelName={hotel.name} email={email} restockCount={restockRooms} demo={isDemoMode} />
      <div className="mx-auto max-w-[1180px] px-4 pb-28 pt-6 sm:px-8 lg:ml-[296px] lg:pb-10 lg:pr-8 lg:pt-8">{children}</div>
      <AdminBottomNav restockCount={restockRooms} />
    </div>
  );
}
