"use client";
import { CircleHelp, Globe } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useGuest } from "@/components/guest/guest-context";
import { HelpSheet } from "@/components/guest/sections/help-sheet";
import { Badge } from "@/components/ui/badge";
import { LogoMark } from "@/components/ui/logo";
import { LANGS, type GuestKey } from "@/lib/i18n/guest";
import { cn } from "@/lib/utils";

/** SEÇÃO · Cabeçalho do hóspede: hotel, quarto, status da trava, idioma e ajuda. */
export function GuestHeader() {
  const { t, lang, setLang, room } = useGuest();
  const [langOpen, setLangOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const menu = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!langOpen) return;
    const close = (e: PointerEvent) => menu.current && !menu.current.contains(e.target as Node) && setLangOpen(false);
    document.addEventListener("pointerdown", close);
    return () => document.removeEventListener("pointerdown", close);
  }, [langOpen]);

  const status = room.hasLock
    ? room.lockOnline
      ? { tone: "ok" as const, label: t("header.lock.ready"), pulse: true }
      : { tone: "warn" as const, label: t("header.lock.offline"), pulse: false }
    : { tone: "info" as const, label: t("header.lock.none"), pulse: false };

  return (
    <header className="glass relative z-30 mb-6 flex items-center gap-1.5 rounded-full py-2 pl-2 pr-2 print:hidden">
      <LogoMark tone="brand" className="size-10 shrink-0" />
      <div className="min-w-0 flex-1 leading-tight">
        <p className="truncate text-sm font-semibold text-ink">{room.hotelName}</p>
        <div className="mt-1 flex items-center gap-2">
          <span className="shrink-0 text-xs font-semibold text-brand-700">{t("header.room", { room: room.roomNumber })}</span>
          <Badge tone={status.tone} dot pulse={status.pulse} className="truncate px-2 py-0.5 text-[0.6rem] uppercase tracking-wide">
            {status.label}
          </Badge>
        </div>
      </div>

      <div ref={menu} className="relative">
        <button
          onClick={() => setLangOpen((o) => !o)}
          aria-label={t("header.language")}
          aria-expanded={langOpen}
          className="grid size-11 place-items-center rounded-full text-brand-700 transition hover:bg-brand-700/10"
        >
          <span className="flex items-center gap-0.5 text-xs font-bold">
            <Globe className="size-4" />
            {lang.toUpperCase()}
          </span>
        </button>
        {langOpen && (
          <ul role="menu" className="glass-strong absolute right-0 top-12 w-44 overflow-hidden rounded-3xl p-1.5">
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
                    l === lang ? "bg-brand-700/10 text-brand-700" : "text-ink-soft hover:bg-brand-700/5",
                  )}
                >
                  {t(`lang.${l}` as GuestKey)}
                  <span className="text-xs text-ink-faint">{l.toUpperCase()}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <button
        onClick={() => setHelpOpen(true)}
        aria-label={t("header.help")}
        className="glass-tint grid size-11 shrink-0 place-items-center rounded-full bg-brand-700/85 text-white transition hover:bg-brand-800/90 active:scale-95"
      >
        <CircleHelp className="size-5" />
      </button>
      <HelpSheet open={helpOpen} onClose={() => setHelpOpen(false)} />
    </header>
  );
}
