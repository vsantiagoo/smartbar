import { cn } from "@/lib/utils";

/**
 * SOBRESCRITA de abertura de seção — o rótulo miúdo acima do título.
 *
 * Vinha repetido em quatro seções com três entreletras diferentes (0.16, 0.18,
 * 0.08), o que fazia cada abertura soar num tom ligeiramente distinto. Agora é
 * uma peça só, com uma medida só.
 *
 * DUAS DECISÕES TIPOGRÁFICAS:
 *
 *   · 0.2em de entreletra. Caixa-alta em corpo miúdo fecha: as maiúsculas têm
 *     todas a mesma altura e o olho perde o apoio entre elas. Abrir a entreletra
 *     devolve a leitura e dá o tom editorial — é o rótulo de uma página de
 *     revista, não um texto de interface.
 *
 *   · O fio antes do texto. É o que separa uma sobrescrita de um parágrafo
 *     pequeno em maiúsculas: ele ancora o rótulo na margem e abre a seção.
 *     Some quando o bloco é centralizado, onde não há margem para ancorar.
 *
 * ONDE *NÃO* USAR: rótulo de campo, de grupo de menu ou de bloco dentro do
 * painel e da vitrine. Lá o texto em caixa-alta é funcional — lido de relance,
 * muitas vezes ao dia — e vale `tracking-[0.14em]`, a medida de rótulo do
 * produto. Esta peça abre uma seção, e isso acontece uma vez por página.
 */
export function Eyebrow({
  children,
  tone = "light",
  centered = false,
  className,
}: {
  children: React.ReactNode;
  /** `light` = fundo claro (texto da marca); `dark` = fundo escuro. */
  tone?: "light" | "dark";
  centered?: boolean;
  className?: string;
}) {
  return (
    <p
      className={cn(
        "flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em]",
        /*
          Azul da marca em corpo miúdo precisa de um degrau mais forte em CADA
          tema — medido contra o fundo de cada um: brand-500 dava 3,93 no claro
          e 3,34 no escuro, os dois abaixo do mínimo de 4,5. Escurecer no claro
          e clarear no escuro leva a 5,81 e 7,1.
        */
        tone === "light" ? "text-brand-600 dark:text-brand-300" : "text-white/55",
        centered && "justify-center",
        className,
      )}
    >
      {!centered && <span aria-hidden className="h-px w-7 shrink-0 bg-current opacity-45" />}
      {children}
    </p>
  );
}
