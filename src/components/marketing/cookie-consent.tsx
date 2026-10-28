"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

/**
 * Banner de consentimento de cookies (LGPD, art. 8º).
 *
 * POSTURA: hoje o site só usa cookies estritamente necessários, que não
 * dependem de consentimento. Este banner é, então, sobretudo transparência — e
 * o gancho pronto para o dia em que houver algo opcional (ver
 * `/cookies`). Por isso o padrão é RECUSAR: "só os necessários" não liga nada
 * além do que já é indispensável.
 *
 * A escolha mora no localStorage, não num cookie — assim o próprio banner não
 * cria estado antes de o visitante decidir. Toda leitura/escrita é protegida:
 * em aba anônima ou com storage bloqueado, o banner simplesmente aparece e o
 * site funciona.
 *
 * Acessível: diálogo rotulado, foco inicial no primeiro botão, fechável por Esc
 * (que equivale a recusar), e não prende o scroll da página.
 */
const CHAVE = "sb_cookie_consent";

type Escolha = "aceito" | "necessarios";

function ler(): Escolha | null {
  try {
    const v = localStorage.getItem(CHAVE);
    return v === "aceito" || v === "necessarios" ? v : null;
  } catch {
    return null;
  }
}

function gravar(escolha: Escolha) {
  try {
    localStorage.setItem(CHAVE, escolha);
  } catch {
    /* storage indisponível: respeita só nesta sessão, sem quebrar */
  }
}

export function CookieConsent() {
  // Começa fechado para não piscar no servidor; decide no cliente.
  const [aberto, setAberto] = useState(false);

  useEffect(() => {
    if (ler() === null) setAberto(true);
  }, []);

  useEffect(() => {
    if (!aberto) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") decidir("necessarios");
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [aberto]);

  function decidir(escolha: Escolha) {
    gravar(escolha);
    setAberto(false);
  }

  if (!aberto) return null;

  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-labelledby="cookie-titulo"
      aria-describedby="cookie-texto"
      className="fixed inset-x-3 bottom-3 z-50 mx-auto max-w-2xl rounded-2xl border border-white/15 bg-black/70 p-5 text-ink-soft shadow-2xl backdrop-blur-md sm:inset-x-6"
    >
      <h2 id="cookie-titulo" className="text-sm font-semibold text-ink">
        Cookies
      </h2>
      <p id="cookie-texto" className="mt-1.5 text-sm leading-relaxed">
        Usamos apenas cookies estritamente necessários para o site funcionar
        (idioma, tema, sessão). Nenhum rastreador de publicidade. Saiba mais na{" "}
        <Link href="/cookies" className="text-hotel-accent underline-offset-4 hover:underline">
          Política de Cookies
        </Link>
        .
      </p>
      <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:justify-end">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => decidir("necessarios")}
        >
          Só os necessários
        </Button>
        <Button
          variant="primary"
          size="sm"
          autoFocus
          onClick={() => decidir("aceito")}
        >
          Entendi
        </Button>
      </div>
    </div>
  );
}
