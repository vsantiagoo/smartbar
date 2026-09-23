"use client";
import { Plus } from "lucide-react";
import { useMemo, useState } from "react";
import { useCart } from "@/components/guest/cart-context";
import { Badge } from "@/components/ui/badge";
import { ProductTile } from "@/components/ui/product-icon";
import { Segmented } from "@/components/ui/segmented";
import { Stepper } from "@/components/ui/stepper";
import { EmptyState } from "@/components/ui/primitives";
import { guestCopy } from "@/lib/content/copy";
import { cn, formatBRL } from "@/lib/utils";
import type { CatalogItem } from "@/lib/types";
import { PackageOpen } from "lucide-react";

const CATEGORY_LABEL: Record<string, string> = { bebida: "Bebidas", snack: "Snacks" };

/** SEÇÃO · Lista de produtos com filtro por categoria e adicionar ao carrinho. */
export function ProductList({ catalog }: { catalog: CatalogItem[] }) {
  const { quantities, setQuantity } = useCart();
  const [category, setCategory] = useState<string>("all");
  const copy = guestCopy.catalog;

  const categories = useMemo(() => [...new Set(catalog.map((p) => p.category))], [catalog]);
  const visible = catalog.filter((p) => category === "all" || p.category === category);

  if (catalog.length === 0) return <EmptyState icon={PackageOpen} title={copy.empty} />;

  return (
    <section aria-label="Produtos">
      <Segmented
        label="Filtrar por categoria"
        value={category}
        onChange={setCategory}
        className="mb-4"
        options={[
          { value: "all", label: "Tudo", count: catalog.length },
          ...categories.map((c) => ({ value: c, label: CATEGORY_LABEL[c] ?? c })),
        ]}
      />
      <ul className="space-y-3">
        {visible.map((p) => {
          const qty = quantities[p.id] ?? 0;
          const soldOut = p.available <= 0;
          return (
            <li
              key={p.id}
              className={cn("glass flex items-center gap-3 rounded-[28px] p-3 pr-4 transition sm:gap-4", soldOut && "opacity-60")}
            >
              <ProductTile iconKey={p.iconKey} className="size-14 shrink-0 sm:size-[72px]" />
              <div className="min-w-0 flex-1">
                <p className="font-semibold leading-snug text-ink">{p.name}</p>
                <p className="truncate text-sm text-ink-soft">{p.description}</p>
                <div className="mt-1.5 flex items-center gap-2">
                  <span className="tabular font-bold text-brand-700">{formatBRL(p.priceCents)}</span>
                  {soldOut ? (
                    <Badge tone="neutral">{copy.soldOut}</Badge>
                  ) : p.available <= 1 ? (
                    <Badge tone="warn">{copy.lowStock(p.available)}</Badge>
                  ) : null}
                </div>
              </div>
              {soldOut ? null : qty === 0 ? (
                <button
                  onClick={() => setQuantity(p.id, 1)}
                  aria-label={`Adicionar ${p.name}`}
                  className="glass-tint grid size-11 shrink-0 place-items-center rounded-full bg-brand-700/85 text-white transition hover:bg-brand-800/90 active:scale-90"
                >
                  <Plus className="size-5" />
                </button>
              ) : (
                <Stepper label={p.name} value={qty} max={p.available} onChange={(n) => setQuantity(p.id, n)} />
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
