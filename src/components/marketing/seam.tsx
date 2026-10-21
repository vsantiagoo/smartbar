"use client";
import { useRef, type ReactNode } from "react";
import { useSmoothScroll } from "@/lib/marketing/use-scroll-progress";
import { clamp01, cn } from "@/lib/utils";

/** Escala com que a seção CHEGA, antes de se abrir. */
const CONTIDA = 0.93;
/** Opacidade do véu sobre a seção ainda fechada. */
const VEU = 0.55;
/** Quanto o conteúdo fica para trás ao sair, em px. */
const ARRASTO = 72;
/** Quanto ele esmaece ao sair. Não vai a 1: sumir por completo cria um vazio. */
const ESMAECE = 0.72;

/**
 * O PORTÃO DA SEÇÃO — ela chega fechada e se abre ao assumir a tela.
 *
 * Duas fases, e a primeira é a que importa:
 *
 *   ABRIR (entrada) — a seção sobe contida: um pouco menor e sob um véu. Ao
 *   ocupar a tela, ela se solta — escala cheia, véu embora. É o gesto do
 *   produto traduzido em luz e escala, sem desenhar um cadeado a mais.
 *
 *   FECHAR (saída) — o conteúdo sobe mais devagar que a página, fica para trás
 *   e esmaece, e a seção seguinte passa por cima. Acaba a emenda seca entre
 *   telas: o olho lê duas camadas a distâncias diferentes, e não dois slides.
 *
 * POR QUE A FASE DE ENTRADA EXISTE. A primeira versão disto só tinha a saída, e
 * passou despercebida mesmo funcionando — medido, 43px de arrasto e 57% de
 * opacidade, valores nada tímidos. O erro não era a dose: era o LUGAR. Quem
 * rola para baixo olha para o que entra, embaixo; a saída acontece no topo, nas
 * costas da atenção. Um efeito no canto cego da tela é um efeito que não existe.
 *
 * As duas fases não se sobrepõem — a entrada termina antes de a saída começar —,
 * então uma nunca desfaz a outra.
 */
export function Seam({
  children,
  tone = "light",
  className,
}: {
  children: ReactNode;
  /**
   * Fundo da seção sob o véu. Sem isto o véu claro vira uma MANCHA sobre o
   * "como funciona", que é azul-marinho: velar é sempre caminhar para a cor do
   * fundo, e cada seção tem o seu.
   */
  tone?: "light" | "dark";
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const veuRef = useRef<HTMLDivElement>(null);

  useSmoothScroll(
    () => {
      const sec = ref.current?.closest("section");
      if (!sec) return 0;
      const vh = window.innerHeight || 1;
      const { top, height } = sec.getBoundingClientRect();

      // Fase de saída, quando a seção já passou do topo. Devolve 1 a 2.
      if (top < 0) return 1 + clamp01(-top / Math.max(1, Math.min(height, vh)));
      // Fase de entrada: 0 quando o topo encosta na borda de baixo, 1 quando
      // subiu 45% da tela — ou seja, a seção se abre enquanto ainda sobe.
      return clamp01((vh - top) / Math.max(1, vh * 0.45));
    },
    (v) => {
      const el = ref.current;
      const veu = veuRef.current;
      if (!el || !veu) return;

      if (v <= 1) {
        // ABRINDO.
        const s = CONTIDA + (1 - CONTIDA) * v;
        el.style.transform = v < 1 ? `scale(${s.toFixed(4)})` : "";
        el.style.opacity = "";
        veu.style.opacity = v < 1 ? (VEU * (1 - v)).toFixed(3) : "0";
      } else {
        // FECHANDO.
        const p = v - 1;
        el.style.transform = `translate3d(0, ${(p * ARRASTO).toFixed(1)}px, 0)`;
        el.style.opacity = (1 - p * ESMAECE).toFixed(3);
        veu.style.opacity = "0";
      }
    },
  );

  return (
    <div ref={ref} className={cn("relative will-change-[transform,opacity]", className)}>
      {/*
        O véu é um irmão do conteúdo, e não um filtro sobre ele: `filter` numa
        seção inteira custa caro no celular e forçaria o navegador a repintar a
        subárvore toda. Uma camada translúcida por cima é composta na GPU.

        A cor vem do `tone`, e não de `currentColor`: as seções alternam fundo
        claro e escuro, e velar é caminhar para a cor do FUNDO de cada uma. Um
        véu claro sobre o "como funciona", que é azul-marinho, seria uma mancha.
      */}
      <div
        ref={veuRef}
        aria-hidden
        className={cn(
          "pointer-events-none absolute -inset-x-6 -inset-y-4 z-10 rounded-surface opacity-0",
          tone === "dark" ? "bg-[rgb(var(--brand-950))]" : "bg-[rgb(var(--sky-2))]",
        )}
      />
      {children}
    </div>
  );
}
