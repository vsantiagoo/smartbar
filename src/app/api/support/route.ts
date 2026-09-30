import { NextResponse } from "next/server";
import { DomainError, getGuestRepo } from "@/lib/data";
import { supportSchema } from "@/lib/schemas";

/**
 * Pedido de ajuda do hóspede (reposição, item danificado, "paguei e a trava não abriu").
 * Vira uma tarefa para a governança/recepção. Sem dados pessoais: só quarto, tipo e observação.
 */
export async function POST(request: Request) {
  const parsed = supportSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Requisição inválida." }, { status: 400 });

  try {
    const req = await getGuestRepo().createSupportRequest(parsed.data);
    return NextResponse.json({ id: req.id }, { status: 201 });
  } catch (e) {
    if (e instanceof DomainError) {
      const status = e.code === "not_found" ? 404 : 503;
      return NextResponse.json({ error: "Não foi possível registrar o pedido agora." }, { status });
    }
    console.error("[support]", e);
    return NextResponse.json({ error: "Erro interno." }, { status: 500 });
  }
}
