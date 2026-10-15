"use client";
import { createContext, useContext, useMemo, type ReactNode } from "react";
import { I18nProvider, useI18n, type I18nValue } from "@/lib/i18n/client";
import type { Lang } from "@/lib/i18n/config";

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

/** Idioma (do provider comum) + dados do quarto (só da vitrine). */
export interface GuestValue extends I18nValue {
  room: GuestRoomInfo;
}

const RoomContext = createContext<GuestRoomInfo | null>(null);

/**
 * Casca da vitrine. O idioma é do I18nProvider, compartilhado com o painel e o
 * site; aqui ficam só os dados do quarto.
 */
export function GuestProvider({
  initialLang,
  hasLangCookie,
  room,
  children,
}: {
  initialLang: Lang;
  hasLangCookie: boolean;
  room: GuestRoomInfo;
  children: ReactNode;
}) {
  return (
    <I18nProvider initialLang={initialLang} hasLangCookie={hasLangCookie}>
      <RoomContext.Provider value={room}>{children}</RoomContext.Provider>
    </I18nProvider>
  );
}

export function useGuest(): GuestValue {
  const i18n = useI18n();
  const room = useContext(RoomContext);
  if (!room) throw new Error("useGuest fora do GuestProvider");
  return useMemo(() => ({ ...i18n, room }), [i18n, room]);
}
