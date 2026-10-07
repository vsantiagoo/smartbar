"use client";
import { CircleHelp, Globe, House } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useGuest } from "@/components/guest/guest-context";
import { HelpSheet } from "@/components/guest/sections/help-sheet";
import { ThemeToggle } from "@/components/guest/sections/theme-toggle";
import { LogoMark } from "@/components/ui/logo";
import { LANGS, type GuestKey } from "@/lib/i18n/guest";
import { cn } from "@/lib/utils";

/** Provisório: até o cadastro do hotel trazer o nome definitivo, a barra mostra este texto. */
const HOTEL_NAME_PLACEHOLDER = "Nome do seu hotel aqui";

/**
 * SEÇÃO · Cabeçalho do hóspede, no mesmo desenho do site: logo à esquerda, barra de vidro
 * central (só hotel e quarto) e, à direita, idioma e ajuda.
 */
export function GuestHeader({ initialDark = false }: { initialDark?: boolean }) {
  const { t, lang, setLang, room } = useGuest();
  const [langOpen, setLangOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const menu = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!langOpen) return;
    const close = (e: PointerEvent) =>
      menu.current &&
      !menu.current.contains(e.target as Node) &&
      setLangOpen(false);
    document.addEventListener("pointerdown", close);
    return () => document.removeEventListener("pointerdown", close);
  }, [langOpen]);

  const greeting = room.guestFirstName
    ? t("header.hello", { name: room.guestFirstName })
    : t("header.room", { room: room.roomNumber });

  return (
    <header className="relative z-30 print:hidden">
      <div className="mb-3 grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-2 sm:grid-cols-[1fr_minmax(0,28rem)_1fr]">
        <LogoMark tone="light" className="size-8 shrink-0 justify-self-start" />

        <div className="glass min-w-0 rounded-[20px] px-5 py-2.5 text-center leading-tight">
          <p className="truncate font-heading text-sm font-semibold text-white/90">
            {HOTEL_NAME_PLACEHOLDER}
          </p>
          <p className="text-xs font-semibold text-brand-300">
            {t("header.room", { room: room.roomNumber })}
          </p>
        </div>

        <div className="flex items-center gap-2 justify-self-end">
          <ThemeToggle initialDark={initialDark} />

          <div ref={menu} className="relative">
            <button
              onClick={() => setLangOpen((o) => !o)}
              aria-label={t("header.language")}
              aria-expanded={langOpen}
              className="glass-dark glass-liquid grid size-11 place-items-center rounded-full text-white/80 transition hover:bg-white/15"
            >
              <span className="flex items-center gap-0.5 text-xs font-bold">
                <Globe className="size-4" />
                {lang.toUpperCase()}
              </span>
            </button>
            {langOpen && (
              <ul
                role="menu"
                className="glass-strong absolute right-0 top-12 z-50 w-44 overflow-hidden rounded-3xl p-1.5"
              >
                {LANGS.map((l) => (
                  <li key={l}>
                    <button
                      role="menuitemradio"
                      aria-checked={l === lang}
                      onClick={() => {
                        setLang(l);
                        setLangOpen(false);
                      }}
                      className={cn(
                        "flex h-11 w-full items-center justify-between rounded-2xl px-3 text-sm font-semibold",
                        l === lang
                          ? "bg-brand-700/10 text-brand-700"
                          : "text-ink-soft hover:bg-brand-700/5",
                      )}
                    >
                      {t(`lang.${l}` as GuestKey)}
                      <span className="text-xs text-ink-faint">
                        {l.toUpperCase()}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <button
            onClick={() => setHelpOpen(true)}
            aria-label={t("header.help")}
            className="glass-tint glass-liquid grid size-11 shrink-0 place-items-center rounded-full bg-gold-500/80 text-white transition hover:bg-gold-500/95 active:scale-95"
          >
            <CircleHelp className="size-5" />
          </button>
          <HelpSheet open={helpOpen} onClose={() => setHelpOpen(false)} />

          <Link
            href="/"
            aria-label={t("header.home")}
            className="glass-dark glass-liquid glass-liquid-shimmer grid size-11 shrink-0 place-items-center rounded-full text-white/85 transition hover:bg-white/15 active:scale-95"
          >
            <House className="size-5" />
          </Link>
        </div>
      </div>

      {/* Saudação centralizada sob a barra */}
      <p className="cursor-default text-center text-xs font-semibold uppercase tracking-[0.14em] text-brand-300 transition-all duration-300 hover:text-white hover:[text-shadow:0_0_8px_rgb(255_255_255/0.9),0_0_18px_rgb(140_200_255/0.75)]">
        {greeting}
      </p>
    </header>
  );
}
