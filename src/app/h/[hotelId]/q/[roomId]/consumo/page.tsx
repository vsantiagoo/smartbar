import { notFound } from "next/navigation";
import { ConsumptionList } from "@/components/guest/sections/consumption-list";
import { getGuestRepo } from "@/lib/data";

export const dynamic = "force-dynamic";
export const metadata = { title: "Meu consumo" };

/** TELA · Meu consumo (extrato da estadia)  →  /h/[hotelId]/q/[roomId]/consumo */
export default async function ConsumptionPage({ params }: { params: Promise<{ hotelId: string; roomId: string }> }) {
  const { hotelId, roomId } = await params;
  const repo = getGuestRepo();
  const ctx = await repo.getGuestContext(hotelId, roomId);
  if (!ctx) notFound();
  const transactions = await repo.listGuestTransactions(ctx.room.id);

  return (
    <main>
      <ConsumptionList
        baseHref={`/h/${hotelId}/q/${roomId}`}
        entries={transactions.map((tx) => ({
          token: tx.publicToken,
          at: tx.authorizedAt ?? tx.createdAt,
          method: tx.method,
          totalCents: tx.totalCents,
          items: tx.items,
        }))}
      />
    </main>
  );
}
