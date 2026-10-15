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
        tone === "light" ? "text-brand-500" : "text-white/55",
        centered && "justify-center",
        className,
      )}
    >
      {!centered && <span aria-hidden className="h-px w-7 shrink-0 bg-current opacity-45" />}
      {children}
    </p>
  );
}
