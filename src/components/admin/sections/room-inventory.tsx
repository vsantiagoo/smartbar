"use client";
import { Badge } from "@/components/ui/badge";
import { GlassCard, SectionTitle } from "@/components/ui/glass-card";
import { Meter } from "@/components/ui/primitives";
import { ProductTile } from "@/components/ui/product-icon";
import type { RoomInventoryLine } from "@/lib/types";
import { useI18n } from "@/lib/i18n/client";

/** SEÇÃO · Estoque do frigobar deste quarto (nível atual × nível ideal). */
export function RoomInventory({ lines }: { lines: RoomInventoryLine[] }) {
  const { t } = useI18n();
  return (
    <GlassCard>
      <SectionTitle title={t("admin.room.minibar")} hint={t("admin.room.minibarHint")} />
      <ul className="space-y-4">
        {lines.map((l) => {
          const low = l.quantity <= l.minLevel;
          return (
            <li key={l.productId} className="flex items-center gap-3">
              <ProductTile iconKey={l.iconKey} className="size-11 shrink-0 rounded-2xl" />
              <div className="min-w-0 flex-1">
                <div className="mb-1.5 flex items-center justify-between gap-2">
                  <span className="truncate text-sm font-medium text-ink">{l.productName}</span>
                  <span className="tabular flex shrink-0 items-center gap-2 text-sm">
                    {low && <Badge tone="danger">{t("admin.room.restock")}</Badge>}
                    <span className="font-semibold text-ink">{l.quantity}</span>
                    <span className="text-ink-faint">/ {l.parLevel}</span>
                  </span>
                </div>
                <Meter value={l.quantity} max={l.parLevel} tone={l.quantity === 0 ? "danger" : low ? "warn" : "ok"} label={t("admin.room.stockMeter", { name: l.productName })} />
              </div>
            </li>
          );
        })}
      </ul>
    </GlassCard>
  );
}
