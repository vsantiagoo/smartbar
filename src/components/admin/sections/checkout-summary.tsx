"use client";
import { CircleCheck, Send } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { DotNumber } from "@/components/ui/primitives";
import { formatBRL } from "@/lib/utils";
import type { RoomDetail } from "@/lib/types";
import { useI18n } from "@/lib/i18n/client";

/**
 * SEÇÃO · Valores para o check-out.
 * Pix já foi quitado no ato da compra; só o "lançado na conta" vai para a fatura.
 */
export function CheckoutSummary({ detail }: { detail: RoomDetail }) {
  const { t } = useI18n();
  const { paidPixCents, roomChargeCents, stay } = detail;
  return (
    <GlassCard surface="navy" pad="lg">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-white">{t("admin.checkout.title")}</h2>
        <Badge tone="gold">{t("admin.checkout.plan")}</Badge>
      </div>

      <p className="mt-5 text-sm text-white/70">{t("admin.checkout.toBill")}</p>
      <DotNumber className="mt-2 block text-[2.5rem] !text-gold-400">{formatBRL(roomChargeCents)}</DotNumber>

      <dl className="mt-6 space-y-3 border-t border-white/15 pt-5 text-sm">
        <div className="flex items-center justify-between">
          <dt className="flex items-center gap-2 text-white/70">
            <CircleCheck className="size-4 text-ok-500" /> {t("admin.checkout.paidPix")}
          </dt>
          <dd className="tabular font-semibold text-white">{formatBRL(paidPixCents)}</dd>
        </div>
        <div className="flex items-center justify-between">
          <dt className="text-white/70">{t("admin.checkout.total")}</dt>
          <dd className="tabular font-semibold text-white">{formatBRL(paidPixCents + roomChargeCents)}</dd>
        </div>
      </dl>

      <Button
        variant="accent"
        className="mt-6 w-full"
        disabled={!stay || roomChargeCents === 0}
        icon={<Send className="size-4" />}
        title={t("admin.checkout.sendTitle")}
      >
        {t("admin.checkout.send")}
      </Button>
      <p className="mt-3 text-center text-xs text-white/55">
        {roomChargeCents === 0 ? t("admin.checkout.nothing") : t("admin.checkout.premium")}
      </p>
    </GlassCard>
  );
}
