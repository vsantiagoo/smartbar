"use client";
import { DoorClosed, KeyRound, MousePointerClick, Smartphone } from "lucide-react";
import { useGuest } from "@/components/guest/guest-context";
import { UNLOCK_SECONDS } from "@/lib/guest-constants";

const ICONS = [MousePointerClick, Smartphone, KeyRound] as const;

/** SEÇÃO · Guia de uso em 3 passos (Escolha → Pague → Sirva-se) e a orientação de segurança da porta. */
export function HowItWorks() {
  const { t, room } = useGuest();
  const steps = [
    { title: t("how.1.title"), text: t("how.1.text") },
    { title: t("how.2.title"), text: t("how.2.text") },
    { title: t("how.3.title"), text: room.hasLock ? t("how.3.text", { s: UNLOCK_SECONDS }) : t("how.3.nolock") },
  ];
  return (
    <section className="mt-5" aria-labelledby="how-title">
      <h2 id="how-title" className="mb-3 px-1 font-heading text-sm font-semibold uppercase tracking-[0.12em] text-ink-soft">
        {t("how.title")}
      </h2>
      <ol className="grid grid-cols-3 gap-2.5">
        {steps.map((s, i) => {
          const Icon = ICONS[i] ?? KeyRound;
          return (
            <li key={s.title} className="glass rounded-3xl p-3.5">
              <span className="grid size-9 place-items-center rounded-2xl glass-chip bg-brand-700/10 text-brand-700">
                <Icon className="size-[18px]" />
              </span>
              <p className="mt-3 font-heading text-sm font-semibold text-ink">
                <span className="tabular mr-1 text-brand-500">{i + 1}.</span>
                {s.title}
              </p>
              <p className="mt-0.5 text-xs leading-snug text-ink-soft">{s.text}</p>
            </li>
          );
        })}
      </ol>
      {room.hasLock && (
        <div className="mt-3 flex items-start gap-3 rounded-[24px] border border-gold-500/30 bg-gold-500/10 p-3.5">
          <DoorClosed className="mt-0.5 size-5 shrink-0 text-gold-600" />
          <p className="text-sm leading-snug text-ink">
            <span className="font-semibold">{t("how.safety.title")}: </span>
            {t("how.safety.text")}
          </p>
        </div>
      )}
    </section>
  );
}
