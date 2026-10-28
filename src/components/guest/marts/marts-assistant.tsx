"use client";
import { useGuest } from "@/components/guest/guest-context";
import { AssistantSheet } from "@/components/guest/sections/assistant-sheet";
import { useMarts } from "@/components/guest/marts/marts-context";
import { MartsOrb } from "@/components/ui/marts-orb";

/**
 * Monta-se UMA vez no layout do hóspede (irmã do `GuestHeader`, dentro do
 * mesmo `GuestProvider`+`MartsProvider`) — é o que faz a Marts "acompanhar o
 * scroll": o botão é `position: fixed`, então continua no lugar em qualquer
 * posição de rolagem, em qualquer página da vitrine (catálogo, checkout,
 * consumo, recibo), porque o layout que a contém não desmonta ao navegar
 * entre essas rotas.
 *
 * Só aparece depois que o hóspede conhece a Marts pela primeira vez — pelo
 * ícone do cabeçalho (ver `guest-header.tsx`) — e some enquanto o painel dela
 * está aberto, para não duplicar o mesmo convite na tela.
 */
export function MartsAssistant() {
  const { t } = useGuest();
  const { ativa, open, ativarEAbrir, speaking } = useMarts();

  return (
    <>
      {ativa && !open && (
        <button
          onClick={ativarEAbrir}
          aria-label={t("guest.marts.float.label")}
          className="fixed bottom-[5.5rem] right-[max(1rem,env(safe-area-inset-right))] z-40 print:hidden"
        >
          <MartsOrb size={56} speaking={speaking} />
        </button>
      )}
      <AssistantSheet />
    </>
  );
}
