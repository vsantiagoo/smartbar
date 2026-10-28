"use client";
import { Mic, MicOff, Send, Volume2, VolumeX } from "lucide-react";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { useGuest } from "@/components/guest/guest-context";
import { HelpSheet } from "@/components/guest/sections/help-sheet";
import { useMarts } from "@/components/guest/marts/marts-context";
import { escutaDisponivel } from "@/components/guest/marts/listen";
import { casarPergunta, type TopicoId } from "@/components/guest/marts/roteiro";
import { duracaoEstimadaMs, falar, pararFala, vozDisponivel } from "@/components/guest/marts/voice";
import { MartsOrb } from "@/components/ui/marts-orb";
import { Sheet } from "@/components/ui/sheet";
import type { DictKey } from "@/lib/i18n";

/**
 * SEÇÃO · Painel da Marts — assistente virtual com voz (Web Speech API) e um
 * roteiro curto de perguntas, respondível por botão OU por texto digitado.
 *
 * O QUE É E O QUE NÃO É, sem meio-termo: a Marts fala de verdade (voz do
 * navegador, feminina — ver `voice.ts`) e reage de verdade (a orbe acende
 * exatamente enquanto o áudio toca). O hóspede pode digitar a pergunta dele,
 * não só tocar nos botões — mas o que entende a pergunta é casamento de
 * PALAVRA-CHAVE contra o mesmo roteiro (`roteiro.ts`), não um modelo de
 * linguagem. Pergunta fora do roteiro recebe uma resposta honesta ("essa eu
 * ainda não sei") e o caminho para a recepção — nunca uma resposta inventada.
 * "Preciso de ajuda com meu pedido" entrega para o HelpSheet, que já resolve
 * de verdade (reposição, item danificado, trava).
 */

interface Pergunta {
  id: TopicoId;
  pergunta: DictKey;
  /** Ausente = não fala uma resposta; entrega para o HelpSheet. */
  resposta?: DictKey;
}

const PERGUNTAS: Pergunta[] = [
  { id: "howItWorks", pergunta: "guest.marts.q.howItWorks", resposta: "guest.marts.a.howItWorks" },
  { id: "security", pergunta: "guest.marts.q.security", resposta: "guest.marts.a.security" },
  { id: "help", pergunta: "guest.marts.q.help" },
];

