import { NextResponse } from "next/server";
import { guardaRequisicao } from "@/lib/api-guard";
import { DomainError, getGuestRepo } from "@/lib/data";
import { logErro } from "@/lib/log";
import { supportSchema } from "@/lib/schemas";
import { freioPorAlvo, freioPorIp, ORCAMENTO } from "@/lib/rate-limit";

/**
 * Pedido de ajuda do hóspede (reposição, item danificado, "paguei e a trava não abriu").
 * Vira uma tarefa para a governança/recepção. Sem dados pessoais: só quarto, tipo e observação.
 */
export async function POST(request: Request) {
  const g = guardaRequisicao(request);
  if (g.erro) return g.erro;
  const flood = freioPorIp("suporte", ORCAMENTO.suporte, request);
  if (flood) return flood;

  const parsed = supportSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Requisição inválida." }, { status: 400 });

  // Por quarto: um quarto não abre cinco chamados por minuto; o prédio, sim.
  const porQuarto = freioPorAlvo("suporte", ORCAMENTO.suporte, parsed.data.roomId);
  if (porQuarto) return porQuarto;

  try {
    const req = await getGuestRepo().createSupportRequest(parsed.data);
    return NextResponse.json({ id: req.id }, { status: 201 });
  } catch (e) {
    if (e instanceof DomainError) {
      // Antes, `not_found` virava 404 e o resto 503. O 404 revelava se um
      // `roomId` existia — oráculo barato de enumeração. Agora o cliente
      // recebe sempre a MESMA mensagem e o MESMO status; o código de domínio
      // fica no log do servidor para a operação, não na resposta pública.
      logErro("[support] domain", { code: e.code });
      return NextResponse.json({ error: "Não foi possível registrar o pedido agora." }, { status: 400 });
    }
    logErro("[support]", e);
    return NextResponse.json({ error: "Erro interno." }, { status: 500 });
  }
}
