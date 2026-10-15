"use client";
import { BedDouble, Check, QrCode } from "lucide-react";
import { useGuest } from "@/components/guest/guest-context";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { PaymentMethod } from "@/lib/types";

interface PaymentMethodsProps {
  value: PaymentMethod;
  onChange: (m: PaymentMethod) => void;
  canChargeToRoom: boolean;
}

/** SEÇÃO · Forma de pagamento: Pix (QR ou Copia e Cola) ou lançar na conta da suíte com o cartão-chave. */
export function PaymentMethods({ value, onChange, canChargeToRoom }: PaymentMethodsProps) {
  const { t, room } = useGuest();
  const options = [
    {
      id: "pix" as const,
      icon: QrCode,
      title: t("guest.checkout.pix.title"),
      text: t("guest.checkout.pix.text"),
      badge: <Badge tone="gold">{t("guest.checkout.pix.badge")}</Badge>,
      disabled: false,
      note: undefined,
    },
    // Motel: compra anônima, então não há conta do quarto. Sem trava: não há leitor de cartão.
    ...(room.anonymous || !room.hasLock
      ? []
      : [
          {
            id: "room_charge" as const,
            icon: BedDouble,
            title: t("guest.checkout.room.title"),
            text: t("guest.checkout.room.text"),
            badge: null,
            disabled: !canChargeToRoom,
            note: !canChargeToRoom ? t("guest.checkout.room.unavailable") : undefined,
          },
        ]),
  ];

  return (
    <fieldset>
      <legend className="mb-3 px-1 text-sm font-semibold uppercase tracking-[0.14em] text-ink-soft">{t("guest.checkout.method")}</legend>
      <div className="space-y-3" role="radiogroup">
        {options.map((o) => {
          const selected = value === o.id;
          return (
            <button
              key={o.id}
              type="button"
              role="radio"
              aria-checked={selected}
              disabled={o.disabled}
              onClick={() => onChange(o.id)}
              className={cn(
                "flex w-full items-start gap-4 rounded-card border p-4 text-left transition",
                selected ? "glass-strong border-brand-700 ring-4 ring-brand-700/10" : "glass hover:bg-white/80",
                o.disabled && "cursor-not-allowed opacity-55",
              )}
            >
              <span
                className={cn(
                  "grid size-12 shrink-0 place-items-center rounded-2xl transition",
                  selected ? "bg-brand-700 text-white" : "bg-brand-700/10 text-brand-700",
                )}
              >
                <o.icon className="size-6" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex flex-wrap items-center gap-2">
                  <span className="font-semibold text-ink">{o.title}</span>
                  {o.badge}
                </span>
                <span className="mt-1 block text-sm leading-snug text-ink-soft">{o.note ?? o.text}</span>
              </span>
              <span
                className={cn(
                  "mt-1 grid size-6 shrink-0 place-items-center rounded-full border-2 transition",
                  selected ? "border-brand-700 bg-brand-700 text-white" : "border-brand-700/25",
                )}
              >
                {selected && <Check className="size-3.5" strokeWidth={3} />}
              </span>
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
