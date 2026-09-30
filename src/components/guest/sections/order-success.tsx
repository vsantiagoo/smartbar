"use client";
import { Check, CircleAlert, FileDown, Lock, LockOpen, Receipt } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useGuest } from "@/components/guest/guest-context";
import { HelpSheet } from "@/components/guest/sections/help-sheet";
import { OrderSummary } from "@/components/guest/sections/order-summary";
import { buttonClasses } from "@/components/ui/button";
import { UNLOCK_SECONDS } from "@/lib/guest-constants";
import { cn } from "@/lib/utils";
import type { PublicTransaction } from "@/lib/types";

/**
 * SEÇÃO · Sucesso. Pagamento aprovado → tela em verde (ok-500), vibração leve e,
 * se há trava, contagem dos 30 s de porta aberta. Sem trava ("apenas sistema"),
 * só confirma: o anfitrião já foi notificado.
 */
export function OrderSuccess({ tx, baseHref }: { tx: PublicTransaction; baseHref: string }) {
  const { t, room } = useGuest();
  const [helpOpen, setHelpOpen] = useState(false);
  const start = tx.authorizedAt ? new Date(tx.authorizedAt).getTime() : 0;
  // Começa cheio e determinístico (igual no servidor); ajusta ao montar.
  const [left, setLeft] = useState(UNLOCK_SECONDS);

  useEffect(() => {
    const tick = () => setLeft(start ? Math.max(0, UNLOCK_SECONDS - Math.floor((Date.now() - start) / 1000)) : UNLOCK_SECONDS);
    tick();
    const id = setInterval(tick, 500);
    return () => clearInterval(id);
  }, [start]);

  // Vibração leve ao liberar (só se a aprovação é recente: recarregar a página depois não vibra de novo).
  const buzzed = useRef(false);
  useEffect(() => {
    if (buzzed.current || !start || Date.now() - start > 5000) return;
    buzzed.current = true;
    try {
      navigator.vibrate?.([60, 40, 60]);
    } catch {
      /* sem suporte a vibração */
    }
  }, [start]);

  const locked = room.hasLock;
  const open = locked && left > 0;
  const R = 62;
  const circ = 2 * Math.PI * R;
  const done = !locked || open;

  return (
    <div className="space-y-6">
      <section className="glass-strong relative overflow-hidden rounded-[36px] px-6 py-10 text-center">
        <div className="relative mx-auto grid size-44 place-items-center">
          {open && <span className="absolute inset-3 animate-pulse-ring rounded-full bg-ok-500/25" />}
          {locked && (
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
          )}
          <span
            className={cn(
              "relative grid size-28 animate-pop-in place-items-center rounded-full text-white shadow-soft transition-colors duration-500",
              done ? "bg-gradient-to-br from-ok-500 to-ok-600" : "bg-ink-faint",
            )}
          >
            {!locked ? (
              <Check className="size-12" strokeWidth={2} />
            ) : open ? (
              <LockOpen className="size-12" strokeWidth={1.6} />
            ) : (
              <Lock className="size-12" strokeWidth={1.6} />
            )}
          </span>
        </div>

        <h1 className="mt-6 text-[1.75rem] font-bold leading-tight">
          {!locked ? t("success.nolock.title") : open ? t("success.title") : t("success.closed")}
        </h1>
        <p className="mx-auto mt-2 max-w-xs text-ink-soft">
          {!locked ? t("success.nolock.text") : open ? t("success.text") : t("success.closed.text")}
        </p>
        {open && (
          <p className="tabular mt-4 inline-flex items-center gap-1.5 rounded-full bg-ok-500/12 px-4 py-1.5 text-sm font-semibold text-ok-600">
            <Check className="size-4" strokeWidth={3} /> {t("success.countdown", { s: left })}
          </p>
        )}
      </section>

      <OrderSummary
        title={t("success.receipt")}
        totalLabel={t("cart.total")}
        lines={tx.items.map((i) => ({ name: i.productName, quantity: i.quantity, unitPriceCents: i.unitPriceCents }))}
      />

      <p className="px-1 text-center text-sm text-ink-soft">{tx.method === "pix" ? t("success.paidPix") : t("success.paidRoom")}</p>

      <div className="space-y-2.5">
        <Link href={`${baseHref}/recibo/${tx.publicToken}`} className={buttonClasses("primary", "lg", "w-full")}>
          <FileDown className="size-5" /> {t("success.download")}
        </Link>
        <Link href={`${baseHref}/consumo`} className={buttonClasses("glass", "lg", "w-full")}>
          <Receipt className="size-5" /> {t("success.myConsumption")}
        </Link>
        <Link href={baseHref} className={buttonClasses("ghost", "md", "w-full")}>
          {t("success.again")}
        </Link>
        {locked && (
          <button
            onClick={() => setHelpOpen(true)}
            className="mx-auto flex items-center gap-1.5 pt-1 text-sm font-medium text-ink-soft underline-offset-4 hover:text-ink hover:underline"
          >
            <CircleAlert className="size-4" /> {t("success.noOpen")}
          </button>
        )}
      </div>
      <HelpSheet open={helpOpen} onClose={() => setHelpOpen(false)} initialKind="door_problem" transactionToken={tx.publicToken} />
    </div>
  );
}
