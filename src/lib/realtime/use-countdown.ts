"use client";
import { useEffect, useState } from "react";

/**
 * Segundos restantes até `iso` (0 quando vencido).
 * `null` até montar no cliente — evita divergência de hidratação com o servidor.
 */
export function useCountdown(iso: string): number | null {
  const target = new Date(iso).getTime();
  const [left, setLeft] = useState<number | null>(null);
  useEffect(() => {
    const tick = () => setLeft(Math.max(0, Math.round((target - Date.now()) / 1000)));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [target]);
  return left;
}

export function formatClock(seconds: number | null): string {
  if (seconds === null) return "--:--";
  return `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;
}
