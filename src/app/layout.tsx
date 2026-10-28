import type { Metadata, Viewport } from "next";
import { Doto, Plus_Jakarta_Sans } from "next/font/google";
import { cookies } from "next/headers";
import { DEFAULT_THEME, THEME_STORAGE_KEY, themeToVars, varsToCss } from "@/lib/theme";
import { LANG_COOKIE, parseLang } from "@/lib/i18n/config";
import "./globals.css";

/** Código BCP-47 para o atributo `lang` do <html>, a partir do idioma salvo. */
const HTML_LANG: Record<string, string> = { pt: "pt-BR", en: "en", es: "es" };

// Fonte pontilhada só para números de destaque (referência do Design System).
const doto = Doto({ subsets: ["latin"], weight: ["700", "800"], variable: "--font-dot", display: "swap" });

// Plus Jakarta Sans: logo e títulos de destaque (headings, nomes de produtos, categorias).
const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-heading",
  display: "swap",
});

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

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // O <html lang> tem de bater com o idioma do conteúdo: um leitor de tela
  // pronuncia com a prosódia errada quando fica fixo em pt e a pessoa escolheu
  // en/es. O idioma vive no mesmo cookie que o site usa.
  const lang = parseLang((await cookies()).get(LANG_COOKIE)?.value) ?? "pt";

  return (
    <html
      lang={HTML_LANG[lang] ?? "pt-BR"}
      /* O texto usa a fonte do sistema (ver fontFamily.sans em tailwind.config.ts). */
      className={`${doto.variable} ${jakarta.variable} scroll-smooth`}
      /* --font-heading: Plus Jakarta Sans (títulos); sans: fonte do sistema (texto corrido). */
      suppressHydrationWarning
    >
      <head>
        <style id="smartbar-theme" dangerouslySetInnerHTML={{ __html: BASE_THEME_CSS }} />
        <script dangerouslySetInnerHTML={{ __html: THEME_BOOT }} />
      </head>
      <body>
        {/* Skip-link: primeiro foco do Tab pula o cabeçalho e vai ao conteúdo.
            Fica fora da tela até receber foco (ver .skip-link em globals.css). */}
        <a href="#conteudo" className="skip-link">
          Pular para o conteúdo
        </a>
        <div id="conteudo">{children}</div>
      </body>
    </html>
  );
}
