"use client";
import { ArrowLeft, ShieldCheck, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { cartTotals, useCart } from "@/components/guest/cart-context";
import { useGuest } from "@/components/guest/guest-context";
import { OrderSummary } from "@/components/guest/sections/order-summary";
import { PaymentMethods } from "@/components/guest/sections/payment-methods";
import { Button, buttonClasses } from "@/components/ui/button";
import { EmptyState, Skeleton } from "@/components/ui/primitives";
import { formatBRL } from "@/lib/utils";
import type { CatalogItem, PaymentMethod } from "@/lib/types";

interface CheckoutScreenProps {
  catalog: CatalogItem[];
  hotelId: string;
  roomId: string;
  canChargeToRoom: boolean;
  baseHref: string;
}

/**
 * TELA · Checkout. Cria o pedido no servidor (preços e estoque são revalidados
 * lá) e segue para a tela de acompanhamento /pedido/[token].
 */
export function CheckoutScreen({ catalog, hotelId, roomId, canChargeToRoom, baseHref }: CheckoutScreenProps) {
  const router = useRouter();
  const { linesFor, clear, ready } = useCart();
  const { t } = useGuest();
  const [method, setMethod] = useState<PaymentMethod>("pix");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const lines = linesFor(catalog);
  const { cents } = cartTotals(lines);

  if (!ready) return <Skeleton className="h-64 w-full rounded-card" />;
  if (lines.length === 0) {
    return (
      <EmptyState
        icon={ShoppingBag}
        title={t("guest.checkout.empty.title")}
        description={t("guest.checkout.empty.text")}
        action={
          <Link href={baseHref} className={buttonClasses("primary")}>
            {t("guest.checkout.empty.action")}
          </Link>
        }
      />
    );
  }

  async function submit() {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          hotelId,
          roomId,
          method,
          items: lines.map((l) => ({ productId: l.item.id, quantity: l.quantity })),
        }),
      });
      const data = (await res.json()) as { token?: string; error?: string; code?: string };
      if (!res.ok || !data.token) {
        setError(data.code === "out_of_stock" ? t("guest.error.stock") : (data.error ?? t("guest.failure.default")));
        setBusy(false);
        return;
      }
      clear();
      router.push(`${baseHref}/pedido/${data.token}`);
    } catch {
      setError(t("guest.checkout.offline"));
      setBusy(false);
    }
  }

  return (
    <main className="space-y-6">
      <div>
        <Link href={baseHref} className="mb-3 inline-flex items-center gap-1.5 text-sm font-medium text-ink-soft hover:text-ink">
          <ArrowLeft className="size-4" /> {t("guest.checkout.back")}
        </Link>
        <h1 className="text-[1.75rem] font-bold">{t("guest.checkout.title")}</h1>
        <p className="mt-1 text-ink-soft">{t("guest.checkout.subtitle")}</p>
      </div>

      <OrderSummary
        title={t("guest.checkout.summary")}
        totalLabel={t("guest.cart.total")}
        lines={lines.map((l) => ({ name: l.item.name, quantity: l.quantity, unitPriceCents: l.item.priceCents }))}
      />
      <PaymentMethods value={method} onChange={setMethod} canChargeToRoom={canChargeToRoom} />

      <p className="flex items-start gap-2 px-1 text-sm text-ink-soft">
        <ShieldCheck className="mt-0.5 size-4 shrink-0 text-ok-500" />
        {t("guest.checkout.reassurance")}
      </p>

      {error && (
        <p role="alert" className="rounded-2xl bg-crimson-500/10 px-4 py-3 text-sm font-medium text-crimson-600">
          {error}
        </p>
      )}

      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 mx-auto max-w-lg px-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
        <div className="glass-strong pointer-events-auto rounded-panel p-3">
          <Button variant="accent" size="lg" className="w-full" loading={busy} onClick={submit}>
            {method === "pix" ? t("guest.checkout.pix.cta") : t("guest.checkout.room.cta")} · {formatBRL(cents)}
          </Button>
        </div>
      </div>
    </main>
  );
}
