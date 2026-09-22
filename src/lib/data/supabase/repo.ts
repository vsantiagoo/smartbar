import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import { buildDashboardSnapshot, startOfDayInTz } from "@/lib/data/aggregate";
import {
  DomainError,
  type AuthorizeResult,
  type CreateTransactionInput,
  type GuestContext,
  type Repository,
} from "@/lib/data/repository";
import type {
  CatalogItem,
  DashboardSnapshot,
  Hotel,
  LockState,
  PaymentMethod,
  PlanTier,
  Product,
  PublicTransaction,
  RestockNeed,
  Room,
  RoomDetail,
  RoomSummary,
  Stay,
  Transaction,
  TransactionStatus,
} from "@/lib/types";

// ── Linhas do banco (snake_case) ─────────────────────────────────
interface HotelRow {
  id: string;
  slug: string;
  name: string;
  plan: PlanTier;
  brand: { primary?: string; accent?: string; logo_url?: string } | null;
  timezone?: string;
}
interface RoomRow {
  id: string;
  hotel_id: string;
  number: string;
  floor: number | null;
  qr_token: string;
  device_id: string | null;
  device_online: boolean;
  device_last_seen_at: string | null;
  lock_state: LockState;
}
interface ProductRow {
  id: string;
  hotel_id: string;
  sku: string | null;
  name: string;
  description: string | null;
  category: string;
  price_cents: number;
  icon_key: string;
  image_url: string | null;
}
interface InventoryRow {
  room_id: string;
  product_id: string;
  quantity: number;
  par_level: number;
  min_level: number;
}
interface StayRow {
  id: string;
  room_id: string;
  guest_name: string;
  rfid_uid: string | null;
  status: "active" | "checked_out";
  check_in_at: string;
  check_out_at: string | null;
}
interface TxItemRow {
  product_id: string;
  product_name: string;
  unit_price_cents: number;
  quantity: number;
}
interface TxRow {
  id: string;
  hotel_id: string;
  room_id: string;
  stay_id: string | null;
  public_token: string;
  method: PaymentMethod;
  status: TransactionStatus;
  total_cents: number;
  pix_copy_paste: string | null;
  expires_at: string;
  authorized_at: string | null;
  failure_reason: string | null;
  created_at: string;
  transaction_items?: TxItemRow[];
  rooms?: { number: string } | null;
}
interface NeedRow {
  room_id: string;
  room_number: string;
  floor: number | null;
  product_id: string;
  product_name: string;
  icon_key: string;
  quantity: number;
  min_level: number;
  par_level: number;
  missing: number;
}

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const TX_SELECT = "*, transaction_items(*), rooms(number)";

function must<T>(res: { data: T | null; error: { message: string } | null }): T {
  if (res.error) throw new Error(res.error.message);
  if (res.data === null) throw new DomainError("not_found");
  return res.data;
}
function list<T>(res: { data: T[] | null; error: { message: string } | null }): T[] {
  if (res.error) throw new Error(res.error.message);
  return res.data ?? [];
}

const mapHotel = (r: HotelRow): Hotel => ({
  id: r.id,
  slug: r.slug,
  name: r.name,
  plan: r.plan,
  brand: { primary: r.brand?.primary, accent: r.brand?.accent, logoUrl: r.brand?.logo_url },
});

const mapRoom = (r: RoomRow): Room => ({
  id: r.id,
  hotelId: r.hotel_id,
  number: r.number,
  floor: r.floor,
  qrToken: r.qr_token,
  deviceId: r.device_id,
  deviceOnline: r.device_online,
  deviceLastSeenAt: r.device_last_seen_at,
  lockState: r.lock_state,
});

const mapProduct = (r: ProductRow): Product => ({
  id: r.id,
  hotelId: r.hotel_id,
  sku: r.sku,
  name: r.name,
  description: r.description,
  category: r.category,
  priceCents: r.price_cents,
  iconKey: r.icon_key,
  imageUrl: r.image_url,
});

const mapStay = (r: StayRow): Stay => ({
  id: r.id,
  roomId: r.room_id,
  guestName: r.guest_name,
  rfidUid: r.rfid_uid,
  status: r.status,
  checkInAt: r.check_in_at,
  checkOutAt: r.check_out_at,
});

