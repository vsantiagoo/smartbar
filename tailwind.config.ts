import type { Config } from "tailwindcss";

/**
 * Tokens do design system SmartBar.
 *
 * As CORES não moram aqui: vêm de CSS variables geradas por src/lib/theme.ts
 * (edite lá, ou use o editor ao vivo em /design-system). Este arquivo só
 * conecta os tokens às classes do Tailwind (bg-brand-700, text-gold-500...).
 * A forma (raios, sombras, animações) é definida aqui.
 */
const STEPS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950] as const;
const rgb = (name: string) => `rgb(var(${name}) / <alpha-value>)`;
const scale = (name: string): Record<number, string> =>
  Object.fromEntries(STEPS.map((s) => [s, rgb(`--${name}-${s}`)]));

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: scale("brand"), // Azul Corporativo (primária)
        crimson: scale("crimson"), // Vermelho Executivo (secundária)
        gold: scale("gold"), // Ouro (destaque)
        ok: scale("ok"), // Sucesso
        danger: scale("danger"), // Erro
        ink: {
          DEFAULT: rgb("--ink"),
          soft: rgb("--ink-soft"),
          faint: rgb("--ink-faint"),
        },
      },
      fontFamily: {
        // Fonte do sistema operacional (San Francisco no Apple, Segoe UI no Windows, Roboto no Android).
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          "'Segoe UI'",
          "Roboto",
          "'Helvetica Neue'",
          "Arial",
          "sans-serif",
        ],
        // Plus Jakarta Sans — títulos, nomes de produtos, categorias, headings.
        heading: ["var(--font-heading)", "sans-serif"],
        mono: ["ui-monospace", "SFMono-Regular", "Menlo", "Consolas", "'Liberation Mono'", "monospace"],
      },
      borderRadius: {
        "4xl": "2rem",
        "5xl": "2.5rem",
      },
      boxShadow: {
        soft: "0 10px 40px -14px rgb(var(--brand-800) / 0.28)",
        glass:
          "0 1px 0 0 rgb(255 255 255 / 0.9) inset, 0 -1px 0 0 rgb(255 255 255 / 0.25) inset, 0 18px 50px -20px rgb(var(--brand-800) / 0.35)",
        press: "0 4px 14px -6px rgb(var(--brand-700) / 0.55)",
      },
      backdropBlur: { glass: "24px" },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "flash-in": {
          "0%": { backgroundColor: "rgb(var(--gold-500) / 0.28)" },
          "100%": { backgroundColor: "rgb(var(--gold-500) / 0)" },
        },
        "pulse-ring": {
          "0%": { transform: "scale(0.9)", opacity: "0.7" },
          "100%": { transform: "scale(1.6)", opacity: "0" },
        },
        "sheet-up": {
          "0%": { transform: "translateY(100%)" },
          "100%": { transform: "translateY(0)" },
        },
        "pop-in": {
          "0%": { transform: "scale(0.6)", opacity: "0" },
          "70%": { transform: "scale(1.06)", opacity: "1" },
          "100%": { transform: "scale(1)" },
        },
        "blob-a": {
          "0%, 100%": { transform: "translate(-6%, -4%) scale(1)" },
          "50%": { transform: "translate(8%, 6%) scale(1.15)" },
        },
        "blob-b": {
          "0%, 100%": { transform: "translate(5%, 8%) scale(1.05)" },
          "50%": { transform: "translate(-8%, -6%) scale(0.95)" },
        },
        "signal-ping": {
          "0%, 100%": { opacity: "0.3" },
          "35%": { opacity: "1" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.4s ease-out both",
        "flash-in": "flash-in 2.2s ease-out both",
        "pulse-ring": "pulse-ring 1.8s ease-out infinite",
        "sheet-up": "sheet-up 0.32s cubic-bezier(0.2, 0.8, 0.2, 1) both",
        "pop-in": "pop-in 0.5s cubic-bezier(0.2, 0.8, 0.2, 1) both",
        orbit: "spin 30s linear infinite",
        "orbit-slow": "spin 46s linear infinite reverse",
        "blob-a": "blob-a 18s ease-in-out infinite",
        "blob-b": "blob-b 22s ease-in-out infinite",
        "signal-ping": "signal-ping 1.8s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
