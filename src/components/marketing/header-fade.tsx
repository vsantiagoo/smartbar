"use client";
import { useRef, type ReactNode } from "react";
import { useSmoothScroll } from "@/lib/marketing/use-scroll-progress";
import { clamp01 } from "@/lib/utils";

/** A partir de quanto da primeira tela o cabeçalho já sumiu por completo. */
const FADE_OUT_AT = 0.55;

/**
 * Some com o cabeçalho (marca + barra de menus) conforme a página desce, e o
 * traz de volta ao subir. O movimento acompanha o scroll amortecido, igual ao
 * resto da página. Enquanto invisível, ele não recebe clique nem teclado.
 *
 * Depois que ele some, o caminho de volta é a seta no canto de cada seção e o
 * botão escrito por extenso no rodapé — os dois em `back-to-top.tsx`.
 */
export function HeaderFade({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useSmoothScroll(
    () => clamp01(window.scrollY / (window.innerHeight * FADE_OUT_AT)),
    (p) => {
      const el = ref.current;
      if (!el) return;
      const hidden = p > 0.985;
      el.style.opacity = String(1 - p);
      el.style.transform = `translate3d(0, ${p * -16}px, 0)`;
      el.style.pointerEvents = hidden ? "none" : "";
      el.style.visibility = hidden ? "hidden" : "visible";
    },
  );

  return (
    /*
      `absolute` (e não `fixed`): o cabeçalho pertence à primeira tela e sobe
      junto com ela. Fixo no topo da janela, ele ficava parado enquanto o texto
      do hero subia — e acabava passando por cima do título.
    */
    <div ref={ref} className="absolute inset-x-0 top-0 z-40 px-6 pt-5 will-change-[transform,opacity] sm:px-10 sm:pt-9">
      {children}
    </div>
  );
}
