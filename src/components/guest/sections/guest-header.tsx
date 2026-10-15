"use client";
import { CircleHelp, Globe, House, Sparkles } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useGuest } from "@/components/guest/guest-context";
import { AssistantSheet } from "@/components/guest/sections/assistant-sheet";
import { HelpSheet } from "@/components/guest/sections/help-sheet";
import { ThemeToggle } from "@/components/guest/sections/theme-toggle";
import { LogoMark } from "@/components/ui/logo";
import { LANGS, type DictKey } from "@/lib/i18n";
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
  const [assistantOpen, setAssistantOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menu = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!langOpen) return;
    const close = (e: PointerEvent) =>
      menu.current &&
      !menu.current.contains(e.target as Node) &&
      setLangOpen(false);
    document.addEventListener("pointerdown", close);
    return () => document.removeEventListener("pointerdown", close);
  }, [langOpen]);

  // Fecha o menu mobile (hambúrguer) ao tocar fora do cluster de ícones.
  useEffect(() => {
    if (!menuOpen) return;
    const close = (e: PointerEvent) =>
      rightRef.current &&
      !rightRef.current.contains(e.target as Node) &&
      setMenuOpen(false);
    document.addEventListener("pointerdown", close);
    return () => document.removeEventListener("pointerdown", close);
  }, [menuOpen]);

  const greeting = room.guestFirstName
    ? t("guest.header.hello", { name: room.guestFirstName })
    : t("guest.header.room", { room: room.roomNumber });

  return (
    <header className="relative z-30 print:hidden">
      <div className="mb-3 grid grid-cols-[1fr_auto_1fr] items-center gap-2 sm:grid-cols-[1fr_minmax(0,28rem)_1fr]">
        {/* A logo nunca some — a fileira de ícones abre ao lado dela. */}
        <LogoMark tone="light" className="size-8 shrink-0 justify-self-start" />

        {/* No mobile, a barra cede o lugar da linha para os ícones quando o menu abre. */}
        <div
          className={cn(
            "glass min-w-0 max-w-[58vw] rounded-[20px] px-5 py-2.5 text-center leading-tight transition-opacity duration-200 sm:max-w-none sm:opacity-100",
            menuOpen && "max-sm:pointer-events-none max-sm:opacity-0",
          )}
        >
          <p className="truncate font-heading text-sm font-semibold text-white/90">
            {HOTEL_NAME_PLACEHOLDER}
          </p>
          <p className="text-xs font-semibold text-brand-300">
            {t("guest.header.room", { room: room.roomNumber })}
          </p>
        </div>

        {/* Lado direito. Mobile: hambúrguer no topo (alinhado com a logo e a barra);
            ao abrir, os ícones expandem PARA O LADO, na MESMA linha, à esquerda do X
            e centrados com a barra do hotel. sm+: linha fixa, sem hambúrguer. */}
        <div ref={rightRef} className="relative justify-self-end">
          <button
            onClick={() => setMenuOpen((o) => !o)}
            aria-label={t("guest.header.menu")}
            aria-expanded={menuOpen}
            className="glass-dark glass-liquid grid size-9 place-items-center rounded-full text-white/85 transition hover:bg-white/15 active:scale-95 min-[360px]:size-10 sm:hidden"
          >
            <span className="relative block h-4 w-5" aria-hidden>
              <span
                className={cn(
                  "absolute left-0 h-0.5 w-5 rounded-full bg-current transition-all duration-300",
                  menuOpen ? "top-[7px] rotate-45" : "top-[3px]",
                )}
              />
              <span
                className={cn(
                  "absolute left-0 top-[7px] h-0.5 w-5 rounded-full bg-current transition-opacity duration-200",
                  menuOpen ? "opacity-0" : "opacity-100",
                )}
              />
              <span
                className={cn(
                  "absolute left-0 h-0.5 w-5 rounded-full bg-current transition-all duration-300",
                  menuOpen ? "top-[7px] -rotate-45" : "top-[11px]",
                )}
              />
            </span>
          </button>

          {/* Ordem: Home · Assistente · Ajuda · Idioma · Tema. */}
          <div
            className={cn(
              // Em telas bem estreitas os ícones encolhem para caber ao lado da logo.
              "flex items-center gap-1 min-[360px]:gap-1.5 sm:gap-2",
              // sm+: linha estática à direita.
              "sm:static sm:translate-x-0 sm:translate-y-0 sm:opacity-100 sm:[pointer-events:auto]",
              // Mobile: MESMA linha do hambúrguer — a fileira abre para a esquerda do X,
              // centrada verticalmente com a barra do hotel (nunca para baixo).
              "max-sm:absolute max-sm:right-[calc(100%+0.4rem)] max-sm:top-1/2 max-sm:-translate-y-1/2 max-sm:z-50 max-sm:origin-right max-sm:transition-[transform,opacity] max-sm:duration-300 max-sm:ease-out",
              menuOpen
                ? "max-sm:translate-x-0 max-sm:opacity-100"
                : "max-sm:pointer-events-none max-sm:translate-x-4 max-sm:opacity-0",
            )}
          >
            <Link
              href="/"
              aria-label={t("guest.header.home")}
              onClick={() => setMenuOpen(false)}
              className="glass-dark glass-liquid glass-liquid-shimmer grid size-9 shrink-0 place-items-center rounded-full text-white/85 transition hover:bg-white/15 active:scale-95 min-[360px]:size-10 sm:size-11"
            >
              <House className="size-5" />
            </Link>

            <button
              onClick={() => {
                setAssistantOpen(true);
                setMenuOpen(false);
              }}
              aria-label={t("guest.header.assistant")}
              className="glass-dark glass-liquid grid size-9 shrink-0 place-items-center rounded-full text-white/85 transition hover:bg-white/15 active:scale-95 min-[360px]:size-10 sm:size-11"
            >
              <Sparkles className="size-5" />
            </button>

            <button
              onClick={() => {
                setHelpOpen(true);
                setMenuOpen(false);
              }}
              aria-label={t("guest.header.help")}
              className="glass-dark glass-liquid grid size-9 shrink-0 place-items-center rounded-full text-white/85 transition hover:bg-white/15 active:scale-95 min-[360px]:size-10 sm:size-11"
            >
              <CircleHelp className="size-5" />
            </button>

            <div ref={menu} className="relative shrink-0">
              <button
                onClick={() => setLangOpen((o) => !o)}
                aria-label={t("guest.header.language")}
                aria-expanded={langOpen}
                className="glass-dark glass-liquid grid size-9 place-items-center rounded-full text-white/80 transition hover:bg-white/15 min-[360px]:size-10 sm:size-11"
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
                          setMenuOpen(false);
                        }}
                        className={cn(
                          "flex h-11 w-full items-center justify-between rounded-2xl px-3 text-sm font-semibold",
                          l === lang
                            ? "bg-brand-700/10 text-brand-700"
                            : "text-ink-soft hover:bg-brand-700/5",
                        )}
                      >
                        {t(`guest.lang.${l}` as DictKey)}
                        <span className="text-xs text-ink-faint">
                          {l.toUpperCase()}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <ThemeToggle initialDark={initialDark} />
          </div>
        </div>
      </div>

      <HelpSheet open={helpOpen} onClose={() => setHelpOpen(false)} />
      <AssistantSheet open={assistantOpen} onClose={() => setAssistantOpen(false)} />

      {/* Saudação centralizada sob a barra */}
      <p className="cursor-default text-center text-xs font-semibold uppercase tracking-[0.14em] text-brand-300 transition-all duration-300 hover:text-white hover:[text-shadow:0_0_8px_rgb(255_255_255/0.9),0_0_18px_rgb(140_200_255/0.75)]">
        {greeting}
      </p>
    </header>
  );
}
