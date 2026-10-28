"use client";
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { useGuest } from "@/components/guest/guest-context";

interface MartsValue {
  /** Já apresentada ao hóspede nesta estadia — governa se o botão flutuante existe. */
  ativa: boolean;
  /** Painel da Marts aberto. */
  open: boolean;
  /** A orbe deve mostrar as partículas de fala agora (áudio tocando ou simulado). */
  speaking: boolean;
  setSpeaking: (v: boolean) => void;
  /** Voz ligada — preferência do aparelho, não do quarto (ver storage abaixo). */
  vozLigada: boolean;
  alternarVoz: () => void;
  /** Ativa a Marts (se ainda não estava) e abre o painel. Chame direto no clique. */
  ativarEAbrir: () => void;
  fechar: () => void;
}

const MartsContext = createContext<MartsValue | null>(null);

const CHAVE_VOZ = "smartbar-marts-voz"; // preferência do APARELHO: fora do escopo por quarto, de propósito

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
  const [speaking, setSpeaking] = useState(false);
  const [vozLigada, setVozLigada] = useState(true);
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

  const value = useMemo<MartsValue>(
    () => ({ ativa, open, speaking, setSpeaking, vozLigada, alternarVoz, ativarEAbrir, fechar }),
    [ativa, open, speaking, vozLigada, alternarVoz, ativarEAbrir, fechar],
  );

  return <MartsContext.Provider value={value}>{children}</MartsContext.Provider>;
}

export function useMarts(): MartsValue {
  const ctx = useContext(MartsContext);
  if (!ctx) throw new Error("useMarts fora do MartsProvider");
  return ctx;
}