export function AssistantSheet() {
  const { t, lang } = useGuest();
  const { open, fechar, origemAbertura, speaking, setSpeaking, vozLigada, alternarVoz, escutaLigada, alternarEscuta } = useMarts();
  const [mensagem, setMensagem] = useState("");
  const [ajudaOpen, setAjudaOpen] = useState(false);
  const [pergunta, setPergunta] = useState("");
  // Só existe em Chrome/Edge — checado no cliente, depois da montagem, para
  // o servidor e o cliente renderizarem a mesma coisa na primeira pintura.
  const [temEscuta, setTemEscuta] = useState(false);
  useEffect(() => setTemEscuta(escutaDisponivel()), []);
  const simulacaoRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function dizer(texto: string) {
    setMensagem(texto);
    if (simulacaoRef.current) clearTimeout(simulacaoRef.current);
    if (vozLigada && vozDisponivel()) {
      falar(texto, { idioma: lang, onStart: () => setSpeaking(true), onEnd: () => setSpeaking(false) });
    } else {
      // Sem voz (navegador sem suporte, ou o hóspede silenciou): a orbe
      // "fala" pelo tempo que o texto levaria para ser lido — a reação
      // visual não depende do áudio ter tocado.
      setSpeaking(true);
      simulacaoRef.current = setTimeout(() => setSpeaking(false), duracaoEstimadaMs(texto));
    }
  }

  // Saudação ao abrir — a frase muda se veio da palavra de despertar ("Olá,
  // Marts" → "Olá, como posso ajudar?") em vez do convite genérico do clique.
  useEffect(() => {
    if (open) {
      dizer(t(origemAbertura === "voz" ? "guest.marts.wakeGreeting" : "guest.marts.greeting"));
    } else {
      pararFala();
      setSpeaking(false);
      if (simulacaoRef.current) clearTimeout(simulacaoRef.current);
    }
    // Só reage à abertura/fechamento — `dizer` muda a cada render e não deve
    // reiniciar a saudação a cada toque numa pergunta.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // Corta a voz se o componente sair da árvore com o painel ainda aberto.
  useEffect(() => () => pararFala(), []);

  function alternarVozAgora() {
    // Silenciar corta a fala em andamento na hora — não é só uma preferência
    // para a PRÓXIMA frase, é "pare de falar" já.
    if (vozLigada) {
      pararFala();
      if (simulacaoRef.current) clearTimeout(simulacaoRef.current);
      setSpeaking(false);
    }
    alternarVoz();
  }

  /** Vai para a recepção (fecha a Marts, abre o HelpSheet) — usado pelo botão
      "Preciso de ajuda" e por qualquer pergunta digitada que caia nesse tópico. */
  function irParaAjuda() {
    fechar();
    setTimeout(() => setAjudaOpen(true), 180); // mesmo tempo do fade-out do Sheet
  }

  function escolher(p: Pergunta) {
    if (!p.resposta) {
      irParaAjuda();
      return;
    }
    dizer(t(p.resposta));
  }

  const RESPOSTA_POR_TOPICO: Partial<Record<TopicoId, DictKey>> = {
    howItWorks: "guest.marts.a.howItWorks",
    security: "guest.marts.a.security",
  };

  function enviarPergunta(e: FormEvent) {
    e.preventDefault();
    const texto = pergunta.trim();
    if (!texto) return;
    setPergunta("");

    const topico = casarPergunta(texto, lang);
    if (topico === "help") {
      irParaAjuda();
      return;
    }
    const resposta = topico ? RESPOSTA_POR_TOPICO[topico] : undefined;
    dizer(resposta ? t(resposta) : t("guest.marts.fallback"));
  }

  return (
    <>
      <Sheet open={open} onClose={fechar} title={t("guest.marts.title")}>
        <div className="space-y-5 py-2">
          <div className="flex items-start gap-3">
            <MartsOrb size={56} speaking={speaking} />
            <div className="min-w-0 flex-1 pt-1">
              <p className="text-xs font-semibold uppercase tracking-wide text-ink-faint">
                {speaking ? t("guest.marts.status.speaking") : t("guest.marts.status.ready")}
              </p>
              <p className="mt-1 text-sm leading-snug text-ink" role="status" aria-live="polite">
                {mensagem}
              </p>
            </div>
          </div>

          <form onSubmit={enviarPergunta} className="flex items-center gap-2">
            <input
              value={pergunta}
              onChange={(e) => setPergunta(e.target.value)}
              placeholder={t("guest.marts.input.placeholder")}
              maxLength={200}
              className="glass-chip h-11 w-full rounded-full bg-white/55 px-4 text-sm text-ink outline-none focus:border-brand-700"
            />
            <button
              type="submit"
              disabled={!pergunta.trim()}
              aria-label={t("guest.marts.input.send")}
              className="grid size-11 shrink-0 place-items-center rounded-full bg-brand-700/85 text-white transition disabled:opacity-40"
            >
              <Send className="size-4" aria-hidden />
            </button>
          </form>

          <ul className="space-y-2">
            {PERGUNTAS.map((p) => (
              <li key={p.pergunta}>
                <button
                  onClick={() => escolher(p)}
                  className="glass w-full rounded-2xl px-4 py-3 text-left text-sm font-medium text-ink transition hover:bg-white/80 active:scale-[0.99]"
                >
                  {t(p.pergunta)}
                </button>
              </li>
            ))}
          </ul>

          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <button
              onClick={alternarVozAgora}
              className="inline-flex items-center gap-2 rounded-full px-1 py-1 text-xs font-medium text-ink-soft transition hover:text-ink"
            >
              {vozLigada ? <Volume2 className="size-4" aria-hidden /> : <VolumeX className="size-4" aria-hidden />}
              {vozLigada ? t("guest.marts.mute") : t("guest.marts.unmute")}
            </button>

            {/* Só em navegadores com SpeechRecognition (Chrome/Edge) — nos
                demais, o botão simplesmente não existe, em vez de aparecer e
                não funcionar ao tocar. */}
            {temEscuta && (
              <button
                onClick={alternarEscuta}
                className="inline-flex items-center gap-2 rounded-full px-1 py-1 text-xs font-medium text-ink-soft transition hover:text-ink"
              >
                {escutaLigada ? <Mic className="size-4" aria-hidden /> : <MicOff className="size-4" aria-hidden />}
                {escutaLigada ? t("guest.marts.listen.disable") : t("guest.marts.listen.enable")}
              </button>
            )}
          </div>
          {temEscuta && <p className="text-xs leading-snug text-ink-faint">{t("guest.marts.listen.hint")}</p>}
        </div>
      </Sheet>

      <HelpSheet open={ajudaOpen} onClose={() => setAjudaOpen(false)} />
    </>
  );
}
