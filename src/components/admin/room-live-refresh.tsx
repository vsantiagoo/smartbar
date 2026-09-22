"use client";
import { useLiveRefresh } from "@/lib/realtime/use-live-refresh";

/** Componente sem UI: mantém uma tela de servidor atualizada por Realtime. */
export function RoomLiveRefresh({ hotelId }: { hotelId: string }) {
  useLiveRefresh(hotelId);
  return null;
}
