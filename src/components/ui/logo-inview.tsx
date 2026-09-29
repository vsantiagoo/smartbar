"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";

/**
 * Casca da logo para seções abaixo da dobra: a entrada animada (`.sb-intro`, ver
 * logo.tsx) só começa quando a logo aparece na tela — senão ela tocaria enquanto
 * a página carrega, fora do olhar. Vale a cada carga/recarga; se a página já
 * abrir com a logo à vista (rolagem restaurada), toca na hora.
 */
export function InViewIntro({ children, className, style }: { children: ReactNode; className?: string; style?: CSSProperties }) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        el.classList.add("sb-intro");
        io.disconnect();
      },
      { threshold: 0.6 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <span ref={ref} className={className} style={style}>
      {children}
    </span>
  );
}
