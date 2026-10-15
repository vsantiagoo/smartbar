import { cookies } from "next/headers";
import { LoginForm } from "@/components/admin/sections/login-form";
import { Logo } from "@/components/ui/logo";
import { DEMO_ADMIN, isDemoMode } from "@/lib/config";
import { I18nProvider } from "@/lib/i18n/client";
import { LANG_COOKIE, parseLang } from "@/lib/i18n/config";
import { getT } from "@/lib/i18n/server";

export const metadata = { title: "Login" };

/**
 * TELA · Login da equipe do hotel → /admin/login
 * Fica FORA do layout do painel (que exige sessão), então traz o próprio
 * I18nProvider — lendo o mesmo cookie de idioma das outras áreas.
 */
export default async function AdminLoginPage() {
  const saved = parseLang((await cookies()).get(LANG_COOKIE)?.value);
  const t = await getT();

  return (
    <I18nProvider initialLang={saved ?? "pt"} hasLangCookie={saved !== null}>
      <main className="brand-diagonals grid min-h-dvh place-items-center px-4 py-10">
        <div className="w-full max-w-md">
          <Logo className="mb-8 justify-center [--logo-size:2.5rem]" />
          <div className="glass-strong rounded-surface p-7 sm:p-9">
            <h1 className="text-2xl font-bold">{t("admin.login.title")}</h1>
            <p className="mt-1.5 text-ink-soft">{t("admin.login.subtitle")}</p>
            <LoginForm demoEmail={isDemoMode ? DEMO_ADMIN.email : undefined} demoPassword={isDemoMode ? DEMO_ADMIN.password : undefined} />
          </div>
          {isDemoMode && (
            <p className="mt-5 text-center text-xs text-ink-soft">{t("admin.login.demo", { file: ".env.local" })}</p>
          )}
        </div>
      </main>
    </I18nProvider>
  );
}
