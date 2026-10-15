"use client";
import { Globe } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { LANGS } from "@/lib/i18n/config";
import { useI18n } from "@/lib/i18n/client";
import type { DictKey } from "@/lib/i18n/translate";
import { cn } from "@/lib/utils";

/**
 * Seletor de idioma — um só para a vitrine, o painel e o site.
 *
 * `tone="dark"`  → sobre faixa escura (cabeçalho do hóspede e do site).
 * `tone="light"` → sobre vidro claro (painel do hotel).
 *
 * Trocar o idioma grava o cookie e dá um refresh suave, para os textos vindos
 * do servidor virem traduzidos sem recarregar a página.
 */
export function LanguageSwitcher({
  tone = "dark",
  className,
  buttonClassName,
  onAfterSelect,
}: {
  tone?: "dark" | "light";
  className?: string;
  /** Substitui as classes de TAMANHO do botão (ex.: na barra do site, menor). */
  buttonClassName?: string;
  /** Ex.: fechar o menu mobile do hóspede depois de escolher. */
  onAfterSelect?: () => void;
}) {
  const { lang, setLang, t } = useI18n();
  const [open, setOpen] = useState(false);
  const box = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const close = (e: PointerEvent) => box.current && !box.current.contains(e.target as Node) && setOpen(false);
    document.addEventListener("pointerdown", close);
    return () => document.removeEventListener("pointerdown", close);
  }, [open]);

  return (
    <div ref={box} className={cn("relative shrink-0", className)}>
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label={t("common.language")}
        aria-expanded={open}
        className={cn(
          "grid place-items-center rounded-full transition",
          tone === "dark" ? "glass-dark glass-liquid text-white/80 hover:bg-white/15" : "glass-chip bg-white/60 text-ink-soft hover:bg-white/80 hover:text-ink",
          buttonClassName ?? (tone === "dark" ? "size-9 min-[360px]:size-10 sm:size-11" : "size-11"),
        )}
      >
        <span className="flex items-center gap-0.5 text-xs font-bold">
          <Globe className="size-4" />
          {lang.toUpperCase()}
        </span>
      </button>

      {open && (
        <ul role="menu" className="glass-strong absolute right-0 top-12 z-50 w-44 overflow-hidden rounded-3xl p-1.5">
          {LANGS.map((l) => (
            <li key={l}>
              <button
                role="menuitemradio"
                aria-checked={l === lang}
                onClick={() => {
                  setLang(l);
                  setOpen(false);
                  onAfterSelect?.();
                }}
                className={cn(
                  "flex h-11 w-full items-center justify-between rounded-2xl px-3 text-sm font-semibold",
                  l === lang ? "bg-brand-700/10 text-brand-700" : "text-ink-soft hover:bg-brand-700/5",
                )}
              >
                {t(`common.lang.${l}` as DictKey)}
                <span className="text-xs text-ink-faint">{l.toUpperCase()}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
