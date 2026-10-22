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

/** Orçamentos por endpoint. Generosos para o uso real, apertados para laço. */
export const ORCAMENTO = {
  /** Montar um pedido é raro: um hóspede faz poucos por estadia. */
  checkout: { limite: 10, janelaMs: 60_000 },
  /** Chamar a recepção, idem. */
  suporte: { limite: 5, janelaMs: 60_000 },
  /** Consultar o próprio pedido acontece em laço na tela de espera. */
  consulta: { limite: 120, janelaMs: 60_000 },
  /** O leitor da porta: uma aproximação por vez, com folga para retentativa. */
  dispositivo: { limite: 30, janelaMs: 60_000 },
} as const;

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
