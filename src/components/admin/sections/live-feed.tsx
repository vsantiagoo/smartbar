"use client";
import { BedDouble, Receipt, QrCode } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { GlassCard, SectionTitle } from "@/components/ui/glass-card";
import { EmptyState, LiveDot } from "@/components/ui/primitives";
import { useI18n } from "@/lib/i18n/client";
import { useNow } from "@/lib/realtime/use-now";
import { cn, formatBRL, timeAgo } from "@/lib/utils";
import type { Transaction } from "@/lib/types";

/** SEÇÃO · Feed de vendas aprovadas em tempo real (Supabase Realtime). */
export function LiveFeed({ transactions, freshIds, bare = false }: { transactions: Transaction[]; freshIds: ReadonlySet<string>; bare?: boolean }) {
  const now = useNow();
  // `tx` em vez de `t` nos itens: `t` aqui é a função de tradução.
  const { t } = useI18n();

  const body = (
    <>
      {transactions.length === 0 ? (
        <EmptyState icon={Receipt} title={t("admin.dashboard.feedEmpty")} />
      ) : (
        <ul className="-mx-2 space-y-1">
          {transactions.map((tx) => {
            const fresh = freshIds.has(tx.id);
            const Icon = tx.method === "pix" ? QrCode : BedDouble;
            const qty = tx.items.reduce((s, i) => s + i.quantity, 0);
            return (
              <li key={tx.id} className={cn("rounded-3xl px-2 py-2.5", fresh && "animate-flash-in")}>
                <Link href={`/admin/quartos/${tx.roomNumber}`} className="flex items-center gap-3">
                  <span className="grid size-11 shrink-0 place-items-center rounded-2xl glass-chip bg-brand-700/10 text-brand-700">
                    <Icon className="size-5" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex flex-wrap items-center gap-2 text-[0.95rem] font-semibold text-ink">
                      {t("admin.feed.room", { room: tx.roomNumber })}
                      {fresh && <Badge tone="gold">{t("admin.feed.new")}</Badge>}
                    </span>
                    <span className="block truncate text-sm text-ink-soft">
                      {t("admin.feed.items", { n: qty })} · {tx.items.map((i) => i.productName).join(", ")}
                    </span>
                  </span>
                  <span className="shrink-0 text-right">
                    <span className="tabular block font-bold text-ink">{formatBRL(tx.totalCents)}</span>
                    <span className="block text-xs text-ink-faint">
                      {tx.method === "pix" ? t("admin.feed.pix") : t("admin.feed.account")}
                      {now !== null && ` · ${timeAgo(tx.authorizedAt ?? tx.createdAt, now)}`}
                    </span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </>
  );

  if (bare) return body;
  return (
    <GlassCard className="h-full">
      <SectionTitle title={t("admin.dashboard.feedTitle")} hint={t("admin.dashboard.feedHint")} action={<LiveDot />} />
      {body}
    </GlassCard>
  );
}
