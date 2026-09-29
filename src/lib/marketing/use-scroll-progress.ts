"use client";
import { useEffect, useRef, useState } from "react";

/**
 * Progresso de rolagem SUAVIZADO: em vez de saltar para a posição exata a
 * cada evento de scroll, o valor persegue o alvo com amortecimento
 * (interpolação exponencial, independente da taxa de quadros). O resultado é
 * entregue a `onFrame` a cada quadro, sem re-render do React — o chamador
 * escreve direto no `style` dos elementos, o que mantém 60fps.
 *
 * `measure` devolve o alvo (normalmente 0–1) lendo o layout atual.
 * `damping`: fração do caminho percorrida por quadro a 60fps (0.1 = mais
 * macio e lento · 0.3 = mais colado ao dedo).
 *
 * Com "reduzir movimento" ativo, entrega o alvo direto, sem amortecer.
 */
export function useSmoothScroll(
  measure: () => number,
  onFrame: (value: number) => void,
  damping = 0.14,
): void {
  const measureRef = useRef(measure);
  const frameRef = useRef(onFrame);
  measureRef.current = measure;
  frameRef.current = onFrame;

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let current = Number.NaN;
    let raf = 0;
    let last = 0;

    const tick = (now: number) => {
      const target = measureRef.current();
      const dt = last ? Math.min(64, now - last) : 16.667;
      last = now;
      if (Number.isNaN(current) || reduced) {
        current = target;
      } else {
        const k = 1 - Math.pow(1 - damping, dt / 16.667);
        current += (target - current) * k;
        if (Math.abs(target - current) < 0.0004) current = target;
      }
      frameRef.current(current);
      raf = current === target ? 0 : requestAnimationFrame(tick);
    };
    const kick = () => {
      if (raf) return;
      last = 0;
      raf = requestAnimationFrame(tick);
    };

    // Em aba oculta o navegador não entrega quadros; ao voltar, recomeçamos o laço.
    const onVisible = () => {
      if (document.visibilityState !== "visible") return;
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
      kick();
    };

    kick();
    window.addEventListener("scroll", kick, { passive: true });
    window.addEventListener("resize", kick);
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      window.removeEventListener("scroll", kick);
      window.removeEventListener("resize", kick);
      document.removeEventListener("visibilitychange", onVisible);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [damping]);
}

/** true quando o sistema pede menos animação — desliga o scrollytelling. */
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
