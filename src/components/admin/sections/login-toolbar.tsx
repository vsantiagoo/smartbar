"use client";
import { House } from "lucide-react";
import Link from "next/link";
import { ThemeToggle } from "@/components/guest/sections/theme-toggle";
import { LanguageSwitcher } from "@/components/ui/language-switcher";
import { useI18n } from "@/lib/i18n/client";

/** Ações do canto superior direito do login: voltar ao site, idioma e claro/escuro (mesmos botões do hóspede). */
export function LoginToolbar({ initialDark, rootId }: { initialDark: boolean; rootId: string }) {
  const { t } = useI18n();
  return (
    <div className="absolute right-4 top-4 z-30 flex items-center gap-2 sm:right-6 sm:top-6">
      <Link
        href="/"
        aria-label={t("guest.header.home")}
        className="glass-dark glass-liquid glass-liquid-shimmer grid size-9 shrink-0 place-items-center rounded-full text-white/85 transition hover:bg-white/15 active:scale-95 min-[360px]:size-10 sm:size-11"
      >
        <House className="size-5" />
      </Link>
      <LanguageSwitcher tone="dark" />
      <ThemeToggle initialDark={initialDark} rootId={rootId} label={t("guest.header.theme")} />
    </div>
  );
}
