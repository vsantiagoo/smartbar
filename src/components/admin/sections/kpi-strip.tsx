import { PackageCheck, Receipt, ShoppingBag, TrendingUp } from "lucide-react";
import { DotNumber, KpiCard } from "@/components/ui/primitives";
import { formatBRL } from "@/lib/utils";
import type { DashboardSnapshot } from "@/lib/types";

/** SEÇÃO · Indicadores do dia. Cada card é um KpiCard independente. */
export function KpiStrip({ data }: { data: DashboardSnapshot }) {
  return (
    <section aria-label="Indicadores do dia" className="grid grid-cols-2 gap-3 sm:gap-4">
      <KpiCard
        className="col-span-2"
        label="Faturamento hoje"
        icon={TrendingUp}
        tone="gold"
        value={<DotNumber className="text-[2.3rem]">{formatBRL(data.revenueTodayCents)}</DotNumber>}
        hint={`${data.pixSharePct}% via Pix · ${100 - data.pixSharePct}% na conta do quarto`}
      />
      <KpiCard
        label="Vendas aprovadas"
        icon={ShoppingBag}
        value={<DotNumber>{data.transactionsToday}</DotNumber>}
        hint="Pedidos com trava liberada"
      />
      <KpiCard label="Ticket médio" icon={Receipt} value={<DotNumber>{formatBRL(data.avgTicketCents)}</DotNumber>} hint="Por pedido aprovado" />
      <KpiCard
        label="Quartos p/ repor"
        icon={PackageCheck}
        tone={data.roomsNeedingRestock > 0 ? "danger" : "ok"}
        value={<DotNumber>{data.roomsNeedingRestock}</DotNumber>}
        hint={`${data.itemsToRestock} unidades faltando`}
      />
    </section>
  );
}
