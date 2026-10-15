"use client";
import { ShoppingBag, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { cartTotals, useCart } from "@/components/guest/cart-context";
import { useGuest } from "@/components/guest/guest-context";
import { Button, buttonClasses } from "@/components/ui/button";
import { ProductTile } from "@/components/ui/product-icon";
import { Sheet } from "@/components/ui/sheet";
import { Stepper } from "@/components/ui/stepper";
import { formatBRL } from "@/lib/utils";
import type { CatalogItem } from "@/lib/types";

/** SEÇÃO · Barra flutuante do pedido: resumo, total em Doto e o botão dourado "Pagar e Destravar". */
export function CartBar({ catalog, checkoutHref }: { catalog: CatalogItem[]; checkoutHref: string }) {
  const { linesFor, setQuantity, clear, ready } = useCart();
  const { t, room } = useGuest();
  const [open, setOpen] = useState(false);
  const lines = linesFor(catalog);
  const { count, cents } = cartTotals(lines);

  if (!ready || count === 0) return null;

  const cta = room.hasLock ? t("guest.cart.payUnlock") : t("guest.cart.pay");

  return (
    <>
      {/* Fica acima do menu do rodapé (Vitrine · Meu consumo). */}
      <div className="pointer-events-none fixed inset-x-0 bottom-[calc(4.75rem+env(safe-area-inset-bottom))] z-40 mx-auto max-w-lg px-4">
        <div className="glass-strong pointer-events-auto flex w-full animate-fade-up items-center gap-2 rounded-full p-2 pr-2">
          <button
            onClick={() => setOpen(true)}
            aria-label={t("guest.cart.view")}
            className="flex min-w-0 flex-1 items-center gap-3 rounded-full text-left transition active:scale-[0.98]"
          >
            <span className="glass-tint relative grid size-12 shrink-0 place-items-center rounded-full bg-brand-700/85 text-white">
              <ShoppingBag className="size-5" />
              <span className="tabular absolute -right-1 -top-1 grid size-5 place-items-center rounded-full bg-gold-500 text-[11px] font-bold text-ink">
                {count}
              </span>
            </span>
            <span className="min-w-0 leading-tight">
              <span className="block text-xs text-ink-soft">{t("guest.cart.items", { n: count })}</span>
              <span className="tabular mt-1 block text-xl font-bold text-brand-700 dark:text-white">{formatBRL(cents)}</span>
            </span>
          </button>
          <Link href={checkoutHref} className={buttonClasses("accent", "md", "h-12 shrink-0 px-5 text-[0.95rem]")}>
            {cta}
          </Link>
        </div>
      </div>

      <Sheet
        open={open}
        onClose={() => setOpen(false)}
        title={t("guest.cart.title")}
        footer={
          <div className="space-y-3">
            <div className="flex items-baseline justify-between">
              <span className="text-sm text-ink-soft">{t("guest.cart.total")}</span>
              <span className="tabular text-2xl font-bold text-ink">{formatBRL(cents)}</span>
            </div>
            <Link href={checkoutHref} className={buttonClasses("accent", "lg", "w-full")}>
              {cta}
            </Link>
          </div>
        }
      >
        <ul className="divide-y divide-brand-700/10">
          {lines.map(({ item, quantity }) => (
            <li key={item.id} className="flex items-center gap-3 py-3">
              <ProductTile sku={item.sku} iconKey={item.iconKey} className="size-14 shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-ink">{item.name}</p>
                <p className="tabular text-sm text-ink-soft">{formatBRL(item.priceCents)}</p>
              </div>
              <Stepper label={item.name} value={quantity} max={item.available} onChange={(n) => setQuantity(item.id, n)} />
            </li>
          ))}
        </ul>
        <Button
          variant="ghost"
          size="sm"
          className="my-2"
          icon={<Trash2 className="size-4" />}
          onClick={() => {
            clear();
            setOpen(false);
          }}
        >
          {t("guest.cart.clear")}
        </Button>
      </Sheet>
    </>
  );
}
