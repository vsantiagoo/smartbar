"use client";
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { LANG_COOKIE, LOCALE_TAG, detectLang, translate, type GuestKey, type Lang } from "@/lib/i18n/guest";

/** O que a tela do hóspede precisa saber do quarto (vem do servidor, uma vez). */
export interface GuestRoomInfo {
  hotelId: string;
  hotelName: string;
  roomId: string;
  roomNumber: string;
  /** Há trava física neste quarto? Falso = "apenas sistema" (anfitrião). */
  hasLock: boolean;
  lockOnline: boolean;
  /** Motel: compra 100% anônima, sem nome e sem conta do quarto. */
  anonymous: boolean;
  guestFirstName: string | null;
  whatsapp: string | null;
}

interface GuestValue {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: GuestKey, vars?: Record<string, string | number>) => string;
  /** Formata data e hora no idioma escolhido. */
  formatDateTime: (iso: string) => string;
  room: GuestRoomInfo;
}

const GuestContext = createContext<GuestValue | null>(null);

function writeLangCookie(lang: Lang): void {
  try {
    document.cookie = `${LANG_COOKIE}=${lang}; path=/; max-age=31536000; samesite=lax`;
  } catch {
    /* cookies bloqueados: o idioma vale só nesta visita */
  }
}

/**
 * Idioma + dados do quarto. O idioma inicial vem do cookie (lido no servidor);
 * na primeira visita, sem cookie, usa o idioma do celular.
 */
export function GuestProvider({ initialLang, hasLangCookie, room, children }: { initialLang: Lang; hasLangCookie: boolean; room: GuestRoomInfo; children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(initialLang);

  useEffect(() => {
    if (hasLangCookie) return;
    const detected = detectLang(navigator.language);
    if (detected !== initialLang) setLangState(detected);
  }, [hasLangCookie, initialLang]);

  useEffect(() => {
    document.documentElement.lang = LOCALE_TAG[lang];
  }, [lang]);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    writeLangCookie(l);
  }, []);

  const value = useMemo<GuestValue>(
    () => ({
      lang,
      setLang,
      room,
      t: (key, vars) => translate(lang, key, vars),
      formatDateTime: (iso) =>
        new Intl.DateTimeFormat(LOCALE_TAG[lang], { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit", timeZone: "America/Sao_Paulo" }).format(new Date(iso)),
    }),
    [lang, setLang, room],
  );
  return <GuestContext.Provider value={value}>{children}</GuestContext.Provider>;
}

export function useGuest(): GuestValue {
  const ctx = useContext(GuestContext);
  if (!ctx) throw new Error("useGuest fora do GuestProvider");
  return ctx;
}
