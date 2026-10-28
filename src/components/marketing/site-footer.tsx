import Link from "next/link";
import { Wordmark } from "@/components/ui/logo";
import { EMPRESA, LEGAL_ATUALIZADO_EM } from "@/lib/content/empresa";

/**
 * Rodapé institucional. Ancora as páginas legais (que de outro modo ninguém
 * acharia) e carrega a identificação da empresa que a LGPD e o CDC exigem que
 * seja pública: quem é o controlador, como falar com ele, quem é o encarregado
 * de dados.
 *
 * Em pt de propósito: identidade jurídica e direitos do titular são da
 * jurisdição brasileira. O resto do site traduz; esta faixa, não.
 *
 * Campo `[PREENCHER]` aparece literalmente até o dado virar real — é melhor o
 * buraco ser visível do que um rodapé que finge estar completo.
 */
export function SiteFooter() {
  const ano = new Date().getFullYear();

  const legais: Array<[string, string]> = [
    ["/privacidade", "Política de Privacidade"],
    ["/termos", "Termos de Uso"],
    ["/cookies", "Política de Cookies"],
    ["/reembolso", "Política de Reembolso"],
  ];

  return (
    <footer className="relative mt-24 border-t border-white/10 bg-black/20 text-ink-soft">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-3">
          <Wordmark tone="light" className="text-xl" />
          <p className="max-w-xs text-sm leading-relaxed">
            Minibar inteligente para hotéis: pagamento prévio por Pix, trava IoT e
            checkout em minutos.
          </p>
        </div>

        <nav aria-label="Páginas legais" className="space-y-3">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-ink-faint">
            Legal
          </h2>
          <ul className="space-y-2 text-sm">
            {legais.map(([href, rotulo]) => (
              <li key={href}>
                <Link href={href} className="rounded underline-offset-4 hover:underline">
                  {rotulo}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="space-y-3 text-sm lg:col-span-2">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-ink-faint">
            {EMPRESA.nomeFantasia}
          </h2>
          <address className="space-y-1 not-italic leading-relaxed">
            <p>{EMPRESA.razaoSocial}</p>
            <p>CNPJ {EMPRESA.cnpj}</p>
            <p>{EMPRESA.endereco}</p>
            <p>
              Contato:{" "}
              <a href={`mailto:${EMPRESA.emailContato}`} className="rounded underline-offset-4 hover:underline">
                {EMPRESA.emailContato}
              </a>
            </p>
            <p>
              Encarregado de Dados (LGPD):{" "}
              <a href={`mailto:${EMPRESA.emailPrivacidade}`} className="rounded underline-offset-4 hover:underline">
                {EMPRESA.encarregadoDados}
              </a>
            </p>
          </address>
        </div>
      </div>

      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-6 pb-10 text-xs text-ink-faint sm:flex-row sm:items-center sm:justify-between">
        <p>
          © {ano} {EMPRESA.nomeFantasia}. Todos os direitos reservados.
        </p>
        <p>
          Regido pelas leis do {EMPRESA.pais} — LGPD, CDC e Marco Civil da Internet.
          Atualizado em {new Date(LEGAL_ATUALIZADO_EM).toLocaleDateString("pt-BR")}.
        </p>
      </div>
    </footer>
  );
}
