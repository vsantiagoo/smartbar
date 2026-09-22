"use client";
import { mockBus } from "@/lib/realtime/mock-bus";

/**
 * DEMO: dispara as simulações do backend e avisa as outras abas (admin) pelo
 * barramento do modo demo. Em produção, quem avisa é o próprio Supabase Realtime.
 */
async function call(path: string, token: string): Promise<boolean> {
  const res = await fetch(path, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ token }) });
  if (!res.ok) return false;
  mockBus.publish({ type: "tx-status", token, status: "authorized" });
  mockBus.publish({ type: "transactions-changed" });
  return true;
}

export const simulatePixPayment = (token: string) => call("/api/mock/pix/pay", token);
export const simulateRfidTap = (token: string) => call("/api/mock/rfid/tap", token);
