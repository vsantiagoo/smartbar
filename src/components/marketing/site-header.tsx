import Link from "next/link";
import { LogoMark, Wordmark } from "@/components/ui/logo";
import { buttonClasses } from "@/components/ui/button";
import { marketingCopy } from "@/lib/content/copy";
import { HeaderFade } from "./header-fade";
import { MobileMenu } from "./mobile-menu";
import { SectionNav } from "./section-nav";

/**
 * SEÇÃO · Cabeçalho. A partir de 1024px é uma grade de três colunas — marca,
 * barra centralizada e um espaço vazio do mesmo peso — então a barra fica no
 * centro exato sem nunca passar por cima da marca. Abaixo disso, a marca fica à
 * esquerda e o menu vira um botão que abre as seções (`mobile-menu.tsx`).
 *
 * As margens laterais (`header-fade.tsx`) põem tudo por dentro da moldura
 * branca do hero (`inset-3`/`sm:inset-5` em `hero.tsx`).
 */
export function SiteHeader() {
  return (
    <HeaderFade>
      <header className="mx-auto grid max-w-6xl grid-cols-[1fr_auto] items-center gap-3 lg:grid-cols-[1fr_auto_1fr]">
        <Link href="#inicio" className="inline-flex items-center gap-2 justify-self-start">
          <LogoMark className="size-7 text-white" />
          <Wordmark tone="light" className="text-[1.05rem] leading-none" />
        </Link>

        <div className="glass-dark hidden items-center gap-1.5 rounded-full p-1.5 text-white lg:flex">
          <SectionNav />
          <Link href="/admin" className={buttonClasses("accent", "sm", "shrink-0")}>
            {marketingCopy.header.cta}
          </Link>
        </div>

        <MobileMenu className="justify-self-end lg:hidden" />
      </header>
    </HeaderFade>
  );
}
