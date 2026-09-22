import { ArrowUpRight, LayoutDashboard, Palette, Smartphone } from "lucide-react";
import Link from "next/link";
import { marketingCopy } from "@/lib/content/copy";
import { DEMO_HOTEL_SLUG, DEMO_ROOM_TOKEN } from "@/lib/config";

const ICONS = { guest: Smartphone, admin: LayoutDashboard, design: Palette } as const;
const ROUTES: Record<string, string> = {
  guest: `/h/${DEMO_HOTEL_SLUG}/q/${DEMO_ROOM_TOKEN}`,
  admin: "/admin",
  design: "/design-system",
};

/** SEÇÃO · Atalhos para as demonstrações funcionais (hóspede, painel, design system). */
export function QuickLinks() {
  const c = marketingCopy.explore;
  return (
    <section id="explorar" className="scroll-mt-24 bg-white px-6 py-24 sm:py-32">
      <div className="mx-auto max-w-5xl">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-500">{c.kicker}</p>
        <h2 className="mt-3 text-[2.1rem] font-bold leading-[1.15] sm:text-[2.6rem]">{c.title}</h2>

        <ul className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-3">
          {c.items.map((item) => {
            const Icon = ICONS[item.route as keyof typeof ICONS];
            return (
              <li key={item.title}>
                <Link href={ROUTES[item.route]!} className="glass group flex h-full flex-col rounded-[28px] p-6 transition hover:-translate-y-1 hover:bg-white/80">
                  <span className="grid size-11 place-items-center rounded-2xl bg-brand-700 text-white">
                    <Icon className="size-5" />
                  </span>
                  <span className="mt-5 flex items-center justify-between gap-2 text-lg font-semibold text-brand-800">
                    {item.title}
                    <ArrowUpRight className="size-5 text-ink-faint transition group-hover:text-brand-700" />
                  </span>
                  <span className="mt-1.5 text-sm text-ink-soft">{item.text}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
