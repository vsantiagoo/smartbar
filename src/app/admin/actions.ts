"use server";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth/session";
import { DEMO_ADMIN, isSupabaseConfigured } from "@/lib/config";
import { getAdminRepo } from "@/lib/data";
import { createSessionClient } from "@/lib/data/supabase/clients";
import type { DictKey } from "@/lib/i18n/translate";

export interface LoginState {
  /** Chave do dicionário: a Server Action não sabe o idioma do visitante;
      quem traduz é o formulário, no cliente. */
  error: DictKey | null;
}

export async function loginAction(_prev: LoginState, form: FormData): Promise<LoginState> {
  const email = String(form.get("email") ?? "").trim();
  const password = String(form.get("password") ?? "");
  if (!email || !password) return { error: "admin.login.missing" };

  if (isSupabaseConfigured) {
    const db = await createSessionClient();
    const { error } = await db.auth.signInWithPassword({ email, password });
    if (error) return { error: "admin.login.error" };
  } else {
    if (email.toLowerCase() !== DEMO_ADMIN.email || password !== DEMO_ADMIN.password) {
      return { error: "admin.login.error" };
    }
    (await cookies()).set(DEMO_ADMIN.cookie, "1", { httpOnly: true, sameSite: "lax", path: "/", maxAge: 60 * 60 * 12 });
  }
  redirect("/admin");
}

export async function logoutAction(): Promise<void> {
  if (isSupabaseConfigured) await (await createSessionClient()).auth.signOut();
  else (await cookies()).delete(DEMO_ADMIN.cookie);
  redirect("/admin/login");
}

/**
 * Governança confirma a reposição → o estoque do quarto volta ao nível "par".
 * No Supabase a RPC valida que o usuário é membro do hotel do quarto (RLS).
 */
export async function confirmRestockAction(roomId: string, productId: string | null): Promise<{ restocked: number }> {
  await requireAdmin();
  const restocked = await (await getAdminRepo()).confirmRestock(roomId, productId);
  revalidatePath("/admin");
  revalidatePath("/admin/reposicao");
  revalidatePath("/admin/quartos", "layout");
  return { restocked };
}
