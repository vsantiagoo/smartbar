"use client";
import { useRef, type ReactNode } from "react";
import { useSmoothScroll } from "@/lib/marketing/use-scroll-progress";
import { clamp01, cn } from "@/lib/utils";

/** Quanto o conteúdo fica para trás ao sair, em px. */
const ARRASTO = 72;
/** Quanto ele esmaece. Não vai a 1: sumir por completo cria um vazio. */
const ESMAECE = 0.72;

/**
 * COSTURA — a seção que sai não desaparece: ela fica para trás.
 *
 * O problema que isto resolve não é a falta de animação, é o CORTE. Cada seção
 * começava e terminava por conta própria, e a página lia como uma pilha de
 * slides: o olho percebia a emenda em cada passagem. Um site que parece
 * profissional não tem emendas visíveis — tem continuidade.
 *
 * A mecânica é a mesma que o herói já usava e que ninguém nota ali justamente
 * porque funciona: enquanto a seção sobe para fora da tela, o conteúdo dela
 * sobe um pouco MAIS DEVAGAR que a página. Ele fica para trás e esmaece, e a
 * seção seguinte passa por cima. O olho lê isso como profundidade — duas
 * camadas a distâncias diferentes — e não como duas telas emendadas.
 *
 * Age só na SAÍDA. A entrada continua sendo do <Reveal>, e os dois não brigam
 * porque escrevem em elementos diferentes: a costura é o container, a revelação
 * é o bloco dentro dele.
 *
 * O deslocamento é normalizado por no máximo uma tela de rolagem. Sem isso a
 * seção de planos, que tem mais de mil e duzentos pixels, começaria a se
 * afastar quando ainda estivesse inteira à vista.
 */
export function Seam({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useSmoothScroll(
    () => {
      const sec = ref.current?.closest("section");
      if (!sec) return 0;
      const vh = window.innerHeight || 1;
      const { top, height } = sec.getBoundingClientRect();
      // Zero enquanto a seção não começou a sair pelo topo.
      return clamp01(-top / Math.max(1, Math.min(height, vh)));
    },
    (p) => {
      const el = ref.current;
      if (!el) return;
      el.style.transform = p ? `translate3d(0, ${(p * ARRASTO).toFixed(1)}px, 0)` : "";
      el.style.opacity = p ? (1 - p * ESMAECE).toFixed(3) : "";
    },
  );

  return (
    <div ref={ref} className={cn("will-change-[transform,opacity]", className)}>
      {children}
    </div>
  );
}
