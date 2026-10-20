"use client";

/**
 * MOTOR DE REVELAÇÃO — o bloco não "aparece", ele é revelado pelo scroll.
 *
 * A diferença é a razão de o scroll anterior parecer genérico: ele era um
 * GATILHO. O bloco cruzava 12% da tela, uma transição de 0,9s disparava e o
 * observador se desligava. O movimento não tinha relação nenhuma com o dedo de
 * quem rolava — rolasse devagar ou aos trancos, a animação era sempre a mesma.
 *
 * Aqui o progresso é uma FUNÇÃO da posição do bloco na tela, recalculada a cada
 * quadro. Rolar devagar revela devagar; parar no meio deixa o bloco no meio do
 * caminho; voltar desfaz. O movimento passa a ser a continuação do gesto.
 *
 * UM LAÇO PARA TODOS. São mais de trinta blocos na landing; um `rAF` por bloco
 * seria trinta laços concorrentes. Aqui há um só, e ele percorre apenas os
 * blocos que o IntersectionObserver marcou como PERTO da tela — o resto nem é
 * medido.
 *
 * Nada disso re-renderiza o React: o laço escreve direto no `style`.
 */

/** Peso editorial — ver a tabela de faixas em `FAIXAS`. */
export type RevealWeight = "lead" | "body" | "aside";

interface Faixa {
  /** Onde a revelação começa e termina, em fração da altura da tela. */
  de: number;
  ate: number;
  /** Quanto o bloco sobe, em px. */
  sobe: number;
  /** Escala inicial — só o apoio encolhe, e de leve. */
  escala: number;
}

/*
  NEM TUDO SE MOVE IGUAL — é disto que vem a sensação editorial.

  O título é a âncora: move pouco e assenta cedo, para o olho ter onde pousar
  enquanto o resto ainda chega. O corpo acompanha. O apoio (cards, números,
  ilustrações) vem de mais longe e mais devagar, e é o único que encolhe — a
  diferença de distância é o que cria profundidade entre as camadas.

  Mover tudo com a mesma distância e a mesma curva é exatamente o que faz uma
  página parecer montada por um gerador: a hierarquia visual existe, mas o
  movimento a ignora.
*/
const FAIXAS: Record<RevealWeight, Faixa> = {
  lead: { de: 0.94, ate: 0.74, sobe: 14, escala: 1 },
  body: { de: 0.96, ate: 0.68, sobe: 26, escala: 1 },
  aside: { de: 0.98, ate: 0.6, sobe: 40, escala: 0.985 },
};

interface Inscrito {
  el: HTMLElement;
  faixa: Faixa;
  /** Defasagem da cascata, em fração da faixa (não em tempo). */
  atraso: number;
  perto: boolean;
  /** Progresso suavizado, 0–1. */
  p: number;
}

const inscritos = new Set<Inscrito>();
const porElemento = new WeakMap<HTMLElement, Inscrito>();

let io: IntersectionObserver | null = null;
let raf = 0;
let ultimo = 0;
let reduzido = false;

/** Curva de saída: rápido no começo, assentando no fim. A mesma do `.lift`. */
const suavizar = (t: number) => 1 - Math.pow(1 - t, 3);

function pintar(i: Inscrito, alvo: number, dt: number) {
  // Amortecimento independente da taxa de quadros — o mesmo de useSmoothScroll.
  const k = 1 - Math.pow(1 - 0.18, dt / 16.667);
  i.p += (alvo - i.p) * k;
  if (Math.abs(alvo - i.p) < 0.001) i.p = alvo;

  const t = suavizar(i.p);
  const { sobe, escala } = i.faixa;
  const y = (1 - t) * sobe;
  const s = escala + (1 - escala) * t;

  i.el.style.opacity = t.toFixed(3);
  i.el.style.transform = s === 1 ? `translate3d(0,${y.toFixed(2)}px,0)` : `translate3d(0,${y.toFixed(2)}px,0) scale(${s.toFixed(4)})`;
}

