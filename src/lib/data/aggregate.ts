import type { DashboardSnapshot, RestockNeed, RoomSummary, Transaction } from "@/lib/types";

/** Início do dia (00:00) no fuso do hotel, em ISO UTC. */
export function startOfDayInTz(tz: string, now: Date = new Date()): Date {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: tz,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now); // YYYY-MM-DD
  const offset =
    new Intl.DateTimeFormat("en-US", { timeZone: tz, timeZoneName: "longOffset" })
      .formatToParts(now)
      .find((p) => p.type === "timeZoneName")?.value.replace("GMT", "") || "+00:00";
  return new Date(`${parts}T00:00:00${offset === "" ? "+00:00" : offset}`);
}

export function hourInTz(iso: string, tz: string): number {
  const h = new Intl.DateTimeFormat("en-US", { timeZone: tz, hour: "numeric", hour12: false }).format(new Date(iso));
  return Number(h) % 24;
}

interface AggregateInput {
  /** Transações autorizadas de hoje, com itens. */
  todays: Transaction[];
  recent: Transaction[];
  needs: RestockNeed[];
  summaries: RoomSummary[];
  tz: string;
}

export function buildDashboardSnapshot({ todays, recent, needs, summaries, tz }: AggregateInput): DashboardSnapshot {
  const revenue = todays.reduce((s, t) => s + t.totalCents, 0);
  const pix = todays.filter((t) => t.method === "pix").reduce((s, t) => s + t.totalCents, 0);

  const hourlyMap = new Map<number, number>();
  for (const t of todays) {
    const h = hourInTz(t.authorizedAt ?? t.createdAt, tz);
    hourlyMap.set(h, (hourlyMap.get(h) ?? 0) + t.totalCents);
  }
  const hourly = Array.from({ length: 24 }, (_, hour) => ({ hour, cents: hourlyMap.get(hour) ?? 0 }));

  const products = new Map<string, { name: string; quantity: number; cents: number }>();
  for (const t of todays) {
    for (const i of t.items) {
      const cur = products.get(i.productId) ?? { name: i.productName, quantity: 0, cents: 0 };
      cur.quantity += i.quantity;
      cur.cents += i.quantity * i.unitPriceCents;
      products.set(i.productId, cur);
    }
  }
  const topProducts = [...products.values()].sort((a, b) => b.cents - a.cents).slice(0, 5);

  return {
    revenueTodayCents: revenue,
    transactionsToday: todays.length,
    avgTicketCents: todays.length ? Math.round(revenue / todays.length) : 0,
    roomsNeedingRestock: new Set(needs.map((n) => n.roomId)).size,
    itemsToRestock: needs.reduce((s, n) => s + n.missing, 0),
    pixSharePct: revenue ? Math.round((pix / revenue) * 100) : 0,
    hourly,
    topProducts,
    recent,
    rooms: summaries.map((s) => ({
      number: s.room.number,
      floor: s.room.floor,
      guestName: s.guestName,
      deviceId: s.room.deviceId,
      deviceOnline: s.room.deviceOnline,
      lockState: s.room.lockState,
      lastSeenAt: s.room.deviceLastSeenAt,
      restockCount: s.restockCount,
    })),
    restockNeeds: needs,
  };
}
