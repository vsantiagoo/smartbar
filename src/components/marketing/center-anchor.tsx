"use client";
import { useEffect } from "react";

/**
 * Faz o link do menu parar com a seção CENTRADA na tela, em vez de colada no
 * topo. Mede a sobra (altura da janela − altura da seção) e joga metade dela
 * em `scroll-margin-top`, que é onde o navegador para ao seguir a âncora.
 *
 * Seção maior que a janela: a sobra é negativa, a margem vira zero e o
 * comportamento volta a ser o normal — para no topo.
 *
 * Não desenha nada.
 */
export function CenterAnchor({ target }: { target: string }) {
  useEffect(() => {
    const el = document.getElementById(target);
    if (!el) return;

    const apply = () => {
      const sobra = window.innerHeight - el.offsetHeight;
      el.style.scrollMarginTop = `${Math.max(0, Math.round(sobra / 2))}px`;
    };
    apply();

    const ro = new ResizeObserver(apply);
    ro.observe(el);
    window.addEventListener("resize", apply);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", apply);
      el.style.scrollMarginTop = "";
    };
  }, [target]);

  return null;
}
