import { KeyRound, MousePointerClick, Smartphone } from "lucide-react";
import { guestCopy } from "@/lib/content/copy";

const ICONS = [MousePointerClick, Smartphone, KeyRound] as const;

/** SEÇÃO · Como funciona (3 passos). Texto em guestCopy.howItWorks. */
export function HowItWorks() {
  const { title, steps } = guestCopy.howItWorks;
  return (
    <section className="mt-8" aria-labelledby="how-title">
      <h2 id="how-title" className="mb-3 px-1 text-sm font-semibold uppercase tracking-[0.12em] text-ink-soft">
        {title}
      </h2>
      <ol className="grid grid-cols-3 gap-2.5">
        {steps.map((s, i) => {
          const Icon = ICONS[i] ?? KeyRound;
          return (
            <li key={s.title} className="glass rounded-3xl p-3.5">
              <span className="grid size-9 place-items-center rounded-2xl bg-brand-700/10 text-brand-700">
                <Icon className="size-[18px]" />
              </span>
              <p className="mt-3 text-sm font-semibold text-ink">{s.title}</p>
              <p className="mt-0.5 text-xs leading-snug text-ink-soft">{s.text}</p>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
