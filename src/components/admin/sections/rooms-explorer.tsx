"use client";
import { BedDouble, Lock, LockOpen, PackageX, Wifi, WifiOff } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { PageHeader } from "@/components/admin/page-header";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/primitives";
import { Segmented } from "@/components/ui/segmented";
import { SearchField } from "@/components/ui/input";
import { adminCopy } from "@/lib/content/copy";
import { useLiveRefresh } from "@/lib/realtime/use-live-refresh";
import { cn, formatBRL } from "@/lib/utils";
import type { RoomSummary } from "@/lib/types";

type Filter = "all" | "occupied" | "restock" | "offline";

/**
 * TELA · Gestão por Quarto (lista). Busca rápida por número ou hóspede;
 * Enter abre direto o quarto quando há um único resultado.
 */
export function RoomsExplorer({ hotelId, rooms }: { hotelId: string; rooms: RoomSummary[] }) {
  const router = useRouter();
  const live = useLiveRefresh(hotelId);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rooms.filter((r) => {
      if (q && !r.room.number.includes(q) && !(r.guestName ?? "").toLowerCase().includes(q)) return false;
      if (filter === "occupied") return Boolean(r.guestName);
      if (filter === "restock") return r.restockCount > 0;
      if (filter === "offline") return !r.room.deviceOnline;
      return true;
    });
  }, [rooms, query, filter]);

  const counts = {
    all: rooms.length,
    occupied: rooms.filter((r) => r.guestName).length,
    restock: rooms.filter((r) => r.restockCount > 0).length,
    offline: rooms.filter((r) => !r.room.deviceOnline).length,
  };

  return (
    <div className="space-y-5">
      <PageHeader title={adminCopy.rooms.title} subtitle={adminCopy.rooms.subtitle} live={live} />

      <div className="flex flex-col gap-3 md:flex-row md:items-center">
        <form
          className="md:w-96"
          onSubmit={(e) => {
            e.preventDefault();
            if (visible.length === 1) router.push(`/admin/quartos/${visible[0]!.room.number}`);
          }}
        >
          <SearchField
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={adminCopy.rooms.searchPlaceholder}
            aria-label="Buscar quarto"
            autoFocus
          />
        </form>
        <Segmented
          label="Filtrar quartos"
          value={filter}
          onChange={setFilter}
          options={[
            { value: "all", label: "Todos", count: counts.all },
            { value: "occupied", label: "Ocupados", count: counts.occupied },
            { value: "restock", label: "Repor", count: counts.restock },
            { value: "offline", label: "Sem sinal", count: counts.offline },
          ]}
        />
      </div>

      {visible.length === 0 ? (
        <EmptyState icon={PackageX} title="Nenhum quarto encontrado" description="Tente outro número, nome de hóspede ou filtro." />
      ) : (
        <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {visible.map(({ room, guestName, restockCount, spentCents }) => (
            <li key={room.id}>
              <Link
                href={`/admin/quartos/${room.number}`}
                className="glass group block rounded-[28px] p-5 transition hover:-translate-y-0.5 hover:bg-white/80"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className={cn("grid size-12 place-items-center rounded-2xl", guestName ? "bg-brand-700 text-white" : "bg-brand-700/10 text-brand-700")}>
                      <BedDouble className="size-6" />
                    </span>
                    <div>
                      <p className="tabular text-2xl font-bold leading-none text-ink">{room.number}</p>
                      <p className="mt-1 text-xs text-ink-soft">Andar {room.floor ?? "—"}</p>
                    </div>
                  </div>
                  {restockCount > 0 && <Badge tone="danger">Repor {restockCount}</Badge>}
                </div>
                <p className="mt-4 truncate text-sm font-medium text-ink">{guestName ?? "Quarto vago"}</p>
                <div className="mt-3 flex items-center justify-between border-t border-brand-700/10 pt-3">
                  <span className="flex items-center gap-2 text-xs text-ink-soft">
                    {room.deviceOnline ? <Wifi className="size-3.5 text-ok-500" /> : <WifiOff className="size-3.5 text-crimson-500" />}
                    {room.lockState === "unlocked" ? <LockOpen className="size-3.5 text-gold-600" /> : <Lock className="size-3.5" />}
                    {room.lockState === "unlocked" ? "Aberto" : "Trancado"}
                  </span>
                  <span className="tabular text-sm font-semibold text-ink">{guestName ? formatBRL(spentCents) : "—"}</span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
