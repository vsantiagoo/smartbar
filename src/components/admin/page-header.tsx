import type { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import type { LiveStatus } from "@/lib/realtime/use-realtime-signal";
import { adminCopy } from "@/lib/content/copy";

/** SEÇÃO · Título de página do admin (com selo de tempo real opcional). */
export function PageHeader({ title, subtitle, live, actions }: { title: string; subtitle?: string; live?: LiveStatus; actions?: ReactNode }) {
  return (
    <header className="mb-6 flex flex-wrap items-start justify-between gap-4">
      <div>
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-[1.9rem] font-bold">{title}</h1>
          {live && (
            <Badge tone={live === "connecting" ? "warn" : "ok"} dot pulse={live !== "connecting"}>
              {live === "live" ? adminCopy.dashboard.live : live === "demo" ? adminCopy.dashboard.demo : "Conectando…"}
            </Badge>
          )}
        </div>
        {subtitle && <p className="mt-1 text-ink-soft">{subtitle}</p>}
      </div>
      {actions}
    </header>
  );
}
