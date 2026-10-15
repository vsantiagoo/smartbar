"use client";
import { useEffect, useRef } from "react";
import { usePrefersReducedMotion } from "@/lib/marketing/use-scroll-progress";
import { clamp01 } from "@/lib/utils";
import { BackToTop } from "./back-to-top";

/** Duração da montagem automática da primeira vez, em segundos (ponteiro fino). */
const INTRO = 3.2;
/** Fração do caminho percorrida por quadro a 60fps ao perseguir o alvo. */
const DAMPING = 0.075;
/** Margem morta nas laterais: o gesto começa e termina antes das bordas. */
const DEAD_ZONE = 0.14;
/** Deslocamento em px que decide se o gesto do dedo é horizontal ou vertical. */
const GESTO_MIN = 8;
/** Aproximação da câmera do início ao fim da montagem. */
const ZOOM_FROM = 0.965;
const ZOOM_TO = 1.0;

/** Desaceleração longa no fim — o produto assenta em vez de parar seco. */
const easeOut = (t: number) => 1 - Math.pow(1 - t, 4);

/**
 * SEÇÃO · O produto sozinho no escuro. Sem título, sem legenda: só o frigobar.
 *
 * Não é um vídeo que toca, é um vídeo PERCORRIDO. Nada de `play()` para exibir —
 * a cada quadro escrevemos `currentTime`, o que transforma os 2,7s de animação
 * numa linha do tempo que a pessoa controla.
 *
 * Quem comanda essa linha do tempo depende do aparelho:
 *
 *  · PONTEIRO FINO (mouse) — ao entrar na tela, a montagem corre sozinha de 0 a
 *    1; depois a posição do cursor manda, esquerda desmonta e direita monta. Ao
 *    tirar o cursor, volta para o produto inteiro.
 *
 *  · TOQUE — não há cursor pairando, então quem monta é a ROLAGEM: o produto se
 *    junta conforme a seção sobe até o centro da janela e se desfaz se ela
 *    descer. Com o dedo na tela, um arraste HORIZONTAL assume o controle; o
 *    vertical continua rolando a página (daí o `touch-pan-y` e o desempate de
 *    direção). Sem isso o celular ficava com uma tela parada: `pointermove` sem
 *    botão pressionado é hover, e hover não existe no toque.
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

    const toque = window.matchMedia("(hover: none)").matches;

    let atual = 0;
    let alvo = 0;
    let raf = 0;
    let introAte = 0; // timestamp em que a montagem automática termina
    let comecou = false;
    let visivel = false;
    // Estado do arraste no toque: de onde saiu e se já sabemos a direção.
    let arrastando = false;
    let x0 = 0;
    let y0 = 0;
    let direcao: "?" | "h" | "v" = "?";

    /** Posição da seção na janela: 0 entrando por baixo, 1 centrada. */
    const progressoScroll = () => {
      const r = section.getBoundingClientRect();
      return clamp01((window.innerHeight - r.top) / ((window.innerHeight + r.height) / 2));
    };

    const frame = (now: number) => {
      if (!toque && now < introAte) {
        atual = easeOut(clamp01(1 - (introAte - now) / (INTRO * 1000)));
        render(atual);
        alvo = 1;
        raf = requestAnimationFrame(frame);
        return;
      }
      if (toque && !arrastando) alvo = progressoScroll();

      atual += (alvo - atual) * DAMPING;
      if (Math.abs(alvo - atual) < 0.0008) atual = alvo;
      render(atual);
      raf = atual === alvo ? 0 : requestAnimationFrame(frame);
    };
    const acorda = () => {
      if (!raf && visivel) raf = requestAnimationFrame(frame);
    };

    /* O iOS só desenha o primeiro quadro depois de um play(): sem isso o
       elemento fica preso no poster e o vídeo percorrido nunca aparece. */
    const forcarDecodificacao = () => {
      const p = video.play();
      if (p) void p.then(() => video.pause()).catch(() => {});
      else video.pause();
    };

    const percorrer = (e: PointerEvent) => {
      const r = section.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width;
      // Estica a faixa útil: as pontas viram 0 e 1 antes de chegar na borda.
      alvo = clamp01((x - DEAD_ZONE) / (1 - DEAD_ZONE * 2));
      acorda();
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!comecou) return;
      if (!toque) {
        percorrer(e);
        return;
      }
      if (!arrastando) return;
      if (direcao === "?") {
        // Desempate: enquanto não dá para saber a intenção, nada se mexe. Assim
        // um gesto de rolagem não arranca um pedaço da linha do tempo junto.
        const dx = Math.abs(e.clientX - x0);
        const dy = Math.abs(e.clientY - y0);
        if (dx < GESTO_MIN && dy < GESTO_MIN) return;
        direcao = dx > dy ? "h" : "v";
      }
      if (direcao === "h") percorrer(e);
    };

    const onPointerDown = (e: PointerEvent) => {
      if (!toque || !comecou) return;
      arrastando = true;
      direcao = "?";
      x0 = e.clientX;
      y0 = e.clientY;
    };
    /* Dedo solto (ou gesto tomado pelo navegador para rolar): a linha do tempo
       volta a seguir a rolagem. */
    const onPointerUp = () => {
      if (!arrastando) return;
      arrastando = false;
      direcao = "?";
      acorda();
    };
    const onPointerLeave = () => {
      if (toque) return;
      alvo = 1;
      acorda();
    };
    const onScroll = () => {
      if (toque) acorda();
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        visivel = Boolean(entry?.isIntersecting);
        if (!visivel) return;
        if (!comecou) {
          comecou = true;
          forcarDecodificacao();
          if (!toque) introAte = performance.now() + INTRO * 1000;
        }
        acorda();
      },
      // Observa o VÍDEO, não a seção: a seção ocupa a tela inteira e uma fração
      // dela nunca ficaria visível numa tela baixa — a montagem jamais
      // começaria. No toque basta uma beirada à vista, porque dali em diante
      // quem monta é a própria rolagem.
      { threshold: toque ? 0 : 0.35, rootMargin: toque ? "25% 0px" : "0px" },
    );

    const iniciar = () => {
      video.pause();
      render(0);
      io.observe(video);
    };
    if (video.readyState >= 1) iniciar();
    else video.addEventListener("loadedmetadata", iniciar, { once: true });

    section.addEventListener("pointermove", onPointerMove);
    section.addEventListener("pointerdown", onPointerDown);
    section.addEventListener("pointerup", onPointerUp);
    section.addEventListener("pointercancel", onPointerUp);
    section.addEventListener("pointerleave", onPointerLeave);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      io.disconnect();
      if (raf) cancelAnimationFrame(raf);
      section.removeEventListener("pointermove", onPointerMove);
      section.removeEventListener("pointerdown", onPointerDown);
      section.removeEventListener("pointerup", onPointerUp);
      section.removeEventListener("pointercancel", onPointerUp);
      section.removeEventListener("pointerleave", onPointerLeave);
      window.removeEventListener("scroll", onScroll);
    };
  }, [reduced]);

  return (
    <section
      ref={sectionRef}
      id="produto"
      /* `touch-pan-y`: o navegador fica com a rolagem vertical e devolve o gesto
         horizontal para nós — é o que deixa o arraste montar o produto sem
         travar a página. */
      className="night-block relative grid min-h-dvh touch-pan-y place-items-center overflow-hidden bg-black px-6 py-16 sm:px-10"
    >
      <BackToTop tone="light" />

      {/* O quadro. `pointer-events-none` para o vídeo não virar alvo de arrasto:
          quem escuta o ponteiro é a seção inteira, de ponta a ponta da tela. */}
      <div className="night-media relative w-full max-w-[1200px]">
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
          className="night-vignette pointer-events-none absolute inset-0"
          style={{
            boxShadow: "inset 0 0 120px 48px #000, inset 0 0 40px 10px #000",
          }}
        />
      </div>
    </section>
  );
}
