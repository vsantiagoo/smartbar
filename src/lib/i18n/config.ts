/**
 * Idiomas do produto — vale para TODAS as áreas (vitrine do hóspede, painel do
 * hotel e site público).
 *
 * PARA INCLUIR UM IDIOMA NOVO (ex.: francês):
 *   1. acrescente "fr" em LANGS e um rótulo em LOCALE_TAG, aqui;
 *   2. crie src/lib/i18n/dictionaries/fr.ts copiando en.ts;
 *   3. rode `npx tsc --noEmit` — ele aponta UMA A UMA as chaves que faltam;
 *   4. registre o arquivo em DICTIONARIES, em src/lib/i18n/translate.ts.
 * Nenhum componente de tela precisa ser tocado.
 */

export const LANGS = ["pt", "en", "es"] as const;
export type Lang = (typeof LANGS)[number];

/** Cookie compartilhado pelas três áreas, para o idioma seguir o visitante. */
export const LANG_COOKIE = "sb_lang";

/** Tag BCP-47 usada em <html lang> e nas formatações de data e moeda. */
export const LOCALE_TAG: Record<Lang, string> = { pt: "pt-BR", en: "en-US", es: "es-ES" };

/** Idioma do navegador → um dos suportados (padrão: português). */
export function detectLang(navigatorLang: string | undefined | null): Lang {
  const base = (navigatorLang ?? "").toLowerCase().slice(0, 2);
  return (LANGS as readonly string[]).includes(base) ? (base as Lang) : "pt";
}

/** Valida o que veio do cookie antes de confiar nele. */
export function parseLang(value: string | undefined | null): Lang | null {
  return (LANGS as readonly string[]).includes(value ?? "") ? (value as Lang) : null;
}
