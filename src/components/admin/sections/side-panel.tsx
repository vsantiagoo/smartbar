"use client";
import { ArrowRight, Lock, LockOpen, PackageCheck, Wifi, WifiOff } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { LiveFeed } from "@/components/admin/sections/live-feed";
import { Badge } from "@/components/ui/badge";
import { buttonClasses } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { EmptyState, LiveDot } from "@/components/ui/primitives";
import { Segmented } from "@/components/ui/segmented";
import { useI18n } from "@/lib/i18n/client";
import { useNow } from "@/lib/realtime/use-now";
import { cn, timeAgo } from "@/lib/utils";
import type { DashboardSnapshot } from "@/lib/types";

type Tab = "live" | "restock" | "devices";

/**
 * SEÇÃO · Painel lateral com abas (padrão "preview / arquivos / atividade" da Orbit):
 *  Ao vivo   → vendas aprovadas em tempo real
 *  Reposição → o que a governança precisa repor
 *  Travas    → cards de dispositivo por quarto (online, aberta/trancada)
 */
export function SidePanel({ data, freshIds }: { data: DashboardSnapshot; freshIds: ReadonlySet<string> }) {
  const { t } = useI18n();
  const [tab, setTab] = useState<Tab>("live");
  const offline = data.rooms.filter((r) => !r.deviceOnline).length;

  return (
    <GlassCard pad="none" className="flex h-full max-h-[52rem] flex-col overflow-hidden">
      <div className="p-4 pb-3">
        <Segmented
          label={t("admin.side.label")}
          value={tab}
          onChange={setTab}
          className="w-full"
          options={[
            { value: "live", label: t("admin.side.live"), count: data.transactionsToday },
            { value: "restock", label: t("admin.side.restock"), count: data.roomsNeedingRestock },
            { value: "devices", label: t("admin.side.devices"), count: offline || undefined },
          ]}
        />
      </div>
      <div className="scroll-hide min-h-0 flex-1 overflow-y-auto px-4 pb-4">
        {tab === "live" && (
          <div>
            <p className="mb-2 flex items-center gap-2 px-1 text-sm text-ink-soft">
              <LiveDot /> {t("admin.dashboard.feedHint")}
            </p>
            <LiveFeed transactions={data.recent} freshIds={freshIds} bare />
          </div>
        )}
        {tab === "restock" && <RestockTab needs={data.restockNeeds} />}
        {tab === "devices" && <DevicesTab rooms={data.rooms} />}
      </div>
    </GlassCard>
  );
}

function RestockTab({ needs }: { needs: DashboardSnapshot["restockNeeds"] }) {
  const { t } = useI18n();
  const grouped = useMemo(() => {
    const m = new Map<string, { room: string; items: string[]; missing: number }>();
    for (const n of needs) {
      const g = m.get(n.roomId) ?? { room: n.roomNumber, items: [], missing: 0 };
      g.items.push(n.productName);
      g.missing += n.missing;
      m.set(n.roomId, g);
    }
    return [...m.values()].sort((a, b) => a.room.localeCompare(b.room));
  }, [needs]);

  if (grouped.length === 0) return <EmptyState icon={PackageCheck} title={t("admin.side.stockOk")} description={t("admin.side.stockOkHint")} className="py-10" />;
  return (
    <div>
      <ul className="space-y-2">
        {grouped.slice(0, 8).map((g) => (
          <li key={g.room}>
            <Link href={`/admin/quartos/${g.room}`} className="flex items-center gap-3 rounded-2xl bg-white/55 p-3 transition hover:bg-white/85">
              <span className="tabular grid size-10 shrink-0 place-items-center rounded-xl bg-brand-700 text-sm font-bold text-white">{g.room}</span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-semibold text-ink">{g.items.join(", ")}</span>
                <span className="block text-xs text-ink-soft">+{g.missing} un. para repor</span>
              </span>
              <Badge tone="danger">{g.items.length}</Badge>
            </Link>
          </li>
        ))}
      </ul>
      <Link href="/admin/reposicao" className={buttonClasses("primary", "md", "mt-4 w-full")}>
        Abrir reposição <ArrowRight className="size-4" />
      </Link>
    </div>
  );
}

function DevicesTab({ rooms }: { rooms: DashboardSnapshot["rooms"] }) {
  const { t } = useI18n();
  const now = useNow();
  const sorted = [...rooms].sort((a, b) => Number(a.deviceOnline) - Number(b.deviceOnline) || a.number.localeCompare(b.number));
  return (
    <ul className="space-y-2">
      {sorted.map((r) => (
        <li key={r.number}>
          <Link href={`/admin/quartos/${r.number}`} className="flex items-center gap-3 rounded-2xl bg-white/55 p-3 transition hover:bg-white/85">
            <span className={cn("tabular grid size-11 shrink-0 place-items-center rounded-2xl text-sm font-bold", r.deviceOnline ? "bg-brand-700/10 text-brand-700" : "bg-crimson-500/10 text-crimson-600")}>
              {r.number}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-semibold text-ink">{r.deviceId ?? t("admin.side.noDevice")}</span>
              <span className="flex items-center gap-1.5 text-xs text-ink-soft">
                {r.deviceOnline ? <Wifi className="size-3 text-ok-500" /> : <WifiOff className="size-3 text-crimson-500" />}
                {r.deviceOnline ? t("admin.side.online") : t("admin.side.offline")}
                {now !== null && r.lastSeenAt && ` · ${timeAgo(r.lastSeenAt, now)}`}
              </span>
            </span>
            <Badge tone={r.lockState === "unlocked" ? "warn" : "neutral"}>
              {r.lockState === "unlocked" ? <LockOpen className="size-3.5" /> : <Lock className="size-3.5" />}
              {r.lockState === "unlocked" ? t("admin.side.unlocked") : t("admin.side.lockedF")}
            </Badge>
          </Link>
        </li>
      ))}
    </ul>
  );
}