const mapTx = (r: TxRow): Transaction => ({
  id: r.id,
  hotelId: r.hotel_id,
  roomId: r.room_id,
  roomNumber: r.rooms?.number ?? "",
  stayId: r.stay_id,
  publicToken: r.public_token,
  method: r.method,
  status: r.status,
  totalCents: r.total_cents,
  items: (r.transaction_items ?? []).map((i) => ({
    productId: i.product_id,
    productName: i.product_name,
    unitPriceCents: i.unit_price_cents,
    quantity: i.quantity,
  })),
  pixCopyPaste: r.pix_copy_paste,
  expiresAt: r.expires_at,
  authorizedAt: r.authorized_at,
  failureReason: r.failure_reason,
  createdAt: r.created_at,
});

const mapNeed = (r: NeedRow): RestockNeed => ({
  roomId: r.room_id,
  roomNumber: r.room_number,
  floor: r.floor,
  productId: r.product_id,
  productName: r.product_name,
  iconKey: r.icon_key,
  quantity: r.quantity,
  minLevel: r.min_level,
  parLevel: r.par_level,
  missing: r.missing,
});

const TZ = "America/Sao_Paulo";

/**
 * Implementação de produção. Recebe o cliente já autenticado:
 *  - service_role  → operações do hóspede e webhooks
 *  - sessão da equipe → operações do painel (RLS aplica o isolamento por hotel)
 */
export class SupabaseRepository implements Repository {
  constructor(private readonly db: SupabaseClient) {}

  // ── Hóspede ───────────────────────────────────────────────────
  async getGuestContext(hotelRef: string, roomRef: string): Promise<GuestContext | null> {
    const hotelQ = this.db.from("hotels").select("*");
    const { data: hotel } = await (UUID.test(hotelRef) ? hotelQ.eq("id", hotelRef) : hotelQ.eq("slug", hotelRef)).maybeSingle<HotelRow>();
    if (!hotel) return null;

    const roomQ = this.db.from("rooms").select("*").eq("hotel_id", hotel.id).eq("is_active", true);
    const { data: room } = await (UUID.test(roomRef) ? roomQ.eq("id", roomRef) : roomQ.eq("qr_token", roomRef)).maybeSingle<RoomRow>();
    if (!room) return null;

    const stay = await this.findActiveStay(room.id);
    return { hotel: mapHotel(hotel), room: mapRoom(room), canChargeToRoom: Boolean(stay?.rfidUid) };
  }

  async getCatalog(roomId: string): Promise<CatalogItem[]> {
    const room = must(await this.db.from("rooms").select("hotel_id").eq("id", roomId).maybeSingle<{ hotel_id: string }>());
    const [products, stock] = await Promise.all([
      this.db.from("products").select("*").eq("hotel_id", room.hotel_id).eq("is_active", true).order("sort_order"),
      this.db.from("inventory").select("product_id, quantity").eq("room_id", roomId),
    ]);
    const qty = new Map(list<{ product_id: string; quantity: number }>(stock).map((r) => [r.product_id, r.quantity]));
    return list<ProductRow>(products).map((p) => ({ ...mapProduct(p), available: qty.get(p.id) ?? 0 }));
  }

  async createTransaction(input: CreateTransactionInput): Promise<Transaction> {
    const room = must(await this.db.from("rooms").select("*").eq("id", input.roomId).maybeSingle<RoomRow>());
    const stay = await this.findActiveStay(room.id);
    if (input.method === "room_charge" && !stay?.rfidUid) throw new DomainError("no_active_stay");

    const ids = input.items.map((i) => i.productId);
    const [products, stock] = await Promise.all([
      this.db.from("products").select("*").eq("hotel_id", room.hotel_id).eq("is_active", true).in("id", ids),
      this.db.from("inventory").select("product_id, quantity").eq("room_id", room.id).in("product_id", ids),
    ]);
    const byId = new Map(list<ProductRow>(products).map((p) => [p.id, p]));
    const qty = new Map(list<{ product_id: string; quantity: number }>(stock).map((r) => [r.product_id, r.quantity]));

    // Preço e nome SEMPRE vêm do banco — nunca do cliente.
    const items = input.items.map((line) => {
      const p = byId.get(line.productId);
      if (!p) throw new DomainError("invalid_items");
      if ((qty.get(p.id) ?? 0) < line.quantity) throw new DomainError("out_of_stock", p.name);
      return { product_id: p.id, product_name: p.name, unit_price_cents: p.price_cents, quantity: line.quantity };
    });
    const total = items.reduce((s, i) => s + i.unit_price_cents * i.quantity, 0);

    const tx = must(
      await this.db
        .from("transactions")
        .insert({ hotel_id: room.hotel_id, room_id: room.id, stay_id: stay?.id ?? null, method: input.method, total_cents: total })
        .select("*")
        .single<TxRow>(),
    );
    const ins = await this.db.from("transaction_items").insert(items.map((i) => ({ ...i, transaction_id: tx.id })));
    if (ins.error) {
      await this.db.from("transactions").delete().eq("id", tx.id);
      throw new Error(ins.error.message);
    }
    return mapTx({ ...tx, transaction_items: items, rooms: { number: room.number } });
  }

