"use client";
import { useEffect, useRef } from "react";
import { useGuest } from "@/components/guest/guest-context";
import { useMarts } from "@/components/guest/marts/marts-context";
import { iniciarEscuta } from "@/components/guest/marts/listen";

/**
 * Liga/desliga o microfone conforme `escutaLigada` (o toggle no painel da
 * Marts). Sem UI própria — só o efeito. Separado do resto porque é o único
 * pedaço da Marts que precisa de permissão sensível do navegador, e isolar
 * isso facilita auditar "onde exatamente o microfone é pedido".
 *
 * Ao ouvir "Olá, Marts", chama `ativarPorVoz()` — mesma abertura do clique,
 * só que o painel sabe a origem e cumprimenta com a frase da palavra de
 * despertar (ver `assistant-sheet.tsx`).
 */
export function MartsListener() {
  const { lang } = useGuest();
  const { escutaLigada, ativarPorVoz, desligarEscuta } = useMarts();
  const ativarPorVozRef = useRef(ativarPorVoz);
  ativarPorVozRef.current = ativarPorVoz;
  const desligarEscutaRef = useRef(desligarEscuta);
  desligarEscutaRef.current = desligarEscuta;

  useEffect(() => {
    if (!escutaLigada) return;
    const alca = iniciarEscuta(
      lang,
      () => ativarPorVozRef.current(),
      () => desligarEscutaRef.current(), // permissão negada: desliga o toggle, não insiste
    );
    return () => alca?.parar();
  }, [escutaLigada, lang]);

  return null;
}
