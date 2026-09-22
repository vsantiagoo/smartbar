"use client";
import { Check, Copy, RotateCcw } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import {
  DEFAULT_THEME,
  STEPS,
  THEME_ROLES,
  THEME_STORAGE_KEY,
  contrastRatio,
  isHex,
  themeToSnippet,
  themeToVars,
  type ThemeColors,
} from "@/lib/theme";
import { cn } from "@/lib/utils";

/** Paletas prontas para explorar direções — todas editáveis depois. */
const PRESETS: { name: string; theme: ThemeColors }[] = [
  { name: "SmartBar (Brandbook)", theme: DEFAULT_THEME },
  {
    name: "Grafite & Esmeralda",
    theme: { primary: "#1F2A37", secondary: "#B4232C", accent: "#2DBE8C", success: "#1E9E5A", danger: "#D9463A", text: "#26323F", skyTop: "#D5DDE3", skyBottom: "#EFEDE8" },
  },
  {
    name: "Oceano & Coral",
    theme: { primary: "#0B4F6C", secondary: "#E4572E", accent: "#FFB627", success: "#20A56B", danger: "#D64545", text: "#263A47", skyTop: "#C9E4EE", skyBottom: "#F7EBDD" },
  },
  {
    name: "Areia & Terracota",
    theme: { primary: "#5B3A29", secondary: "#B5452F", accent: "#D99A2B", success: "#4E8B4A", danger: "#C24B3A", text: "#3B2F2A", skyTop: "#E8DCCB", skyBottom: "#F6EFE6" },
  },
  {
    name: "Noite & Lavanda",
    theme: { primary: "#2E2A6B", secondary: "#C2255C", accent: "#F2B33D", success: "#2F9E6E", danger: "#E5484D", text: "#2B2A44", skyTop: "#D8D6EE", skyBottom: "#F1E9F0" },
  },
];

const SCALES = [
  { name: "brand", label: "Primária" },
  { name: "crimson", label: "Secundária" },
  { name: "gold", label: "Destaque" },
] as const;

/** Aplica as variáveis direto no <html> (efeito imediato em todo o app) e persiste. */
function apply(theme: ThemeColors, persist: boolean): void {
  const vars = themeToVars(theme);
  const root = document.documentElement.style;
  Object.entries(vars).forEach(([k, v]) => root.setProperty(k, v));
  if (!persist) return;
  try {
    localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify({ theme, vars }));
  } catch {
    /* storage bloqueado: a mudança vale só nesta sessão */
  }
}

function ratioBadge(ratio: number): { label: string; ok: boolean } {
  if (ratio >= 7) return { label: `${ratio.toFixed(1)}:1 · AAA`, ok: true };
  if (ratio >= 4.5) return { label: `${ratio.toFixed(1)}:1 · AA`, ok: true };
  return { label: `${ratio.toFixed(1)}:1 · baixo contraste`, ok: false };
}

/**
 * EDITOR DE CORES. Cada papel (primária, destaque…) gera a escala completa.
 * A mudança é aplicada na hora em TODAS as telas e fica salva neste navegador.
 * Para tornar permanente, use "Copiar tema" e cole em src/lib/theme.ts.
 */
