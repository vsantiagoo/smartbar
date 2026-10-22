import "server-only";

/**
 * FREIO DE ABUSO para os endpoints públicos.
 *
 * O problema que resolve: `/api/checkout` e `/api/support` aceitam requisições
 * de qualquer um, sem conta e sem sessão — é o preço de o hóspede ser anônimo.
 * Sem freio, um laço simples enche a tabela de transações pendentes ou de
 * chamados, e o custo recai no hotel.
 *
 * JANELA DESLIZANTE, não contador por minuto. Um contador que zera no minuto
 * cheio aceita o dobro do limite na virada: trinta num segundo antes, trinta
 * logo depois. Aqui cada chamada guarda o instante, e o que saiu da janela é
 * descartado — o limite vale para qualquer intervalo de N segundos, não só para
 * os que começam em zero.
 *
 * O QUE ISTO NÃO É. A memória do processo não é compartilhada entre instâncias:
 * em serverless, cada uma tem a sua, e o limite efetivo se multiplica pelo
 * número delas. Isto detém o laço ingênuo e o acidente — não um ataque
 * distribuído. Para isso, o freio precisa ser externo (Upstash Redis, ou o
 * próprio rate limiting da borda da Vercel). Está registrado no Blueprint.
 */

interface Janela {
  /** Instantes das chamadas recentes, em ms. */
  marcas: number[];
}

const baldes = new Map<string, Janela>();

/** Acima disto, faz uma limpeza antes de continuar crescendo. */
const LIMPAR_ACIMA_DE = 5_000;

function limpar(agora: number, janelaMs: number) {
  for (const [chave, j] of baldes) {
    const vivos = j.marcas.filter((t) => agora - t < janelaMs);
    if (vivos.length === 0) baldes.delete(chave);
    else j.marcas = vivos;
  }
}

export interface ResultadoFreio {
  permitido: boolean;
  /** Quantas chamadas ainda cabem na janela. */
  restantes: number;
  /** Segundos até a janela abrir espaço — para o header `Retry-After`. */
  esperarSegundos: number;
}

/**
 * Registra uma chamada e diz se ela passa.
 *
 * `chave` deve identificar quem chama **e** o que chama — o mesmo IP pode ter
 * orçamentos diferentes em endpoints diferentes.
 */
export function freio(chave: string, limite: number, janelaMs: number): ResultadoFreio {
  const agora = Date.now();

  if (baldes.size > LIMPAR_ACIMA_DE) limpar(agora, janelaMs);

  const janela = baldes.get(chave) ?? { marcas: [] };
  janela.marcas = janela.marcas.filter((t) => agora - t < janelaMs);

  if (janela.marcas.length >= limite) {
    baldes.set(chave, janela);
    const maisAntiga = janela.marcas[0]!;
    return {
      permitido: false,
      restantes: 0,
      esperarSegundos: Math.max(1, Math.ceil((janelaMs - (agora - maisAntiga)) / 1000)),
    };
  }

  janela.marcas.push(agora);
  baldes.set(chave, janela);
  return { permitido: true, restantes: limite - janela.marcas.length, esperarSegundos: 0 };
}

/**
 * De onde veio a requisição, para servir de chave.
 *
 * Atrás de proxy (Vercel), `x-forwarded-for` traz a cadeia e o PRIMEIRO item é
 * o cliente. `x-real-ip` é o reserva. Sem nenhum dos dois, todo mundo cai no
 * mesmo balde — o que aperta demais, e por isso o fallback é explícito e
 * reconhecível em log.
 */
export function origem(request: Request): string {
  const encadeado = request.headers.get("x-forwarded-for");
  if (encadeado) return encadeado.split(",")[0]!.trim();
  return request.headers.get("x-real-ip") ?? "sem-ip";
}

