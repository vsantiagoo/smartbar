import type { Metadata, Viewport } from "next";
import { Doto, Plus_Jakarta_Sans } from "next/font/google";
import { DEFAULT_THEME, THEME_STORAGE_KEY, themeToVars, varsToCss } from "@/lib/theme";
import "./globals.css";

// Fonte pontilhada só para números de destaque (referência do Design System).
const doto = Doto({ subsets: ["latin"], weight: ["700", "800"], variable: "--font-dot", display: "swap" });

// Fonte da logotipo "SmartBar".
const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], weight: ["700", "800"], variable: "--font-logo", display: "swap" });

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
      /* O texto usa a fonte do sistema (ver fontFamily.sans em tailwind.config.ts). */
      className={`${doto.variable} ${jakarta.variable} scroll-smooth`}
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
