import { NextResponse } from "next/server";
import { getGuestRepo } from "@/lib/data";
import { freio, origem, ORCAMENTO, respostaFreada } from "@/lib/rate-limit";

/** Estado público de um pedido (sem dados pessoais). O token não é adivinhável. */
export async function GET(request: Request, { params }: { params: Promise<{ token: string }> }) {
  const passe = freio(`consulta:${origem(request)}`, ORCAMENTO.consulta.limite, ORCAMENTO.consulta.janelaMs);
  if (!passe.permitido) return respostaFreada(passe);

  const { token } = await params;
  const tx = await getGuestRepo().getPublicTransaction(token);
  if (!tx) return NextResponse.json({ error: "Pedido não encontrado." }, { status: 404 });
  return NextResponse.json(tx, { headers: { "Cache-Control": "no-store" } });
}
