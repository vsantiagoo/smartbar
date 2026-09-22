/**
 * ═══════════════════════════════════════════════════════════════════
 *  TEMA DO SMARTBAR — a ÚNICA fonte das cores do produto.
 *
 *  Quer mudar as cores?
 *   1. Ao vivo: abra /design-system, use o editor "Cores", e clique em
 *      "Copiar tema". Cole o resultado em DEFAULT_THEME abaixo.
 *   2. Direto: edite os hex de DEFAULT_THEME.
 *
 *  Cada cor-base gera automaticamente a escala 50→950 (claros misturados
 *  com branco, escuros com preto). Não há hex espalhado pelos componentes:
 *  tudo lê estes tokens via CSS variables (ver tailwind.config.ts).
 * ═══════════════════════════════════════════════════════════════════
 */

export interface ThemeColors {
  /** Azul Corporativo — CTAs, títulos, navegação. Vira a escala `brand`. */
  primary: string;
  /** Vermelho Executivo — urgência, alertas, reposição. Vira `crimson`. */
  secondary: string;
  /** Ouro — foco, destaque premium, "ao vivo". Vira `gold`. */
  accent: string;
  /** Sucesso — aprovado, estoque em dia. Vira `ok`. */
  success: string;
  /** Erro — falha, sem estoque. Vira `danger`. */
  danger: string;
  /** Texto corpo (cinza neutro). Vira `ink`. */
  text: string;
  /** Fundo: cor do topo do degradê (azul-acinzentado das referências). */
  skyTop: string;
  /** Fundo: cor da base do degradê (tom quente). */
  skyBottom: string;
}

/** Valores do Brandbook (#1B3A6B / #C41E3A / #F39200 / #27AE60 / #E74C3C / #2C3E50). */
export const DEFAULT_THEME: ThemeColors = {
  primary: "#1B3A6B",
  secondary: "#C41E3A",
  accent: "#F39200",
  success: "#27AE60",
  danger: "#E74C3C",
  text: "#2C3E50",
  skyTop: "#CFDCEE",
  skyBottom: "#F6EDE4",
};

export const THEME_ROLES: { key: keyof ThemeColors; label: string; hint: string }[] = [
  { key: "primary", label: "Primária", hint: "Botões, títulos, navegação" },
  { key: "secondary", label: "Secundária", hint: "Urgência e alertas" },
  { key: "accent", label: "Destaque", hint: "Foco, ao vivo, premium" },
  { key: "success", label: "Sucesso", hint: "Aprovado, estoque ok" },
  { key: "danger", label: "Erro", hint: "Falha, sem estoque" },
  { key: "text", label: "Texto", hint: "Corpo e legendas" },
  { key: "skyTop", label: "Fundo · topo", hint: "Início do degradê" },
  { key: "skyBottom", label: "Fundo · base", hint: "Fim do degradê" },
];

// ── Utilidades de cor ─────────────────────────────────────────────
export type RGB = readonly [number, number, number];

export function isHex(v: string): boolean {
  return /^#[0-9a-fA-F]{6}$/.test(v);
}

export function hexToRgb(hex: string): RGB {
  const h = hex.replace("#", "");
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
}

export function rgbToHex([r, g, b]: RGB): string {
  return "#" + [r, g, b].map((n) => Math.round(n).toString(16).padStart(2, "0")).join("").toUpperCase();
}

function mix(a: RGB, b: RGB, k: number): RGB {
  return [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k, a[2] + (b[2] - a[2]) * k];
}

const WHITE: RGB = [255, 255, 255];
const BLACK: RGB = [0, 0, 0];
export const STEPS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950] as const;
export type Step = (typeof STEPS)[number];

/**
 * Escala 50–950 a partir de uma cor-base posicionada em `baseStep`.
 * Passos mais claros misturam com branco; mais escuros, com preto.
 */
export function deriveScale(baseHex: string, baseStep: Step): Record<Step, RGB> {
  const base = hexToRgb(baseHex);
  const b = STEPS.indexOf(baseStep);
  const last = STEPS.length - 1;
  const out = {} as Record<Step, RGB>;
  STEPS.forEach((step, i) => {
    if (i === b) out[step] = base;
    else if (i < b) out[step] = mix(base, WHITE, ((b - i) / b) * 0.95);
    else out[step] = mix(base, BLACK, ((i - b) / (last - b)) * 0.62);
  });
  return out;
}

function luminance([r, g, b]: RGB): number {
  const f = (c: number) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
}

/** Razão de contraste WCAG entre duas cores hex. */
export function contrastRatio(a: string, b: string): number {
  const [l1, l2] = [luminance(hexToRgb(a)), luminance(hexToRgb(b))].sort((x, y) => y - x) as [number, number];
  return (l1 + 0.05) / (l2 + 0.05);
}

// ── Tema → CSS variables ──────────────────────────────────────────
const chan = ([r, g, b]: RGB): string => `${Math.round(r)} ${Math.round(g)} ${Math.round(b)}`;

/** Mapa `--nome → valor` (canais RGB separados por espaço, p/ suportar `/ alpha`). */
export function themeToVars(theme: Partial<ThemeColors> = {}): Record<string, string> {
  // Ignora campos indefinidos (ex.: hotel sem cor própria) para não anular o padrão.
  const t: ThemeColors = { ...DEFAULT_THEME, ...(Object.fromEntries(Object.entries(theme).filter(([, v]) => Boolean(v))) as Partial<ThemeColors>) };
  const vars: Record<string, string> = {};
  const scale = (name: string, hex: string, base: Step) => {
    const s = deriveScale(hex, base);
    STEPS.forEach((step) => (vars[`--${name}-${step}`] = chan(s[step])));
  };
  scale("brand", t.primary, 700);
  scale("crimson", t.secondary, 500);
  scale("gold", t.accent, 500);
  scale("ok", t.success, 500);
  scale("danger", t.danger, 500);

  const text = hexToRgb(t.text);
  vars["--ink"] = chan(text);
  vars["--ink-soft"] = chan(mix(text, WHITE, 0.22));
  vars["--ink-faint"] = chan(mix(text, WHITE, 0.44));

  const top = hexToRgb(t.skyTop);
  const bottom = hexToRgb(t.skyBottom);
  vars["--sky-1"] = chan(top);
  vars["--sky-2"] = chan(mix(top, bottom, 0.38));
  vars["--sky-3"] = chan(mix(top, bottom, 0.72));
  vars["--sky-4"] = chan(bottom);
  return vars;
}

export function varsToCss(vars: Record<string, string>, selector = ":root"): string {
  return `${selector}{${Object.entries(vars)
    .map(([k, v]) => `${k}:${v}`)
    .join(";")}}`;
}

/** Trecho pronto para colar em DEFAULT_THEME. */
export function themeToSnippet(theme: ThemeColors): string {
  const lines = (Object.keys(DEFAULT_THEME) as (keyof ThemeColors)[]).map((k) => `  ${k}: "${theme[k].toUpperCase()}",`);
  return `export const DEFAULT_THEME: ThemeColors = {\n${lines.join("\n")}\n};`;
}

export const THEME_STORAGE_KEY = "smartbar-theme-v1";