  async attachPixCharge(transactionId: string, charge: { externalId: string; copyPaste: string }): Promise<void> {
    const { error } = await this.db
      .from("transactions")
      .update({ pix_external_id: charge.externalId, pix_copy_paste: charge.copyPaste })
      .eq("id", transactionId);
    if (error) throw new Error(error.message);
  }

  async getPublicTransaction(publicToken: string): Promise<PublicTransaction | null> {
    if (!UUID.test(publicToken)) return null;
    const { data } = await this.db.from("transactions").select(TX_SELECT).eq("public_token", publicToken).maybeSingle<TxRow>();
    if (!data) return null;
    let tx = mapTx(data);
    if (tx.status === "pending" && new Date(tx.expiresAt).getTime() < Date.now()) {
      await this.db.from("transactions").update({ status: "expired" }).eq("id", tx.id).eq("status", "pending");
      tx = { ...tx, status: "expired" };
    }
    return {
      publicToken: tx.publicToken,
      method: tx.method,
      status: tx.status,
      totalCents: tx.totalCents,
      items: tx.items,
      pixCopyPaste: tx.pixCopyPaste,
      expiresAt: tx.expiresAt,
      authorizedAt: tx.authorizedAt,
      failureReason: tx.failureReason,
      roomNumber: tx.roomNumber,
    };
  }

  async getTransactionById(id: string): Promise<Transaction | null> {
    const { data } = await this.db.from("transactions").select(TX_SELECT).eq("id", id).maybeSingle<TxRow>();
    return data ? mapTx(data) : null;
  }

  async getTransactionByToken(publicToken: string): Promise<Transaction | null> {
    if (!UUID.test(publicToken)) return null;
    const { data } = await this.db.from("transactions").select(TX_SELECT).eq("public_token", publicToken).maybeSingle<TxRow>();
    return data ? mapTx(data) : null;
  }

  async authorizeTransaction(transactionId: string, by: "pix_webhook" | "rfid"): Promise<AuthorizeResult> {
    const { data, error } = await this.db.rpc("smartbar_authorize_transaction", {
      p_transaction_id: transactionId,
      p_authorized_by: by,
    });
    if (error) throw new Error(error.message);
    const r = data as { ok: boolean; status: string; reason?: string; room_id?: string };
    return { ok: r.ok, status: r.status, reason: r.reason, roomId: r.room_id };
  }

  async getRoomById(roomId: string): Promise<Room | null> {
    const { data } = await this.db.from("rooms").select("*").eq("id", roomId).maybeSingle<RoomRow>();
    return data ? mapRoom(data) : null;
  }

  async findRoomByDeviceId(deviceId: string): Promise<Room | null> {
    const { data } = await this.db.from("rooms").select("*").eq("device_id", deviceId).maybeSingle<RoomRow>();
    return data ? mapRoom(data) : null;
  }

  async findPendingRoomCharge(roomId: string): Promise<Transaction | null> {
    const { data } = await this.db
      .from("transactions")
      .select(TX_SELECT)
      .eq("room_id", roomId)
      .eq("method", "room_charge")
      .eq("status", "pending")
      .gt("expires_at", new Date().toISOString())
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle<TxRow>();
    return data ? mapTx(data) : null;
  }

  async findActiveStay(roomId: string): Promise<Stay | null> {
    const { data } = await this.db.from("stays").select("*").eq("room_id", roomId).eq("status", "active").maybeSingle<StayRow>();
    return data ? mapStay(data) : null;
  }

  async touchDevice(roomId: string): Promise<void> {
    await this.db.from("rooms").update({ device_online: true, device_last_seen_at: new Date().toISOString() }).eq("id", roomId);
  }

  // ── Admin (RLS) ───────────────────────────────────────────────
  async getAdminHotel(): Promise<Hotel | null> {
    const { data } = await this.db.from("hotels").select("*").limit(1).maybeSingle<HotelRow>();
    return data ? mapHotel(data) : null;
  }

