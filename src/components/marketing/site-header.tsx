import Link from "next/link";
import { Logo } from "@/components/ui/logo";
import { marketingCopy } from "@/lib/content/copy";
import { HeaderFade } from "./header-fade";
import { SectionNav } from "./section-nav";

/**
 * SEÇÃO · Cabeçalho. A barra de menus existe em todos os tamanhos: a partir de
 * 1024px ela fica centralizada numa grade de três colunas (marca · barra ·
 * espaço do mesmo peso), e abaixo disso ocupa a largura que sobra ao lado da
 * marca, com o menu deslizando na horizontal (`section-nav.tsx`).
 *
 * No celular a marca é só o ícone animado — o letreiro "SmartBar" entra a
 * partir de 768px, quando há espaço sem apertar o menu.
 *
 * As margens laterais (`header-fade.tsx`) põem tudo por dentro da moldura
 * branca do hero (`inset-3`/`sm:inset-5` em `hero.tsx`).
 */
export function SiteHeader() {
  const c = marketingCopy.header;
  const brand = (
    <span className="inline-flex pr-5 sm:pr-7">
      {/*
        Celular: só o ícone, com a luz pulsando. A partir de 1024px entra o texto:
        antes disso ele (e seu espelho) comeriam o menu. A entrada animada roda a
        cada carga/recarga da página.
      */}
      <Logo tone="light" className="[--logo-size:1.75rem] sm:[--logo-size:2rem]" wordmarkClassName="hidden lg:inline-block" />
    </span>
  );
  return (
    <HeaderFade>
      {/*
        Três colunas sem vão: as laterais (1fr) têm o mesmo peso, então a barra
        fica no centro exato da página sempre que couber. Quando o espaço
        aperta, `minmax(0,auto)` deixa ela encolher e o menu desliza, em vez de
        empurrar a marca. O respiro da marca vem do seu próprio `pr-*`, para a
        coluna vazia da direita não sobrar como espaço morto.
      */}
      <header className="mx-auto grid max-w-6xl grid-cols-[1fr_minmax(0,auto)_1fr] items-center">
        <Link href="#inicio" className="justify-self-start" aria-label="SmartBar">
          {brand}
        </Link>

        <div className="glass-dark flex min-w-0 items-center gap-1 rounded-full p-1 text-white sm:gap-1.5 sm:p-1.5">
          <SectionNav className="min-w-0 flex-1" />
          <Link
            href="/admin"
            className="inline-flex h-8 shrink-0 items-center rounded-full px-3 text-[0.75rem] font-medium text-white/30 outline-none transition-colors duration-300 hover:text-white hover:[text-shadow:0_0_8px_rgb(255_255_255/0.9),0_0_18px_rgb(140_200_255/0.75)] focus-visible:text-white focus-visible:[text-shadow:0_0_8px_rgb(255_255_255/0.9),0_0_18px_rgb(140_200_255/0.75)] sm:h-9 sm:px-4 sm:text-sm"
          >
            <span className="sm:hidden">{c.ctaShort}</span>
            <span className="hidden sm:inline">{c.cta}</span>
          </Link>
        </div>

        {/* Espelho invisível da marca: dá à coluna da direita o mesmo peso da esquerda,
            então a barra cai no centro exato da página em vez de escorregar. */}
        <span aria-hidden className="invisible justify-self-end">{brand}</span>
      </header>
    </HeaderFade>
  );
}
