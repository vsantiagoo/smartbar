"use client";
import { useRouter } from "next/navigation";
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { LANG_COOKIE, LOCALE_TAG, detectLang, type Lang } from "@/lib/i18n/config";
import { translate, type DictKey, type TFunction } from "@/lib/i18n/translate";

/**
 * Idioma para COMPONENTES DE CLIENTE das três áreas (vitrine, painel e site).
 * O provider fica na casca de cada área; em server components use `getT()`
 * de src/lib/i18n/server.ts.
 */
export interface I18nValue {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: TFunction;
  /** Data e hora no idioma escolhido, no fuso do hotel. */
  formatDateTime: (iso: string) => string;
}

const I18nContext = createContext<I18nValue | null>(null);

function writeLangCookie(lang: Lang): void {
  try {
    document.cookie = `${LANG_COOKIE}=${lang}; path=/; max-age=31536000; samesite=lax`;
  } catch {
    /* cookies bloqueados: o idioma vale só nesta visita */
  }
}

export function I18nProvider({
  initialLang,
  hasLangCookie,
  children,
}: {
  initialLang: Lang;
  /** Sem cookie, a primeira visita adota o idioma do aparelho. */
  hasLangCookie: boolean;
  children: ReactNode;
}) {
  const [lang, setLangState] = useState<Lang>(initialLang);
  const router = useRouter();

  useEffect(() => {
    if (hasLangCookie) return;
    const detected = detectLang(navigator.language);
    if (detected !== initialLang) setLangState(detected);
  }, [hasLangCookie, initialLang]);

  useEffect(() => {
    document.documentElement.lang = LOCALE_TAG[lang];
  }, [lang]);

  const setLang = useCallback(
    (l: Lang) => {
      setLangState(l);
      writeLangCookie(l);
      /* Os componentes de CLIENTE já trocam pelo estado acima. Os de SERVIDOR
         (site e painel) foram renderizados com o idioma antigo, então pedimos
         um refresh suave: re-renderiza o servidor sem recarregar a página nem
         perder o estado das telas. */
      router.refresh();
    },
    [router],
  );

  const value = useMemo<I18nValue>(
    () => ({
      lang,
      setLang,
      t: (key: DictKey, vars) => translate(lang, key, vars),
      formatDateTime: (iso) =>
        new Intl.DateTimeFormat(LOCALE_TAG[lang], {
          day: "2-digit",
          month: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          timeZone: "America/Sao_Paulo",
        }).format(new Date(iso)),
    }),
    [lang, setLang],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nValue {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n fora do I18nProvider");
  return ctx;
}
