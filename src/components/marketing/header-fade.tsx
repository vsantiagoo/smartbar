"use client";
import { useRef, type ReactNode } from "react";
import { clamp01, useSmoothScroll } from "@/lib/marketing/use-scroll-progress";

/** A partir de quanto da primeira tela o cabeçalho já sumiu por completo. */
const FADE_OUT_AT = 0.55;

/**
 * Some com o cabeçalho (marca + barra de menus) conforme a página desce, e o
 * traz de volta ao subir. O movimento acompanha o scroll amortecido, igual ao
 * resto da página. Enquanto invisível, ele não recebe clique nem teclado.
 *
 * Depois que ele some, o caminho de volta é o botão "Voltar ao início" no
 * rodapé (`final-cta.tsx`).
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
    <div ref={ref} className="fixed inset-x-0 top-0 z-40 px-4 pt-6 will-change-[transform,opacity] sm:pt-9">
      {children}
    </div>
  );
}
