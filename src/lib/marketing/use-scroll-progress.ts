"use client";
import { useEffect, useRef, useState } from "react";

export interface ScrollProgress {
  /** 0 → topo do container ainda não alcançou o topo da viewport · 1 → fim do container saiu pelo topo. */
  progress: number;
  /** Passo atual (0-based) dentro de `steps`. */
  index: number;
  /** Progresso local (0–1) da transição para o próximo passo. */
  local: number;
}

/**
 * Progresso de rolagem de um container "pinado" (scrollytelling): o container
 * tem `steps * 100dvh` de altura; por dentro, uma seção `sticky` mostra o passo
 * atual e faz crossfade para o próximo conforme o usuário rola.
 *
 * Respeita `prefers-reduced-motion`: quando ativo, retorna sempre o último
 * passo parado (sem crossfade), e o chamador deve preferir layout estático.
 */
export function useScrollProgress(ref: React.RefObject<HTMLElement | null>, steps: number): ScrollProgress {
  const [state, setState] = useState<ScrollProgress>({ progress: 0, index: 0, local: 0 });
  const reduced = useRef(false);

  useEffect(() => {
    reduced.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced.current) return;

    let raf = 0;
    const compute = () => {
      raf = 0;
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      const progress = total > 0 ? Math.min(1, Math.max(0, -rect.top / total)) : 0;
      const stepFloat = progress * (steps - 1);
      const index = Math.min(steps - 1, Math.floor(stepFloat));
      const local = stepFloat - index;
      setState({ progress, index, local });
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(compute);
    };
    compute();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [ref, steps]);

  return state;
}

/** true quando o sistema pede menos animação — desliga o crossfade de scroll. */
export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return reduced;
}
