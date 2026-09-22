"use client";
import { useEffect, useState } from "react";

/**
 * Relógio que "bate" a cada `everyMs` — para rótulos relativos ("há 2 min").
 * Retorna `null` no servidor e no primeiro render do cliente: assim o HTML
 * hidrata idêntico (sem erro de hidratação) e o rótulo aparece logo após montar.
 */
export function useNow(everyMs = 15_000): number | null {
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), everyMs);
    return () => clearInterval(id);
  }, [everyMs]);
  return now;
}
