"use client";
import { useRef } from "react";
import { useSmoothScroll } from "@/lib/marketing/use-scroll-progress";
import { clamp01 } from "@/lib/utils";

/** Em que fração da primeira tela a moldura termina de acender. */
const FADE_IN_AT = 0.45;

/**
 * SEÇÃO · Moldura de luz quente colada nas bordas da janela. Fica apagada no
 * hero (que já tem a sua própria borda branca) e acende conforme a página
 * desce, no mesmo ritmo amortecido do resto do site.
 *
 * É só luz: não recebe clique nem aparece para leitores de tela. A cor sai dos
 * tokens `gold-*`, então acompanha qualquer troca de paleta.
 */
export function EdgeGlow() {
  const ref = useRef<HTMLDivElement>(null);

  useSmoothScroll(
    () => clamp01(window.scrollY / (window.innerHeight * FADE_IN_AT)),
    (p) => {
      const el = ref.current;
      if (el) el.style.opacity = p.toFixed(3);
    },
  );

  return (
    /*
      A intensidade sai para o CSS (`.edge-glow`) porque ela MUDA com o tema:
      sobre o fundo claro o ouro é um calor discreto, mas sobre o escuro o mesmo
      valor vira uma barra alaranjada crua nas laterais. No escuro ele recua a
      quase um terço e abre mais o desfoque, para ser luz, não contorno.
    */
    <div ref={ref} aria-hidden className="edge-glow pointer-events-none fixed inset-0 z-50 opacity-0 will-change-[opacity]" />
  );
}
