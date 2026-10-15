"use client";
import { ChevronDown, Lock, PanelTopClose, PanelTopOpen } from "lucide-react";
import { useEffect, useState } from "react";
import { Badge, type BadgeTone } from "@/components/ui/badge";
import { GlassCard } from "@/components/ui/glass-card";
import { useI18n } from "@/lib/i18n/client";
import type { DictKey } from "@/lib/i18n/translate";
import { cn } from "@/lib/utils";
import type { DashboardSnapshot } from "@/lib/types";

const STORAGE_KEY = "smartbar-presentation-collapsed";

type StepState = "done" | "waiting" | "attention";
const STATE_UI: Record<StepState, { labelKey: DictKey; tone: BadgeTone }> = {
  done: { labelKey: "admin.pres.state.done", tone: "ok" },
  waiting: { labelKey: "admin.pres.state.waiting", tone: "neutral" },
  attention: { labelKey: "admin.pres.state.attention", tone: "warn" },
};

/** Referências do Plano de Negócios (hotel de 50 quartos) — não são medições deste hotel. */
const BENCHMARKS = [
  { labelKey: "admin.pres.bench.shrinkage" as DictKey, from: "22%", to: "< 1%" },
  { labelKey: "admin.pres.bench.checkout" as DictKey, from: "8–12 min", to: "2–3 min" },
  { labelKey: "admin.pres.bench.housekeeping" as DictKey, from: "15 min", to: "9 min" },
];

/**
 * SEÇÃO · Apresentação do sistema.
 * Explica o SmartBar em 3 etapas com o estado real de cada uma (execução
 * em etapas, no padrão do design system Orbit). Pode ser recolhida.
 */
