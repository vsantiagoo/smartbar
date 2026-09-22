import type {
  CatalogItem,
  DashboardSnapshot,
  Hotel,
  PaymentMethod,
  PublicTransaction,
  RestockNeed,
  Room,
  RoomDetail,
  RoomSummary,
  Stay,
  Transaction,
} from "@/lib/types";

export type DomainErrorCode =
  | "not_found"
  | "out_of_stock"
  | "no_active_stay"
  | "invalid_items"
  | "forbidden"
  | "unavailable";

export class DomainError extends Error {
  constructor(
    public readonly code: DomainErrorCode,
    message?: string,
  ) {
    super(message ?? code);
    this.name = "DomainError";
  }
}

export interface GuestContext {
  hotel: Hotel;
  room: Room;
  /** Só é possível "lançar na conta" se houver estadia ativa com cartão RFID. */
  canChargeToRoom: boolean;
}

export interface CreateTransactionInput {
  hotelId: string;
  roomId: string;
  method: PaymentMethod;
  items: { productId: string; quantity: number }[];
}

export interface AuthorizeResult {
  ok: boolean;
  status: string;
  reason?: string;
  roomId?: string;
}

/**
 * Contrato único de acesso a dados. Há duas implementações:
 *  - supabase/repo.ts  → produção (PostgreSQL + RLS + RPCs atômicas)
 *  - mock/repo.ts      → modo demo (memória), mesma semântica
 */
export interface Repository {
  // ── Web App do Hóspede ────────────────────────────────────────
  getGuestContext(hotelRef: string, roomRef: string): Promise<GuestContext | null>;
  getCatalog(roomId: string): Promise<CatalogItem[]>;
  createTransaction(input: CreateTransactionInput): Promise<Transaction>;
  attachPixCharge(transactionId: string, charge: { externalId: string; copyPaste: string }): Promise<void>;
  getPublicTransaction(publicToken: string): Promise<PublicTransaction | null>;
  getTransactionById(id: string): Promise<Transaction | null>;
  getTransactionByToken(publicToken: string): Promise<Transaction | null>;
  /** Abate o estoque e autoriza — atômico e idempotente. */
  authorizeTransaction(transactionId: string, by: "pix_webhook" | "rfid"): Promise<AuthorizeResult>;
  getRoomById(roomId: string): Promise<Room | null>;
  findRoomByDeviceId(deviceId: string): Promise<Room | null>;
  findPendingRoomCharge(roomId: string): Promise<Transaction | null>;
  findActiveStay(roomId: string): Promise<Stay | null>;
  touchDevice(roomId: string): Promise<void>;

  // ── Painel Admin ──────────────────────────────────────────────
  getAdminHotel(): Promise<Hotel | null>;
  getDashboardSnapshot(hotelId: string): Promise<DashboardSnapshot>;
  listRecentTransactions(hotelId: string, limit: number): Promise<Transaction[]>;
  listRoomSummaries(hotelId: string): Promise<RoomSummary[]>;
  getRoomDetail(hotelId: string, roomNumber: string): Promise<RoomDetail | null>;
  listRestockNeeds(hotelId: string): Promise<RestockNeed[]>;
  /** productId omitido = repõe tudo que está abaixo do mínimo no quarto. */
  confirmRestock(roomId: string, productId: string | null): Promise<number>;
}
