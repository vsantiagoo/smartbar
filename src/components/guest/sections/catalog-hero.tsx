"use client";
import { useGuest } from "@/components/guest/guest-context";

/** SEÇÃO · Abertura da vitrine: título e subtítulo da marca. A saudação está no GuestHeader. */
export function CatalogHero() {
  const { t, room } = useGuest();
  return (
    <section className="px-1 pb-4">
      <h1 className="font-heading text-[1.75rem] font-bold leading-[1.1] text-[#5B6861] dark:text-[#C8D4CC]">{t("catalog.title")}</h1>
      <p className="mt-2 max-w-sm text-[0.9rem] text-[#5B6861]/85 dark:text-[#C8D4CC]/80">{room.hasLock ? t("catalog.subtitle") : t("catalog.subtitle.nolock")}</p>
    </section>
  );
}
