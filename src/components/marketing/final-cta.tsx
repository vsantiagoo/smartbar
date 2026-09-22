import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { LogoMark, Wordmark } from "@/components/ui/logo";
import { buttonClasses } from "@/components/ui/button";
import { marketingCopy } from "@/lib/content/copy";
import { DEMO_HOTEL_SLUG, DEMO_ROOM_TOKEN, isDemoMode } from "@/lib/config";

/** SEÇÃO · Chamada final + rodapé, no padrão de encerramento do Orbit. */
export function FinalCta() {
  const c = marketingCopy.finalCta;
  return (
    <footer id="contato" className="scroll-mt-24 bg-brand-950 px-6 pb-10 pt-24 text-white sm:pt-32">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-[2.2rem] font-bold leading-[1.15] text-white sm:text-[2.8rem]">{c.title}</h2>
        <p className="mx-auto mt-4 max-w-lg text-white/70">{c.subtitle}</p>
        <Link href={`/h/${DEMO_HOTEL_SLUG}/q/${DEMO_ROOM_TOKEN}`} className={buttonClasses("accent", "lg", "mt-8")}>
          {c.cta} <ArrowRight className="size-5" />
        </Link>
      </div>

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
