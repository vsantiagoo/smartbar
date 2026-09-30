"use client";
import { useGuest } from "@/components/guest/guest-context";

/** SEÇÃO · Abertura da vitrine: quarto, nome do hóspede (quando há PMS) e a promessa da marca. */
export function CatalogHero() {
  const { t, room } = useGuest();
  return (
    <section className="px-1 pb-5">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-500">
        {room.guestFirstName ? t("header.hello", { name: room.guestFirstName }) : t("header.room", { room: room.roomNumber })}
      </p>
      <h1 className="mt-2 text-[2rem] font-bold leading-[1.1] text-ink">{t("catalog.title")}</h1>
      <p className="mt-3 max-w-sm text-[0.95rem] text-ink-soft">{room.hasLock ? t("catalog.subtitle") : t("catalog.subtitle.nolock")}</p>
    </section>
  );
}
