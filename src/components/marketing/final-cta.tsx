import { ArrowUp } from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { buttonClasses } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { marketingCopy } from "@/lib/content/copy";
import { BackToTopButton } from "./back-to-top";
import { DayNightLens } from "./day-night-lens";

/** SEÇÃO · Chamada final + rodapé, no padrão de encerramento do Orbit. */
export function FinalCta() {
  const c = marketingCopy.finalCta;
  return (
    <footer
      id="contato"
      /*
        min-h em vw: dá ao rodapé a MESMA proporção da foto (1920×1072), então
        ela cabe inteira — céu e arquitetura — sem `cover` cortar nada. No
        celular a altura vem do conteúdo e a foto é enquadrada, como convém a
        uma tela estreita.

        `flex-col` existe por causa do `mt-auto` dos botões: é ele que os
        empurra para o pé da seção quando sobra altura.
      */
      className="relative isolate flex touch-pan-y scroll-mt-24 flex-col overflow-hidden bg-brand-950 px-6 pb-10 pt-24 text-white sm:px-10 sm:pt-32 md:min-h-[55.9vw]"
    >
      {/*
        Fundo vivo: a foto do hotel muda de hora sob o cursor. O véu por cima
        segura o contraste do texto branco — sem ele, o céu claro do meio-dia
        engoliria o título.
      */}
      <DayNightLens className="absolute inset-0 -z-10" />
      <div aria-hidden className="absolute inset-0 -z-10 bg-brand-950/42" />
      {/* O escuro vai para onde o texto está, não para a foto inteira: um oval
          no centro segura o contraste do título e deixa o céu e as pontas da
          arquitetura à vista. A faixa de baixo fecha a página. */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(ellipse 70% 52% at 50% 44%, rgb(var(--brand-950) / 0.74), transparent 72%), linear-gradient(to bottom, transparent 62%, rgb(var(--brand-950) / 0.88))",
        }}
      />

      <Reveal className="mx-auto max-w-2xl text-center">
        <h2 className="text-[2.2rem] font-bold leading-[1.15] text-white sm:text-[2.8rem]">{c.title}</h2>
        <p className="mx-auto mt-4 max-w-lg text-white/70">{c.subtitle}</p>
      </Reveal>

      {/*
        Os botões ficam no pé da seção, e não sob o texto: no meio da foto eles
        cortavam a fachada do hotel e ocupavam justo a faixa onde a lente do
        tempo é manuseada. `mt-auto` cola o bloco na base sempre que a seção
        tem altura de sobra; no celular, sem `min-h`, o `pt-16` dá o respiro.
      */}
      <Reveal className="mt-auto flex flex-col items-center gap-3 pt-16">
        {/* Caminho de volta: o cabeçalho some conforme a página desce (header-fade.tsx).
            Mesmo comportamento da seta de canto — vem do mesmo lugar. */}
        <BackToTopButton
          className={buttonClasses("ghost", "sm", "glass-tint border-white/20 bg-white/5 text-white/80 hover:border-white/40 hover:bg-white/15 hover:text-white")}
        >
          <ArrowUp className="size-4" /> {c.backToTop}
        </BackToTopButton>
      </Reveal>

      <div className="mx-auto mt-10 flex w-full max-w-6xl flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-6 text-sm text-white/50">
        <Logo tone="light" intro="inview" className="opacity-70 [--logo-size:1.5rem]" />
      </div>
    </footer>
  );
}
