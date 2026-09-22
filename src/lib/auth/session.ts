import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { DEMO_ADMIN, isSupabaseConfigured } from "@/lib/config";
import { getAdminRepo } from "@/lib/data";
import { createSessionClient } from "@/lib/data/supabase/clients";
import type { Hotel } from "@/lib/types";

export interface AdminContext {
  email: string;
  hotel: Hotel;
}

/** Retorna o contexto da equipe logada ou null. */
export async function getAdminContext(): Promise<AdminContext | null> {
  let email: string | null = null;

  if (isSupabaseConfigured) {
    const db = await createSessionClient();
    const { data } = await db.auth.getUser();
    email = data.user?.email ?? null;
  } else {
    const store = await cookies();
    if (store.get(DEMO_ADMIN.cookie)?.value === "1") email = DEMO_ADMIN.email;
  }
  if (!email) return null;

  const hotel = await (await getAdminRepo()).getAdminHotel();
  return hotel ? { email, hotel } : null;
}

export async function requireAdmin(): Promise<AdminContext> {
  const ctx = await getAdminContext();
  if (!ctx) redirect("/admin/login");
  return ctx;
}
