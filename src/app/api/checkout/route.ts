import { NextResponse } from "next/server";
import { DomainError, getGuestRepo } from "@/lib/data";
import { getPixProvider } from "@/lib/payments/pix";
import { PIX_TTL_SECONDS } from "@/lib/guest-constants";
import { checkoutSchema } from "@/lib/schemas";
import { freio, origem, ORCAMENTO, respostaFreada } from "@/lib/rate-limit";

const ERRORS: Record<string, { status: number; message: string }> = {
  not_found: { status: 404, message: "Quarto não encontrado." },
  out_of_stock: { status: 409, message: "Um dos itens acabou de esgotar neste quarto." },
  no_active_stay: { status: 409, message: "Este quarto não tem estadia ativa para lançar na conta." },
  invalid_items: { status: 400, message: "Itens inválidos no carrinho." },
};

/**
 * Cria o pedido (status "pending"). Preços e estoque são revalidados aqui —
 * o cliente só informa QUAIS produtos e QUANTOS. O estoque só é abatido
 * quando o pagamento/cartão é validado (smartbar_authorize_transaction).
 */
export async function POST(request: Request) {
  const passe = freio(`checkout:${origem(request)}`, ORCAMENTO.checkout.limite, ORCAMENTO.checkout.janelaMs);
  if (!passe.permitido) return respostaFreada(passe);

  const parsed = checkoutSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Requisição inválida." }, { status: 400 });
  const input = parsed.data;

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
      const mapped = ERRORS[e.code] ?? { status: 400, message: "Não foi possível criar o pedido." };
      return NextResponse.json({ error: mapped.message, code: e.code }, { status: mapped.status });
    }
    console.error("[checkout]", e);
    return NextResponse.json({ error: "Erro interno. Tente novamente." }, { status: 500 });
  }
}
