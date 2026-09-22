"use client";
import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface StepperProps {
  value: number;
  max: number;
  onChange: (next: number) => void;
  label: string;
  className?: string;
}

/** Controle de quantidade em pílula. Alvos de toque de 44px. */
export function Stepper({ value, max, onChange, label, className }: StepperProps) {
  return (
    <div
      role="group"
      aria-label={`Quantidade de ${label}`}
      className={cn("inline-flex items-center rounded-full bg-brand-700 p-1 text-white shadow-press", className)}
    >
      <button
        type="button"
        aria-label={`Remover um ${label}`}
        onClick={() => onChange(value - 1)}
        className="grid size-9 place-items-center rounded-full transition hover:bg-white/15 active:scale-90"
      >
        <Minus className="size-4" />
      </button>
      <span aria-live="polite" className="tabular min-w-7 text-center text-sm font-bold">
        {value}
      </span>
      <button
        type="button"
        aria-label={`Adicionar um ${label}`}
        disabled={value >= max}
        onClick={() => onChange(value + 1)}
        className="grid size-9 place-items-center rounded-full transition hover:bg-white/15 active:scale-90 disabled:opacity-35"
      >
        <Plus className="size-4" />
      </button>
    </div>
  );
}
