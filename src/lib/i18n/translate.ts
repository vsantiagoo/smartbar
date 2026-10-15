import type { Lang } from "@/lib/i18n/config";
import { en } from "@/lib/i18n/dictionaries/en";
import { es } from "@/lib/i18n/dictionaries/es";
import { pt, type DictKey } from "@/lib/i18n/dictionaries/pt";

export type { DictKey };

/** Um dicionário por idioma. Ver config.ts para incluir um idioma novo. */
export const DICTIONARIES: Record<Lang, Record<DictKey, string>> = { pt, en, es };

/** Assinatura da função de tradução, igual no servidor e no cliente. */
export type TFunction = (key: DictKey, vars?: Record<string, string | number>) => string;

/**
 * Traduz `key` e troca `{var}`. O plural usa `{n|singular|plural}` (n = 1 → singular).
 * Se faltar a chave no idioma, cai no português em vez de quebrar a tela.
 */
export function translate(lang: Lang, key: DictKey, vars: Record<string, string | number> = {}): string {
  const raw = DICTIONARIES[lang][key] ?? DICTIONARIES.pt[key] ?? key;
  return raw
    .replace(/\{(\w+)\|([^|}]*)\|([^}]*)\}/g, (_, v: string, one: string, many: string) => (Number(vars[v]) === 1 ? one : many))
    .replace(/\{(\w+)\}/g, (_, v: string) => String(vars[v] ?? ""));
}

/** Prende o idioma e devolve o `t` pronto para uso. */
export function translator(lang: Lang): TFunction {
  return (key, vars) => translate(lang, key, vars);
}
