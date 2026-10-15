"use client";
import { FlaskConical } from "lucide-react";
import { useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";

/** Caixa de simulação (só aparece com NEXT_PUBLIC_DEMO_TOOLS ligado). */
export function DemoTools({ label, onRun }: { label: ReactNode; onRun: () => Promise<boolean> }) {
  const [busy, setBusy] = useState(false);
  const [failed, setFailed] = useState(false);
  return (
    <div className="rounded-inset border border-dashed border-brand-700/25 p-4">
      <p className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-ink-soft">
        <FlaskConical className="size-3.5" /> Demonstração
      </p>
      <Button
        variant="soft"
        className="w-full"
        loading={busy}
        onClick={async () => {
          setBusy(true);
          setFailed(!(await onRun()));
          setBusy(false);
        }}
      >
        {label}
      </Button>
      {failed && <p className="mt-2 text-xs text-crimson-600">A simulação não foi aceita pelo servidor.</p>}
    </div>
  );
}
