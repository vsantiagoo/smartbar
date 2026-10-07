"use client";
import { PackageOpen, Plus } from "lucide-react";
import { useMemo, useState } from "react";
import { useCart } from "@/components/guest/cart-context";
import { useGuest } from "@/components/guest/guest-context";
import { Badge } from "@/components/ui/badge";
import { ProductTile } from "@/components/ui/product-icon";
import { Segmented } from "@/components/ui/segmented";
import { Stepper } from "@/components/ui/stepper";
import { EmptyState } from "@/components/ui/primitives";
import { translateProduct, type GuestKey } from "@/lib/i18n/guest";
import { cn, formatBRL } from "@/lib/utils";
import type { CatalogItem } from "@/lib/types";

/** Ordem fixa das abas da especificação; categorias novas entram no fim com o próprio nome. */
const CATEGORY_ORDER = ["bebida", "snack", "adega", "conveniencia"];
const LOW_STOCK = 1;

/** SEÇÃO · Lista de produtos com filtro por categoria, selos e controle de quantidade. */
export function ProductList({ catalog }: { catalog: CatalogItem[] }) {
  const { quantities, setQuantity } = useCart();
  const { t, lang } = useGuest();
  const [category, setCategory] = useState<string>("all");

  const categories = useMemo(() => {
    const present = [...new Set(catalog.map((p) => p.category))];
    return present.sort((a, b) => (CATEGORY_ORDER.indexOf(a) + 1 || 99) - (CATEGORY_ORDER.indexOf(b) + 1 || 99));
  }, [catalog]);
  const categoryLabel = (c: string) => (CATEGORY_ORDER.includes(c) ? t(`cat.${c}` as GuestKey) : c);
  const visible = catalog.filter((p) => category === "all" || p.category === category);

  if (catalog.length === 0) return <EmptyState icon={PackageOpen} title={t("catalog.empty")} />;

  return (
    <section aria-label={t("nav.catalog")}>
      <Segmented
        label={t("catalog.filter")}
        value={category}
        onChange={setCategory}
        className="mb-4"
        options={[
          { value: "all", label: t("catalog.all"), count: catalog.length },
          ...categories.map((c) => ({ value: c, label: categoryLabel(c) })),
        ]}
      />
      <ul className="space-y-2.5">
        {visible.map((p) => {
          const qty = quantities[p.id] ?? 0;
          const soldOut = p.available <= 0;
          const tr = translateProduct(lang, p.sku);
          const displayName = tr?.name ?? p.name;
          const displayDesc = tr?.description ?? p.description;
          return (
            <li
              key={p.id}
              className={cn("glass flex items-center gap-3 rounded-[28px] p-3 pr-4 transition sm:gap-4", soldOut && "opacity-60")}
            >
              <ProductTile iconKey={p.iconKey} className="size-14 shrink-0 sm:size-[72px]" />
              <div className="min-w-0 flex-1">
                <p className="font-heading font-semibold leading-snug text-ink">{displayName}</p>
                <p className="truncate text-sm text-ink-soft">{displayDesc}</p>
                <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                  <span className="tabular mr-1 font-bold text-brand-700">{formatBRL(p.priceCents)}</span>
                  {soldOut ? (
                    <Badge tone="neutral">{t("catalog.soldOut")}</Badge>
                  ) : p.available <= LOW_STOCK ? (
                    <Badge tone="warn">{t("catalog.onlyLeft", { n: p.available })}</Badge>
                  ) : null}
                  {!soldOut &&
                    p.tags?.map((tag) => (
                      <Badge key={tag} tone={tag === "cold" ? "info" : "ok"}>
                        {t(`tag.${tag}` as GuestKey)}
                      </Badge>
                    ))}
                </div>
              </div>
              {soldOut ? null : qty === 0 ? (
                <button
                  onClick={() => setQuantity(p.id, 1)}
                  aria-label={t("catalog.add", { name: displayName })}
                  className="glass-tint grid size-11 shrink-0 place-items-center rounded-full bg-brand-700/85 text-white transition hover:bg-brand-800/90 active:scale-90"
                >
                  <Plus className="size-5" />
                </button>
              ) : (
                <Stepper label={displayName} value={qty} max={p.available} onChange={(n) => setQuantity(p.id, n)} />
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
