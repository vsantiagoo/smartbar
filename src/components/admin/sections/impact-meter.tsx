import { ShieldCheck } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { DotNumber, Meter } from "@/components/ui/primitives";
import { formatBRL } from "@/lib/utils";

/** Perda média sem controle (Plano de Negócios): 22% do consumo não é lançado. */
const LEAKAGE = 0.22;
/** Mensalidade mínima do plano Plus (R$ 490/mês) → custo diário. */
const PLAN_MONTHLY_CENTS = 49_000;

/**
 * SEÇÃO · Receita protegida (medidor de retorno).
 * Estima quanto seria perdido sem pagamento prévio e compara com o custo diário
 * do plano — no formato "consumo / saldo / limite" do medidor da Orbit.
 */
export function ImpactMeter({ revenueTodayCents }: { revenueTodayCents: number }) {
  // Se 22% do consumo real some, o consumo real = vendido / 0,78; a perda evitada = o restante.
  const protectedCents = Math.round((revenueTodayCents * LEAKAGE) / (1 - LEAKAGE));
  const dailyCost = Math.round(PLAN_MONTHLY_CENTS / 30);
  const times = dailyCost ? protectedCents / dailyCost : 0;

  return (
    <GlassCard>
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-medium text-ink-soft">Receita protegida hoje</p>
        <span className="grid size-9 place-items-center rounded-2xl bg-ok-500/12 text-ok-600">
          <ShieldCheck className="size-[18px]" />
        </span>
      </div>
      <div className="mt-3 text-[2.1rem]">
        <DotNumber>{formatBRL(protectedCents)}</DotNumber>
      </div>
      <Meter className="mt-4" value={Math.min(protectedCents, dailyCost)} max={dailyCost} tone="ok" label="Receita protegida frente ao custo diário do plano" />
      <div className="tabular mt-2 flex justify-between text-xs text-ink-soft">
        <span>{times >= 1 ? `${times.toFixed(1).replace(".", ",")}× o custo diário do plano` : "Abaixo do custo diário do plano"}</span>
        <span>{formatBRL(dailyCost)}/dia</span>
      </div>
      <p className="mt-3 border-t border-brand-700/10 pt-3 text-xs leading-snug text-ink-faint">
        Estimativa: considera a perda média de 22% do setor sem pagamento prévio (Plano de Negócios). Não é uma medição deste hotel.
      </p>
    </GlassCard>
  );
}
