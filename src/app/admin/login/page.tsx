import { cookies } from "next/headers";
import { AurumLoginCard } from "@/components/admin/sections/aurum-login-card";
import { LoginToolbar } from "@/components/admin/sections/login-toolbar";
import { APPEARANCE_COOKIE } from "@/lib/appearance";
import { DEMO_ADMIN, isDemoMode } from "@/lib/config";
import { I18nProvider } from "@/lib/i18n/client";
import { LANG_COOKIE, parseLang } from "@/lib/i18n/config";
import { getT } from "@/lib/i18n/server";

export const metadata = { title: "Login" };

const ROOT_ID = "login-root";

/**
 * TELA · Login da equipe do hotel → /admin/login
 *
 * Fundo liso (#E8F0F9 no claro; o mesmo degradê escuro do hóspede no escuro),
 * o card Aurum no centro e, no canto superior direito, home + idioma + tema.
 * O modo escuro é escopado em #login-root, como o #guest-root do hóspede, e usa
 * o mesmo cookie de aparência.
 */
export default async function AdminLoginPage() {
  const cookieStore = await cookies();
  const saved = parseLang(cookieStore.get(LANG_COOKIE)?.value);
  const dark = cookieStore.get(APPEARANCE_COOKIE)?.value === "dark";
  const t = await getT();

  return (
    <I18nProvider initialLang={saved ?? "pt"} hasLangCookie={saved !== null}>
      <main
        id={ROOT_ID}
        data-theme={dark ? "dark" : undefined}
        className="login-root relative grid min-h-dvh place-items-center px-4 py-10"
      >
        <LoginToolbar initialDark={dark} rootId={ROOT_ID} />
        <div className="w-full max-w-md">
          <AurumLoginCard
            demoEmail={isDemoMode ? DEMO_ADMIN.email : undefined}
            demoPassword={isDemoMode ? DEMO_ADMIN.password : undefined}
          />
          {isDemoMode && (
            <p className="mt-6 text-center text-xs text-ink-soft">{t("admin.login.demo", { file: ".env.local" })}</p>
          )}
        </div>
      </main>
    </I18nProvider>
  );
}
