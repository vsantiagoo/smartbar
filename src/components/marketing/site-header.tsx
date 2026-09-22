import Link from "next/link";
import { LogoMark, Wordmark } from "@/components/ui/logo";
import { buttonClasses } from "@/components/ui/button";
import { marketingCopy } from "@/lib/content/copy";
import { SectionNav } from "./section-nav";
import { HeaderFade } from "./header-fade";

/**
 * SEÇÃO · Cabeçalho: a barra de vidro fica centralizada e do tamanho do
 * conteúdo, um pouco abaixo do topo para não encostar na moldura do hero
 * (ver `inset-3`/`sm:inset-5` em `hero.tsx`). A marca fica fora da barra.
 *
 * Ele some conforme a página desce (`header-fade.tsx`) e volta ao subir; da
 * última tela se retorna pelo botão "Voltar ao início" do rodapé.
 *
 * Em telas estreitas a barra volta a ocupar a largura toda, com o menu rolando
 * na horizontal, e a palavra "SmartBar" some para dar espaço a ele.
 */
export function SiteHeader() {
  return (
    <HeaderFade>
      <header className="relative mx-auto flex max-w-6xl items-center gap-2">
        <Link
          href="#inicio"
          className="z-10 inline-flex shrink-0 items-center gap-1.5 sm:absolute sm:left-0 sm:top-1/2 sm:-translate-y-1/2"
        >
          <LogoMark className="size-7 text-white" />
          <Wordmark tone="light" className="hidden text-[1.05rem] leading-none sm:inline" />
        </Link>

        <div className="glass-dark flex min-w-0 flex-1 items-center gap-1.5 rounded-full p-1.5 text-white sm:mx-auto sm:w-fit sm:flex-none">
          <SectionNav className="min-w-0 flex-1 sm:flex-none" />
          <Link href="/admin" className={buttonClasses("accent", "sm", "shrink-0")}>
            {marketingCopy.header.cta}
          </Link>
        </div>
      </header>
    </HeaderFade>
  );
}
