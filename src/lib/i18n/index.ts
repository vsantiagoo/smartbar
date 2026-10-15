/**
 * PONTO DE ENTRADA do sistema de idiomas do SmartBar.
 *
 *   Componente de CLIENTE  →  const { t, lang, setLang } = useI18n();   (./client)
 *   Componente de SERVIDOR →  const t = await getT();                   (./server)
 *
 * Os textos ficam em ./dictionaries/{pt,en,es}.ts, com as chaves no formato
 * "area.bloco.item" (guest.*, admin.*, site.*). O português é a fonte da
 * verdade: o TypeScript exige que en.ts e es.ts tenham exatamente as mesmas
 * chaves, então um texto novo sem tradução quebra o build em vez de aparecer
 * em português no meio de outro idioma.
 *
 * `server.ts` fica fora deste barril de propósito: ele importa `server-only`
 * e quebraria qualquer componente de cliente que importasse daqui.
 */

export { LANGS, LANG_COOKIE, LOCALE_TAG, detectLang, parseLang, type Lang } from "@/lib/i18n/config";
export { DICTIONARIES, translate, translator, type DictKey, type TFunction } from "@/lib/i18n/translate";
export { I18nProvider, useI18n, type I18nValue } from "@/lib/i18n/client";
export { translateProduct } from "@/lib/i18n/products";