export function ThemeEditor() {
  const [theme, setTheme] = useState<ThemeColors>(DEFAULT_THEME);
  const [drafts, setDrafts] = useState<Partial<Record<keyof ThemeColors, string>>>({});
  const [copied, setCopied] = useState(false);
  const [customized, setCustomized] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(THEME_STORAGE_KEY);
      if (raw) {
        const saved = (JSON.parse(raw) as { theme?: ThemeColors }).theme;
        if (saved) {
          setTheme({ ...DEFAULT_THEME, ...saved });
          setCustomized(true);
        }
      }
    } catch {
      /* ignora */
    }
  }, []);

  const update = useCallback((next: ThemeColors) => {
    setTheme(next);
    setCustomized(true);
    apply(next, true);
  }, []);

  function setColor(key: keyof ThemeColors, value: string) {
    setDrafts((d) => ({ ...d, [key]: value }));
    if (isHex(value)) update({ ...theme, [key]: value.toUpperCase() });
  }

  function reset() {
    try {
      localStorage.removeItem(THEME_STORAGE_KEY);
    } catch {
      /* ignora */
    }
    setTheme(DEFAULT_THEME);
    setDrafts({});
    setCustomized(false);
    apply(DEFAULT_THEME, false);
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(themeToSnippet(theme));
    } catch {
      /* clipboard bloqueado */
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  }

  const onPrimary = ratioBadge(contrastRatio("#FFFFFF", theme.primary));
  const onAccent = ratioBadge(contrastRatio(theme.primary, theme.accent));
  const bodyText = ratioBadge(contrastRatio(theme.text, theme.skyTop));

  return (
    <GlassCard pad="lg" className="space-y-7">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h3 className="text-xl font-semibold">Editor de cores</h3>
          <p className="mt-1 max-w-xl text-sm text-ink-soft">
            Mude uma cor e o app inteiro (hóspede e painel) reage na hora. Fica salvo neste navegador
            {customized && <span className="font-semibold text-gold-600"> · tema personalizado ativo</span>}.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="soft" size="sm" onClick={reset} icon={<RotateCcw className="size-4" />} disabled={!customized}>
            Restaurar padrão
          </Button>
          <Button size="sm" onClick={copy} icon={copied ? <Check className="size-4" /> : <Copy className="size-4" />}>
            {copied ? "Copiado!" : "Copiar tema"}
          </Button>
        </div>
      </div>

      <div>
        <p className="mb-2.5 text-xs font-semibold uppercase tracking-[0.12em] text-ink-faint">Paletas prontas</p>
        <div className="flex flex-wrap gap-2">
          {PRESETS.map((p) => (
            <button
              key={p.name}
              onClick={() => {
                setDrafts({});
                update(p.theme);
              }}
              className="glass flex items-center gap-2.5 rounded-full py-1.5 pl-2 pr-4 text-sm font-semibold text-brand-800 transition hover:bg-white/80"
            >
              <span className="flex -space-x-1.5">
                {[p.theme.primary, p.theme.secondary, p.theme.accent].map((c) => (
                  <span key={c} className="size-5 rounded-full ring-2 ring-white" style={{ background: c }} />
                ))}
              </span>
              {p.name}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {THEME_ROLES.map((r) => {
          const value = drafts[r.key] ?? theme[r.key];
          const valid = isHex(value);
          return (
            <div key={r.key} className="flex items-center gap-3 rounded-3xl bg-white/50 p-3">
              <label className="relative size-12 shrink-0 cursor-pointer overflow-hidden rounded-2xl ring-2 ring-white shadow-soft" style={{ background: theme[r.key] }}>
                <span className="sr-only">Escolher cor: {r.label}</span>
                <input
                  type="color"
                  value={theme[r.key].toLowerCase()}
                  onChange={(e) => setColor(r.key, e.target.value)}
                  className="absolute inset-0 size-full cursor-pointer opacity-0"
                />
              </label>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-brand-800">{r.label}</p>
                <p className="truncate text-xs text-ink-soft">{r.hint}</p>
              </div>
              <input
                aria-label={`Hex de ${r.label}`}
                value={value}
                maxLength={7}
                spellCheck={false}
                onChange={(e) => setColor(r.key, e.target.value.startsWith("#") ? e.target.value : `#${e.target.value}`)}
                onBlur={() => setDrafts((d) => ({ ...d, [r.key]: undefined }))}
                className={cn(
                  "h-10 w-[7.2rem] rounded-full border bg-white/80 px-4 font-mono text-sm uppercase focus:outline-none focus:ring-4",
                  valid ? "border-white focus:ring-brand-700/10" : "border-crimson-500 focus:ring-crimson-500/15",
                )}
              />
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {[
          { label: "Texto branco no botão primário", r: onPrimary },
          { label: "Primária sobre o destaque", r: onAccent },
          { label: "Texto sobre o fundo", r: bodyText },
        ].map(({ label, r }) => (
          <div key={label} className={cn("rounded-2xl px-4 py-3 text-sm", r.ok ? "bg-ok-500/10 text-ok-600" : "bg-crimson-500/10 text-crimson-600")}>
            <p className="text-xs font-semibold uppercase tracking-wide opacity-80">{label}</p>
            <p className="tabular mt-0.5 font-bold">{r.label}</p>
          </div>
        ))}
      </div>

      <div className="space-y-4">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-ink-faint">Escalas geradas (50 → 950)</p>
        {SCALES.map((s) => (
          <div key={s.name}>
            <p className="mb-1.5 text-sm font-semibold text-ink-soft">{s.label}</p>
            <div className="grid grid-cols-11 gap-1">
              {STEPS.map((step) => (
                <div key={step} className="text-center">
                  <div className="h-10 rounded-xl ring-1 ring-black/5" style={{ background: `rgb(var(--${s.name}-${step}))` }} />
                  <span className="tabular mt-1 block text-[10px] text-ink-faint">{step}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </GlassCard>
  );
}
