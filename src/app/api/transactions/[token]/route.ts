import { NextResponse } from "next/server";
import { getGuestRepo } from "@/lib/data";
import { aplicarFreio, ORCAMENTO } from "@/lib/rate-limit";

/** Estado público de um pedido (sem dados pessoais). O token não é adivinhável. */
export async function GET(request: Request, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;

  // Chaveado pelo PEDIDO, não pelo IP: vários hóspedes esperando atrás do mesmo
  // NAT não disputam o mesmo orçamento.
  const freado = aplicarFreio("consulta", ORCAMENTO.consulta, request, token);
  if (freado) return freado;
  const tx = await getGuestRepo().getPublicTransaction(token);
  if (!tx) return NextResponse.json({ error: "Pedido não encontrado." }, { status: 404 });
  return NextResponse.json(tx, { headers: { "Cache-Control": "no-store" } });
}
