"use client";
import { useRef, type ReactNode } from "react";
import { clamp01, useSmoothScroll } from "@/lib/marketing/use-scroll-progress";

/**
 * Conteúdo do hero que se afasta com suavidade ao rolar: sobe um pouco mais
 * devagar que a página, encolhe de leve e esmaece — a passagem para a seção
 * seguinte fica contínua, sem corte seco.
 */
export function HeroParallax({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useSmoothScroll(
    () => {
      const section = ref.current?.parentElement;
      if (!section) return 0;
      return clamp01(-section.getBoundingClientRect().top / section.offsetHeight);
    },
    (p) => {
      const el = ref.current;
      if (!el) return;
      el.style.transform = `translate3d(0, ${p * 120}px, 0) scale(${1 - p * 0.06})`;
      el.style.opacity = String(1 - Math.min(1, p * 1.4));
    },
  );

  return (
    /* pt-* afasta o conteúdo da barra do cabeçalho, que fica no topo da seção.
       max-w-6xl + px-6/sm:px-10 repetem a caixa do cabeçalho (`header-fade.tsx`),
       então o texto alinhado à esquerda nasce na mesma margem da marca. */
    <div
      ref={ref}
      /* select-none: sem marca-texto no hero — a seleção dourada suja a foto de fundo. */
      className="relative w-full select-none px-6 pt-12 text-left text-white will-change-[transform,opacity] sm:px-10 sm:pt-16"
    >
      <div className="mx-auto max-w-6xl">{children}</div>
    </div>
  );
}
