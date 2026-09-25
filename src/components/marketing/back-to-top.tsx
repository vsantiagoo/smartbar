"use client";
import { ArrowUpRight } from "lucide-react";
import type { MouseEvent } from "react";
import { cn } from "@/lib/utils";

/**
 * Seta discreta no canto inferior direito da seção: leva de volta ao topo da
 * página de onde quer que a pessoa esteja. Só um traço — sem caixa, sem fundo.
 *
 * Fica fora do hero (lá já se está no topo) e do rodapé, que tem o botão
 * "Voltar ao início" escrito por extenso.
 *
 * O `href` existe para teclado e para quando o JS não carrega, mas o clique é
 * tratado à mão: se o endereço já estiver em `#inicio` — e ele fica, depois da
 * primeira volta — o navegador ignora a âncora e a seta não faria nada.
 *
 * `tone="light"` para as seções azul-marinho, onde o traço escuro sumiria.
 */
export function BackToTop({ tone = "dark" }: { tone?: "dark" | "light" }) {
  const subir = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const behavior = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth";
    const hero = document.getElementById("inicio");
    if (hero) hero.scrollIntoView({ behavior, block: "start" });
    else window.scrollTo({ top: 0, behavior });
  };

  return (
    <a
      href="#inicio"
      onClick={subir}
      aria-label="Voltar ao início"
      className={cn(
        "absolute bottom-6 right-6 z-10 transition duration-200 hover:-translate-y-0.5 hover:translate-x-0.5 sm:bottom-8 sm:right-10",
        tone === "light" ? "text-white/60 hover:text-white" : "text-ink-soft hover:text-ink",
      )}
    >
      <ArrowUpRight className="size-[17px]" aria-hidden />
    </a>
  );
}
