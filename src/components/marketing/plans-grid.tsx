import { Check } from "lucide-react";
import { buttonClasses } from "@/components/ui/button";
import { marketingCopy } from "@/lib/content/copy";
import { cn } from "@/lib/utils";

/** SEÇÃO · Planos (cards), no padrão "próximos capítulos" do Orbit. */
export function PlansGrid() {
  const c = marketingCopy.plans;
  return (
    <section id="planos" className="scroll-mt-24 px-6 py-24 sm:py-32">
      <div className="mx-auto max-w-6xl">
        <div className="max-w-xl">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-500">{c.kicker}</p>
          <h2 className="mt-3 text-[2.1rem] font-bold leading-[1.15] sm:text-[2.6rem]">{c.title}</h2>
          <p className="mt-3 text-ink-soft">{c.subtitle}</p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-3">
          {c.items.map((plan) => (
            <div
              key={plan.tier}
              className={cn(
                "flex flex-col rounded-[32px] p-7",
                plan.highlight ? "bg-brand-900 text-white shadow-soft ring-1 ring-brand-700" : "glass",
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
                    <span className={plan.highlight ? "text-white/85" : "text-brand-900"}>{f}</span>
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
          ))}
        </div>
      </div>
    </section>
  );
}
