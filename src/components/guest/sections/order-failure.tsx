import { TriangleAlert } from "lucide-react";
import Link from "next/link";
import { buttonClasses } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { guestCopy } from "@/lib/content/copy";
import type { PublicTransaction } from "@/lib/types";

/** SEÇÃO · Pedido expirado ou com falha (ex.: item esgotou durante o pagamento). */
export function OrderFailure({ tx, baseHref }: { tx: PublicTransaction; baseHref: string }) {
  const f = guestCopy.failure;
  const message = tx.status === "expired" ? f.expired : tx.failureReason === "out_of_stock" ? f.out_of_stock : f.default;
  return (
    <GlassCard surface="strong" pad="lg" className="text-center">
      <span className="mx-auto grid size-20 place-items-center rounded-full bg-crimson-500/10 text-crimson-500">
        <TriangleAlert className="size-9" />
      </span>
      <h1 className="mt-5 text-2xl font-bold">Pedido não concluído</h1>
      <p className="mx-auto mt-2 max-w-xs text-ink-soft">{message}</p>
      <Link href={baseHref} className={buttonClasses("primary", "lg", "mt-6 w-full")}>
        Voltar à vitrine
      </Link>
    </GlassCard>
  );
}
