"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { usePrefersReducedMotion } from "@/lib/marketing/use-scroll-progress";

export interface HeroShot {
  src: string;
  alt: string;
}

/** Tempo que cada foto fica na tela (ms). A transição em si dura 2s (CSS). */
const HOLD_MS = 7000;

/**
 * Fundo do hero: fotos de hotel em crossfade lento, com um leve zoom que
 * continua enquanto a foto está visível. Com "reduzir movimento" ativo, fica
 * só a primeira foto, parada.
 */
export function HeroSlideshow({ shots }: { shots: HeroShot[] }) {
  const reduced = usePrefersReducedMotion();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (reduced || shots.length < 2) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % shots.length), HOLD_MS);
    return () => clearInterval(id);
  }, [reduced, shots.length]);

  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden>
      {shots.map((shot, i) => (
        <div
          key={shot.src}
          className={cn(
            "absolute inset-0 transition-opacity duration-[2000ms] ease-in-out",
            i === index ? "opacity-100" : "opacity-0",
          )}
        >
          <Image
            src={shot.src}
            alt={shot.alt}
            fill
            priority={i === 0}
            sizes="100vw"
            className={cn(
              "object-cover",
              !reduced && "transition-transform duration-[9000ms] ease-out",
              !reduced && (i === index ? "scale-105" : "scale-100"),
            )}
          />
        </div>
      ))}
    </div>
  );
}
