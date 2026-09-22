"use client";
import type { TransactionStatus } from "@/lib/types";

/**
 * Barramento do MODO DEMO: imita o Supabase Realtime entre abas do mesmo
 * navegador (BroadcastChannel). Entre aparelhos diferentes, o polling dos hooks
 * cobre a diferença. Em produção este arquivo não é usado.
 */
export type BusEvent =
  | { type: "transactions-changed" }
  | { type: "tx-status"; token: string; status: TransactionStatus };

const CHANNEL = "smartbar-demo-bus";
type Listener = (event: BusEvent) => void;
const listeners = new Set<Listener>();
let channel: BroadcastChannel | null = null;

function ensureChannel(): BroadcastChannel | null {
  if (typeof BroadcastChannel === "undefined") return null;
  if (!channel) {
    channel = new BroadcastChannel(CHANNEL);
    channel.onmessage = (e: MessageEvent<BusEvent>) => listeners.forEach((l) => l(e.data));
  }
  return channel;
}

export const mockBus = {
  publish(event: BusEvent): void {
    ensureChannel()?.postMessage(event);
    listeners.forEach((l) => l(event)); // mesma aba (BroadcastChannel não entrega para si mesmo)
  },
  subscribe(listener: Listener): () => void {
    ensureChannel();
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
};
