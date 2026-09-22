"use client";
import { ArrowRight, ShoppingBag, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { cartTotals, useCart } from "@/components/guest/cart-context";
import { Button, buttonClasses } from "@/components/ui/button";
import { ProductTile } from "@/components/ui/product-icon";
import { Sheet } from "@/components/ui/sheet";
import { Stepper } from "@/components/ui/stepper";
import { guestCopy } from "@/lib/content/copy";
import { formatBRL } from "@/lib/utils";
import type { CatalogItem } from "@/lib/types";

/** SEÇÃO · Barra flutuante do carrinho + gaveta com o pedido. */
export function CartBar({ catalog, checkoutHref }: { catalog: CatalogItem[]; checkoutHref: string }) {
  const { linesFor, setQuantity, clear, ready } = useCart();
  const [open, setOpen] = useState(false);
  const lines = linesFor(catalog);
  const { count, cents } = cartTotals(lines);

  if (!ready || count === 0) return null;

  return (
    <>
      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 mx-auto max-w-lg px-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
        <button
          onClick={() => setOpen(true)}
          className="glass-strong pointer-events-auto flex w-full animate-fade-up items-center gap-3 rounded-full p-2 pr-5 text-left transition active:scale-[0.98]"
        >
          <span className="glass-tint relative grid size-12 place-items-center rounded-full bg-brand-700/85 text-white">
            <ShoppingBag className="size-5" />
            <span className="tabular absolute -right-1 -top-1 grid size-5 place-items-center rounded-full bg-gold-500 text-[11px] font-bold text-ink">
              {count}
            </span>
          </span>
          <span className="flex-1 text-sm font-semibold text-ink">{guestCopy.catalog.cartCta(count)}</span>
          <span className="tabular text-base font-bold text-brand-700">{formatBRL(cents)}</span>
        </button>
      </div>

      <Sheet
        open={open}
        onClose={() => setOpen(false)}
        title="Seu pedido"
        footer={
          <div className="space-y-3">
            <div className="flex items-baseline justify-between">
              <span className="text-sm text-ink-soft">Total</span>
              <span className="tabular text-2xl font-bold text-ink">{formatBRL(cents)}</span>
            </div>
            <Link href={checkoutHref} className={buttonClasses("primary", "lg", "w-full")}>
              Continuar
              <ArrowRight className="size-5" />
            </Link>
          </div>
        }
      >
        <ul className="divide-y divide-brand-700/10">
          {lines.map(({ item, quantity }) => (
            <li key={item.id} className="flex items-center gap-3 py-3">
              <ProductTile iconKey={item.iconKey} className="size-14 shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-ink">{item.name}</p>
                <p className="tabular text-sm text-ink-soft">{formatBRL(item.priceCents)}</p>
              </div>
              <Stepper label={item.name} value={quantity} max={item.available} onChange={(n) => setQuantity(item.id, n)} />
            </li>
          ))}
        </ul>
        <Button variant="ghost" size="sm" className="my-2" icon={<Trash2 className="size-4" />} onClick={() => { clear(); setOpen(false); }}>
          Limpar pedido
        </Button>
      </Sheet>
    </>
  );
}
