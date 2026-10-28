import Link from "next/link";
import type { ReactNode } from "react";
import { LogoMark, Wordmark } from "@/components/ui/logo";
import { SiteFooter } from "@/components/marketing/site-footer";
import { empresaEmRascunho, empresaPendente } from "@/lib/content/empresa";

/**
 * Casca das páginas legais (/privacidade, /termos, /cookies, /reembolso).
 *
 * Fica fora do I18nProvider de propósito: o conteúdo jurídico é da jurisdição
 * brasileira e vive em pt. O que o visitante precisa aqui é ler com calma e
 * achar o caminho de volta — nada de scroll animado.
 *
 * Enquanto `empresa.ts` tiver campo `[PREENCHER]`, uma faixa avisa que o texto
 * é rascunho. Some sozinha quando os dados forem preenchidos.
 */
export default function LegalLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-dvh bg-black/40">
      <header className="sticky top-0 z-10 border-b border-white/10 bg-black/30 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2 rounded" aria-label="Voltar à página inicial do SmartBar">
            <LogoMark tone="light" intro={false} className="size-8" />
            <Wordmark tone="light" className="text-lg" />
          </Link>
          <Link href="/" className="rounded text-sm text-ink-soft underline-offset-4 hover:underline">
            Voltar ao site
          </Link>
        </div>
      </header>

      {empresaEmRascunho && (
        <div
          role="status"
          className="mx-auto mt-6 max-w-3xl rounded-lg border border-amber-400/40 bg-amber-400/10 px-5 py-3 text-sm text-amber-100"
        >
          <strong className="font-semibold">Rascunho.</strong> Esta página ainda
          depende de dados da empresa a preencher ({empresaPendente.join(", ")}) e
          de revisão jurídica antes de valer como documento oficial.
        </div>
      )}

      <main className="mx-auto max-w-3xl px-6 py-14 [&_a]:text-hotel-accent [&_a]:underline-offset-4 hover:[&_a]:underline [&_h2]:mt-10 [&_h2]:scroll-mt-24 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-ink [&_h3]:mt-6 [&_h3]:font-semibold [&_h3]:text-ink [&_li]:my-1 [&_ol]:my-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_p]:my-4 [&_p]:leading-relaxed [&_p]:text-ink-soft [&_ul]:my-4 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:text-ink-soft">
        {children}
      </main>

      <SiteFooter />
    </div>
  );
}
