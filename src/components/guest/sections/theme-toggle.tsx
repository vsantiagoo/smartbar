"use client";
import { Moon, Sun } from "lucide-react";
import { useState } from "react";
import { APPEARANCE_COOKIE } from "@/lib/appearance";
import { cn } from "@/lib/utils";

/**
 * Botão claro/escuro: pílula de vidro com um knob que desliza entre o sol (claro,
 * glow quente) e a meia-lua (escuro, glow frio). Alterna `data-theme` no elemento
 * `rootId` — o modo escuro fica escopado à casca (o app do hóspede ou a tela de
 * login) — e grava a escolha no cookie para a próxima renderização não piscar.
 * O cookie é o mesmo nas duas telas, então a preferência acompanha o usuário.
 */
export function ThemeToggle({
  initialDark,
  label,
  rootId = "guest-root",
}: {
  initialDark: boolean;
  /** aria-label traduzido — vem do chamador, que já está dentro do seu provider. */
  label: string;
  rootId?: string;
}) {
  const [dark, setDark] = useState(initialDark);

  const toggle = () => {
    const next = !dark;
    setDark(next);
    const root = document.getElementById(rootId);
    if (root) {
      if (next) root.setAttribute("data-theme", "dark");
      else root.removeAttribute("data-theme");
    }
    // `secure` só em HTTPS — em http://localhost (dev) derrubaria o cookie.
    const secure = window.location.protocol === "https:" ? ";secure" : "";
    document.cookie = `${APPEARANCE_COOKIE}=${next ? "dark" : "light"};path=/;max-age=31536000;samesite=lax${secure}`;
  };

  return (
    <button
      type="button"
      role="switch"
      aria-checked={dark}
      aria-label={label}
      onClick={toggle}
      className="glass-dark glass-liquid relative grid h-9 w-[46px] shrink-0 grid-cols-2 items-center rounded-full px-0.5 active:scale-95 min-[360px]:h-10 min-[360px]:w-14 min-[360px]:px-1 sm:h-11 sm:w-16"
    >
      {/* Ícones fixos nas pontas (o knob cobre o lado ativo). */}
      <Sun className="size-4 justify-self-center text-amber-300/70" strokeWidth={2} />
      <Moon className="size-4 justify-self-center text-sky-200/70" strokeWidth={2} />

      {/* Knob deslizante com glow. */}
      <span className={cn("theme-knob", dark && "is-dark")}>
        {dark ? <Moon className="size-[18px]" strokeWidth={2.2} /> : <Sun className="size-[18px]" strokeWidth={2.2} />}
      </span>
    </button>
  );
}
