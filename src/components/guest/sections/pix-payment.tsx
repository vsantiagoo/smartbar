"use client";
import { Check, Copy, LoaderCircle } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { useState } from "react";
import { DemoTools } from "@/components/guest/sections/demo-tools";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { DotNumber } from "@/components/ui/primitives";
import { guestCopy } from "@/lib/content/copy";
import { formatClock, useCountdown } from "@/lib/realtime/use-countdown";
import { simulatePixPayment } from "@/lib/realtime/simulate";
import { formatBRL } from "@/lib/utils";
import type { PublicTransaction } from "@/lib/types";

/** SEÇÃO · Pix "Copia e Cola" + QR Code, aguardando o webhook do gateway. */
export function PixPayment({ tx, showDemoTools }: { tx: PublicTransaction; showDemoTools: boolean }) {
  const c = guestCopy.pix;
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
        <h1 className="text-[1.75rem] font-bold">{c.title}</h1>
        <p className="mt-2 flex items-center gap-2 text-sm text-ink-soft">
          <LoaderCircle className="size-4 animate-spin text-brand-500" />
          {c.waiting}
        </p>
      </div>

      <GlassCard surface="strong" pad="lg" className="text-center">
        <p className="text-sm font-medium text-ink-soft">Valor a pagar</p>
        <DotNumber className="mt-2 block text-[2.6rem]">{formatBRL(tx.totalCents)}</DotNumber>

        <div className="mx-auto mt-6 w-fit rounded-3xl bg-white p-4 shadow-soft">
          <QRCodeSVG value={code || "smartbar"} size={176} level="M" fgColor="currentColor" bgColor="#FFFFFF" className="text-brand-800" />
        </div>
        <p className="tabular mt-4 text-sm text-ink-soft">
          Expira em <span className="font-semibold text-brand-800">{formatClock(left)}</span>
        </p>

        <Button variant={copied ? "accent" : "primary"} size="lg" className="mt-5 w-full" onClick={copy} icon={copied ? <Check className="size-5" /> : <Copy className="size-5" />}>
          {copied ? c.copied : c.copy}
        </Button>
        <label className="mt-3 block text-left">
          <span className="sr-only">Código Pix copia e cola</span>
          <input
            readOnly
            value={code}
            onFocus={(e) => e.currentTarget.select()}
            className="w-full truncate rounded-2xl bg-brand-700/5 px-4 py-2.5 font-mono text-xs text-ink-soft"
          />
        </label>
      </GlassCard>

      <ol className="space-y-2 px-1">
        {c.steps.map((s, i) => (
          <li key={s} className="flex items-center gap-3 text-sm text-ink-soft">
            <span className="tabular grid size-6 shrink-0 place-items-center rounded-full bg-brand-700/10 text-xs font-bold text-brand-700">{i + 1}</span>
            {s}
          </li>
        ))}
      </ol>

      {showDemoTools && <DemoTools label="Simular pagamento confirmado (webhook)" onRun={() => simulatePixPayment(tx.publicToken)} />}
    </div>
  );
}
