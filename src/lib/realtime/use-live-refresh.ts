"use client";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { useRealtimeSignal, type LiveStatus } from "@/lib/realtime/use-realtime-signal";

/** Telas renderizadas no servidor (quartos, reposição): re-renderiza a cada sinal. */
export function useLiveRefresh(hotelId: string): LiveStatus {
  const router = useRouter();
  const refresh = useCallback(() => router.refresh(), [router]);
  return useRealtimeSignal(hotelId, refresh, 6000);
}
