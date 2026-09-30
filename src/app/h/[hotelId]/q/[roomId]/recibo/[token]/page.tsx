import { notFound } from "next/navigation";
import { ReceiptView } from "@/components/guest/sections/receipt-view";
import { getGuestRepo } from "@/lib/data";

export const dynamic = "force-dynamic";
export const metadata = { title: "Recibo" };

/** TELA · Recibo de uma compra (imprimir ou salvar em PDF)  →  /h/[hotelId]/q/[roomId]/recibo/[token] */
export default async function ReceiptPage({ params }: { params: Promise<{ hotelId: string; roomId: string; token: string }> }) {
  const { hotelId, roomId, token } = await params;
  const repo = getGuestRepo();
  const ctx = await repo.getGuestContext(hotelId, roomId);
  if (!ctx) notFound();
  const tx = await repo.getTransactionByToken(token);
  // O recibo só abre dentro do quarto a que a compra pertence, e só se foi aprovada.
  if (!tx || tx.roomId !== ctx.room.id || tx.status !== "authorized") notFound();

  return (
    <main>
      <ReceiptView
        baseHref={`/h/${hotelId}/q/${roomId}`}
        code={tx.publicToken.slice(0, 8).toUpperCase()}
        at={tx.authorizedAt ?? tx.createdAt}
        method={tx.method}
        totalCents={tx.totalCents}
        items={tx.items}
      />
    </main>
  );
}