/*
  ORÇAMENTOS — e a razão de haver DOIS níveis.

  O erro fácil aqui é chavear tudo por IP. Num hotel, todos os hóspedes saem
  pelo MESMO endereço público: um limite de dez pedidos por minuto por IP
  bloquearia o décimo primeiro hóspede a pedir alguma coisa no mesmo minuto —
  punindo exatamente quem está usando o produto como deve.

  Por isso cada endpoint tem dois freios:

    POR IP     generoso. Só existe para deter laço e flood, e precisa caber um
               hotel inteiro atrás de um NAT.
    POR ALVO   apertado, e chaveado pelo que identifica o uso legítimo — o
               quarto que pede, o pedido que é consultado. É este que impede o
               abuso de verdade, e ele não vaza para o vizinho.
*/
export const ORCAMENTO = {
  /** Um quarto não faz dez pedidos por minuto. Um hotel inteiro, sim. */
  checkout: { porAlvo: 10, porIp: 120, janelaMs: 60_000 },
  /** Chamar a recepção é raro por quarto, comum no prédio todo. */
  suporte: { porAlvo: 5, porIp: 60, janelaMs: 60_000 },
  /**
   * A tela de espera consulta a cada 3s — 20 por minuto por pedido. O teto por
   * pedido dá folga de 3×; o teto por IP precisa caber muitos quartos esperando
   * ao mesmo tempo.
   */
  consulta: { porAlvo: 60, porIp: 600, janelaMs: 60_000 },
  /** Leitores da porta: um por quarto, todos pela rede do hotel. */
  dispositivo: { porAlvo: 30, porIp: 300, janelaMs: 60_000 },
} as const;

type Orcamento = { porAlvo: number; porIp: number; janelaMs: number };

/**
 * Aplica os dois freios de um endpoint: o largo, por IP, e o apertado, por
 * alvo. Devolve `null` quando passa, ou a recusa pronta.
 *
 * Para quando o alvo já é conhecido antes de qualquer trabalho — o token na
 * URL. Quando ele só aparece depois de ler o corpo, use `freioPorIp` e
 * `freioPorAlvo` em dois passos.
 */
export function aplicarFreio(
  nome: string,
  orcamento: Orcamento,
  request: Request,
  alvo: string,
): Response | null {
  return freioPorIp(nome, orcamento, request) ?? freioPorAlvo(nome, orcamento, alvo);
}

/**
 * Só o nível largo, por IP. Vem ANTES de ler o corpo da requisição: é o que
 * detém flood sem gastar trabalho com ele.
 */
export function freioPorIp(nome: string, orcamento: Orcamento, request: Request): Response | null {
  const r = freio(`${nome}:ip:${origem(request)}`, orcamento.porIp, orcamento.janelaMs);
  return r.permitido ? null : respostaFreada(r);
}

/**
 * Só o nível apertado, por alvo. Vem DEPOIS de validar o corpo, já com o
 * quarto em mãos.
 *
 * Os dois níveis são funções separadas de propósito. Com um alvo opcional num
 * único `aplicarFreio`, o handler que só conhece o quarto depois de ler o
 * corpo precisa chamar duas vezes — e cobra o orçamento por IP DUAS vezes por
 * requisição legítima, cortando pela metade o teto que o comentário acima
 * promete. Dois passos, duas funções: cada orçamento é cobrado uma vez.
 */
export function freioPorAlvo(nome: string, orcamento: Orcamento, alvo: string): Response | null {
  const r = freio(`${nome}:alvo:${alvo}`, orcamento.porAlvo, orcamento.janelaMs);
  return r.permitido ? null : respostaFreada(r);
}

/** Resposta pronta de recusa, com o header que o cliente precisa para recuar. */
export function respostaFreada(r: ResultadoFreio): Response {
  return new Response(JSON.stringify({ error: "rate_limited" }), {
    status: 429,
    headers: {
      "content-type": "application/json",
      "retry-after": String(r.esperarSegundos),
    },
  });
}
