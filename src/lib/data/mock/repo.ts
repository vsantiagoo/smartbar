import { randomUUID } from "node:crypto";
import { buildDashboardSnapshot, startOfDayInTz } from "@/lib/data/aggregate";
import {
  DomainError,
  type AuthorizeResult,
  type CreateSupportInput,
  type CreateTransactionInput,
  type GuestContext,
  type Repository,
} from "@/lib/data/repository";
import { PIX_TTL_SECONDS } from "@/lib/guest-constants";
import { getMockStore, invKey, type MockStore } from "@/lib/data/mock/store";
import type {
  CatalogItem,
  DashboardSnapshot,
  Hotel,
  PublicTransaction,
  RestockNeed,
  Room,
  RoomDetail,
  RoomSummary,
  Stay,
  SupportRequest,
  Transaction,
} from "@/lib/types";

const TZ = "America/Sao_Paulo";
const PIX_TTL_MS = PIX_TTL_SECONDS * 1000;

function clone<T>(v: T): T {
  return structuredClone(v);
}

function toPublic(t: Transaction): PublicTransaction {
  return {
    publicToken: t.publicToken,
    method: t.method,
    status: t.status,
    totalCents: t.totalCents,
    items: t.items,
    pixCopyPaste: t.pixCopyPaste,
    expiresAt: t.expiresAt,
    authorizedAt: t.authorizedAt,
    failureReason: t.failureReason,
    roomNumber: t.roomNumber,
  };
}

class MockRepository implements Repository {
  private get s(): MockStore {
    return getMockStore();
  }

  private activeStay(roomId: string): Stay | null {
    return this.s.stays.find((st) => st.roomId === roomId && st.status === "active") ?? null;
  }

  /** Marca como expiradas as transações pendentes vencidas (equivale ao job do banco). */
  private sweepExpired(): void {
    const now = Date.now();
    for (const t of this.s.transactions) {
      if (t.status === "pending" && new Date(t.expiresAt).getTime() < now) t.status = "expired";
    }
  }

  async getGuestContext(hotelRef: string, roomRef: string): Promise<GuestContext | null> {
    const { hotel, rooms } = this.s;
    if (hotel.slug !== hotelRef && hotel.id !== hotelRef) return null;
    const room = rooms.find((r) => r.qrToken === roomRef || r.id === roomRef);
    if (!room) return null;
    const stay = this.activeStay(room.id);
    const guestFirstName = hotel.segment === "motel" ? null : (stay?.guestName.split(" ")[0] ?? null);
    return { hotel: clone(hotel), room: clone(room), canChargeToRoom: Boolean(stay?.rfidUid), guestFirstName };
  }

  async getCatalog(roomId: string): Promise<CatalogItem[]> {
    return this.s.products.map((p) => ({
      ...clone(p),
      available: this.s.inventory.get(invKey(roomId, p.id))?.quantity ?? 0,
    }));
  }

  async createTransaction(input: CreateTransactionInput): Promise<Transaction> {
    const room = this.s.rooms.find((r) => r.id === input.roomId);
    if (!room) throw new DomainError("not_found");
    const stay = this.activeStay(room.id);
    if (input.method === "room_charge" && !stay?.rfidUid) throw new DomainError("no_active_stay");

    // Preço e nome SEMPRE vêm do servidor — nunca do cliente.
    const items = input.items.map((line) => {
      const p = this.s.products.find((x) => x.id === line.productId);
      if (!p) throw new DomainError("invalid_items");
      const stock = this.s.inventory.get(invKey(room.id, line.productId))?.quantity ?? 0;
      if (stock < line.quantity) throw new DomainError("out_of_stock", p.name);
      return { productId: p.id, productName: p.name, unitPriceCents: p.priceCents, quantity: line.quantity };
    });

    const now = Date.now();
    const tx: Transaction = {
      id: randomUUID(),
      hotelId: room.hotelId,
      roomId: room.id,
      roomNumber: room.number,
      stayId: stay?.id ?? null,
      publicToken: randomUUID(),
      method: input.method,
      status: "pending",
      totalCents: items.reduce((s, i) => s + i.unitPriceCents * i.quantity, 0),
      items,
      pixCopyPaste: null,
      expiresAt: new Date(now + PIX_TTL_MS).toISOString(),
      authorizedAt: null,
      failureReason: null,
      createdAt: new Date(now).toISOString(),
    };
    this.s.transactions.unshift(tx);
    return clone(tx);
  }

