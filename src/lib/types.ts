/** Tipos de domínio do SmartBar. Espelham o schema em supabase/migrations. */

export type PaymentMethod = "pix" | "room_charge";
export type TransactionStatus = "pending" | "authorized" | "failed" | "expired" | "cancelled";
export type LockState = "locked" | "unlocked";
export type PlanTier = "basic" | "plus" | "premium";

export interface HotelBrand {
  primary?: string;
  accent?: string;
  logoUrl?: string;
}

export interface Hotel {
  id: string;
  slug: string;
  name: string;
  plan: PlanTier;
  brand: HotelBrand;
}

export interface Room {
  id: string;
  hotelId: string;
  number: string;
  floor: number | null;
  qrToken: string;
  deviceId: string | null;
  deviceOnline: boolean;
  deviceLastSeenAt: string | null;
  lockState: LockState;
}

export interface Product {
  id: string;
  hotelId: string;
  sku: string | null;
  name: string;
  description: string | null;
  category: string;
  priceCents: number;
  iconKey: string;
  imageUrl: string | null;
}

/** Item da vitrine: produto + quantidade disponível NAQUELE quarto. */
export interface CatalogItem extends Product {
  available: number;
}

export interface TransactionItem {
  productId: string;
  productName: string;
  unitPriceCents: number;
  quantity: number;
}

export interface Transaction {
  id: string;
  hotelId: string;
  roomId: string;
  roomNumber: string;
  stayId: string | null;
  publicToken: string;
  method: PaymentMethod;
  status: TransactionStatus;
  totalCents: number;
  items: TransactionItem[];
  pixCopyPaste: string | null;
  expiresAt: string;
  authorizedAt: string | null;
  failureReason: string | null;
  createdAt: string;
}

/** O que o hóspede (anônimo) pode ver de um pedido. Sem dados pessoais. */
export interface PublicTransaction {
  publicToken: string;
  method: PaymentMethod;
  status: TransactionStatus;
  totalCents: number;
  items: TransactionItem[];
  pixCopyPaste: string | null;
  expiresAt: string;
  authorizedAt: string | null;
  failureReason: string | null;
  roomNumber: string;
}

export interface Stay {
  id: string;
  roomId: string;
  guestName: string;
  rfidUid: string | null;
  status: "active" | "checked_out";
  checkInAt: string;
  checkOutAt: string | null;
}

export interface RestockNeed {
  roomId: string;
  roomNumber: string;
  floor: number | null;
  productId: string;
  productName: string;
  iconKey: string;
  quantity: number;
  minLevel: number;
  parLevel: number;
  missing: number;
}

export interface RoomSummary {
  room: Room;
  guestName: string | null;
  restockCount: number;
  spentCents: number;
}

export interface RoomInventoryLine {
  productId: string;
  productName: string;
  iconKey: string;
  quantity: number;
  minLevel: number;
  parLevel: number;
}

export interface RoomDetail {
  room: Room;
  stay: Stay | null;
  inventory: RoomInventoryLine[];
  transactions: Transaction[];
  /** Pago via Pix durante a estadia (já quitado). */
  paidPixCents: number;
  /** Lançado na conta do quarto (a cobrar no check-out). */
  roomChargeCents: number;
}

/** Linha resumida de quarto para a home da recepção (busca, travas, reposição). */
export interface DashboardRoom {
  number: string;
  floor: number | null;
  guestName: string | null;
  deviceId: string | null;
  deviceOnline: boolean;
  lockState: LockState;
  lastSeenAt: string | null;
  restockCount: number;
}

export interface DashboardSnapshot {
  revenueTodayCents: number;
  transactionsToday: number;
  avgTicketCents: number;
  roomsNeedingRestock: number;
  itemsToRestock: number;
  pixSharePct: number;
  hourly: { hour: number; cents: number }[];
  topProducts: { name: string; quantity: number; cents: number }[];
  recent: Transaction[];
  rooms: DashboardRoom[];
  restockNeeds: RestockNeed[];
}
