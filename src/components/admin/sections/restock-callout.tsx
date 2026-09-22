import { ArrowRight, PackageCheck } from "lucide-react";
import Link from "next/link";
import { buttonClasses } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";

/** SEÇÃO · Atalho para a Governança quando há quartos sem estoque mínimo. */
export function RestockCallout({ rooms, items }: { rooms: number; items: number }) {
  const ok = rooms === 0;
  return (
    <GlassCard surface={ok ? "glass" : "navy"} className="flex flex-col gap-4">
      <span className={`grid size-11 place-items-center rounded-2xl ${ok ? "bg-ok-500/12 text-ok-600" : "bg-white/15 text-white"}`}>
        <PackageCheck className="size-5" />
      </span>
      <div>
        <p className={`text-lg font-semibold ${ok ? "text-ink" : "text-white"}`}>
          {ok ? "Estoque em dia" : `${rooms} ${rooms === 1 ? "quarto precisa" : "quartos precisam"} de reposição`}
        </p>
        <p className={`mt-1 text-sm ${ok ? "text-ink-soft" : "text-white/70"}`}>
          {ok ? "Nenhum item abaixo do mínimo." : `${items} unidades a repor. Envie a governança agora.`}
        </p>
      </div>
      {!ok && (
        <Link href="/admin/reposicao" className={buttonClasses("accent", "md", "self-start")}>
          Abrir reposição <ArrowRight className="size-4" />
        </Link>
      )}
    </GlassCard>
  );
}
