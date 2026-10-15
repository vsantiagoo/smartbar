"use client";
import { ArrowUpRight } from "lucide-react";
import { useI18n } from "@/lib/i18n/client";
import type { MouseEvent, ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Leva ao topo da página de onde quer que a pessoa esteja.
 *
 * O `href` existe para teclado e para quando o JS não carrega, mas o clique é
 * tratado à mão: se o endereço já estiver em `#inicio` — e ele fica, depois da
 * primeira volta pelo menu — o navegador ignora a âncora repetida e o controle
 * não faria nada.
 */
function subir(e: MouseEvent<HTMLAnchorElement>) {
  e.preventDefault();
  const behavior = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth";
  const hero = document.getElementById("inicio");
  if (hero) hero.scrollIntoView({ behavior, block: "start" });
  else window.scrollTo({ top: 0, behavior });
}

/**
 * Seta discreta no canto inferior direito da seção. Só um traço — sem caixa,
 * sem fundo. Fica fora do hero (lá já se está no topo) e do rodapé, que tem o
 * mesmo destino escrito por extenso.
 *
 * `tone="light"` para as seções azul-marinho, onde o traço escuro sumiria.
 */
export function BackToTop({ tone = "dark" }: { tone?: "dark" | "light" }) {
  const { t } = useI18n();
  return (
    <a
      href="#inicio"
      onClick={subir}
      aria-label={t("site.finalCta.backToTop")}
      className={cn(
        "absolute bottom-6 right-6 z-10 transition duration-200 hover:-translate-y-0.5 hover:translate-x-0.5 sm:bottom-8 sm:right-10",
        tone === "light" ? "text-white/60 hover:text-white" : "text-ink-soft hover:text-ink",
      )}
    >
      <ArrowUpRight className="size-[17px]" aria-hidden />
    </a>
  );
}

/** O mesmo destino em botão escrito por extenso, para o rodapé. */
export function BackToTopButton({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <a href="#inicio" onClick={subir} className={className}>
      {children}
    </a>
  );
}
