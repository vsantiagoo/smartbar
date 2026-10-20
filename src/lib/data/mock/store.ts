import type { Hotel, Product, Room, Stay, SupportRequest, Transaction } from "@/lib/types";

/**
 * Banco em memória do MODO DEMO. Vive em globalThis para sobreviver ao
 * hot-reload do Next e ser compartilhado entre as rotas de API.
 */
export interface InventoryRow {
  roomId: string;
  productId: string;
  quantity: number;
  parLevel: number;
  minLevel: number;
}

export interface MockStore {
  hotel: Hotel;
  rooms: Room[];
  products: Product[];
  inventory: Map<string, InventoryRow>;
  stays: Stay[];
  transactions: Transaction[];
  supportRequests: SupportRequest[];
}

export const invKey = (roomId: string, productId: string): string => `${roomId}:${productId}`;

const HOTEL_ID = "hotel-aurora-id";

type ProductSeed = Omit<Product, "hotelId" | "id" | "imageUrl"> & { par: number; min: number };

const COLD = ["cold"];

const PRODUCTS: ProductSeed[] = [
  { sku: "AGU-SG", name: "Água mineral sem gás", description: "500 ml", category: "bebida", priceCents: 600, iconKey: "glass-water", tags: COLD, par: 2, min: 0 },
  { sku: "AGU-CG", name: "Água mineral com gás", description: "500 ml", category: "bebida", priceCents: 600, iconKey: "glass-water", tags: COLD, par: 2, min: 0 },
  { sku: "REF-CO", name: "Refrigerante coca cola original", description: "Lata 350 ml", category: "bebida", priceCents: 900, iconKey: "cup-soda", tags: COLD, par: 2, min: 0 },
  { sku: "REF-ZE", name: "Refrigerante coca cola zero", description: "Lata 350 ml", category: "bebida", priceCents: 900, iconKey: "cup-soda", tags: ["cold", "zero-sugar"], par: 2, min: 0 },
  { sku: "SUC-UV", name: "Suco de uva", description: "Lata 290 ml", category: "bebida", priceCents: 950, iconKey: "grape", tags: ["cold", "vegan"], par: 3, min: 1 },
  { sku: "AMD-50", name: "Amendoim torrado", description: "Pacote 50 g", category: "snack", priceCents: 800, iconKey: "nut", tags: ["gluten-free", "vegan"], par: 2, min: 0 },
  { sku: "BAR-CE", name: "Barra de cereal", description: "Castanhas e mel", category: "snack", priceCents: 500, iconKey: "wheat", tags: ["vegan"], par: 2, min: 0 },
  { sku: "BAT-PT", name: "Batata chips", description: "35 g", category: "snack", priceCents: 1400, iconKey: "popcorn", par: 1, min: 0 },
];

const ROOM_NUMBERS = [101, 102, 103, 104, 201, 202, 203, 204, 301, 302, 303, 304];

const GUESTS: Record<string, { name: string; uid: string }> = {
  "101": { name: "Mariana Souza", uid: "A1B2C3D4" },
  "102": { name: "Carlos Ferreira", uid: "B2C3D4E5" },
  "103": { name: "Beatriz Lima", uid: "C3D4E5F6" },
  "201": { name: "Rafael Nogueira", uid: "D4E5F6A7" },
  "202": { name: "Helena Duarte", uid: "E5F6A7B8" },
  "301": { name: "Pedro Albuquerque", uid: "F6A7B8C9" },
  "302": { name: "Juliana Prado", uid: "A7B8C9D0" },
};

