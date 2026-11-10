import "server-only";

/**
 * LOG DE ERRO para endpoints públicos.
 *
 * `console.error("[rota]", e)` loga o OBJETO de erro inteiro. Em produção
 * esse objeto pode conter: stack trace com caminhos do servidor, detalhes
 * do driver do banco (query SQL, parâmetros, ids internos), chaves que o
 * cliente HTTP guarda, campos que o próprio catch promoveu de PII. Logs
 * trafegam para coletores, muitas vezes para terceiros — PII em log é
 * incidente de LGPD mesmo sem invasão.
 *
 * Em dev: imprime o erro inteiro, porque é onde se precisa dele.
 * Em produção: imprime só a MENSAGEM e a CLASSE do erro. Nada de stack,
 * nada do payload interno. É intencionalmente opaco: o diagnóstico profundo
 * tem que vir de monitoramento com contexto controlado (Sentry, Datadog),
 * não de `console.log` entrando num arquivo de nginx.
 */
export function logErro(tag: string, erro: unknown, ctx?: Record<string, string | number>): void {
  if (process.env.NODE_ENV !== "production") {
    console.error(tag, erro, ctx ?? "");
    return;
  }
  const e = erro instanceof Error ? erro : null;
  console.error(tag, {
    classe: e?.name ?? typeof erro,
    mensagem: e?.message ?? "erro desconhecido",
    ...(ctx ?? {}),
  });
}
