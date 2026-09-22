import { NextResponse } from "next/server";
import { simulationAllowed } from "@/lib/config";
import { getGuestRepo } from "@/lib/data";
import { authorizeAndUnlock } from "@/lib/services/authorize";

/**
 * DEMO: fabrica uma compra completa de um hóspede aleatório (Pix já pago), para
 * ver o dashboard reagir em tempo real sem precisar de dois aparelhos.
 */
export async function POST() {
  if (!simulationAllowed) return NextResponse.json({ error: "disabled" }, { status: 404 });
  const repo = getGuestRepo();
  const hotel = await repo.getAdminHotel();
  if (!hotel) return NextResponse.json({ error: "not_found" }, { status: 404 });

  const summaries = await repo.listRoomSummaries(hotel.id);
  const occupied = summaries.filter((s) => s.guestName);
  const pick = occupied[Math.floor(Math.random() * occupied.length)];
  if (!pick) return NextResponse.json({ error: "no_rooms" }, { status: 409 });

  const catalog = (await repo.getCatalog(pick.room.id)).filter((p) => p.available > 0);
  if (catalog.length === 0) return NextResponse.json({ error: "no_stock" }, { status: 409 });

  const shuffled = [...catalog].sort(() => Math.random() - 0.5).slice(0, 1 + Math.floor(Math.random() * 2));
  const method = Math.random() > 0.4 ? "pix" : "room_charge";
  const tx = await repo.createTransaction({
    hotelId: hotel.id,
    roomId: pick.room.id,
    method,
    items: shuffled.map((p) => ({ productId: p.id, quantity: 1 })),
  });
  const result = await authorizeAndUnlock(tx.id, method === "pix" ? "pix_webhook" : "rfid");
  return NextResponse.json({ ...result, room: pick.room.number, totalCents: tx.totalCents });
}
