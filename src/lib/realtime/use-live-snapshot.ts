"use client";
import { useCallback, useRef, useState } from "react";
import { useRealtimeSignal } from "@/lib/realtime/use-realtime-signal";
import type { DashboardSnapshot } from "@/lib/types";

/**
 * Dashboard ao vivo: a cada sinal do Realtime, busca o snapshot atualizado e
 * marca as vendas recém-chegadas (`freshIds`) para o feed destacá-las.
 */
export function useLiveSnapshot(hotelId: string, initial: DashboardSnapshot) {
  const [snapshot, setSnapshot] = useState<DashboardSnapshot>(initial);
  const [freshIds, setFreshIds] = useState<ReadonlySet<string>>(new Set());
  const known = useRef(new Set(initial.recent.map((t) => t.id)));

  const refetch = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/snapshot", { cache: "no-store" });
      if (!res.ok) return;
      const next = (await res.json()) as DashboardSnapshot;
      const arrived = next.recent.filter((t) => !known.current.has(t.id)).map((t) => t.id);
      if (arrived.length) {
        arrived.forEach((id) => known.current.add(id));
        setFreshIds((prev) => new Set([...prev, ...arrived]));
        setTimeout(() => setFreshIds((prev) => new Set([...prev].filter((id) => !arrived.includes(id)))), 6000);
      }
      setSnapshot(next);
    } catch {
      /* rede instável: o próximo sinal tenta de novo */
    }
  }, []);

  const status = useRealtimeSignal(hotelId, refetch);
  return { snapshot, freshIds, status, refetch };
}
