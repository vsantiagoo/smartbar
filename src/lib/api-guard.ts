import "server-only";
import { NextResponse } from "next/server";

/**
 * GUARDAS DE REQUISIÇÃO para as rotas POST da API.
 *
 * Duas checagens que precisam vir ANTES do `request.json()`, porque é o
 * `.json()` que cobra o preço de aceitar um payload gigante ou de content-type
 * errado — e nós queremos recusar o pior caso antes do custo acontecer.
 *
 *   1. CONTENT-TYPE: exige `application/json`. CSRF clássico usa `<form>`
 *      submetido de uma página atacante: o navegador envia cookies, mas o
 *      formulário HTML só consegue POST com `application/x-www-form-urlencoded`,
 *      `multipart/form-data` ou `text/plain`. Barrar POST que não seja JSON
 *      inviabiliza esse ataque sem depender de SameSite do cookie.
 *
 *   2. CONTENT-LENGTH: rejeita body maior que `TETO_BODY_BYTES`. Os schemas
 *      Zod já têm limites por campo, mas o payload BRUTO ainda passa pelo
 *      `request.json()` antes de ir ao parse. Um megabyte de "{}}" consome
 *      CPU para parsear antes de o Zod falar que é inválido. Com o teto
 *      aqui, o atacante só bate em 413 Payload Too Large.
 *
 * O dois juntos cobrem a maioria dos vetores triviais em POST público.
 */

const TETO_BODY_BYTES = 16 * 1024; // 16KB: generoso para os schemas de JSON que a Marts... ops, a API usa.

export interface Guard {
  /** `null` se a requisição pode seguir; uma `Response` 4xx pronta caso contrário. */
  erro: Response | null;
}

export function guardaRequisicao(request: Request): Guard {
  const ct = (request.headers.get("content-type") ?? "").toLowerCase();
  if (!ct.includes("application/json")) {
    return {
      erro: NextResponse.json({ error: "content_type_required" }, { status: 415 }),
    };
  }
  const tamanho = Number(request.headers.get("content-length") ?? "0");
  if (Number.isFinite(tamanho) && tamanho > TETO_BODY_BYTES) {
    return {
      erro: NextResponse.json({ error: "payload_too_large" }, { status: 413 }),
    };
  }
  return { erro: null };
}
