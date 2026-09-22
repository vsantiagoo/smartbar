"use client";
import { FlaskConical } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { mockBus } from "@/lib/realtime/mock-bus";

/**
 * DEMO: simula uma compra de hóspede concluída. Só aparece com as ferramentas
 * de demonstração ligadas. Permite ver o Realtime sem abrir o app do hóspede.
 */
export function SimulateSaleButton() {
  const [busy, setBusy] = useState(false);
  return (
    <Button
      variant="glass"
      loading={busy}
      icon={<FlaskConical className="size-4" />}
      onClick={async () => {
        setBusy(true);
        await fetch("/api/mock/purchase", { method: "POST" });
        mockBus.publish({ type: "transactions-changed" });
        setBusy(false);
      }}
    >
      Simular venda
    </Button>
  );
}
