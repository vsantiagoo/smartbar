"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { getBrowserClient } from "@/lib/supabase/browser";
import { mockBus } from "@/lib/realtime/mock-bus";
import type { PublicTransaction } from "@/lib/types";

/**
 * Acompanha um pedido do hóspede até o estado final.
 *  • Supabase: canal de broadcast `tx:{token}` — o próprio banco emite o evento
 *    dentro de smartbar_authorize_transaction() (realtime.send).
 *  • Demo: BroadcastChannel entre abas.
 *  • Sempre: polling de 3 s como rede de segurança (Wi-Fi de hotel é instável).
 */
export function useTransactionStatus(initial: PublicTransaction) {
  const token = initial.publicToken;
  const [tx, setTx] = useState<PublicTransaction>(initial);
  const done = useRef(initial.status !== "pending");

  const refetch = useCallback(async () => {
    try {
      const res = await fetch(`/api/transactions/${token}`, { cache: "no-store" });
      if (!res.ok) return;
      const next = (await res.json()) as PublicTransaction;
      setTx(next);
      if (next.status !== "pending") done.current = true;
    } catch {
      /* tenta no próximo ciclo */
    }
  }, [token]);

  useEffect(() => {
    if (done.current) return;
    const sb = getBrowserClient();
    const channel = sb?.channel(`tx:${token}`).on("broadcast", { event: "status" }, () => void refetch()).subscribe();
    const off = mockBus.subscribe((e) => e.type === "tx-status" && e.token === token && void refetch());
    const poll = setInterval(() => {
      if (done.current) clearInterval(poll);
      else void refetch();
    }, 3000);
    return () => {
      if (sb && channel) void sb.removeChannel(channel);
      off();
      clearInterval(poll);
    };
  }, [token, refetch]);

  return { tx, refetch };
}
