"use client";
import type { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import { LanguageSwitcher } from "@/components/ui/language-switcher";
import { useI18n } from "@/lib/i18n/client";
import type { LiveStatus } from "@/lib/realtime/use-realtime-signal";

/**
 * SEÇÃO · Título de página do admin (com selo de tempo real opcional).
 * No mobile ele também abriga o seletor de idioma — a barra inferior é só
 * navegação e a sidebar, que o traz no desktop, fica oculta.
 */
export function PageHeader({ title, subtitle, live, actions }: { title: string; subtitle?: string; live?: LiveStatus; actions?: ReactNode }) {
  const { t } = useI18n();
  return (
    <header className="mb-6 flex flex-wrap items-start justify-between gap-4">
      <div>
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-[1.9rem] font-bold">{title}</h1>
          {live && (
            <Badge tone={live === "connecting" ? "warn" : "ok"} dot pulse={live !== "connecting"}>
              {live === "live" ? t("admin.status.live") : live === "demo" ? t("admin.status.demo") : t("admin.status.connecting")}
            </Badge>
          )}
        </div>
        {subtitle && <p className="mt-1 text-ink-soft">{subtitle}</p>}
      </div>
      <div className="flex items-center gap-2">
        {actions}
        <LanguageSwitcher tone="light" className="lg:hidden" />
      </div>
    </header>
  );
}
