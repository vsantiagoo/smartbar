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
        {/* Vidro no lugar do dourado sólido: sobre a foto, o texto vai a branco. */}
        <Badge tone="gold" className="glass bg-white/10 text-white">
          {c.eyebrow}
        </Badge>
        {/* -0.0469em = os -3px pedidos no tamanho cheio (64px), proporcional quando a tela encolhe. */}
        <h1
          className="mt-6 whitespace-pre-line text-white"
          style={{ fontSize: "clamp(34px,6.4vw,64px)", fontWeight: 400, lineHeight: 1.06, letterSpacing: "-0.0469em" }}
        >
          {c.title}
        </h1>

        <p
          className="max-w-xl whitespace-pre-line text-white/75"
          style={{ margin: "23px 0 28px", fontSize: "14px", lineHeight: 1.9 }}
        >
          {c.subtitle}
        </p>

        <div className="flex flex-wrap items-center gap-3">
          <Link href="/h/hotel-aurora/q/aurora-101" className={buttonClasses("accent", "lg", "h-12 border-gold-400/50 bg-gold-500/30 px-7 text-[0.95rem] text-white hover:border-gold-400/70 hover:bg-gold-500/45")}>
            {c.primaryCta} <ArrowRight className="size-[18px]" />
          </Link>
          <Link
            href="/admin"
            className={buttonClasses(
              "ghost",
              "lg",
              "glass-tint h-12 border-white/25 bg-white/10 px-7 text-[0.95rem] text-white hover:border-white/40 hover:bg-white/20",
            )}
          >
            <LayoutDashboard className="size-[18px]" /> {c.secondaryCta}
          </Link>
        </div>
      </HeroParallax>

      {/* Em telas baixas o indicador encostaria nos botões — aí ele não aparece. */}
      <a
        href="#como-funciona"
        className="glass-tint absolute bottom-10 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-1 whitespace-nowrap rounded-full bg-white/5 px-4 py-2 text-xs font-medium text-white/70 transition hover:bg-white/15 hover:text-white [@media(min-height:680px)]:flex"
      >
        {c.scrollHint}
        <ChevronDown className="size-4 animate-bounce" />
      </a>
    </section>
  );
}
