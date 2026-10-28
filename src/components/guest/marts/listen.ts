/**
 * ESCUTA DA MARTS — "Olá, Marts!" abre o painel pela voz.
 *
 * Web Speech API (`SpeechRecognition` / `webkitSpeechRecognition`) — mesmo
 * raciocínio da fala em `voice.ts`: nativa do navegador, sem chave, sem
 * custo. Só existe hoje em navegadores Chromium (Chrome, Edge); Safari e
 * Firefox não têm suporte confiável — `escutaDisponivel()` cobre isso, e o
 * toggle que liga a escuta simplesmente não aparece nesses navegadores.
 *
 * PRIVACIDADE, sem meio-termo: ligar isto pede a permissão de microfone do
 * PRÓPRIO NAVEGADOR (o hóspede vê o prompt do sistema, não algo nosso) e,
 * nos navegadores que suportam a API hoje, o áudio captado é processado nos
 * servidores do fabricante do navegador para virar texto — não existe jeito
 * de evitar isso usando esta API gratuita e nativa. Por isso a escuta:
 *   - começa SEMPRE desligada;
 *   - só liga com um toque explícito do hóspede (toggle no painel);
 *   - nunca grava nem envia nada para o nosso servidor — o reconhecimento
 *     é só do navegador para o navegador, e só o texto reconhecido localmente
 *     é olhado (comparado com a palavra de despertar), nunca guardado.
 */

import { normalizar } from "@/components/guest/marts/voice";

type Idioma = "pt" | "en" | "es";
const BCP47: Record<Idioma, string> = { pt: "pt-BR", en: "en-US", es: "es-ES" };

/** Variações aceitas da palavra de despertar, por idioma (comparação já normalizada). */
const PALAVRA_DESPERTAR: Record<Idioma, string[]> = {
  pt: ["ola marts", "oi marts", "ola, marts"],
  en: ["hello marts", "hi marts"],
  es: ["hola marts"],
};

/* Tipos mínimos para a API — não depende do lib.dom (cobertura inconsistente
   entre versões de TypeScript) nem de `any`. Só o que este módulo usa. */
interface ResultadoEscuta {
  length: number;
  [indice: number]: { transcript: string } | undefined;
}
interface EventoResultado {
  resultIndex: number;
  results: { length: number; [indice: number]: ResultadoEscuta | undefined };
}
interface EventoErro {
  error: string;
}
interface MotorEscuta extends EventTarget {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  start: () => void;
  stop: () => void;
  onresult: ((e: EventoResultado) => void) | null;
  onerror: ((e: EventoErro) => void) | null;
  onend: (() => void) | null;
}
type MotorEscutaCtor = new () => MotorEscuta;

function obterConstrutor(): MotorEscutaCtor | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as { SpeechRecognition?: MotorEscutaCtor; webkitSpeechRecognition?: MotorEscutaCtor };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

/** true só em navegadores que de fato oferecem a API (hoje: Chrome/Edge). */
export function escutaDisponivel(): boolean {
  return obterConstrutor() !== null;
}

export interface AlcaEscuta {
  /** Encerra de vez — não tenta mais reiniciar sozinha. */
  parar: () => void;
  /** Pausa sem desistir — usado enquanto a Marts está falando (ver por quê, abaixo). */
  pausar: () => void;
  /** Volta a escutar depois de uma pausa. */
  retomar: () => void;
}

/**
 * Começa a escutar em segundo plano. Dispara `onPalavraDespertar` quando
 * reconhece "Olá, Marts" (ou variação aceita) no idioma pedido.
 *
 * Fica ligada o tempo todo enquanto durar — o navegador encerra o
 * reconhecimento sozinho depois de um tempo de silêncio, e aqui ele é
 * reiniciado automaticamente (`onend` → `start()` de novo), até alguém
 * chamar `parar()`. Se a permissão for negada, desiste sem insistir.
 *
 * `pausar()`/`retomar()` existem por um motivo concreto: sem eles, o
 * microfone continuaria ligado enquanto a PRÓPRIA Marts fala — no aparelho
 * sem fone, o alto-falante vaza para o microfone, e a voz dela vira "fala"
 * reconhecida pelo motor. Quem chama isto (`marts-listener.tsx`) pausa
 * exatamente na janela em que `speaking` está ligado.
 */
export function iniciarEscuta(idioma: Idioma, onPalavraDespertar: () => void, onErro?: (motivo: string) => void): AlcaEscuta | null {
  const Ctor = obterConstrutor();
  if (!Ctor) return null;

  let ativo = true;
  let pausado = false;
  const rec = new Ctor();
  rec.lang = BCP47[idioma];
  rec.continuous = true;
  rec.interimResults = true;

  const palavras = PALAVRA_DESPERTAR[idioma];
  rec.onresult = (e) => {
    for (let i = e.resultIndex; i < e.results.length; i++) {
      const alternativa = e.results[i]?.[0];
      if (!alternativa) continue;
      const texto = normalizar(alternativa.transcript);
      if (palavras.some((p) => texto.includes(p))) {
        onPalavraDespertar();
        return;
      }
    }
  };
  rec.onerror = (e) => {
    // Permissão negada ou bloqueada pelo navegador: desiste, não insiste.
    // "no-speech"/"aborted"/erro de rede são passageiros — o onend reinicia.
    if (e.error === "not-allowed" || e.error === "service-not-allowed") {
      ativo = false;
      onErro?.(e.error);
    }
  };
  rec.onend = () => {
    if (!ativo || pausado) return;
    try {
      rec.start();
    } catch {
      /* já pode estar rodando (corrida entre onend e um start manual) — ignora */
    }
  };

  try {
    rec.start();
  } catch {
    return null;
  }

  return {
    parar: () => {
      ativo = false;
      try {
        rec.stop();
      } catch {
        /* ignora */
      }
    },
    pausar: () => {
      pausado = true;
      try {
        rec.stop();
      } catch {
        /* ignora */
      }
    },
    retomar: () => {
      pausado = false;
      if (!ativo) return;
      try {
        rec.start();
      } catch {
        /* ignora — pode já estar rodando */
      }
    },
  };
}
