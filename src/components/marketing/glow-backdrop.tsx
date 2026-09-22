import { cn } from "@/lib/utils";

/**
 * Brilhos desfocados nas cores da marca, atrás do conteúdo das seções claras.
 * Sem eles o vidro não tem o que desfocar e parece branco chapado.
 * `flip` espelha a posição para alternar entre seções vizinhas.
 */
export function GlowBackdrop({ flip = false }: { flip?: boolean }) {
  return (
    <div
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      style={{
        maskImage: "linear-gradient(to bottom, transparent, black 18%, black 82%, transparent)",
        WebkitMaskImage: "linear-gradient(to bottom, transparent, black 18%, black 82%, transparent)",
      }}
      aria-hidden
    >
      <div
        className={cn(
          "absolute top-[8%] size-[46rem] max-w-[120vw] rounded-full bg-brand-300/35 blur-[120px]",
          flip ? "-right-[18rem]" : "-left-[18rem]",
        )}
      />
      <div
        className={cn(
          "absolute bottom-[4%] size-[34rem] max-w-[100vw] rounded-full bg-gold-300/35 blur-[120px]",
          flip ? "-left-[10rem]" : "-right-[10rem]",
        )}
      />
    </div>
  );
}
