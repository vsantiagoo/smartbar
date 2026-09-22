"use client";
import { LoaderCircle, Nfc } from "lucide-react";
import { DemoTools } from "@/components/guest/sections/demo-tools";
import { GlassCard } from "@/components/ui/glass-card";
import { guestCopy } from "@/lib/content/copy";
import { simulateRfidTap } from "@/lib/realtime/simulate";
import { formatClock, useCountdown } from "@/lib/realtime/use-countdown";
import type { PublicTransaction } from "@/lib/types";

/** SEÇÃO · Aguardando o cartão-chave RFID no leitor do frigobar (ESP32). */
export function RfidWaiting({ tx, showDemoTools }: { tx: PublicTransaction; showDemoTools: boolean }) {
  const c = guestCopy.rfid;
  const left = useCountdown(tx.expiresAt);

  return (
    <div className="space-y-5">
      <GlassCard surface="strong" pad="lg" className="text-center">
        <div className="relative mx-auto grid size-40 place-items-center">
          <span className="absolute inset-0 animate-pulse-ring rounded-full bg-brand-500/25" />
          <span className="absolute inset-6 animate-pulse-ring rounded-full bg-brand-500/25 [animation-delay:0.6s]" />
          <span className="relative grid size-24 place-items-center rounded-full bg-brand-700 text-white shadow-press">
            <Nfc className="size-11" strokeWidth={1.6} />
          </span>
        </div>
        <h1 className="mt-6 text-[1.6rem] font-bold">{c.title}</h1>
        <p className="mx-auto mt-2 max-w-xs text-ink-soft">{c.text}</p>
        <p className="mt-5 flex items-center justify-center gap-2 text-sm text-ink-soft">
          <LoaderCircle className="size-4 animate-spin text-brand-500" />
          {c.waiting}
          <span className="tabular font-semibold text-ink">{formatClock(left)}</span>
        </p>
      </GlassCard>

      {showDemoTools && <DemoTools label="Simular aproximação do cartão (ESP32)" onRun={() => simulateRfidTap(tx.publicToken)} />}
    </div>
  );
}
