"use client";
import { useState } from "react";
import { Segmented } from "@/components/ui/segmented";
import { Stepper } from "@/components/ui/stepper";
import { Sheet } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

/** Demos interativos do catálogo (precisam de estado no cliente). */
export function StepperDemo() {
  const [n, setN] = useState(2);
  return <Stepper label="Água mineral" value={n} max={4} onChange={setN} />;
}

export function SegmentedDemo() {
  const [v, setV] = useState("all");
  return (
    <Segmented
      label="Exemplo"
      value={v}
      onChange={setV}
      options={[
        { value: "all", label: "Tudo", count: 9 },
        { value: "bebida", label: "Bebidas" },
        { value: "snack", label: "Snacks" },
      ]}
    />
  );
}

export function SheetDemo() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="glass" onClick={() => setOpen(true)}>Abrir gaveta</Button>
      <Sheet open={open} onClose={() => setOpen(false)} title="Seu pedido" footer={<Button className="w-full" onClick={() => setOpen(false)}>Continuar</Button>}>
        <p className="py-6 text-ink-soft">Conteúdo da gaveta. Fecha com Esc, clique fora ou no X.</p>
      </Sheet>
    </>
  );
}
