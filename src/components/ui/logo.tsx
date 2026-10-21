import { useId } from "react";
import { cn } from "@/lib/utils";
import { InViewIntro } from "./logo-inview";

/**
 * Logo SmartBar 2.0 — proporções e movimento medidos quadro a quadro nos vídeos
 * e GIFs de referência (Logo SmartBar 2.0). Tudo em unidades do quadrado do
 * ícone (100 = lado externo):
 *
 *   contorno   traço 4,55 · canto externo 17 · desenhado no sentido horário
 *   linha      x 40,4 · de 16,95 a 83,05 · traço 3,05 · pontas redondas
 *   ponto      centro (65,2 · 50) · disco azul r 7,6 · núcleo claro r 3,5
 *   halo       degradê azul de raio 26,9 (repouso); no pulso o raio dobra
 *   texto      Arial Bold, altura de caixa-alta 45,6% do ícone, tinta do "S" a 19,1% do contorno
 *
 * Movimento (globals.css, `.sb-*`): na entrada o contorno se desenha, a linha
 * entra, o ponto nasce com um flash de luz e o texto surge deslizando; depois
 * só a luz pulsa (2 s). No celular só o ícone aparece (o texto é opcional).
 *
 * O tamanho vem da variável `--logo-size` (lado do ícone): o texto e o
 * afastamento derivam dela, então a proporção nunca se desfaz. Ex.:
 * `<Logo className="[--logo-size:2rem]" />`.
 */

type LogoTone = "brand" | "light";

const HALO = "48 139 255"; // azul do halo (medido)

/**
 * O ícone. `tone` só muda contorno/linha (branco no escuro, azul-marinho no
 * claro); o ponto e a luz são sempre azuis. `intro` liga a entrada quando o
 * ícone é usado sozinho — dentro de <Logo> a entrada vem do ancestral.
 */
export function LogoMark({ className, tone = "brand", intro = true }: { className?: string; tone?: LogoTone; intro?: boolean }) {
  const haloId = `sb-halo-${useId().replace(/[^a-zA-Z0-9]/g, "")}`;
  return (
    <svg
      viewBox="0 0 100 100"
      aria-hidden="true"
      className={cn("size-10 overflow-visible", tone === "light" ? "text-[#f2f5fa]" : "text-brand-700", intro && "sb-intro", className)}
    >
      <defs>
        {/* Alfas amostrados do vídeo de referência (repouso): 0,36 na borda do disco → 0 a 26,9. */}
        <radialGradient id={haloId} gradientUnits="userSpaceOnUse" cx="65.2" cy="50" r="26.9">
          <stop offset="0" stopColor={`rgb(${HALO})`} stopOpacity="0.9" />
          <stop offset="0.177" stopColor={`rgb(${HALO})`} stopOpacity="0.62" />
          <stop offset="0.29" stopColor={`rgb(${HALO})`} stopOpacity="0.4" />
          <stop offset="0.363" stopColor={`rgb(${HALO})`} stopOpacity="0.354" />
          <stop offset="0.46" stopColor={`rgb(${HALO})`} stopOpacity="0.275" />
          <stop offset="0.556" stopColor={`rgb(${HALO})`} stopOpacity="0.2" />
          <stop offset="0.653" stopColor={`rgb(${HALO})`} stopOpacity="0.133" />
          <stop offset="0.75" stopColor={`rgb(${HALO})`} stopOpacity="0.083" />
          <stop offset="0.847" stopColor={`rgb(${HALO})`} stopOpacity="0.046" />
          <stop offset="1" stopColor={`rgb(${HALO})`} stopOpacity="0" />
        </radialGradient>
      </defs>

      <circle className="sb-halo" cx="65.2" cy="50" r="26.9" fill={`url(#${haloId})`} />
      <rect
        className="sb-box"
        pathLength={1}
        x="2.275"
        y="2.275"
        width="95.45"
        height="95.45"
        rx="14.7"
        fill="none"
        stroke="currentColor"
        strokeWidth="4.55"
        strokeLinecap="round"
      />
      <line className="sb-line" pathLength={1} x1="40.4" y1="16.95" x2="40.4" y2="83.05" stroke="currentColor" strokeWidth="3.05" strokeLinecap="round" />
      <g className="sb-dot">
        <circle cx="65.2" cy="50" r="7.6" fill="#76b6fc" />
        <circle cx="65.2" cy="50" r="3.5" fill="#e1eeff" />
      </g>
    </svg>
  );
}

/** O texto: Arial Bold, "Smart" na cor do traço e "Bar" em azul. Tamanho = 63,7% de `--logo-size`. */
export function Wordmark({ tone = "brand", className }: { tone?: LogoTone; className?: string }) {
  return (
    <span
      className={cn("sb-word inline-block font-bold leading-none", className)}
      style={{
        fontFamily: "Arial, 'Helvetica Neue', Helvetica, 'Liberation Sans', sans-serif",
        fontSize: "calc(var(--logo-size, 2.25rem) * 0.637)",
      }}
    >
      <span className={tone === "light" ? "text-[#f2f5fa]" : "text-brand-700"}>Smart</span>
      <span className="text-[#4da3ff]">Bar</span>
    </span>
  );
}

/**
 * Ícone + texto. `intro`: `true` toca a entrada ao carregar (cabeçalho); `"inview"` toca quando a logo
 * aparece na tela (seções abaixo da dobra); `false` só pulsa. `wordmarkClassName` controla só o texto — ex.: `"hidden lg:inline-block"`
 * deixa apenas o ícone (com a luz pulsando) em telas menores.
 */
export function Logo({
  className,
  tone = "brand",
  intro = true,
  wordmarkClassName,
}: {
  className?: string;
  tone?: LogoTone;
  intro?: boolean | "inview";
  wordmarkClassName?: string;
}) {
  const Root = intro === "inview" ? InViewIntro : "span";
  return (
    <Root
      className={cn("inline-flex items-center [--logo-size:2.25rem]", intro === true && "sb-intro", className)}
      style={{ gap: "calc(var(--logo-size) * 0.163)" }}
    >
      <LogoMark tone={tone} intro={false} className="size-[var(--logo-size)] shrink-0" />
      <Wordmark tone={tone} className={wordmarkClassName} />
    </Root>
  );
}
