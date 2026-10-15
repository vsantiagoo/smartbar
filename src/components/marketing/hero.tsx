import { ArrowRight, ChevronDown, LayoutDashboard } from "lucide-react";
import Link from "next/link";
import { buttonClasses } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { marketingCopy } from "@/lib/content/copy";
import { getT } from "@/lib/i18n/server";
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
/** As descrições das fotos (alt) vêm do dicionário — ver dentro do componente. */

export async function Hero() {
  const t = await getT();
  const c = marketingCopy(t).hero;
  const SHOTS: HeroShot[] = [
    { src: "/images/hero/lobby.jpg", alt: t("site.hero.alt1") },
    { src: "/images/hero/fachada.jpg", alt: t("site.hero.alt2") },
  ];
  return (
    /*
      A margem em volta da moldura é branca e a foto fica só dentro dela. No
      escuro ela fica TRANSPARENTE em vez de trocar de cor: por baixo está o
      gradiente escuro que a casca do site já pinta, então a moldura acompanha
      o tema sem ninguém precisar manter duas cores em sincronia.
    */
    <section
      id="inicio"
      className="relative flex h-dvh min-h-[640px] items-center justify-center overflow-hidden bg-white dark:bg-transparent"
    >
      {/*
        Tela da moldura: as fotos e o escurecimento ficam recortados aqui dentro,
        então a animação acontece só dentro da borda branca vazada.
      */}
      {/*
        Único raio fora da escala óptica, de propósito: isto não é um material
        sobre a página, é a moldura da própria viewport. Ela tem de ser mais
        aberta que `surface` (36px) para a borda branca não parecer um card.
      */}
      <div
        className="pointer-events-none absolute inset-1.5 overflow-hidden rounded-[2.25rem] border border-white/45 sm:inset-2.5 sm:rounded-[2.5rem]"
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
