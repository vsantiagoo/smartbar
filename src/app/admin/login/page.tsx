import { cookies } from "next/headers";
import { AurumLoginCard } from "@/components/admin/sections/aurum-login-card";
import { DEMO_ADMIN, isDemoMode } from "@/lib/config";
import { I18nProvider } from "@/lib/i18n/client";
import { LANG_COOKIE, parseLang } from "@/lib/i18n/config";
import { getT } from "@/lib/i18n/server";

export const metadata = { title: "Login" };

/**
 * TELA · Login da equipe do hotel → /admin/login
 *
 * Usa o AurumLoginCard — card vidro-preto com rastro de luz na borda. O card
 * traz o próprio eyebrow (LogoMark + "Aurum · SmartBar" com glow), então
 * dispensa a <Logo /> acima, o <h1> e o <div.glass-strong> que existiam na
 * versão anterior. O fundo `brand-diagonals` fica para dar contexto do
 * SmartBar atrás do vidro.
 */
export default async function AdminLoginPage() {
  const saved = parseLang((await cookies()).get(LANG_COOKIE)?.value);
  const t = await getT();

  return (
    <I18nProvider initialLang={saved ?? "pt"} hasLangCookie={saved !== null}>
      <main className="brand-diagonals grid min-h-dvh place-items-center px-4 py-10">
        <div className="w-full max-w-md">
          <AurumLoginCard
            demoEmail={isDemoMode ? DEMO_ADMIN.email : undefined}
            demoPassword={isDemoMode ? DEMO_ADMIN.password : undefined}
          />
          {isDemoMode && (
            <p className="mt-6 text-center text-xs text-white/60">
              {t("admin.login.demo", { file: ".env.local" })}
            </p>
          )}
        </div>
      </main>
    </I18nProvider>
  );
}
