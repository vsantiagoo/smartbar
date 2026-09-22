import { ArrowRight, ChevronDown, LayoutDashboard } from "lucide-react";
import Link from "next/link";
import { buttonClasses } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { marketingCopy } from "@/lib/content/copy";

/**
 * SEÇÃO · Hero em tela cheia, estilo Orbit (glassmorfismo, vídeo de fundo).
 *
 * O vídeo ainda não foi gerado (Seedance 2.5 via CLI Higgsfield — pendente de
 * créditos na conta). Para plugar o vídeo definitivo:
 *   1. Salve o arquivo em `public/videos/hero.mp4` (H.264, 16:9, 1080p).
 *   2. Troque a constante `HERO_VIDEO_SRC` abaixo pelo caminho `/videos/hero.mp4`.
 * Enquanto não houver vídeo, o fundo é um degradê animado (respeita
 * "reduzir movimento") nas cores da marca — não é o resultado final.
 */
const HERO_VIDEO_SRC: string | null = null;

export function Hero() {
  const c = marketingCopy.hero;
  return (
    <section id="inicio" className="relative flex h-dvh min-h-[640px] items-center justify-center overflow-hidden bg-brand-950">
      <div className="absolute inset-0" aria-hidden>
        {HERO_VIDEO_SRC ? (
          <video className="size-full object-cover" src={HERO_VIDEO_SRC} autoPlay muted loop playsInline />
        ) : (
          <>
            <div className="absolute -left-1/4 -top-1/4 size-[70%] animate-blob-a rounded-full bg-brand-500/40 blur-[110px]" />
            <div className="absolute -bottom-1/4 -right-1/4 size-[70%] animate-blob-b rounded-full bg-gold-500/25 blur-[110px]" />
            <div className="absolute inset-0 bg-gradient-to-b from-brand-950/40 via-brand-950/10 to-brand-950" />
          </>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-brand-950 via-brand-950/20 to-brand-950/60" />
      </div>

      <div className="relative mx-auto max-w-3xl px-6 text-center text-white">
        <Badge tone="gold" className="mx-auto">
          {c.eyebrow}
        </Badge>
        <h1 className="mt-6 text-[2.6rem] font-bold leading-[1.08] text-white sm:text-[3.6rem]">
          {c.title} <span className="text-gold-400">{c.titleAccent}</span>
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-lg text-white/75">{c.subtitle}</p>
        <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
          <Link href="/h/hotel-aurora/q/aurora-101" className={buttonClasses("accent", "lg")}>
            {c.primaryCta} <ArrowRight className="size-5" />
          </Link>
          <Link
            href="/admin"
            className={buttonClasses("ghost", "lg", "border border-white/25 bg-white/10 text-white backdrop-blur-md hover:bg-white/20")}
          >
            <LayoutDashboard className="size-5" /> {c.secondaryCta}
          </Link>
        </div>
      </div>

      <a
        href="#como-funciona"
        className="absolute bottom-24 left-1/2 flex -translate-x-1/2 flex-col items-center gap-1 text-xs font-medium text-white/60 transition hover:text-white"
      >
        {c.scrollHint}
        <ChevronDown className="size-4 animate-bounce" />
      </a>
    </section>
  );
}
