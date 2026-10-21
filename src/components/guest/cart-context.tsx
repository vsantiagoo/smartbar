"use client";
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { CatalogItem } from "@/lib/types";

interface CartLine {
  item: CatalogItem;
  quantity: number;
}

interface CartValue {
  quantities: Readonly<Record<string, number>>;
  setQuantity: (productId: string, quantity: number) => void;
  clear: () => void;
  /** Linhas do carrinho resolvidas contra o catálogo atual. */
  linesFor: (catalog: readonly CatalogItem[]) => CartLine[];
  ready: boolean;
}

const CartContext = createContext<CartValue | null>(null);

/**
 * Carrinho do hóspede. Guarda só {produto → quantidade} em sessionStorage
 * (sobrevive a refresh, some ao fechar a aba). Preços SEMPRE vêm do servidor.
 */
export function CartProvider({ roomId, children }: { roomId: string; children: ReactNode }) {
  const storageKey = `smartbar-cart:${roomId}`;
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(storageKey);
      if (raw) setQuantities(JSON.parse(raw) as Record<string, number>);
    } catch {
      /* storage indisponível: segue em memória */
    }
    setReady(true);
  }, [storageKey]);

  useEffect(() => {
    if (!ready) return;
    try {
      sessionStorage.setItem(storageKey, JSON.stringify(quantities));
    } catch {
      /* ignore */
    }
  }, [quantities, ready, storageKey]);

  const setQuantity = useCallback((productId: string, quantity: number) => {
    setQuantities((prev) => {
      const next = { ...prev };
      if (quantity <= 0) delete next[productId];
      else next[productId] = quantity;
      return next;
    });
  }, []);

  const clear = useCallback(() => setQuantities({}), []);

  const linesFor = useCallback(
    (catalog: readonly CatalogItem[]): CartLine[] =>
      catalog
        .filter((item) => (quantities[item.id] ?? 0) > 0)
        .map((item) => ({ item, quantity: Math.min(quantities[item.id]!, item.available) }))
        .filter((l) => l.quantity > 0),
    [quantities],
  );

  const value = useMemo(() => ({ quantities, setQuantity, clear, linesFor, ready }), [quantities, setQuantity, clear, linesFor, ready]);
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart fora do CartProvider");
  return ctx;
}

export function cartTotals(lines: readonly CartLine[]): { count: number; cents: number } {
  return lines.reduce((t, l) => ({ count: t.count + l.quantity, cents: t.cents + l.quantity * l.item.priceCents }), { count: 0, cents: 0 });
}