  async attachPixCharge(transactionId: string, charge: { externalId: string; copyPaste: string }): Promise<void> {
    const tx = this.s.transactions.find((t) => t.id === transactionId);
    if (tx) tx.pixCopyPaste = charge.copyPaste;
  }

  async getPublicTransaction(publicToken: string): Promise<PublicTransaction | null> {
    this.sweepExpired();
    const tx = this.s.transactions.find((t) => t.publicToken === publicToken);
    return tx ? toPublic(clone(tx)) : null;
  }

  async getTransactionById(id: string): Promise<Transaction | null> {
    const tx = this.s.transactions.find((t) => t.id === id);
    return tx ? clone(tx) : null;
  }

  async getTransactionByToken(publicToken: string): Promise<Transaction | null> {
    const tx = this.s.transactions.find((t) => t.publicToken === publicToken);
    return tx ? clone(tx) : null;
  }

  async authorizeTransaction(transactionId: string): Promise<AuthorizeResult> {
    const tx = this.s.transactions.find((t) => t.id === transactionId);
    if (!tx) return { ok: false, status: "not_found" };
    if (tx.status === "authorized") return { ok: true, status: "authorized" }; // idempotente
    if (tx.status !== "pending") return { ok: false, status: tx.status };

    if (new Date(tx.expiresAt).getTime() < Date.now() && tx.method === "room_charge") {
      tx.status = "expired";
      return { ok: false, status: "expired" };
    }

    // 1) confere tudo antes de abater qualquer item
    for (const item of tx.items) {
      const row = this.s.inventory.get(invKey(tx.roomId, item.productId));
      if (!row || row.quantity < item.quantity) {
        tx.status = "failed";
        tx.failureReason = "out_of_stock";
        return { ok: false, status: "failed", reason: "out_of_stock" };
      }
    }
    // 2) abate
    for (const item of tx.items) {
      const row = this.s.inventory.get(invKey(tx.roomId, item.productId))!;
      row.quantity -= item.quantity;
    }
    // 3) autoriza
    tx.status = "authorized";
    tx.authorizedAt = new Date().toISOString();
    const room = this.s.rooms.find((r) => r.id === tx.roomId);
    if (room) {
      room.lockState = "unlocked";
      // O ESP32 real reporta o estado; no demo, a trava volta sozinha após 15 s.
      setTimeout(() => {
        room.lockState = "locked";
      }, 15_000);
    }
    return { ok: true, status: "authorized", roomId: tx.roomId };
  }

  async getRoomById(roomId: string): Promise<Room | null> {
    const room = this.s.rooms.find((r) => r.id === roomId);
    return room ? clone(room) : null;
  }

  async findRoomByDeviceId(deviceId: string): Promise<Room | null> {
    const room = this.s.rooms.find((r) => r.deviceId === deviceId);
    return room ? clone(room) : null;
  }

  async findPendingRoomCharge(roomId: string): Promise<Transaction | null> {
    this.sweepExpired();
    const tx = this.s.transactions.find((t) => t.roomId === roomId && t.method === "room_charge" && t.status === "pending");
    return tx ? clone(tx) : null;
  }

  async findActiveStay(roomId: string): Promise<Stay | null> {
    const st = this.activeStay(roomId);
    return st ? clone(st) : null;
  }

  async listGuestTransactions(roomId: string): Promise<Transaction[]> {
    const stay = this.activeStay(roomId);
    return this.s.transactions
      .filter((t) => t.roomId === roomId && t.status === "authorized" && (!stay || t.stayId === stay.id))
      .sort((a, b) => (b.authorizedAt ?? b.createdAt).localeCompare(a.authorizedAt ?? a.createdAt))
      .map(clone);
  }

  async createSupportRequest(input: CreateSupportInput): Promise<SupportRequest> {
    const room = this.s.rooms.find((r) => r.id === input.roomId && r.hotelId === input.hotelId);
    if (!room) throw new DomainError("not_found");
    const req: SupportRequest = {
      id: randomUUID(),
      hotelId: room.hotelId,
      roomId: room.id,
      roomNumber: room.number,
      kind: input.kind,
      note: input.note?.trim() || null,
      transactionToken: input.transactionToken ?? null,
      createdAt: new Date().toISOString(),
    };
    (this.s.supportRequests ??= []).unshift(req); // ??= cobre o banco em memória criado antes deste campo existir (hot-reload)
    return clone(req);
  }

  async touchDevice(roomId: string): Promise<void> {
    const room = this.s.rooms.find((r) => r.id === roomId);
    if (room) {
      room.deviceOnline = true;
      room.deviceLastSeenAt = new Date().toISOString();
    }
  }

