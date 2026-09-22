import { ArrowRight, ChevronDown, LayoutDashboard } from "lucide-react";
import Link from "next/link";
import { buttonClasses } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { marketingCopy } from "@/lib/content/copy";
import { HeroParallax } from "./hero-parallax";
import { HeroSlideshow, type HeroShot } from "./hero-slideshow";

/**
 * SEÇÃO · Hero em tela cheia: fotos de hotel em crossfade ao fundo, moldura
 * branca vazada (só o contorno) separando o bloco do resto da página e o texto
 * em quatro degraus — etiqueta, título, explicação e as três provas curtas.
 *
 * Trocar as fotos: substitua os arquivos em `public/images/hero/` ou edite
 * `SHOTS` abaixo. O vídeo do hero (Seedance) continua pendente; quando existir,
 * ele entra no lugar de `<HeroSlideshow>`.
 */
const SHOTS: HeroShot[] = [
  { src: "/images/hero/lobby.jpg", alt: "Lobby de hotel ao entardecer, com piso espelhado e luz quente" },
  { src: "/images/hero/fachada.jpg", alt: "Fachada iluminada de um hotel na hora azul" },
];

export function Hero() {
  const c = marketingCopy.hero;
  return (
    /* bg-white: a margem em volta da moldura é branca; a foto fica só dentro dela. */
    <section id="inicio" className="relative flex h-dvh min-h-[640px] items-center justify-center overflow-hidden bg-white">
      {/*
        Tela da moldura: as fotos e o escurecimento ficam recortados aqui dentro,
        então a animação acontece só dentro da borda branca vazada.
      */}
      <div
        className="pointer-events-none absolute inset-3 overflow-hidden rounded-[2.5rem] border border-white/45 sm:inset-5 sm:rounded-[3rem]"
        aria-hidden
      >
        <HeroSlideshow shots={SHOTS} />
        {/* Escurecimento para o texto ficar legível sobre qualquer foto. */}
        <div className="absolute inset-0 bg-brand-950/30" />
        <div className="absolute inset-0 bg-gradient-to-b from-brand-950/75 via-brand-950/25 to-brand-950/80" />
      </div>

      <HeroParallax>
        <Badge tone="gold" className="mx-auto">
          {c.eyebrow}
        </Badge>
        <h1 className="mt-5 text-[2rem] font-bold leading-[1.08] text-white sm:mt-6 sm:text-[3.4rem]">
          {c.title} <span className="text-gold-400">{c.titleAccent}</span>
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-sm text-white/75 sm:mt-5 sm:text-lg">{c.subtitle}</p>

        <div className="mt-7 flex flex-wrap items-center justify-center gap-3 sm:mt-9">
          <Link href="/h/hotel-aurora/q/aurora-101" className={buttonClasses("accent", "lg")}>
            {c.primaryCta} <ArrowRight className="size-5" />
          </Link>
          <Link
            href="/admin"
            className={buttonClasses("ghost", "lg", "glass-tint border-white/25 bg-white/10 text-white hover:border-white/40 hover:bg-white/20")}
          >
            <LayoutDashboard className="size-5" /> {c.secondaryCta}
          </Link>
        </div>
      </HeroParallax>

      {/* Em telas baixas o indicador encostaria nas provas — aí ele não aparece. */}
      <a
        href="#como-funciona"
        className="glass-tint absolute bottom-10 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-1 rounded-full bg-white/5 px-4 py-2 text-xs font-medium text-white/70 transition hover:bg-white/15 hover:text-white [@media(min-height:680px)]:flex"
      >
        {c.scrollHint}
        <ChevronDown className="size-4 animate-bounce" />
      </a>
    </section>
  );
}
