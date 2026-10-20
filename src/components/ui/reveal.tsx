"use client";
import { useEffect, useRef, type ReactNode } from "react";
import { inscrever, type RevealWeight } from "@/lib/marketing/reveal-engine";
import { cn } from "@/lib/utils";

interface RevealProps {
  children: ReactNode;
  /** Defasagem da cascata em listas (ex.: `i * 90`). Vira distância, não tempo. */
  delay?: number;
  /**
   * Peso editorial. `lead` para o título que ancora a seção, `aside` para o
   * apoio que vem de mais longe (cards, números, ilustrações). O padrão `body`
   * serve ao resto.
   */
  weight?: RevealWeight;
  className?: string;
}

/**
 * Revela o bloco conforme ele sobe a tela — ver `lib/marketing/reveal-engine`.
 *
 * O progresso é função da POSIÇÃO, não de um gatilho: rolar devagar revela
 * devagar, parar no meio deixa no meio, voltar desfaz. Com "reduzir movimento"
 * o bloco nasce visível e parado.
 */
export function Reveal({ children, delay = 0, weight = "body", className }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    return inscrever(el, weight, delay);
  }, [delay, weight]);

  return (
    <div ref={ref} className={cn("reveal", className)}>
      {children}
    </div>
  );
}