function quadro(agora: number) {
  const dt = ultimo ? Math.min(64, agora - ultimo) : 16.667;
  ultimo = agora;
  const vh = window.innerHeight || 1;
  let vivos = 0;

  for (const i of inscritos) {
    if (!i.perto) continue;
    vivos++;
    const topo = i.el.getBoundingClientRect().top;
    const { de, ate } = i.faixa;
    /*
      A cascata desloca a FAIXA, não o tempo: o segundo card revela um pouco
      mais tarde no percurso, e não um pouco depois no relógio. Assim a
      defasagem continua colada ao scroll mesmo se a pessoa voltar.

      O sinal é MENOS, e isso é contraintuitivo: fração maior significa mais
      perto da borda de baixo, então somar o atraso adiantaria a revelação.
      Subtrair empurra a faixa para cima — o bloco precisa subir mais para
      começar a aparecer, que é o que "atrasar" quer dizer aqui.
    */
    const inicio = vh * (de - i.atraso);
    const fim = vh * (ate - i.atraso);
    const bruto = (inicio - topo) / Math.max(1, inicio - fim);
    pintar(i, Math.min(1, Math.max(0, bruto)), dt);
  }

  raf = vivos ? requestAnimationFrame(quadro) : 0;
}

function acordar() {
  if (raf || reduzido) return;
  ultimo = 0;
  raf = requestAnimationFrame(quadro);
}

function garantirObservador() {
  if (io) return io;
  io = new IntersectionObserver(
    (entradas) => {
      for (const e of entradas) {
        const i = porElemento.get(e.target as HTMLElement);
        if (i) i.perto = e.isIntersecting;
      }
      acordar();
    },
    // Margem generosa: o bloco entra na conta antes de aparecer, para já chegar
    // com o progresso certo em vez de pular do zero.
    { rootMargin: "120% 0px 40% 0px" },
  );
  return io;
}

/** Entrega o bloco pronto e tira a mão: usado por toda saída de emergência. */
function entregar(el: HTMLElement) {
  el.style.opacity = "1";
  el.style.transform = "none";
  el.style.willChange = "auto";
}

/**
 * Inscreve um bloco. Devolve a função de baixa — chame-a ao desmontar.
 *
 * FALHA PARA VISÍVEL, e isso não é detalhe. Um bloco que só aparece quando o
 * laço roda é uma aposta: `requestAnimationFrame` não dispara em aba de fundo,
 * e navegadores o suspendem sob economia de bateria. Numa primeira versão disto
 * a página inteira ficava invisível nessas condições — o efeito funcionava e o
 * site sumia. Três defesas:
 *
 *   1. O CSS base deixa `.reveal` visível. Sem JS, o conteúdo está lá.
 *   2. Só escurece quem está ABAIXO da dobra. O que já aparece no carregamento
 *      nunca é escondido para depois ser revelado.
 *   3. Um cão de guarda: se em meio segundo o laço não tiver pintado nada, o
 *      bloco é entregue pronto e a inscrição é descartada.
 *
 * Com "reduzir movimento" não há laço nenhum: o bloco nasce visível e parado.
 */
export function inscrever(el: HTMLElement, peso: RevealWeight, atrasoMs: number): () => void {
  reduzido = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduzido) {
    entregar(el);
    return () => {};
  }

  // Já visível no carregamento? Então não é um bloco a revelar — é conteúdo.
  const vh = window.innerHeight || 1;
  if (el.getBoundingClientRect().top < vh * FAIXAS[peso].ate) {
    entregar(el);
    return () => {};
  }

  const i: Inscrito = {
    el,
    faixa: FAIXAS[peso],
    // 90ms era o passo da cascata antiga; em faixa, cada passo vale 0.045 da tela.
    atraso: (atrasoMs / 90) * 0.045,
    perto: false,
    p: 0,
  };
  inscritos.add(i);
  porElemento.set(el, i);
  garantirObservador().observe(el);

  el.style.opacity = "0";
  el.style.willChange = "opacity, transform";
  acordar();

  const cao = window.setTimeout(() => {
    if (i.p > 0 || !inscritos.has(i)) return;
    entregar(el);
    io?.unobserve(el);
    inscritos.delete(i);
    porElemento.delete(el);
  }, 500);

  return () => {
    window.clearTimeout(cao);
    io?.unobserve(el);
    inscritos.delete(i);
    porElemento.delete(el);
  };
}
