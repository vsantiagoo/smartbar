"use client";
import { useEffect, useRef } from "react";
import { usePrefersReducedMotion } from "@/lib/marketing/use-scroll-progress";
import { BackToTop } from "./back-to-top";

/** Duração da montagem automática da primeira vez, em segundos. */
const INTRO = 3.2;
/** Fração do caminho percorrida por quadro a 60fps ao perseguir o ponteiro. */
const DAMPING = 0.075;
/** Margem morta nas laterais: o gesto começa e termina antes das bordas. */
const DEAD_ZONE = 0.14;
/** Aproximação da câmera do início ao fim da montagem. */
const ZOOM_FROM = 0.965;
const ZOOM_TO = 1.0;

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
/** Desaceleração longa no fim — o produto assenta em vez de parar seco. */
const easeOut = (t: number) => 1 - Math.pow(1 - t, 4);

/**
 * SEÇÃO · O produto sozinho no escuro. Sem título, sem legenda: só o frigobar.
 *
 * Não é um vídeo que toca, é um vídeo PERCORRIDO. Nada de `play()` — a cada
 * quadro escrevemos `currentTime`, o que transforma os 2,7s de animação numa
 * linha do tempo que a pessoa controla.
 *
 *  1. Ao entrar na tela, a linha do tempo corre sozinha de 0 a 1: as peças se
 *     juntam e a câmera fecha de leve no produto montado.
 *  2. Depois, a posição do ponteiro manda — esquerda desmonta, direita monta.
 *     O valor persegue o alvo com amortecimento, então o movimento tem peso.
 *  3. Ao tirar o ponteiro, volta sozinho para o produto inteiro.
 *
 * O arquivo é o PRIMEIRO plano do original (quadros 0–63). O segundo plano, um
 * close, foi cortado: ele quebrava a leitura de "peças → produto" e o último
 * quadro precisava ser o frigobar completo.
 *
 * Reencodado com TODOS os quadros-chave (`-g 1`): sem isso o navegador
 * decodificaria desde o quadro-chave anterior a cada busca e o movimento
 * engasgaria. Medido: 2 a 6ms por busca, contra os 16,7ms de um quadro.
 */
export function ProductReveal() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const section = sectionRef.current;
    const video = videoRef.current;
    if (!section || !video) return;

    const render = (p: number) => {
      const d = video.duration;
      if (!Number.isFinite(d) || d <= 0) return;
      const v = clamp01(p);
      // 1e-3 a menos: em `currentTime === duration` alguns navegadores devolvem
      // o quadro preto do fim do arquivo.
      video.currentTime = Math.min(d - 0.001, v * d);
      video.style.transform = `scale(${(ZOOM_FROM + (ZOOM_TO - ZOOM_FROM) * v).toFixed(4)})`;
      video.style.opacity = (0.55 + 0.45 * v).toFixed(3);
    };

    if (reduced) {
      const pronto = () => render(1);
      if (video.readyState >= 1) pronto();
      else video.addEventListener("loadedmetadata", pronto, { once: true });
      return;
    }

    let atual = 0;
    let alvo = 0;
    let raf = 0;
    let introAte = 0; // timestamp em que a montagem automática termina
    let comecou = false;

    const frame = (now: number) => {
      if (now < introAte) {
        atual = easeOut(clamp01(1 - (introAte - now) / (INTRO * 1000)));
        alvo = 1;
      } else {
        atual += (alvo - atual) * DAMPING;
        if (Math.abs(alvo - atual) < 0.0008) atual = alvo;
      }
      render(atual);
      raf = atual === alvo && now >= introAte ? 0 : requestAnimationFrame(frame);
    };
    const acorda = () => {
      if (!raf) raf = requestAnimationFrame(frame);
    };

    const onPointer = (e: PointerEvent) => {
      if (!comecou) return;
      const r = section.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width;
      // Estica a faixa útil: as pontas viram 0 e 1 antes de chegar na borda.
      alvo = clamp01((x - DEAD_ZONE) / (1 - DEAD_ZONE * 2));
      acorda();
    };
    const onLeave = () => {
      alvo = 1;
      acorda();
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting || comecou) return;
        comecou = true;
        introAte = performance.now() + INTRO * 1000;
        acorda();
        io.disconnect();
      },
      // Observa o VÍDEO, não a seção: a seção ocupa a tela inteira e uma fração
      // dela nunca ficaria visível numa tela baixa — a montagem jamais começaria.
      { threshold: 0.35 },
    );

    const iniciar = () => {
      video.pause();
      render(0);
      io.observe(video);
    };
    if (video.readyState >= 1) iniciar();
    else video.addEventListener("loadedmetadata", iniciar, { once: true });

    section.addEventListener("pointermove", onPointer);
    section.addEventListener("pointerleave", onLeave);
    return () => {
      io.disconnect();
      if (raf) cancelAnimationFrame(raf);
      section.removeEventListener("pointermove", onPointer);
      section.removeEventListener("pointerleave", onLeave);
    };
  }, [reduced]);

  return (
    <section
      ref={sectionRef}
      id="produto"
      className="relative grid min-h-dvh place-items-center overflow-hidden bg-black px-6 py-16 sm:px-10"
    >
      <BackToTop tone="light" />

      {/* O quadro. `pointer-events-none` para o vídeo não virar alvo de arrasto:
          quem escuta o ponteiro é a seção inteira, de ponta a ponta da tela. */}
      <div className="relative w-full max-w-[1200px]">
        <video
          ref={videoRef}
          className="pointer-events-none w-full select-none will-change-[transform,opacity]"
          style={{ transform: `scale(${ZOOM_FROM})`, opacity: 0.55 }}
          src="/videos/minibar-montagem.mp4"
          poster="/videos/minibar-montagem.jpg"
          preload="auto"
          muted
          playsInline
          disablePictureInPicture
          aria-hidden
        />
        {/* Vinheta preta: dissolve as bordas do quadro no fundo da seção, para
            o produto parecer suspenso no escuro em vez de colado num retângulo. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            boxShadow: "inset 0 0 120px 48px #000, inset 0 0 40px 10px #000",
          }}
        />
      </div>
    </section>
  );
}