/** PRNG determinístico — o seed sempre gera o mesmo estoque. */
function lcg(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

function buildStore(): MockStore {
  const rnd = lcg(42);
  const now = Date.now();

  const hotel: Hotel = {
    id: HOTEL_ID,
    slug: "hotel-aurora",
    name: "Hotel Aurora Paulista",
    plan: "plus",
    segment: "hotel",
    whatsapp: "5511999990000",
    brand: { primary: "#1B3A6B", accent: "#F39200" },
  };

  const rooms: Room[] = ROOM_NUMBERS.map((n) => ({
    id: `room-${n}`,
    hotelId: HOTEL_ID,
    number: String(n),
    floor: Math.floor(n / 100),
    qrToken: `aurora-${n}`,
    deviceId: `esp32-aurora-${n}`,
    deviceOnline: n % 7 !== 0,
    deviceLastSeenAt: new Date(now - (n % 7 === 0 ? 3_600_000 * 5 : 20_000)).toISOString(),
    lockState: "locked",
  }));

  const products: Product[] = PRODUCTS.map((p, i) => ({
    id: `prod-${i + 1}`,
    hotelId: HOTEL_ID,
    sku: p.sku,
    name: p.name,
    description: p.description,
    category: p.category,
    priceCents: p.priceCents,
    iconKey: p.iconKey,
    imageUrl: null,
    tags: p.tags,
  }));

  const inventory = new Map<string, InventoryRow>();
  for (const room of rooms) {
    products.forEach((product, i) => {
      const cfg = PRODUCTS[i]!;
      const roll = rnd();
      // maioria em dia; alguns com 1 unidade a menos; poucos esgotados (~1 em cada 3 quartos pede reposição)
      const consumed = roll < 0.65 ? 0 : roll < 0.95 ? (cfg.par >= 2 ? 1 : 0) : cfg.par;
      inventory.set(invKey(room.id, product.id), {
        roomId: room.id,
        productId: product.id,
        quantity: Math.max(0, cfg.par - consumed),
        parLevel: cfg.par,
        minLevel: cfg.min,
      });
    });
  }

  const stays: Stay[] = rooms.flatMap((room) => {
    const g = GUESTS[room.number];
    if (!g) return [];
    return [
      {
        id: `stay-${room.number}`,
        roomId: room.id,
        guestName: g.name,
        rfidUid: g.uid,
        status: "active" as const,
        checkInAt: new Date(now - 86_400_000 * (1 + (Number(room.number) % 3))).toISOString(),
        checkOutAt: null,
      },
    ];
  });

  // Histórico de hoje, para o dashboard nascer "vivo".
  const transactions: Transaction[] = [];
  const stayRooms = rooms.filter((r) => GUESTS[r.number]);
  const count = 14;
  const dayStart = new Date();
  dayStart.setHours(0, 5, 0, 0);
  for (let i = 0; i < count; i++) {
    const room = stayRooms[Math.floor(rnd() * stayRooms.length)]!;
    const stay = stays.find((s) => s.roomId === room.id)!;
    const picks = 1 + Math.floor(rnd() * 3);
    const items = Array.from({ length: picks }, () => {
      const p = products[Math.floor(rnd() * products.length)]!;
      return { productId: p.id, productName: p.name, unitPriceCents: p.priceCents, quantity: 1 + Math.floor(rnd() * 2) };
    });
    const total = items.reduce((s, it) => s + it.unitPriceCents * it.quantity, 0);
    const minutesAgo = Math.round(((count - i) / count) * 60 * 9 * (0.6 + rnd() * 0.4)) + 4;
    const at = new Date(now - minutesAgo * 60_000);
    // Não atravessa para "ontem": mantém no dia corrente.
    const when = at < dayStart ? new Date(dayStart.getTime() + i * 60_000) : at;
    transactions.push({
      id: `seed-tx-${i}`,
      hotelId: HOTEL_ID,
      roomId: room.id,
      roomNumber: room.number,
      stayId: stay.id,
      publicToken: `seed-token-${i}`,
      method: rnd() > 0.35 ? "pix" : "room_charge",
      status: "authorized",
      totalCents: total,
      items,
      pixCopyPaste: null,
      expiresAt: new Date(when.getTime() + 600_000).toISOString(),
      authorizedAt: when.toISOString(),
      failureReason: null,
      createdAt: when.toISOString(),
    });
  }
  transactions.sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  return { hotel, rooms, products, inventory, stays, transactions, supportRequests: [] };
}

declare global {
  // `var` e obrigatorio aqui: `let`/`const` nao declaram global no TS.
  var __smartbarMock: MockStore | undefined;
}

export function getMockStore(): MockStore {
  globalThis.__smartbarMock ??= buildStore();
  return globalThis.__smartbarMock;
}
