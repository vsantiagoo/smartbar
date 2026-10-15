"use client";
import { Moon, Sun } from "lucide-react";
import { useState } from "react";
import { APPEARANCE_COOKIE } from "@/lib/appearance";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

/**
 * Botão claro/escuro: pílula de vidro com um knob que desliza entre o sol
 * (claro, glow quente) e a meia-lua (escuro, glow frio).
 *
 * NÃO conhece a tela onde está. Ao ser clicado ele sobe no DOM até o ancestral
 * marcado com `data-theme-root` e aplica `data-theme` ali — assim o mesmo botão
 * serve à vitrine do hóspede e ao site público sem props de acoplamento, e cada
 * casca decide até onde o modo escuro alcança. A escolha vai para o cookie para
 * a próxima renderização não piscar.
 *
 * `size="sm"` é a versão do cabeçalho do site, onde ele divide a borda com o
 * seletor de idioma e não pode roubar a largura da barra de menus.
 */
export function ThemeToggle({
  initialDark,
  size = "md",
  className,
}: {
  initialDark: boolean;
  size?: "sm" | "md";
  className?: string;
}) {
  const { t } = useI18n();
  const [dark, setDark] = useState(initialDark);

  const toggle = (e: React.MouseEvent<HTMLButtonElement>) => {
    const next = !dark;
    setDark(next);
    const root = e.currentTarget.closest<HTMLElement>("[data-theme-root]");
    if (root) {
      if (next) root.setAttribute("data-theme", "dark");
      else root.removeAttribute("data-theme");
    }
    document.cookie = `${APPEARANCE_COOKIE}=${next ? "dark" : "light"};path=/;max-age=31536000;samesite=lax`;
  };

  const pequeno = size === "sm";

  return (
    <button
      type="button"
      role="switch"
      aria-checked={dark}
      aria-label={t("common.theme")}
      onClick={toggle}
      className={cn(
        "glass-dark glass-liquid relative grid shrink-0 grid-cols-2 items-center rounded-full active:scale-95",
        pequeno
          ? "h-8 w-[42px] px-0.5 sm:h-9 sm:w-[50px] sm:px-1"
          : "h-9 w-[46px] px-0.5 min-[360px]:h-10 min-[360px]:w-14 min-[360px]:px-1 sm:h-11 sm:w-16",
        className,
      )}
    >
      {/* Ícones fixos nas pontas (o knob cobre o lado ativo). */}
      <Sun
        className={cn("justify-self-center text-amber-300/70", pequeno ? "size-3" : "size-4")}
        strokeWidth={2}
      />
      <Moon
        className={cn("justify-self-center text-sky-200/70", pequeno ? "size-3" : "size-4")}
        strokeWidth={2}
      />

      {/* Knob deslizante com glow. */}
      <span className={cn("theme-knob", pequeno && "is-sm", dark && "is-dark")}>
        {dark ? (
          <Moon className={pequeno ? "size-3.5" : "size-[18px]"} strokeWidth={2.2} />
        ) : (
          <Sun className={pequeno ? "size-3.5" : "size-[18px]"} strokeWidth={2.2} />
        )}
      </span>
    </button>
  );
}
