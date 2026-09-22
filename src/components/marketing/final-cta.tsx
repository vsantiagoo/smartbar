import { ArrowRight, ArrowUp } from "lucide-react";
import Link from "next/link";
import { LogoMark, Wordmark } from "@/components/ui/logo";
import { buttonClasses } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { marketingCopy } from "@/lib/content/copy";
import { DEMO_HOTEL_SLUG, DEMO_ROOM_TOKEN, isDemoMode } from "@/lib/config";

/** SEÇÃO · Chamada final + rodapé, no padrão de encerramento do Orbit. */
export function FinalCta() {
  const c = marketingCopy.finalCta;
  return (
    <footer id="contato" className="relative scroll-mt-24 bg-brand-950 px-6 pb-10 pt-24 text-white sm:pt-32">
      {/* Degradê de entrada: a seção clara escurece aos poucos até o rodapé. */}
      <div className="pointer-events-none absolute inset-x-0 bottom-[calc(100%-2px)] h-24 bg-gradient-to-t sm:h-28 from-brand-950 via-brand-950/40 to-transparent" aria-hidden />
      <Reveal className="mx-auto max-w-2xl text-center">
        <h2 className="text-[2.2rem] font-bold leading-[1.15] text-white sm:text-[2.8rem]">{c.title}</h2>
        <p className="mx-auto mt-4 max-w-lg text-white/70">{c.subtitle}</p>
        <Link href={`/h/${DEMO_HOTEL_SLUG}/q/${DEMO_ROOM_TOKEN}`} className={buttonClasses("accent", "lg", "mt-8")}>
          {c.cta} <ArrowRight className="size-5" />
        </Link>

        {/* Caminho de volta: o cabeçalho some conforme a página desce (header-fade.tsx). */}
        <div className="mt-6">
          <a
            href="#inicio"
            className={buttonClasses("ghost", "sm", "glass-tint border-white/20 bg-white/5 text-white/80 hover:border-white/40 hover:bg-white/15 hover:text-white")}
          >
            <ArrowUp className="size-4" /> {c.backToTop}
          </a>
        </div>
      </Reveal>

      <div className="mx-auto mt-24 flex max-w-6xl flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-6 text-sm text-white/50">
        <span className="flex items-center gap-2">
          <LogoMark className="size-6 text-white/70" />
          <Wordmark tone="light" className="text-sm text-white/70" />
        </span>
        <span>{isDemoMode ? "Modo demonstração" : "© SmartBar"}</span>
      </div>
    </footer>
  );
}
