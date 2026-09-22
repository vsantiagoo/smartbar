"use client";
import { Check, Lock, LockOpen } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { OrderSummary } from "@/components/guest/sections/order-summary";
import { buttonClasses } from "@/components/ui/button";
import { guestCopy } from "@/lib/content/copy";
import { cn } from "@/lib/utils";
import type { PublicTransaction } from "@/lib/types";

const UNLOCK_SECONDS = 15;

/**
 * SEÇÃO · Sucesso: a trava foi liberada (evento recebido via Realtime).
 * O anel mostra os 15 s em que o módulo fica aberto.
 */
export function OrderSuccess({ tx, baseHref }: { tx: PublicTransaction; baseHref: string }) {
  const c = guestCopy.success;
  const start = tx.authorizedAt ? new Date(tx.authorizedAt).getTime() : 0;
  // Começa cheio e determinístico (igual no servidor); ajusta ao montar.
  const [left, setLeft] = useState(UNLOCK_SECONDS);

  useEffect(() => {
    const tick = () => setLeft(start ? Math.max(0, UNLOCK_SECONDS - Math.floor((Date.now() - start) / 1000)) : UNLOCK_SECONDS);
    tick();
    const id = setInterval(tick, 500);
    return () => clearInterval(id);
  }, [start]);

  const open = left > 0;
  const R = 62;
  const circ = 2 * Math.PI * R;

  return (
    <div className="space-y-6">
      <section className="glass-strong relative overflow-hidden rounded-[36px] px-6 py-10 text-center">
        <div className="relative mx-auto grid size-44 place-items-center">
          {open && <span className="absolute inset-3 animate-pulse-ring rounded-full bg-ok-500/25" />}
          <svg viewBox="0 0 140 140" className="absolute inset-0 -rotate-90" aria-hidden>
            <circle cx="70" cy="70" r={R} fill="none" strokeWidth="7" className="stroke-brand-700/10" />
            <circle
              cx="70"
              cy="70"
              r={R}
              fill="none"
              strokeWidth="7"
              strokeLinecap="round"
              strokeDasharray={circ}
              strokeDashoffset={circ * (1 - left / UNLOCK_SECONDS)}
              className={cn("transition-[stroke-dashoffset,stroke] duration-500 ease-linear", open ? "stroke-ok-500" : "stroke-ink-faint")}
            />
          </svg>
          <span
            className={cn(
              "relative grid size-28 animate-pop-in place-items-center rounded-full text-white shadow-soft transition-colors duration-500",
              open ? "bg-gradient-to-br from-ok-500 to-ok-600" : "bg-ink-faint",
            )}
          >
            {open ? <LockOpen className="size-12" strokeWidth={1.6} /> : <Lock className="size-12" strokeWidth={1.6} />}
          </span>
        </div>

        <h1 className="mt-6 text-[1.9rem] font-bold">{open ? c.title : c.closed}</h1>
        <p className="mx-auto mt-2 max-w-xs text-ink-soft">{open ? c.text : "Pedido concluído com sucesso."}</p>
        {open && (
          <p className="tabular mt-4 inline-flex items-center gap-1.5 rounded-full bg-ok-500/12 px-4 py-1.5 text-sm font-semibold text-ok-600">
            <Check className="size-4" strokeWidth={3} /> {c.countdown(left)}
          </p>
        )}
      </section>

      <OrderSummary title={c.receipt} lines={tx.items.map((i) => ({ name: i.productName, quantity: i.quantity, unitPriceCents: i.unitPriceCents }))} />

      <p className="px-1 text-center text-sm text-ink-soft">
        {tx.method === "pix" ? "Pago via Pix." : "Lançado na conta do quarto — você acerta no check-out."}
      </p>

      <Link href={baseHref} className={buttonClasses("glass", "lg", "w-full")}>
        {c.again}
      </Link>
    </div>
  );
}
