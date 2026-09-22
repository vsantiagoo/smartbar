import { NextResponse } from "next/server";
import { getGuestRepo } from "@/lib/data";

/** Estado público de um pedido (sem dados pessoais). O token não é adivinhável. */
export async function GET(_req: Request, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const tx = await getGuestRepo().getPublicTransaction(token);
  if (!tx) return NextResponse.json({ error: "Pedido não encontrado." }, { status: 404 });
  return NextResponse.json(tx, { headers: { "Cache-Control": "no-store" } });
}
