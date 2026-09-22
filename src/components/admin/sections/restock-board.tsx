"use client";
import { BedDouble, CircleCheck, Check } from "lucide-react";
import { useOptimistic, useState, useTransition } from "react";
import { confirmRestockAction } from "@/app/admin/actions";
import { PageHeader } from "@/components/admin/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { EmptyState } from "@/components/ui/primitives";
import { ProductTile } from "@/components/ui/product-icon";
import { adminCopy } from "@/lib/content/copy";
import { useLiveRefresh } from "@/lib/realtime/use-live-refresh";
import { mockBus } from "@/lib/realtime/mock-bus";
import type { RestockNeed } from "@/lib/types";

interface RoomGroup {
  roomId: string;
  roomNumber: string;
  floor: number | null;
  needs: RestockNeed[];
}

function group(needs: RestockNeed[]): RoomGroup[] {
  const map = new Map<string, RoomGroup>();
  for (const n of needs) {
    const g = map.get(n.roomId) ?? { roomId: n.roomId, roomNumber: n.roomNumber, floor: n.floor, needs: [] };
    g.needs.push(n);
    map.set(n.roomId, g);
  }
  return [...map.values()].sort((a, b) => a.roomNumber.localeCompare(b.roomNumber));
}

/**
 * TELA · Painel de Reposição (Governança). Lista em tempo real e o botão
 * "Confirmar reposição" atualiza o estoque no banco. A remoção do card é
 * otimista (some na hora) e se corrige sozinha se a ação falhar.
 */
export function RestockBoard({ hotelId, needs }: { hotelId: string; needs: RestockNeed[] }) {
  const live = useLiveRefresh(hotelId);
  const [pending, start] = useTransition();
  const [done, setDone] = useState<number>(0);
  const [optimisticNeeds, remove] = useOptimistic(needs, (state, r: { roomId: string; productId: string | null }) =>
    state.filter((n) => !(n.roomId === r.roomId && (r.productId === null || n.productId === r.productId))),
  );

  const groups = group(optimisticNeeds);
  const totalItems = optimisticNeeds.reduce((s, n) => s + n.missing, 0);

  function confirm(roomId: string, productId: string | null) {
    start(async () => {
      remove({ roomId, productId });
      const { restocked } = await confirmRestockAction(roomId, productId);
      setDone((d) => d + restocked);
      mockBus.publish({ type: "transactions-changed" }); // demo: avisa outras abas
    });
  }

  return (
    <div className="space-y-5">
      <PageHeader
        title={adminCopy.restock.title}
        subtitle={adminCopy.restock.subtitle}
        live={live}
        actions={
          groups.length > 0 && (
            <div className="flex gap-2">
              <Badge tone="danger">{groups.length} {groups.length === 1 ? "quarto" : "quartos"}</Badge>
              <Badge tone="neutral">{totalItems} un. a repor</Badge>
            </div>
          )
        }
      />

      {done > 0 && (
        <p role="status" className="flex items-center gap-2 rounded-2xl bg-ok-500/12 px-4 py-3 text-sm font-medium text-ok-600">
          <Check className="size-4" strokeWidth={3} /> {done} {done === 1 ? "item reposto" : "itens repostos"} nesta sessão — estoque atualizado.
        </p>
      )}

      {groups.length === 0 ? (
        <GlassCard>
          <EmptyState icon={CircleCheck} title={adminCopy.restock.empty} description="Novos alertas aparecem aqui assim que um quarto atingir o estoque mínimo." />
        </GlassCard>
      ) : (
        <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {groups.map((g) => (
            <li key={g.roomId}>
              <GlassCard className="flex h-full flex-col animate-fade-up">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="grid size-11 place-items-center rounded-2xl bg-brand-700 text-white">
                      <BedDouble className="size-5" />
                    </span>
                    <div>
                      <p className="tabular text-xl font-bold leading-none text-ink">Quarto {g.roomNumber}</p>
                      <p className="mt-1 text-xs text-ink-soft">Andar {g.floor ?? "—"}</p>
                    </div>
                  </div>
                  <Badge tone="danger">{g.needs.length} {g.needs.length === 1 ? "item" : "itens"}</Badge>
                </div>

                <ul className="mt-4 flex-1 divide-y divide-brand-700/10">
                  {g.needs.map((n) => (
                    <li key={n.productId} className="flex items-center gap-3 py-2.5">
                      <ProductTile iconKey={n.iconKey} className="size-10 shrink-0 rounded-2xl" />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-ink">{n.productName}</p>
                        <p className="tabular text-xs text-ink-soft">
                          Tem {n.quantity} · repor <span className="font-bold text-crimson-600">+{n.missing}</span>
                        </p>
                      </div>
                      <button
                        disabled={pending}
                        onClick={() => confirm(n.roomId, n.productId)}
                        aria-label={`Confirmar reposição de ${n.productName} no quarto ${g.roomNumber}`}
                        className="glass-tint grid size-9 shrink-0 place-items-center rounded-full border-white/60 bg-white/40 text-brand-700 transition hover:bg-ok-500/85 hover:text-white active:scale-90 disabled:opacity-50"
                      >
                        <Check className="size-4" strokeWidth={2.5} />
                      </button>
                    </li>
                  ))}
                </ul>

                <Button className="mt-4 w-full" disabled={pending} onClick={() => confirm(g.roomId, null)}>
                  Confirmar reposição
                </Button>
              </GlassCard>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
