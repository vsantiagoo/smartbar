"use client";
import { TriangleAlert } from "lucide-react";
import Link from "next/link";
import { useGuest } from "@/components/guest/guest-context";
import { buttonClasses } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import type { PublicTransaction } from "@/lib/types";

/** SEÇÃO · Pedido expirado ou com falha (ex.: item esgotou durante o pagamento → estorno automático). */
export function OrderFailure({ tx, baseHref }: { tx: PublicTransaction; baseHref: string }) {
  const { t } = useGuest();
  const message = tx.status === "expired" ? t("guest.failure.expired") : tx.failureReason === "out_of_stock" ? t("guest.failure.out_of_stock") : t("guest.failure.default");
  return (
    <GlassCard surface="strong" pad="lg" className="text-center">
      <span className="mx-auto grid size-20 place-items-center rounded-full glass-chip bg-crimson-500/10 text-crimson-500">
        <TriangleAlert className="size-9" />
      </span>
      <h1 className="mt-5 text-2xl font-bold">{t("guest.failure.title")}</h1>
      <p className="mx-auto mt-2 max-w-xs text-ink-soft">{message}</p>
      <Link href={baseHref} className={buttonClasses("primary", "lg", "mt-6 w-full")}>
        {t("guest.failure.back")}
      </Link>
    </GlassCard>
  );
}
