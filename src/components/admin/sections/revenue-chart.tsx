import { GlassCard, SectionTitle } from "@/components/ui/glass-card";
import { cn, formatBRL } from "@/lib/utils";
import type { DashboardSnapshot } from "@/lib/types";

const FIRST_HOUR = 6;

/** SEÇÃO · Faturamento por hora (barras). Hora atual em ouro. */
export function RevenueChart({ hourly, currentHour }: { hourly: DashboardSnapshot["hourly"]; currentHour: number }) {
  const bars = hourly.filter((h) => h.hour >= FIRST_HOUR);
  const max = Math.max(1, ...bars.map((b) => b.cents));
  return (
    <GlassCard>
      <SectionTitle title="Faturamento por hora" hint="Vendas aprovadas hoje" />
      <div className="flex h-44 items-end gap-1.5" role="img" aria-label="Gráfico de faturamento por hora do dia">
        {bars.map((b) => {
          const pct = (b.cents / max) * 100;
          return (
            <div key={b.hour} className="group flex h-full min-w-0 flex-1 flex-col items-center justify-end gap-2" title={`${b.hour}h — ${formatBRL(b.cents)}`}>
              <div
                className={cn(
                  "w-full rounded-full transition-all duration-700",
                  b.hour === currentHour ? "bg-gold-500" : b.cents > 0 ? "bg-brand-600/80 group-hover:bg-brand-700" : "bg-brand-700/10",
                )}
                style={{ height: `${Math.max(pct, 5)}%` }}
              />
              <span className={cn("tabular text-[10px]", b.hour === currentHour ? "font-bold text-gold-600" : "text-ink-faint")}>
                {b.hour % 3 === 0 || b.hour === currentHour ? b.hour : ""}
              </span>
            </div>
          );
        })}
      </div>
    </GlassCard>
  );
}
