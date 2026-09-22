import { BedDouble } from "lucide-react";
import { LogoMark } from "@/components/ui/logo";

/** SEÇÃO · Cabeçalho do hóspede — nome do hotel + quarto. */
export function GuestHeader({ hotelName, roomNumber }: { hotelName: string; roomNumber: string }) {
  return (
    <header className="glass mb-6 flex items-center justify-between rounded-full py-2 pl-2 pr-4">
      <div className="flex min-w-0 items-center gap-3">
        <LogoMark className="size-10 shrink-0 text-brand-700" />
        <div className="min-w-0 leading-tight">
          <p className="truncate text-sm font-semibold text-ink">{hotelName}</p>
          <p className="text-xs text-ink-soft">Minibar SmartBar</p>
        </div>
      </div>
      <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-brand-700/10 px-3 py-1.5 text-sm font-semibold text-brand-700">
        <BedDouble className="size-4" />
        {roomNumber}
      </span>
    </header>
  );
}
