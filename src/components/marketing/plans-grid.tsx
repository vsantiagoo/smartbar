import { Check } from "lucide-react";
import { buttonClasses } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { marketingCopy } from "@/lib/content/copy";
import { cn } from "@/lib/utils";
import { GlowBackdrop } from "./glow-backdrop";

/** SEÇÃO · Planos (cards de vidro), no padrão "próximos capítulos" do Orbit. */
export function PlansGrid() {
  const c = marketingCopy.plans;
  return (
    <section id="planos" className="relative isolate scroll-mt-24 px-6 py-24 sm:py-32">
      <GlowBackdrop flip />
      <div className="mx-auto max-w-6xl">
        <Reveal className="max-w-xl">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-500">{c.kicker}</p>
          <h2 className="mt-3 text-[2.1rem] font-bold leading-[1.15] sm:text-[2.6rem]">{c.title}</h2>
          <p className="mt-3 text-ink-soft">{c.subtitle}</p>
        </Reveal>

        <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-3">
          {c.items.map((plan, i) => (
            <Reveal key={plan.tier} delay={i * 110} className="h-full">
              <div
                className={cn(
                  "flex h-full flex-col rounded-[32px] p-7 transition duration-300 hover:-translate-y-1",
                  plan.highlight ? "glass-navy text-white" : "glass",
                )}
              >
                <p className={cn("text-sm font-semibold uppercase tracking-wide", plan.highlight ? "text-gold-400" : "text-brand-500")}>
                  {plan.tier}
                </p>
                <p className="mt-3 flex flex-wrap items-baseline gap-x-1.5">
                  <span className="whitespace-nowrap text-[2rem] font-bold">{plan.price}</span>
                  <span className={cn("whitespace-nowrap text-sm", plan.highlight ? "text-white/60" : "text-ink-soft")}>{plan.unit}</span>
                </p>
                <p className={cn("text-xs", plan.highlight ? "text-white/50" : "text-ink-faint")}>{plan.minimum}</p>

                <ul className="mt-6 flex-1 space-y-2.5">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm">
                      <Check className={cn("mt-0.5 size-4 shrink-0", plan.highlight ? "text-gold-400" : "text-ok-500")} />
                      <span className={plan.highlight ? "text-white/85" : "text-ink"}>{f}</span>
                    </li>
                  ))}
                </ul>

                <a
                  href="#explorar"
                  className={buttonClasses(plan.highlight ? "accent" : "soft", "md", "mt-7 w-full justify-center")}
                >
                  Explorar planos
                </a>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
