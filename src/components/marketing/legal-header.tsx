import { LEGAL_ATUALIZADO_EM } from "@/lib/content/empresa";

/** Título + data de vigência, padrão em todas as páginas legais. */
export function LegalHeader({ titulo, resumo }: { titulo: string; resumo: string }) {
  return (
    <header className="mb-10">
      <p className="text-xs font-semibold uppercase tracking-wide text-ink-faint">
        Documento legal
      </p>
      <h1 className="mt-2 text-3xl font-bold text-ink">{titulo}</h1>
      <p className="mt-3 leading-relaxed text-ink-soft">{resumo}</p>
      <p className="mt-4 text-sm text-ink-faint">
        Última atualização: {new Date(LEGAL_ATUALIZADO_EM).toLocaleDateString("pt-BR", {
          day: "2-digit",
          month: "long",
          year: "numeric",
        })}
      </p>
    </header>
  );
}

/**
 * Marcador de público. Boa parte das obrigações recai diferente sobre o HÓSPEDE
 * (titular de dados, consumidor) e sobre o HOTEL (cliente contratante). Em vez
 * de duas páginas quase iguais, cada seção diz a quem se dirige.
 */
export function Publico({ quem }: { quem: "hospede" | "empresa" | "ambos" }) {
  const rotulo =
    quem === "hospede" ? "Para o hóspede" : quem === "empresa" ? "Para o hotel" : "Para todos";
  return (
    <span className="mb-1 inline-block rounded-full border border-white/15 px-2.5 py-0.5 text-xs font-medium text-ink-faint">
      {rotulo}
    </span>
  );
}
