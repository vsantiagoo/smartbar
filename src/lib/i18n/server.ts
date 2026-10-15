import "server-only";
import { cookies } from "next/headers";
import { LANG_COOKIE, parseLang, type Lang } from "@/lib/i18n/config";
import { translator, type TFunction } from "@/lib/i18n/translate";

/**
 * Idioma e tradução para SERVER COMPONENTS (site público e painel do hotel).
 *
 *   const t = await getT();
 *   <h1>{t("site.hero.title")}</h1>
 *
 * Nos componentes de cliente use `useI18n()` de src/lib/i18n/client.tsx.
 * Ler o cookie torna a rota dinâmica — é o preço de trocar de idioma sem
 * prefixo de URL (/en, /es), que exigiria reorganizar todas as rotas.
 */
export async function getLang(): Promise<Lang> {
  const store = await cookies();
  return parseLang(store.get(LANG_COOKIE)?.value) ?? "pt";
}

export async function getT(): Promise<TFunction> {
  return translator(await getLang());
}
