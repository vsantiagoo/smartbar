"use client";
import { Check, Copy, LoaderCircle } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { useState } from "react";
import { useGuest } from "@/components/guest/guest-context";
import { DemoTools } from "@/components/guest/sections/demo-tools";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { DotNumber } from "@/components/ui/primitives";
import { formatClock, useCountdown } from "@/lib/realtime/use-countdown";
import { simulatePixPayment } from "@/lib/realtime/simulate";
import { cn, formatBRL } from "@/lib/utils";
import type { GuestKey } from "@/lib/i18n/guest";
import type { PublicTransaction } from "@/lib/types";

const STEPS: GuestKey[] = ["pix.step.1", "pix.step.2", "pix.step.3"];

/** SEÇÃO · Pix "Copia e Cola" + QR Code, com o timer de 3 minutos, aguardando o webhook do gateway. */
export function PixPayment({ tx, showDemoTools }: { tx: PublicTransaction; showDemoTools: boolean }) {
  const { t } = useGuest();
  const left = useCountdown(tx.expiresAt);
  const [copied, setCopied] = useState(false);
  const code = tx.pixCopyPaste ?? "";

  async function copy() {
    try {
      await navigator.clipboard.writeText(code);
    } catch {
      /* clipboard bloqueado: o campo abaixo permite copiar manualmente */
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  }

  return (
    <div className="space-y-5">
      <div className="px-1">
        <h1 className="text-[1.75rem] font-bold">{t("pix.title")}</h1>
        <p className="mt-2 flex items-center gap-2 text-sm text-ink-soft">
          <LoaderCircle className="size-4 animate-spin text-brand-500" />
          {t("pix.waiting")}
        </p>
      </div>

      <GlassCard surface="strong" pad="lg" className="text-center">
        <p className="text-sm font-medium text-ink-soft">{t("pix.amount")}</p>
        <DotNumber className="mt-2 block text-[2.6rem]">{formatBRL(tx.totalCents)}</DotNumber>

        <div className="mx-auto mt-6 w-fit rounded-3xl bg-white p-4 shadow-soft">
          <QRCodeSVG value={code || "smartbar"} size={176} level="M" fgColor="currentColor" bgColor="#FFFFFF" className="text-brand-800" />
        </div>
        <p className="tabular mt-4 text-sm text-ink-soft">
          {t("pix.expires")}{" "}
          <span className={cn("font-semibold", left !== null && left <= 30 ? "text-crimson-600" : "text-ink")}>{formatClock(left)}</span>
        </p>

        <Button
          variant={copied ? "accent" : "primary"}
          size="lg"
          className="mt-5 w-full"
          onClick={copy}
          icon={copied ? <Check className="size-5" /> : <Copy className="size-5" />}
        >
          {copied ? t("pix.copied") : t("pix.copy")}
        </Button>
        <label className="mt-3 block text-left">
          <span className="sr-only">{t("pix.code")}</span>
          <input
            readOnly
            value={code}
            onFocus={(e) => e.currentTarget.select()}
            className="glass-chip w-full truncate rounded-2xl bg-brand-700/5 px-4 py-2.5 font-mono text-xs text-ink-soft"
          />
        </label>
      </GlassCard>

      <ol className="space-y-2 px-1">
        {STEPS.map((s, i) => (
          <li key={s} className="flex items-center gap-3 text-sm text-ink-soft">
            <span className="tabular grid size-6 shrink-0 place-items-center rounded-full glass-chip bg-brand-700/10 text-xs font-bold text-brand-700">{i + 1}</span>
            {t(s)}
          </li>
        ))}
      </ol>

      {showDemoTools && <DemoTools label={t("pix.demo")} onRun={() => simulatePixPayment(tx.publicToken)} />}
    </div>
  );
}
