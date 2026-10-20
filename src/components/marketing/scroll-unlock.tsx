"use client";
import { useRef } from "react";
import { useSmoothScroll } from "@/lib/marketing/use-scroll-progress";
import { clamp01 } from "@/lib/utils";
import { Lock3D } from "./lock-3d";

/**
 * A ROLAGEM COMO GESTO DE DESTRAVAR.
 *
 * Esta é a dobradiça da página: acima dela o site mostra, abaixo dela o site
 * explica. Em vez de uma seção simplesmente dar lugar à outra, o cadeado da
 * declaração abre conforme a pessoa desce — e é a abertura dele que entrega o
 * resto do site.
 *
 * Por que aqui e só aqui: o SmartBar é uma trava que libera depois do
 * pagamento. Repetir esse gesto a cada seção o transformaria em enfeite; usá-lo
 * uma vez, na única transição que muda a promessa da página, faz dele
 * pontuação. É a diferença entre uma assinatura e um carimbo.
 *
 * A faixa vai de quando o bloco entra pelo pé da tela até ele cruzar o meio —
 * ou seja, o cadeado termina de abrir no instante em que a declaração está
 * centrada e legível, e não antes. O movimento usa o mesmo motor amortecido do
 * resto do site, então o destravar tem a inércia das outras peças, e não a
 * resposta seca de quem lê `scrollY` cru.
 *
 * O cadeado é renderizado AQUI DENTRO em vez de chegar por `children`: este é
 * um componente de cliente usado por um de servidor, e uma função não atravessa
 * essa fronteira — o React não tem como serializá-la.
 */
export function ScrollUnlock({ className }: { className?: string }) {
  const caixa = useRef<HTMLDivElement>(null);
  const abertura = useRef(0);

  useSmoothScroll(
    () => {
      const el = caixa.current;
      if (!el) return 0;
      const vh = window.innerHeight || 1;
      const { top } = el.getBoundingClientRect();
      // 1 quando o topo do bloco cruza a metade da tela; 0 quando ele ainda
      // está no pé dela. O divisor nunca é zero mesmo em telas muito baixas.
      return clamp01((vh * 0.92 - top) / Math.max(1, vh * 0.42));
    },
    (p) => {
      abertura.current = p;
    },
    // Mais macio que o padrão: a trava é uma peça com massa, não um cursor.
    0.1,
  );

  return (
    <div ref={caixa} className="shrink-0">
      <Lock3D unlock={abertura} className={className} />
    </div>
  );
}
