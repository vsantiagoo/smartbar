import { useId } from "react";
import { cn } from "@/lib/utils";

/**
 * Isotipo SmartBar: frigobar + cadeado destravado + ondas de sinal (o gesto de
 * "aproximar o cartão e destravar", referência enviada pela usuária).
 *
 * O desenho (frigobar + cadeado) segue `currentColor` — controlado pelo `tone`
 * do <Logo>. As ondas usam sempre o degradê fixo (âmbar → azul-marinho) da
 * referência enviada, nas duas variantes de cor.
 */
export function LogoMark({ className }: { className?: string }) {
  const gradientId = useId();
  return (
    <svg viewBox="0 0 130 100" className={cn("size-10", className)} aria-hidden="true">
      <defs>
        {/* Degradê da referência de marca (âmbar → azul), amostrado por pixel do print enviado. */}
        <linearGradient id={gradientId} x1="60%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#C98A2E" />
          <stop offset="55%" stopColor="#5B4A38" />
          <stop offset="100%" stopColor="#1C3A63" />
        </linearGradient>
      </defs>

      <g fill="none" stroke="currentColor" strokeWidth="6.5" strokeLinecap="round" strokeLinejoin="round">
        {/* Corpo do frigobar */}
        <rect x="8" y="8" width="44" height="84" rx="10" />
        {/* Traços de prateleira/porta */}
        <line x1="18" y1="26" x2="34" y2="26" />
        <line x1="18" y1="42" x2="30" y2="42" />
        {/* Pés */}
        <line x1="18" y1="92" x2="18" y2="98" />
        <line x1="44" y1="92" x2="44" y2="98" />
        {/* Corpo do cadeado, destravado sobre a quina do frigobar */}
        <rect x="50" y="56" width="27" height="25" rx="5.5" />
        <path d="M56 56 V40 a9.5 9.5 0 0 1 19 0" />
        {/* Fechadura */}
        <circle cx="63.5" cy="66.5" r="3" fill="currentColor" stroke="none" />
        <line x1="63.5" y1="70" x2="63.5" y2="74.5" strokeWidth="5.5" />
      </g>

      {/*
        Ondas de sinal (o gesto de aproximar e destravar) — sempre no degradê da marca.
        Pulsam em sequência de dentro pra fora, na mesma ordem do degradê (âmbar → azul).
        `prefers-reduced-motion` já desliga isso globalmente (ver globals.css).
      */}
      <g fill="none" stroke={`url(#${gradientId})`} strokeLinecap="round">
        <path className="animate-signal-ping" style={{ animationDelay: "0s" }} d="M85 58 a12 12 0 0 1 0 22" strokeWidth="7" />
        <path className="animate-signal-ping" style={{ animationDelay: "0.28s" }} d="M96 49 a24 24 0 0 1 0 40" strokeWidth="7.5" />
        <path className="animate-signal-ping" style={{ animationDelay: "0.56s" }} d="M107 40 a36 36 0 0 1 0 58" strokeWidth="8" />
      </g>
    </svg>
  );
}

export type LogoTone = "brand" | "light";

/**
 * Texto "SmartBar". Sempre em Plus Jakarta Sans — nunca reescreva esse texto
 * à mão em outro componente; importe `Wordmark` (ou `Logo`, que já o inclui).
 */
export function Wordmark({ tone = "brand", className }: { tone?: LogoTone; className?: string }) {
  return (
    <span
      style={{ fontFamily: "var(--font-logo), 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}
      className={cn("font-extrabold tracking-tight", tone === "brand" ? "text-brand-700" : "text-white", className)}
    >
      SmartBar
    </span>
  );
}

export function Logo({ className, tone = "brand" }: { className?: string; tone?: LogoTone }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <LogoMark className={cn("size-9", tone === "brand" ? "text-brand-700" : "text-white")} />
      <Wordmark tone={tone} className="text-[1.35rem] leading-none" />
    </span>
  );
}
