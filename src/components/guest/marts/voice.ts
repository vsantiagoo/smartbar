/**
 * VOZ DA MARTS — Web Speech API do navegador (`speechSynthesis`).
 *
 * Decisão de propósito: nenhum provedor pago (ElevenLabs, Azure, OpenAI TTS)
 * entra aqui. A API nativa não precisa de chave, não tem custo por caractere e
 * já funciona hoje — e por isso é o que entrega "Marts tem voz" sem depender
 * de uma credencial que só o dono do produto pode fornecer. Trocar pelo
 * provedor pago é um passo isolado e documentado (ver README do componente).
 *
 * Três cuidados que esta API exige e que, ignorados, quebram em produção:
 *
 *   1. `getVoices()` às vezes devolve `[]` na primeira chamada — a lista
 *      carrega depois, de forma assíncrona (evento `voiceschanged`).
 *   2. iOS/Safari só aceita `speak()` chamado SINCRONAMENTE dentro do mesmo
 *      gesto do usuário (clique) — por isso nenhuma função aqui é `async`
 *      antes de chamar `speak`.
 *   3. Utterance anterior ainda falando quando uma nova começa gera fala
 *      sobreposta — `cancel()` sempre antes de `speak()`.
 */

type Idioma = "pt" | "en" | "es";

const BCP47: Record<Idioma, string> = { pt: "pt-BR", en: "en-US", es: "es-ES" };

/** true só quando a API existe de verdade (SSR e navegadores antigos não têm). */
export function vozDisponivel(): boolean {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

let vozesCache: SpeechSynthesisVoice[] = [];
let vozesPedidas = false;

function carregarVozes() {
  if (!vozDisponivel()) return;
  vozesCache = window.speechSynthesis.getVoices();
  if (!vozesPedidas) {
    vozesPedidas = true;
    window.speechSynthesis.addEventListener("voiceschanged", () => {
      vozesCache = window.speechSynthesis.getVoices();
    });
  }
}

/**
 * A Marts é mulher — não é um detalhe de gosto, é o que foi pedido. A Web
 * Speech API não expõe gênero (`SpeechSynthesisVoice` não tem esse campo em
 * navegador nenhum), só o nome. Por isso a escolha é por NOME conhecido: uma
 * lista de vozes femininas comuns nos três grandes motores (Microsoft/Edge,
 * Google/Chrome, Apple/Safari) por idioma, e um filtro reverso (nomes
 * tipicamente masculinos) para o caso de a lista não cobrir a voz do
 * aparelho — melhor arriscar errar por falta de voz nenhuma marcada do que
 * arriscar escalar logo de cara um "Daniel" ou um "Ricardo".
 */
const NOMES_FEMININOS: Record<Idioma, string[]> = {
  pt: ["maria", "francisca", "luciana", "camila", "thalita", "yara", "fernanda", "raquel"],
  en: ["samantha", "zira", "aria", "jenny", "susan", "karen", "victoria", "female"],
  es: ["monica", "mónica", "paulina", "helena", "elvira", "lucia", "lucía", "female"],
};
const NOMES_MASCULINOS = ["daniel", "ricardo", "jorge", "diego", "carlos", "david", "mark", "guy", "male", "fred", "antonio", "pedro"];

/** Minúsculas e sem acento — usado aqui e no casamento de palavras-chave do roteiro. */
export function normalizar(s: string): string {
  return s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
}

function escolherVoz(idioma: Idioma): SpeechSynthesisVoice | null {
  carregarVozes();
  const alvo = BCP47[idioma];
  const doIdioma = vozesCache.filter((v) => v.lang === alvo || v.lang.toLowerCase().startsWith(idioma));
  if (doIdioma.length === 0) return null;

  const femininas = NOMES_FEMININOS[idioma];
  const porNome = doIdioma.find((v) => femininas.some((nome) => normalizar(v.name).includes(nome)));
  if (porNome) return porNome;

  // Nenhum nome conhecido bateu: evita pegar uma voz com nome tipicamente
  // masculino por acaso (primeira da lista, ordem do navegador).
  const semMasculinas = doIdioma.filter((v) => !NOMES_MASCULINOS.some((nome) => normalizar(v.name).includes(nome)));
  return semMasculinas[0] ?? doIdioma[0] ?? null;
}

export interface FalarOpcoes {
  idioma: Idioma;
  onStart?: () => void;
  onEnd?: () => void;
}

/**
 * Fala um texto. Chame diretamente dentro de um handler de clique — nunca
 * depois de um `await`, para o iOS aceitar sem bloquear por política de
 * autoplay. Se a API não existir, `onStart`/`onEnd` disparam na mesma hora
 * (ver `falarOuSimular` para a orbe continuar "falando" visualmente mesmo
 * sem áudio).
 */
export function falar(texto: string, { idioma, onStart, onEnd }: FalarOpcoes): void {
  if (!vozDisponivel()) return;
  const synth = window.speechSynthesis;
  synth.cancel(); // nunca sobrepõe fala

  const u = new SpeechSynthesisUtterance(texto);
  u.lang = BCP47[idioma];
  const voz = escolherVoz(idioma);
  if (voz) u.voice = voz;
  // Suave e humanizada: quase no natural do motor, só um toque de calor —
  // nada de acelerar ou agudizar, que é o que faz voz sintética soar
  // apressada ou cartunesca.
  u.rate = 1.0;
  u.pitch = 1.04;
  u.volume = 1;
  u.onstart = () => onStart?.();
  u.onend = () => onEnd?.();
  u.onerror = () => onEnd?.(); // falha de voz não deve travar a orbe "falando" para sempre
  synth.speak(u);
}

export function pararFala(): void {
  if (vozDisponivel()) window.speechSynthesis.cancel();
}

/**
 * Duração estimada de leitura, para o modo sem áudio (API ausente, ou
 * silenciada pelo hóspede) continuar sincronizando a orbe com o texto — a
 * Marts "fala" visualmente mesmo quando a voz está desligada.
 */
export function duracaoEstimadaMs(texto: string): number {
  const palavras = texto.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(900, Math.round((palavras / 2.6) * 1000)); // ~156 palavras/min, voz animada
}
