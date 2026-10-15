import { SearchX } from "lucide-react";
import Link from "next/link";
import { buttonClasses } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/primitives";

export default function NotFound() {
  return (
    <main className="grid min-h-dvh place-items-center px-4">
      <div className="glass-strong w-full max-w-md rounded-surface">
        <EmptyState
          icon={SearchX}
          title="Página não encontrada"
          description="O QR Code pode estar desatualizado ou o link foi digitado errado. Fale com a recepção."
          action={<Link href="/" className={buttonClasses("primary")}>Ir para o início</Link>}
        />
      </div>
    </main>
  );
}
