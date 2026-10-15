"use client";
import { CommandBar } from "@/components/admin/sections/command-bar";
import { ImpactMeter } from "@/components/admin/sections/impact-meter";
import { KpiStrip } from "@/components/admin/sections/kpi-strip";
import { RevenueChart } from "@/components/admin/sections/revenue-chart";
import { SidePanel } from "@/components/admin/sections/side-panel";
import { SimulateSaleButton } from "@/components/admin/sections/simulate-sale-button";
import { SystemPresentation } from "@/components/admin/sections/system-presentation";
import { TopProducts } from "@/components/admin/sections/top-products";
import { Badge } from "@/components/ui/badge";
import { LanguageSwitcher } from "@/components/ui/language-switcher";
import { useI18n } from "@/lib/i18n/client";
import { useLiveSnapshot } from "@/lib/realtime/use-live-snapshot";
import { useNow } from "@/lib/realtime/use-now";
import type { DashboardSnapshot } from "@/lib/types";

/**
 * TELA · Início da recepção (apresentação do sistema + operação ao vivo).
 * Recebe o snapshot inicial do servidor (SSR) e assina o Realtime: assim que
 * uma compra do Web App é finalizada, tudo atualiza sozinho.
 *
 * Ordem das seções (mova os blocos para reorganizar; cada um é independente):
 *   1. CommandBar          busca de quarto/hóspede/ação (⌘K)
 *   2. SystemPresentation  o que o SmartBar faz, com o estado real de cada etapa
 *   3. KpiStrip + ImpactMeter
 *   4. RevenueChart + TopProducts   |   SidePanel (abas: ao vivo · repor · travas)
 */
export function LiveDashboard({
  hotelId,
  hotelName,
  initial,
  showDemoTools,
}: {
  hotelId: string;
  hotelName: string;
  initial: DashboardSnapshot;
  showDemoTools: boolean;
}) {
  const { t } = useI18n();
  const { snapshot, freshIds, status } = useLiveSnapshot(hotelId, initial);
  const now = useNow(60_000);
  // -1 até montar: evita divergência de hidratação na virada de hora.
  const currentHour =
    now === null
      ? -1
      : Number(new Intl.DateTimeFormat("en-US", { timeZone: "America/Sao_Paulo", hour: "numeric", hour12: false }).format(new Date(now))) % 24;
  const offline = snapshot.rooms.filter((r) => !r.deviceOnline).length;

  return (
    <div className="space-y-5">
      <CommandBar hotelName={hotelName} rooms={snapshot.rooms} offlineCount={offline} />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <Badge tone={status === "connecting" ? "warn" : "ok"} dot pulse={status !== "connecting"}>
          {status === "live" ? t("admin.status.live") : status === "demo" ? t("admin.status.demo") : t("admin.status.connecting")}
        </Badge>
        <div className="flex items-center gap-2">
          {showDemoTools && <SimulateSaleButton />}
          {/* Esta tela não usa PageHeader; no mobile (sem sidebar) o idioma entra aqui. */}
          <LanguageSwitcher tone="light" className="lg:hidden" />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_400px]">
        <div className="min-w-0 space-y-5">
          <SystemPresentation data={snapshot} />
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1.5fr_1fr]">
            <KpiStrip data={snapshot} />
            <ImpactMeter revenueTodayCents={snapshot.revenueTodayCents} />
          </div>
          <RevenueChart hourly={snapshot.hourly} currentHour={currentHour} />
          <TopProducts items={snapshot.topProducts} />
        </div>
        <div className="min-w-0 xl:sticky xl:top-6 xl:self-start">
          <SidePanel data={snapshot} freshIds={freshIds} />
        </div>
      </div>
    </div>
  );
}
