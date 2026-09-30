"use client";
import { EyeOff, ShieldCheck } from "lucide-react";
import { useGuest } from "@/components/guest/guest-context";

/** SEÇÃO · Regras e transparência de preço. No motel, também a garantia de anonimato. */
export function PricePromise() {
  const { t, room } = useGuest();
  return (
    <section aria-label={t("rules.title")} className="mb-5 space-y-3">
      <div className="glass flex items-start gap-3 rounded-[28px] p-4">
        <span className="grid size-10 shrink-0 place-items-center rounded-2xl glass-chip bg-ok-500/12 text-ok-600">
          <ShieldCheck className="size-5" />
        </span>
        <div>
          <p className="font-semibold text-ink">{t("rules.title")}</p>
          <p className="mt-0.5 text-sm leading-snug text-ink-soft">{t("rules.text")}</p>
        </div>
      </div>
      {room.anonymous && (
        <div className="glass flex items-start gap-3 rounded-[28px] p-4">
          <span className="grid size-10 shrink-0 place-items-center rounded-2xl glass-chip bg-brand-700/10 text-brand-700">
            <EyeOff className="size-5" />
          </span>
          <div>
            <p className="font-semibold text-ink">{t("privacy.title")}</p>
            <p className="mt-0.5 text-sm leading-snug text-ink-soft">{t("privacy.text")}</p>
          </div>
        </div>
      )}
    </section>
  );
}
