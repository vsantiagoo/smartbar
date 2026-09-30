"use client";
import { BedDouble, Receipt, QrCode } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { GlassCard, SectionTitle } from "@/components/ui/glass-card";
import { EmptyState, LiveDot } from "@/components/ui/primitives";
import { adminCopy } from "@/lib/content/copy";
import { useNow } from "@/lib/realtime/use-now";
import { cn, formatBRL, timeAgo } from "@/lib/utils";
import type { Transaction } from "@/lib/types";

/** SEÇÃO · Feed de vendas aprovadas em tempo real (Supabase Realtime). */
export function LiveFeed({ transactions, freshIds, bare = false }: { transactions: Transaction[]; freshIds: ReadonlySet<string>; bare?: boolean }) {
  const now = useNow();
  const c = adminCopy.dashboard;

  const body = (
    <>
      {transactions.length === 0 ? (
        <EmptyState icon={Receipt} title={c.feedEmpty} />
      ) : (
        <ul className="-mx-2 space-y-1">
          {transactions.map((t) => {
            const fresh = freshIds.has(t.id);
            const Icon = t.method === "pix" ? QrCode : BedDouble;
            const qty = t.items.reduce((s, i) => s + i.quantity, 0);
            return (
              <li key={t.id} className={cn("rounded-3xl px-2 py-2.5", fresh && "animate-flash-in")}>
                <Link href={`/admin/quartos/${t.roomNumber}`} className="flex items-center gap-3">
                  <span className="grid size-11 shrink-0 place-items-center rounded-2xl glass-chip bg-brand-700/10 text-brand-700">
                    <Icon className="size-5" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex flex-wrap items-center gap-2 text-[0.95rem] font-semibold text-ink">
                      Quarto {t.roomNumber}
                      {fresh && <Badge tone="gold">Novo</Badge>}
                    </span>
                    <span className="block truncate text-sm text-ink-soft">
                      {qty} {qty === 1 ? "item" : "itens"} · {t.items.map((i) => i.productName).join(", ")}
                    </span>
                  </span>
                  <span className="shrink-0 text-right">
                    <span className="tabular block font-bold text-ink">{formatBRL(t.totalCents)}</span>
                    <span className="block text-xs text-ink-faint">
                      {t.method === "pix" ? "Pix" : "Na conta"}
                      {now !== null && ` · ${timeAgo(t.authorizedAt ?? t.createdAt, now)}`}
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
      <SectionTitle title={c.feedTitle} hint={c.feedHint} action={<LiveDot />} />
      {body}
    </GlassCard>
  );
}
