import { ArrowUpRight, LayoutDashboard, Palette, Smartphone } from "lucide-react";
import Link from "next/link";
import { Eyebrow } from "@/components/ui/eyebrow";
import { marketingCopy } from "@/lib/content/copy";
import { getT } from "@/lib/i18n/server";
import { DEMO_HOTEL_SLUG, DEMO_ROOM_TOKEN } from "@/lib/config";
import { Reveal } from "@/components/ui/reveal";
import { BackToTop } from "./back-to-top";
import { GlowBackdrop } from "./glow-backdrop";

const ICONS = { guest: Smartphone, admin: LayoutDashboard, design: Palette } as const;
const ROUTES: Record<string, string> = {
  guest: `/h/${DEMO_HOTEL_SLUG}/q/${DEMO_ROOM_TOKEN}`,
  admin: "/admin",
  design: "/design-system",
};

/** SEÇÃO · Atalhos para as demonstrações funcionais (hóspede, painel, design system). */
export async function QuickLinks() {
  const c = marketingCopy(await getT()).explore;
  return (
    /*
      Respiro desigual de propósito: menos em cima (o conteúdo sobe e o vazio
      acima do "Explorar agora" encolhe) e mais embaixo, para os cards não
      ficarem encostados no degradê escuro do rodapé.
    */
    <section id="explorar" className="relative isolate px-6 pb-24 pt-10 sm:px-10 sm:pb-28 sm:pt-12">
      <BackToTop />
      <GlowBackdrop />
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <Eyebrow>{c.kicker}</Eyebrow>
          <h2 className="mt-5 text-[2.1rem] font-bold leading-[1.15] sm:text-[2.6rem]">{c.title}</h2>
        </Reveal>

        <ul className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-3">
          {c.items.map((item, i) => {
            const Icon = ICONS[item.route as keyof typeof ICONS];
            return (
              <li key={item.title}>
                <Reveal delay={i * 100} className="h-full">
                  <Link
                    href={ROUTES[item.route]!}
                    className="glass lift group flex h-full flex-col rounded-card p-6"
                  >
                    <span className="glass-tint grid size-11 place-items-center rounded-2xl bg-brand-700/80 text-white">
                      <Icon className="size-5" />
                    </span>
                    <span className="mt-5 flex items-center justify-between gap-2 text-lg font-semibold text-ink">
                      {item.title}
                      <ArrowUpRight className="size-5 text-ink-faint transition group-hover:text-brand-700" />
                    </span>
                    <span className="mt-1.5 text-sm text-ink-soft">{item.text}</span>
                  </Link>
                </Reveal>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
