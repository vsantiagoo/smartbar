"use client";
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { useGuest } from "@/components/guest/guest-context";

/** De onde veio a abertura do painel — muda só a saudação (ver assistant-sheet.tsx). */
export type OrigemAbertura = "clique" | "voz";

interface MartsValue {
  /** Já apresentada ao hóspede nesta estadia — governa se o botão flutuante existe. */
  ativa: boolean;
  /** Painel da Marts aberto. */
  open: boolean;
  /** De onde veio a abertura mais recente — lido uma vez pelo painel, depois descartado. */
  origemAbertura: OrigemAbertura;
  /** A orbe deve mostrar as partículas de fala agora (áudio tocando ou simulado). */
  speaking: boolean;
  setSpeaking: (v: boolean) => void;
  /** Voz ligada — preferência do aparelho, não do quarto (ver storage abaixo). */
  vozLigada: boolean;
  alternarVoz: () => void;
  /** Escuta de "Olá, Marts" ligada — também preferência do aparelho. Só existe
      de verdade em navegadores com SpeechRecognition (ver listen.ts). */
  escutaLigada: boolean;
  alternarEscuta: () => void;
  /** Desliga sem alternar — usado quando o navegador nega a permissão, para não correr risco de ligar de volta por engano. */
  desligarEscuta: () => void;
  /** Ativa a Marts (se ainda não estava) e abre o painel. Chame direto no clique. */
  ativarEAbrir: () => void;
  /** Mesma coisa, mas a saudação do painel sabe que veio da palavra de despertar. */
  ativarPorVoz: () => void;
  fechar: () => void;
}

const MartsContext = createContext<MartsValue | null>(null);

const CHAVE_VOZ = "smartbar-marts-voz"; // preferência do APARELHO: fora do escopo por quarto, de propósito
const CHAVE_ESCUTA = "smartbar-marts-escuta";

/**
 * Estado da Marts, compartilhado entre o ícone do cabeçalho, o botão
 * flutuante e o painel — os três são componentes irmãos no layout do
 * hóspede, então precisam de um lugar comum para combinar.
 *
 * `ativa` sobrevive a um F5 (sessionStorage por quarto, como o carrinho):
 * uma vez que o hóspede conheceu a Marts, ela continua flutuando pela
 * estadia inteira, não só enquanto a aba não recarrega.
 */
export function MartsProvider({ children }: { children: ReactNode }) {
  const { room } = useGuest();
  const storageKey = `smartbar-marts:${room.roomId}`;

  const [ativa, setAtiva] = useState(false);
  const [open, setOpen] = useState(false);
  const [origemAbertura, setOrigemAbertura] = useState<OrigemAbertura>("clique");
  const [speaking, setSpeaking] = useState(false);
  const [vozLigada, setVozLigada] = useState(true);
  const [escutaLigada, setEscutaLigada] = useState(false);
  const [pronto, setPronto] = useState(false);

  useEffect(() => {
    try {
      if (sessionStorage.getItem(storageKey) === "1") setAtiva(true);
    } catch {
      /* sem storage: Marts começa inativa, e a primeira abertura resolve */
    }
    try {
      const v = localStorage.getItem(CHAVE_VOZ);
      if (v === "0") setVozLigada(false);
    } catch {
      /* preferência não persiste; segue ligada por padrão */
    }
    try {
      if (localStorage.getItem(CHAVE_ESCUTA) === "1") setEscutaLigada(true);
    } catch {
      /* preferência não persiste; segue desligada por padrão — é o mais seguro */
    }
    setPronto(true);
  }, [storageKey]);

  useEffect(() => {
    if (!pronto || !ativa) return;
    try {
      sessionStorage.setItem(storageKey, "1");
    } catch {
      /* ignora */
    }
  }, [ativa, pronto, storageKey]);

  const ativarEAbrir = useCallback(() => {
    setAtiva(true);
    setOrigemAbertura("clique");
    setOpen(true);
  }, []);

  const ativarPorVoz = useCallback(() => {
    setAtiva(true);
    setOrigemAbertura("voz");
    setOpen(true);
  }, []);

  const fechar = useCallback(() => setOpen(false), []);

  const alternarVoz = useCallback(() => {
    setVozLigada((v) => {
      const novo = !v;
      try {
        localStorage.setItem(CHAVE_VOZ, novo ? "1" : "0");
      } catch {
        /* ignora */
      }
      return novo;
    });
  }, []);

  const alternarEscuta = useCallback(() => {
    setEscutaLigada((v) => {
      const novo = !v;
      try {
        localStorage.setItem(CHAVE_ESCUTA, novo ? "1" : "0");
      } catch {
        /* ignora */
      }
      return novo;
    });
  }, []);

  const desligarEscuta = useCallback(() => {
    setEscutaLigada(false);
    try {
      localStorage.setItem(CHAVE_ESCUTA, "0");
    } catch {
      /* ignora */
    }
  }, []);

  const value = useMemo<MartsValue>(
    () => ({
      ativa,
      open,
      origemAbertura,
      speaking,
      setSpeaking,
      vozLigada,
      alternarVoz,
      escutaLigada,
      alternarEscuta,
      desligarEscuta,
      ativarEAbrir,
      ativarPorVoz,
      fechar,
    }),
    [
      ativa,
      open,
      origemAbertura,
      speaking,
      vozLigada,
      alternarVoz,
      escutaLigada,
      alternarEscuta,
      desligarEscuta,
      ativarEAbrir,
      ativarPorVoz,
      fechar,
    ],
  );

  return <MartsContext.Provider value={value}>{children}</MartsContext.Provider>;
}

export function useMarts(): MartsValue {
  const ctx = useContext(MartsContext);
  if (!ctx) throw new Error("useMarts fora do MartsProvider");
  return ctx;
}
