import { NextResponse } from "next/server";
import { guardaRequisicao } from "@/lib/api-guard";
import { DomainError, getGuestRepo } from "@/lib/data";
import { logErro } from "@/lib/log";
import { getPixProvider } from "@/lib/payments/pix";
import { PIX_TTL_SECONDS } from "@/lib/guest-constants";
import { checkoutSchema } from "@/lib/schemas";
import { freioPorAlvo, freioPorIp, ORCAMENTO } from "@/lib/rate-limit";

/*
  O QUE RETORNAR PARA O CLIENTE — e o que NÃO retornar.

  Nem toda razão de falha é publicável. Discriminar `not_found` por quarto
  inexistente de `no_active_stay` por quarto SEM estadia ativa entrega ao
  atacante um oráculo:

    POST { roomId: "q-101" } → 404 "não encontrado"   → quarto não existe
    POST { roomId: "q-102" } → 409 "sem estadia"      → quarto existe, sem hóspede
    POST { roomId: "q-103" } → 201                    → quarto existe, com hóspede

  Isso enumera o hotel (mapa de quartos + ocupação) em segundos.

  Só UM código precisa escapar para a UX: `out_of_stock` — o checkout
  troca a mensagem para "esgotou" e sugere outro item. Os outros três
  colapsam para a MESMA resposta genérica (400 + mensagem igual) e NÃO
  acompanham o campo `code`. Quem olha o response do lado de fora não
  consegue inferir nada.
*/
const PUBLICOS = new Set<string>(["out_of_stock"]);
const ERRORS: Record<string, { status: number; message: string }> = {
  out_of_stock: { status: 409, message: "Um dos itens acabou de esgotar neste quarto." },
};
const ERRO_GENERICO = { status: 400, message: "Não foi possível criar o pedido." } as const;

/**
 * Cria o pedido (status "pending"). Preços e estoque são revalidados aqui —
 * o cliente só informa QUAIS produtos e QUANTOS. O estoque só é abatido
 * quando o pagamento/cartão é validado (smartbar_authorize_transaction).
 */
export async function POST(request: Request) {
  // Content-Type + tamanho máximo ANTES de qualquer trabalho.
  const g = guardaRequisicao(request);
  if (g.erro) return g.erro;
  // Primeiro o freio largo, por IP: detém flood antes de qualquer trabalho.
  const flood = freioPorIp("checkout", ORCAMENTO.checkout, request);
  if (flood) return flood;

  const parsed = checkoutSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Requisição inválida." }, { status: 400 });
  const input = parsed.data;

  // Agora o apertado, por QUARTO — que é o uso legítimo. Um hotel inteiro
  // compartilha o IP; cada quarto tem o próprio orçamento.
  const porQuarto = freioPorAlvo("checkout", ORCAMENTO.checkout, input.roomId);
  if (porQuarto) return porQuarto;

  try {
    const repo = getGuestRepo();
    const room = await repo.getRoomById(input.roomId);
    if (!room || room.hotelId !== input.hotelId) throw new DomainError("not_found");

    const tx = await repo.createTransaction(input);

    if (tx.method === "pix") {
      const charge = await getPixProvider().createCharge({
        transactionId: tx.id,
        amountCents: tx.totalCents,
        description: `SmartBar — quarto ${tx.roomNumber}`,
        expiresInSeconds: PIX_TTL_SECONDS,
      });
      await repo.attachPixCharge(tx.id, charge);
    }
    return NextResponse.json({ token: tx.publicToken, method: tx.method }, { status: 201 });
  } catch (e) {
    if (e instanceof DomainError) {
      if (PUBLICOS.has(e.code)) {
        const mapped = ERRORS[e.code]!;
        return NextResponse.json({ error: mapped.message, code: e.code }, { status: mapped.status });
      }
      // Códigos sensíveis (not_found, no_active_stay, invalid_items, etc.):
      // resposta ÚNICA, sem `code`, para não virar oráculo de enumeração.
      // O detalhe fica no log do servidor — útil para a operação, invisível
      // para o cliente.
      logErro("[checkout] domain", { code: e.code });
      return NextResponse.json({ error: ERRO_GENERICO.message }, { status: ERRO_GENERICO.status });
    }
    logErro("[checkout]", e);
    return NextResponse.json({ error: "Erro interno. Tente novamente." }, { status: 500 });
  }
}