export function SystemPresentation({ data }: { data: DashboardSnapshot }) {
  const { t } = useI18n();
  const [collapsed, setCollapsed] = useState(false);
  const [openStep, setOpenStep] = useState<number | null>(0);

  useEffect(() => {
    try {
      setCollapsed(localStorage.getItem(STORAGE_KEY) === "1");
    } catch {
      /* storage bloqueado: segue expandido */
    }
  }, []);

  function toggle() {
    setCollapsed((c) => {
      try {
        localStorage.setItem(STORAGE_KEY, c ? "0" : "1");
      } catch {
        /* ignora */
      }
      return !c;
    });
  }

  const totalRooms = data.rooms.length;
  const offline = data.rooms.filter((r) => !r.deviceOnline).length;
  const opened = data.transactionsToday;

  const steps: { title: string; live: string; state: StepState; detail: string }[] = [
    {
      title: t("admin.pres.1.title"),
      live: t("admin.pres.1.live", { n: totalRooms }),
      state: totalRooms > 0 ? "done" : "waiting",
      detail:
        t("admin.pres.1.detail"),
    },
    {
      title: t("admin.pres.2.title"),
      live: t("admin.pres.2.live", { n: opened, pix: data.pixSharePct }),
      state: opened > 0 ? "done" : "waiting",
      detail:
        t("admin.pres.2.detail"),
    },
    {
      title: t("admin.pres.3.title"),
      live: t("admin.pres.3.live", { online: totalRooms - offline, total: totalRooms }),
      state: offline > 0 ? "attention" : "done",
      detail:
        t("admin.pres.3.detail"),
    },
  ];

  return (
    <GlassCard surface="navy" pad="none" className="relative overflow-hidden">
      <div className="pointer-events-none absolute -right-24 -top-24 size-[26rem] rounded-full bg-brand-500/30 blur-3xl" aria-hidden />
      <div className="pointer-events-none absolute -bottom-32 left-1/3 size-80 rounded-full bg-gold-500/15 blur-3xl" aria-hidden />

      <div className="relative p-6 sm:p-8">
        <div className="flex items-start justify-between gap-4">
          <div className="max-w-xl">
            <Badge tone="gold">{t("admin.pres.badge")}</Badge>
            <h2 className="mt-4 text-[1.75rem] font-bold leading-[1.15] !text-white sm:text-[2.1rem]">
              {t("admin.pres.title")} <span className="text-gold-400">{t("admin.pres.titleAccent")}</span>
            </h2>
            {!collapsed && (
              <p className="mt-3 text-[0.95rem] text-white/70">
                {t("admin.pres.subtitle")}
              </p>
            )}
          </div>
          <button
            onClick={toggle}
            aria-expanded={!collapsed}
            aria-label={collapsed ? t("admin.pres.expand") : t("admin.pres.collapse")}
            className="grid size-10 shrink-0 place-items-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
          >
            {collapsed ? <PanelTopOpen className="size-5" /> : <PanelTopClose className="size-5" />}
          </button>
        </div>

        {!collapsed && (
          <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[1.25fr_1fr]">
            <ol className="space-y-2.5" aria-label={t("admin.pres.stepsLabel")}>
              {steps.map((s, i) => {
                const ui = STATE_UI[s.state];
                const isOpen = openStep === i;
                return (
                  <li key={s.title} className="rounded-3xl bg-white/[0.07] ring-1 ring-white/10">
                    <button
                      onClick={() => setOpenStep(isOpen ? null : i)}
                      aria-expanded={isOpen}
                      className="flex w-full items-center gap-3.5 p-3.5 text-left"
                    >
                      <span className="tabular grid size-9 shrink-0 place-items-center rounded-full bg-white/12 text-sm font-bold text-white">{i + 1}</span>
                      <span className="min-w-0 flex-1">
                        <span className="block font-semibold text-white">{s.title}</span>
                        <span className="block truncate text-sm text-white/65">{s.live}</span>
                      </span>
                      <Badge tone={ui.tone} dot pulse={s.state === "done"} className="hidden sm:inline-flex">
                        {t(ui.labelKey)}
                      </Badge>
                      <ChevronDown className={cn("size-5 shrink-0 text-white/60 transition", isOpen && "rotate-180")} />
                    </button>
                    {isOpen && <p className="animate-fade-up px-4 pb-4 pl-[3.6rem] text-sm leading-relaxed text-white/70">{s.detail}</p>}
                  </li>
                );
              })}
            </ol>

            <div className="flex flex-col gap-6">
              <Orbit />
              <div>
                <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-white/50">{t("admin.pres.benchTitle")}</p>
                <ul className="space-y-2">
                  {BENCHMARKS.map((b) => (
                    <li key={b.labelKey} className="flex items-center justify-between gap-3 text-sm">
                      <span className="text-white/70">{t(b.labelKey)}</span>
                      <span className="tabular font-semibold text-white">
                        <span className="text-white/45 line-through">{b.from}</span> <span className="text-gold-400">→ {b.to}</span>
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </GlassCard>
  );
}

/** Motivo visual: o hotel no centro e os 3 passos em órbita. Decorativo. */
function Orbit() {
  return (
    <div className="relative mx-auto grid size-44 place-items-center" aria-hidden>
      {[1, 0.72, 0.44].map((s) => (
        <span key={s} className="absolute rounded-full border border-white/15" style={{ inset: `${(1 - s) * 50}%` }} />
      ))}
      <span className="absolute inset-0 animate-orbit">
        <span className="absolute left-1/2 top-0 size-3 -translate-x-1/2 rounded-full bg-gold-500 shadow-[0_0_14px_rgb(var(--gold-500))]" />
        <span className="absolute bottom-[14%] right-[12%] size-2.5 rounded-full bg-ok-500" />
      </span>
      <span className="absolute inset-[14%] animate-orbit-slow">
        <span className="absolute left-0 top-1/2 size-2.5 -translate-y-1/2 rounded-full bg-white" />
      </span>
      <span className="relative grid size-16 place-items-center rounded-full bg-white/12 text-white ring-1 ring-white/25 backdrop-blur">
        <Lock className="size-7" strokeWidth={1.6} />
      </span>
    </div>
  );
}
