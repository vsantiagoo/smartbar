import type { Metadata, Viewport } from "next";
import { Doto, Instrument_Sans, Instrument_Serif } from "next/font/google";
import { DEFAULT_THEME, THEME_STORAGE_KEY, themeToVars, varsToCss } from "@/lib/theme";
import "./globals.css";

/**
 * TIPOGRAFIA (Brandbook §2) — três vozes, cada uma com um papel:
 *
 *   display → Instrument Serif: só títulos de display e declarações de marca.
 *             O serif traz hospitalidade; o itálico é o acento autoral.
 *   sans    → Instrument Sans: corpo e TODA a interface (painel e vitrine).
 *   dot     → Doto: apenas números de destaque (valores, contadores).
 *
 * O logotipo não entra aqui: ele é desenhado em Arial Bold dentro do próprio
 * componente (`ui/logo.tsx`), como ativo fixo da marca.
 */
const serif = Instrument_Serif({
  subsets: ["latin", "latin-ext"],
  weight: ["400"],
  style: ["normal", "italic"],
  variable: "--font-display",
  display: "swap",
});

const sans = Instrument_Sans({
  subsets: ["latin", "latin-ext"],
  variable: "--font-sans",
  display: "swap",
});

const doto = Doto({ subsets: ["latin"], weight: ["700", "800"], variable: "--font-dot", display: "swap" });

export const metadata: Metadata = {
  title: { default: "SmartBar — minibar inteligente para hotéis", template: "%s · SmartBar" },
  description: "Recupere o faturamento do minibar: pagamento prévio por Pix, trava IoT e checkout em 2 minutos.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: DEFAULT_THEME.primary,
};

/** Cores padrão do produto (src/lib/theme.ts) como CSS variables. */
const BASE_THEME_CSS = varsToCss(themeToVars());

/**
 * Aplica, antes da primeira pintura, a personalização de cores que você salvou
 * no editor de /design-system (fica só neste navegador). Sem flash de cor.
 */
const THEME_BOOT = `try{var t=JSON.parse(localStorage.getItem(${JSON.stringify(THEME_STORAGE_KEY)})||"null");if(t&&t.vars){var s=document.documentElement.style;for(var k in t.vars)s.setProperty(k,t.vars[k])}}catch(e){}`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="pt-BR"
      className={`${sans.variable} ${serif.variable} ${doto.variable} scroll-smooth`}
      suppressHydrationWarning
    >
      <head>
        <style id="smartbar-theme" dangerouslySetInnerHTML={{ __html: BASE_THEME_CSS }} />
        <script dangerouslySetInnerHTML={{ __html: THEME_BOOT }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
