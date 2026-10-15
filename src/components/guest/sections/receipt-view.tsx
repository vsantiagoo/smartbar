"use client";
import { ArrowLeft, Printer } from "lucide-react";
import Link from "next/link";
import { useGuest } from "@/components/guest/guest-context";
import { LogoMark } from "@/components/ui/logo";
import { Button } from "@/components/ui/button";
import { formatBRL } from "@/lib/utils";
import type { PaymentMethod, TransactionItem } from "@/lib/types";

interface ReceiptViewProps {
  baseHref: string;
  code: string;
  at: string;
  method: PaymentMethod;
  totalCents: number;
  items: TransactionItem[];
}

/** SEÇÃO · Recibo detalhado (Pix ou conta do quarto), pronto para imprimir ou salvar em PDF. */
export function ReceiptView({ baseHref, code, at, method, totalCents, items }: ReceiptViewProps) {
  const { t, formatDateTime, room } = useGuest();
  const rows = [
    [t("guest.receipt.hotel"), room.hotelName],
    [t("guest.receipt.room"), room.roomNumber],
    [t("guest.receipt.date"), formatDateTime(at)],
    [t("guest.receipt.method"), method === "pix" ? t("guest.consumption.pix") : t("guest.consumption.room")],
    [t("guest.receipt.status"), method === "pix" ? t("guest.receipt.status.paid") : t("guest.receipt.status.charged")],
    [t("guest.receipt.code"), code],
  ] as const;

  return (
    <div className="space-y-5">
      <Link href={`${baseHref}/consumo`} className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-soft hover:text-ink print:hidden">
        <ArrowLeft className="size-4" /> {t("guest.receipt.back")}
      </Link>

      <article className="glass-strong rounded-[32px] p-6 print:rounded-none print:border-0 print:bg-white print:p-0 print:shadow-none">
        <header className="flex items-center gap-3 border-b border-brand-700/10 pb-4">
          <LogoMark tone="brand" intro={false} className="size-10" />
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-500">SmartBar</p>
            <h1 className="text-xl font-bold leading-tight">{t("guest.receipt.title")}</h1>
          </div>
        </header>

        <dl className="mt-4 space-y-2 text-sm">
          {rows.map(([k, v]) => (
            <div key={k} className="flex justify-between gap-4">
              <dt className="text-ink-soft">{k}</dt>
              <dd className="tabular text-right font-medium text-ink">{v}</dd>
            </div>
          ))}
        </dl>

        <ul className="mt-5 space-y-2 border-t border-brand-700/10 pt-4">
          {items.map((i) => (
            <li key={i.productId} className="flex items-baseline justify-between gap-3 text-[0.95rem]">
              <span className="min-w-0 text-ink">
                <span className="tabular mr-2 font-semibold text-ink-soft">{i.quantity}×</span>
                {i.productName}
                <span className="tabular ml-2 text-xs text-ink-soft">({formatBRL(i.unitPriceCents)})</span>
              </span>
              <span className="tabular shrink-0 font-medium">{formatBRL(i.quantity * i.unitPriceCents)}</span>
            </li>
          ))}
        </ul>
        <div className="mt-4 flex items-baseline justify-between border-t border-brand-700/10 pt-4">
          <span className="font-medium text-ink-soft">{t("guest.cart.total")}</span>
          <span className="tabular text-2xl font-bold text-ink">{formatBRL(totalCents)}</span>
        </div>
        <p className="mt-5 text-xs leading-snug text-ink-soft">{t("guest.receipt.footer")}</p>
      </article>

      <Button size="lg" className="w-full print:hidden" icon={<Printer className="size-5" />} onClick={() => window.print()}>
        {t("guest.receipt.print")}
      </Button>
    </div>
  );
}
