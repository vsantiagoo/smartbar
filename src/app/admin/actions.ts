"use server";
import { timingSafeEqual } from "node:crypto";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth/session";
import { DEMO_ADMIN, isSupabaseConfigured } from "@/lib/config";
import { getAdminRepo } from "@/lib/data";
import { createSessionClient } from "@/lib/data/supabase/clients";
import type { DictKey } from "@/lib/i18n/translate";
import { freio } from "@/lib/rate-limit";

export interface LoginState {
  /** Chave do dicionário: a Server Action não sabe o idioma do visitante;
      quem traduz é o formulário, no cliente. */
  error: DictKey | null;
}

/**
 * Comparação de SEGREDOS em tempo constante. `a === b` compara byte a byte
 * e para no primeiro diferente — o tempo da resposta vaza o COMPRIMENTO do
 * prefixo correto, e isso é tudo que precisa para montar a senha letra a
 * letra. `timingSafeEqual` do Node compara até o fim, sem curto-circuito.
 *
 * Em modo demo a senha é pública e esse risco é teórico, mas não há ganho
 * em deixar o padrão ruim aqui -- quem copia este arquivo para produção
 * leva a função certa junto.
 */
function iguaisEmTempoConstante(a: string, b: string): boolean {
  const x = Buffer.from(a);
  const y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
}

/**
 * Freio contra brute-force do login. 5 tentativas por minuto POR EMAIL
 * (quem a atacante acredita que é a vítima) são suficientes para humano,
 * insuficientes para dicionário.
 */
const LOGIN_FREIO = { porAlvo: 5, porIp: 30, janelaMs: 60_000 } as const;

export async function loginAction(_prev: LoginState, form: FormData): Promise<LoginState> {
  const email = String(form.get("email") ?? "").trim();
  const password = String(form.get("password") ?? "");
  if (!email || !password) return { error: "admin.login.missing" };

  // Freio por EMAIL (não por IP): várias tentativas vindas do mesmo hotel
  // (operadores humanos) são legítimas. Várias tentativas contra o mesmo
  // email vêm de alguém que não sabe a senha e está adivinhando.
  const emailBaixo = email.toLowerCase();
  const porEmail = freio(`login:${emailBaixo}`, LOGIN_FREIO.porAlvo, LOGIN_FREIO.janelaMs);
  if (!porEmail.permitido) return { error: "admin.login.error" };

  if (isSupabaseConfigured) {
    const db = await createSessionClient();
    const { error } = await db.auth.signInWithPassword({ email, password });
    if (error) return { error: "admin.login.error" };
  } else {
    const emailOk = iguaisEmTempoConstante(emailBaixo, DEMO_ADMIN.email);
    const senhaOk = iguaisEmTempoConstante(password, DEMO_ADMIN.password);
    // Avalia os DOIS antes de decidir: o `&&` com short-circuit também vaza
    // timing (não checa a senha se o email estiver errado = resposta mais
    // rápida nesse caso). Esta forma gasta o mesmo tempo nos dois ramos.
    if (!(emailOk && senhaOk)) return { error: "admin.login.error" };
    (await cookies()).set(DEMO_ADMIN.cookie, "1", {
      httpOnly: true,
      // `strict`: em cross-site nem segue o cookie. Para login do ADMIN não
      // há caso de uso legítimo em que o cookie precise viajar vindo de
      // outra origem -- strict fecha a última fenda de CSRF.
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 12,
    });
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
