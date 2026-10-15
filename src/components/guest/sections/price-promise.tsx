"use client";
import { EyeOff, ShieldCheck } from "lucide-react";
import { useGuest } from "@/components/guest/guest-context";

/** SEÇÃO · Regras e transparência de preço. No motel, também a garantia de anonimato. */
export function PricePromise() {
  const { t, room } = useGuest();
  return (
    <section aria-label={t("guest.rules.title")} className="mb-3 space-y-2">
      <div className="glass flex items-start gap-3 rounded-[24px] p-3.5">
        <span className="grid size-9 shrink-0 place-items-center rounded-xl glass-chip bg-ok-500/12 text-ok-600">
          <ShieldCheck className="size-[18px]" />
        </span>
        <div>
          <p className="font-heading text-sm font-semibold text-ink">{t("guest.rules.title")}</p>
          <p className="mt-0.5 text-xs leading-snug text-ink-soft">{t("guest.rules.text")}</p>
        </div>
      </div>
      {room.anonymous && (
        <div className="glass flex items-start gap-3 rounded-[28px] p-4">
          <span className="grid size-10 shrink-0 place-items-center rounded-2xl glass-chip bg-brand-700/10 text-brand-700">
            <EyeOff className="size-5" />
          </span>
          <div>
            <p className="font-semibold text-ink">{t("guest.privacy.title")}</p>
            <p className="mt-0.5 text-sm leading-snug text-ink-soft">{t("guest.privacy.text")}</p>
          </div>
        </div>
      )}
    </section>
  );
}