  async listRecentTransactions(hotelId: string, limit: number): Promise<Transaction[]> {
    const res = await this.db
      .from("transactions")
      .select(TX_SELECT)
      .eq("hotel_id", hotelId)
      .eq("status", "authorized")
      .order("authorized_at", { ascending: false })
      .limit(limit);
    return list<TxRow>(res).map(mapTx);
  }

  async getDashboardSnapshot(hotelId: string): Promise<DashboardSnapshot> {
    const since = startOfDayInTz(TZ).toISOString();
    const res = await this.db
      .from("transactions")
      .select(TX_SELECT)
      .eq("hotel_id", hotelId)
      .eq("status", "authorized")
      .gte("authorized_at", since);
    return buildDashboardSnapshot({
      todays: list<TxRow>(res).map(mapTx),
      recent: await this.listRecentTransactions(hotelId, 12),
      needs: await this.listRestockNeeds(hotelId),
      summaries: await this.listRoomSummaries(hotelId),
      tz: TZ,
    });
  }

  async listRoomSummaries(hotelId: string): Promise<RoomSummary[]> {
    const [rooms, stays, needs] = await Promise.all([
      this.db.from("rooms").select("*").eq("hotel_id", hotelId).eq("is_active", true).order("number"),
      this.db.from("stays").select("*").eq("hotel_id", hotelId).eq("status", "active"),
      this.listRestockNeeds(hotelId),
    ]);
    const stayRows = list<StayRow>(stays);
    const stayIds = stayRows.map((s) => s.id);
    const txs = stayIds.length
      ? list<{ stay_id: string; total_cents: number }>(
          await this.db.from("transactions").select("stay_id, total_cents").eq("status", "authorized").in("stay_id", stayIds),
        )
      : [];
    return list<RoomRow>(rooms).map((room) => {
      const stay = stayRows.find((s) => s.room_id === room.id);
      return {
        room: mapRoom(room),
        guestName: stay?.guest_name ?? null,
        restockCount: needs.filter((n) => n.roomId === room.id).length,
        spentCents: txs.filter((t) => t.stay_id === stay?.id).reduce((s, t) => s + t.total_cents, 0),
      };
    });
  }

  async getRoomDetail(hotelId: string, roomNumber: string): Promise<RoomDetail | null> {
    const { data: room } = await this.db.from("rooms").select("*").eq("hotel_id", hotelId).eq("number", roomNumber).maybeSingle<RoomRow>();
    if (!room) return null;
    const stayModel = await this.findActiveStay(room.id);

    const txQuery = this.db.from("transactions").select(TX_SELECT).order("created_at", { ascending: false }).limit(50);
    const [inv, txs] = await Promise.all([
      this.db.from("inventory").select("*, products(name, icon_key, sort_order)").eq("room_id", room.id),
      stayModel ? txQuery.eq("stay_id", stayModel.id) : txQuery.eq("room_id", room.id),
    ]);
    const transactions = list<TxRow>(txs).map(mapTx);
    const authorized = transactions.filter((t) => t.status === "authorized");

    const inventory = list<InventoryRow & { products: { name: string; icon_key: string; sort_order: number } | null }>(inv)
      .sort((a, b) => (a.products?.sort_order ?? 0) - (b.products?.sort_order ?? 0))
      .map((r) => ({
        productId: r.product_id,
        productName: r.products?.name ?? "—",
        iconKey: r.products?.icon_key ?? "package",
        quantity: r.quantity,
        minLevel: r.min_level,
        parLevel: r.par_level,
      }));

    return {
      room: mapRoom(room),
      stay: stayModel,
      inventory,
      transactions,
      paidPixCents: authorized.filter((t) => t.method === "pix").reduce((s, t) => s + t.totalCents, 0),
      roomChargeCents: authorized.filter((t) => t.method === "room_charge").reduce((s, t) => s + t.totalCents, 0),
    };
  }

  async listRestockNeeds(hotelId: string): Promise<RestockNeed[]> {
    const res = await this.db.from("room_restock_needs").select("*").eq("hotel_id", hotelId).order("room_number");
    return list<NeedRow>(res).map(mapNeed);
  }

  async confirmRestock(roomId: string, productId: string | null): Promise<number> {
    const { data, error } = await this.db.rpc("smartbar_confirm_restock", { p_room_id: roomId, p_product_id: productId });
    if (error) throw new Error(error.message);
    return Number(data ?? 0);
  }
}
