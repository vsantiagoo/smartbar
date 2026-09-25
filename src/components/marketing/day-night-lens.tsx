"use client";
import { useEffect, useRef, type CSSProperties } from "react";
import { usePrefersReducedMotion } from "@/lib/marketing/use-scroll-progress";
import { cn } from "@/lib/utils";

/** Raio da lente em fração da largura, com piso e teto em px. */
const R_FRAC = 0.2;
const R_MIN = 200;
const R_MAX = 440;
/** Fração do caminho percorrida por quadro a 60fps ao perseguir o ponteiro. */
const DAMPING = 0.085;

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));

/**
 * Lente do tempo: a foto do hotel de DIA é a base; sob o cursor, uma área de
 * borda difusa revela a mesma foto ao ENTARDECER e, no núcleo, à NOITE.
 * As três chapas são o mesmo enquadramento, então o recorte casa pixel a pixel
 * e a leitura é de um só lugar mudando de hora.
 *
 * A borda não é um círculo: a máscara soma DOIS degradês radiais que orbitam
 * em fases diferentes e respiram fora de compasso. É o que dá o contorno vivo,
 * sem filtro de ruído (que custaria caro a cada quadro).
 *
 * Sem ponteiro, a lente não fica parada: ela vagueia devagar numa figura de
 * Lissajous. Quando o cursor entra, ela o persegue com amortecimento; quando
 * sai, volta a vaguear.
 *
 * Nada disso re-renderiza React: o laço escreve variáveis CSS direto no
 * elemento, como o resto das animações da página. Com "reduzir movimento",
 * mostra só a foto do dia.
 */
export function DayNightLens({ className }: { className?: string }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const root = rootRef.current;
    if (!root || reduced) return;

    let w = 0;
    let h = 0;
    const medir = () => {
      const r = root.getBoundingClientRect();
      w = r.width;
      h = r.height;
    };
    medir();

    // Alvo em px dentro do elemento; começa no centro.
    let alvoX = w / 2;
    let alvoY = h / 2;
    let x = alvoX;
    let y = alvoY;
    let comPonteiro = false;
    let visivel = false;
    let raf = 0;
    const t0 = performance.now();

    const frame = (now: number) => {
      if (!visivel) {
        raf = 0;
        return;
      }
      const t = (now - t0) / 1000;

      if (!comPonteiro) {
        // Passeio lento: duas senoides de períodos incomensuráveis, então o
        // caminho nunca se repete de forma perceptível.
        alvoX = w * (0.5 + 0.23 * Math.sin(t * 0.13) + 0.06 * Math.sin(t * 0.37 + 1.7));
        alvoY = h * (0.5 + 0.16 * Math.sin(t * 0.19 + 1.1) + 0.05 * Math.sin(t * 0.43));
      }
      x += (alvoX - x) * DAMPING;
      y += (alvoY - y) * DAMPING;

      const r = clamp(w * R_FRAC, R_MIN, R_MAX);
      // Os dois bolsões: órbitas pequenas, em sentidos e fases diferentes.
      const ax = x + r * 0.1 * Math.sin(t * 0.61);
      const ay = y + r * 0.08 * Math.cos(t * 0.47 + 0.6);
      const bx = x - r * 0.14 * Math.sin(t * 0.38 + 2.1);
      const by = y - r * 0.11 * Math.cos(t * 0.53 + 1.4);
      const ar = r * (1 + 0.06 * Math.sin(t * 0.5));
      const br = r * 0.74 * (1 + 0.08 * Math.sin(t * 0.37 + 2));

      const s = root.style;
      s.setProperty("--ax", `${ax.toFixed(1)}px`);
      s.setProperty("--ay", `${ay.toFixed(1)}px`);
      s.setProperty("--bx", `${bx.toFixed(1)}px`);
      s.setProperty("--by", `${by.toFixed(1)}px`);
      s.setProperty("--ar", `${ar.toFixed(1)}px`);
      s.setProperty("--br", `${br.toFixed(1)}px`);
      s.setProperty("--tr", `${(r * 1.55).toFixed(1)}px`);

      raf = requestAnimationFrame(frame);
    };
    const acorda = () => {
      if (!raf && visivel) raf = requestAnimationFrame(frame);
    };

    const onMove = (e: PointerEvent) => {
      const r = root.getBoundingClientRect();
      comPonteiro = true;
      alvoX = e.clientX - r.left;
      alvoY = e.clientY - r.top;
      acorda();
    };
    const onLeave = () => {
      comPonteiro = false;
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        visivel = Boolean(entry?.isIntersecting);
        if (visivel) acorda();
      },
      { rootMargin: "120px" },
    );
    io.observe(root);

    const ro = new ResizeObserver(medir);
    ro.observe(root);

    const pai = root.parentElement ?? root;
    pai.addEventListener("pointermove", onMove);
    pai.addEventListener("pointerleave", onLeave);
    return () => {
      io.disconnect();
      ro.disconnect();
      if (raf) cancelAnimationFrame(raf);
      pai.removeEventListener("pointermove", onMove);
      pai.removeEventListener("pointerleave", onLeave);
    };
  }, [reduced]);

  /* As duas camadas reveladas nascem no centro; o laço assume a partir daí. */
  const inicial = {
    "--ax": "50%",
    "--ay": "50%",
    "--bx": "50%",
    "--by": "50%",
    "--ar": `${R_MIN}px`,
    "--br": `${R_MIN * 0.74}px`,
    "--tr": `${R_MIN * 1.55}px`,
  } as CSSProperties;

  return (
    <div
      ref={rootRef}
      aria-hidden
      className={cn("pointer-events-none overflow-hidden bg-brand-950", className)}
      style={inicial}
    >
      {/* Base: o hotel de dia. */}
      <img src="/images/hotel/dia.jpg" alt="" className="absolute inset-0 size-full object-cover xl:object-contain" />

      {!reduced && (
        <>
          {/* Halo largo: o entardecer aparece antes da noite, como um anel. */}
          <img
            src="/images/hotel/tarde.jpg"
            alt=""
            className="absolute inset-0 size-full object-cover xl:object-contain"
            style={{
              maskImage:
                "radial-gradient(circle var(--tr) at var(--ax) var(--ay), #000 0%, #000 34%, transparent 82%)",
              WebkitMaskImage:
                "radial-gradient(circle var(--tr) at var(--ax) var(--ay), #000 0%, #000 34%, transparent 82%)",
            }}
          />
          {/* Núcleo: a noite. Dois degradês somados = borda viva. */}
          <img
            src="/images/hotel/noite.jpg"
            alt=""
            className="absolute inset-0 size-full object-cover xl:object-contain"
            style={{
              maskImage:
                "radial-gradient(circle var(--ar) at var(--ax) var(--ay), #000 0%, #000 28%, transparent 74%), radial-gradient(circle var(--br) at var(--bx) var(--by), #000 0%, #000 20%, transparent 72%)",
              WebkitMaskImage:
                "radial-gradient(circle var(--ar) at var(--ax) var(--ay), #000 0%, #000 28%, transparent 74%), radial-gradient(circle var(--br) at var(--bx) var(--by), #000 0%, #000 20%, transparent 72%)",
            }}
          />
        </>
      )}
    </div>
  );
}