  // ── Admin ────────────────────────────────────────────────────
  async getAdminHotel(): Promise<Hotel | null> {
    return clone(this.s.hotel);
  }

  async listRecentTransactions(hotelId: string, limit: number): Promise<Transaction[]> {
    return clone(
      this.s.transactions
        .filter((t) => t.hotelId === hotelId && t.status === "authorized")
        .sort((a, b) => (b.authorizedAt ?? "").localeCompare(a.authorizedAt ?? ""))
        .slice(0, limit),
    );
  }

  async getDashboardSnapshot(hotelId: string): Promise<DashboardSnapshot> {
    const dayStart = startOfDayInTz(TZ).getTime();
    const todays = this.s.transactions.filter(
      (t) =>
        t.hotelId === hotelId &&
        t.status === "authorized" &&
        new Date(t.authorizedAt ?? t.createdAt).getTime() >= dayStart,
    );
    return buildDashboardSnapshot({
      todays: clone(todays),
      recent: await this.listRecentTransactions(hotelId, 12),
      needs: await this.listRestockNeeds(hotelId),
      summaries: await this.listRoomSummaries(hotelId),
      tz: TZ,
    });
  }

  async listRoomSummaries(hotelId: string): Promise<RoomSummary[]> {
    const needs = await this.listRestockNeeds(hotelId);
    return this.s.rooms
      .filter((r) => r.hotelId === hotelId)
      .map((room) => {
        const stay = this.activeStay(room.id);
        const spent = this.s.transactions
          .filter((t) => stay && t.stayId === stay.id && t.status === "authorized")
          .reduce((sum, t) => sum + t.totalCents, 0);
        return {
          room: clone(room),
          guestName: stay?.guestName ?? null,
          restockCount: needs.filter((n) => n.roomId === room.id).length,
          spentCents: spent,
        };
      })
      .sort((a, b) => a.room.number.localeCompare(b.room.number));
  }

  async getRoomDetail(hotelId: string, roomNumber: string): Promise<RoomDetail | null> {
    const room = this.s.rooms.find((r) => r.hotelId === hotelId && r.number === roomNumber);
    if (!room) return null;
    const stay = this.activeStay(room.id);
    const transactions = this.s.transactions
      .filter((t) => (stay ? t.stayId === stay.id : t.roomId === room.id))
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    const authorized = transactions.filter((t) => t.status === "authorized");
    const inventory = this.s.products.map((p) => {
      const row = this.s.inventory.get(invKey(room.id, p.id));
      return {
        productId: p.id,
        productName: p.name,
        iconKey: p.iconKey,
        quantity: row?.quantity ?? 0,
        minLevel: row?.minLevel ?? 0,
        parLevel: row?.parLevel ?? 0,
      };
    });
    return clone({
      room,
      stay,
      inventory,
      transactions,
      paidPixCents: authorized.filter((t) => t.method === "pix").reduce((s, t) => s + t.totalCents, 0),
      roomChargeCents: authorized.filter((t) => t.method === "room_charge").reduce((s, t) => s + t.totalCents, 0),
    });
  }

  async listRestockNeeds(hotelId: string): Promise<RestockNeed[]> {
    const needs: RestockNeed[] = [];
    for (const room of this.s.rooms.filter((r) => r.hotelId === hotelId)) {
      for (const p of this.s.products) {
        const row = this.s.inventory.get(invKey(room.id, p.id));
        if (row && row.quantity <= row.minLevel) {
          needs.push({
            roomId: room.id,
            roomNumber: room.number,
            floor: room.floor,
            productId: p.id,
            productName: p.name,
            iconKey: p.iconKey,
            quantity: row.quantity,
            minLevel: row.minLevel,
            parLevel: row.parLevel,
            missing: row.parLevel - row.quantity,
          });
        }
      }
    }
    return needs.sort((a, b) => a.roomNumber.localeCompare(b.roomNumber) || a.productName.localeCompare(b.productName));
  }

  async confirmRestock(roomId: string, productId: string | null): Promise<number> {
    let count = 0;
    for (const row of this.s.inventory.values()) {
      if (row.roomId !== roomId) continue;
      if (productId && row.productId !== productId) continue;
      if (row.quantity <= row.minLevel) {
        row.quantity = row.parLevel;
        count++;
      }
    }
    const room = this.s.rooms.find((r) => r.id === roomId);
    if (room) room.lockState = "locked";
    return count;
  }
}

export const mockRepository: Repository = new MockRepository();
