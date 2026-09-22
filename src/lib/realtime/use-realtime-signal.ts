"use client";
import { useEffect, useRef, useState } from "react";
import { getBrowserClient } from "@/lib/supabase/browser";
import { mockBus } from "@/lib/realtime/mock-bus";

export type LiveStatus = "connecting" | "live" | "demo";

/**
 * Sinal de "algo mudou no hotel" — a base do tempo real do painel.
 *
 *  • Com Supabase: `postgres_changes` em `transactions` (filtrado por hotel) e
 *    `inventory`. O RLS garante que só chegam eventos do próprio hotel.
 *  • Modo demo (mock): BroadcastChannel entre abas + polling entre aparelhos.
 *
 * O evento não carrega dados: apenas dispara `onSignal` (com debounce, para
 * absorver rajadas — uma compra atualiza várias linhas de inventário). Quem
 * escuta busca o estado atual no servidor: fonte única de verdade.
 */
export function useRealtimeSignal(hotelId: string, onSignal: () => void, pollMs = 4000): LiveStatus {
  const [status, setStatus] = useState<LiveStatus>("connecting");
  const handler = useRef(onSignal);
  handler.current = onSignal;

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | null = null;
    const fire = () => {
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => handler.current(), 250);
    };

    const sb = getBrowserClient();
    if (sb) {
      const channel = sb
        .channel(`admin-live:${hotelId}`)
        .on("postgres_changes", { event: "*", schema: "public", table: "transactions", filter: `hotel_id=eq.${hotelId}` }, fire)
        .on("postgres_changes", { event: "UPDATE", schema: "public", table: "inventory" }, fire)
        .subscribe((s) => setStatus(s === "SUBSCRIBED" ? "live" : "connecting"));
      return () => {
        void sb.removeChannel(channel);
        if (timer) clearTimeout(timer);
      };
    }

    setStatus("demo");
    const off = mockBus.subscribe((e) => e.type === "transactions-changed" && fire());
    const poll = setInterval(() => handler.current(), pollMs);
    return () => {
      off();
      clearInterval(poll);
      if (timer) clearTimeout(timer);
    };
  }, [hotelId, pollMs]);

  return status;
}
