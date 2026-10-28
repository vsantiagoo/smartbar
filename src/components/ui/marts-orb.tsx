"use client";

import { useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "@/lib/marketing/use-scroll-progress";
import { GradientOrb } from "@/components/ui/gradient-orb";
import { cn } from "@/lib/utils";

/**
 * ORBE DA MARTS — a assistente virtual do SmartBar.
 *
 * Duas camadas sobrepostas num wrapper de tamanho fixo:
 *
 *   1. a esfera — shader em GPU (`GradientOrb`, `gradient-orb.tsx`): vidro
 *      líquido de verdade, com a superfície girando e ondulando por ruído
 *      3D, não um gradiente estático. SÓ roda enquanto a orbe está visível
 *      (IntersectionObserver — ver `visivel` abaixo) e NUNCA roda com
 *      "reduzir movimento" ativo; nesse caso cai para `.marts-orb`, a esfera
 *      estática em CSS puro definida em globals.css.
 *   2. o canvas de partículas (aqui) — só existe com `particles` (padrão
 *      `false`): a orbe SOZINHA, sem partícula nenhuma, já é o ícone do
 *      cabeçalho e o conteúdo do painel da Marts; só a orbe FLUTUANTE liga
 *      isto. Duas famílias de ponto, as duas amostrando a MESMA fase de cor
 *      contínua, por isso "mudam gradativamente" em vez de piscar ao acaso:
 *        · centelhas do anel — orbitam rente à borda da esfera (citam o aro
 *          de faíscas da referência visual);
 *        · partículas emitidas — nascem na borda e se espalham POUCO antes
 *          de encolher e apagar (arrasto alto, vida curta): o efeito tem que
 *          ler como parte da orbe, não como algo solto ao redor dela.
 *      As duas são moduladas por uma única `intensidade` (0–1) que sobe e
 *      desce suavemente com `speaking` — não há liga/desliga abrupto.
 *
 * As cores das PARTÍCULAS vêm dos tokens do tema (marca + ouro), lidos do CSS
 * em tempo de execução — não de hex fixos. A esfera do shader usa a paleta
 * própria do componente (ver `hue` em `GradientOrbConfig`); ajustar para bater
 * exatamente com o tema é um passo isolado, não feito aqui ainda.
 */

export interface MartsOrbProps {
  /** Diâmetro da esfera, em px. O canvas de partículas usa uma área maior ao redor. */
  size?: number;
  /** true enquanto a Marts fala ou processa — liga as partículas (só tem efeito com `particles`). */
  speaking?: boolean;
  /**
   * Liga o canvas de partículas (centelhas do anel + faíscas emitidas).
   * `false` por padrão: só a ORBE FLUTUANTE deve ter partículas — no ícone
   * do cabeçalho e dentro do painel da Marts elas ficavam "soltas" atrás de
   * um alvo pequeno, sem ler como parte da orbe. A esfera em si (shader)
   * aparece sempre, com ou sem partículas.
   */
  particles?: boolean;
  className?: string;
}

/** Fallback só vale antes de o layout injetar o tema (não deveria acontecer em uso normal). */
const PALETA: { var: string; fallback: [number, number, number] }[] = [
  { var: "--gold-400", fallback: [247, 185, 72] },
  { var: "--brand-400", fallback: [107, 143, 196] },
  { var: "--gold-500", fallback: [243, 146, 0] },
  { var: "--brand-300", fallback: [150, 178, 220] },
  { var: "--gold-400", fallback: [247, 185, 72] }, // repetido: o ouro domina um pouco mais o ciclo
  { var: "--ok-400", fallback: [93, 200, 140] }, // toque raro de verde-sucesso
];

const MAX_PARTICULAS = 56;
const TAXA_EMISSAO = 24; // por segundo, no pico (intensidade = 1)
const N_CENTELHAS = 4;
const ESCALA_CANVAS = 2.3; // mais perto da esfera que antes — o efeito deve ler como PARTE da orbe, não soltar longe dela
const VELOCIDADE_COR = 0.05; // voltas de paleta por segundo — bem lento, para ler como "gradual"
const RELEITURA_PALETA = 0.5; // segundos entre leituras do tema (acompanha o editor ao vivo sem custar por quadro)

function readRgb(nome: string, fallback: [number, number, number]): [number, number, number] {
  const raw = getComputedStyle(document.documentElement).getPropertyValue(nome).trim().split(/\s+/).map(Number);
  return raw.length === 3 && raw.every(Number.isFinite) ? (raw as [number, number, number]) : fallback;
}

/** Amostra a paleta num ponto contínuo (0..1, cíclico) — cores vizinhas se misturam. */
function corNaFase(paleta: [number, number, number][], fase: number): [number, number, number] {
  const f = ((fase % 1) + 1) % 1;
  const pos = f * paleta.length;
  const i = Math.floor(pos) % paleta.length;
  const j = (i + 1) % paleta.length;
  const k = pos - Math.floor(pos);
  const a = paleta[i]!;
  const b = paleta[j]!;
  return [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k, a[2] + (b[2] - a[2]) * k];
}

interface Particula {
  ativa: boolean;
  x: number;
  y: number;
  vx: number;
  vy: number;
  nascimento: number;
  vida: number;
  raio: number;
  faseCor: number;
  seed: number;
}

interface Centelha {
  ang: number;
  velAng: number;
  faseCor: number;
}

export function MartsOrb({ size = 96, speaking = false, particles = false, className }: MartsOrbProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const speakingRef = useRef(speaking);
  speakingRef.current = speaking;
  const reduzido = usePrefersReducedMotion();
  // Espelha a visibilidade num estado de React — é o que desmonta o
  // <GradientOrb> (shader em GPU) quando a orbe sai da tela, em vez de deixar
  // um WebGL ocioso rodando fora de vista. Roda SEMPRE (com ou sem
  // partículas) — é por isso que é um efeito à parte do de partículas abaixo.
  const [visivel, setVisivel] = useState(true);

  useEffect(() => {
    if (reduzido) return;
    const wrap = wrapRef.current;
    if (!wrap) return;
    const io = new IntersectionObserver(([entry]) => setVisivel(Boolean(entry?.isIntersecting)), { rootMargin: "80px" });
    io.observe(wrap);
    return () => io.disconnect();
  }, [reduzido]);

  useEffect(() => {
    if (reduzido || !particles) return; // sem partícula nenhuma: a esfera respira sozinha.
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !wrap || !ctx) return;

    let dpr = 1;
    let w = 0;
    let h = 0;
    const resize = () => {
      dpr = Math.min(2, window.devicePixelRatio || 1);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.max(1, Math.round(w * dpr));
      canvas.height = Math.max(1, Math.round(h * dpr));
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const particulas: Particula[] = Array.from({ length: MAX_PARTICULAS }, () => ({
      ativa: false,
      x: 0,
      y: 0,
      vx: 0,
      vy: 0,
      nascimento: 0,
      vida: 0,
      raio: 0,
      faseCor: 0,
      seed: 0,
    }));
    const centelhas: Centelha[] = Array.from({ length: N_CENTELHAS }, (_, i) => ({
      ang: (i / N_CENTELHAS) * Math.PI * 2,
      velAng: (0.5 + Math.random() * 0.4) * (i % 2 === 0 ? 1 : -1),
      faseCor: Math.random(),
    }));

    const raioEsfera = size / 2;
    let intensidade = 0; // 0..1, suavizada — "o quanto" a Marts está falando agora
    let acumulador = 0;
    let faseGlobal = Math.random();
    let t = 0;
    let emTela = true;
    let raf = 0;
    let anterior = 0;
    let paleta: [number, number, number][] = PALETA.map((p) => p.fallback);
    let paletaLidaEm = -Infinity;

    const nascer = (p: Particula) => {
      const ang = Math.random() * Math.PI * 2;
      const vel = 9 + Math.random() * 13; // mais devagar: gruda perto da superfície em vez de se afastar rápido
      p.ativa = true;
      p.x = Math.cos(ang) * raioEsfera;
      p.y = Math.sin(ang) * raioEsfera;
      p.vx = Math.cos(ang) * vel;
      p.vy = Math.sin(ang) * vel;
      p.nascimento = t;
      p.vida = 0.7 + Math.random() * 0.5; // vida mais curta = alcance menor
      p.raio = 1.2 + Math.random() * 1.6;
      p.faseCor = Math.random();
      p.seed = Math.random() * Math.PI * 2;
    };

    /** Ponto de luz suave: um disco com degradê radial que esmaece até transparente. */
    const pontoGlow = (x: number, y: number, raio: number, rgb: [number, number, number], alfa: number) => {
      if (alfa <= 0.003 || raio <= 0) return;
      const [r, g, b] = rgb;
      const grad = ctx.createRadialGradient(x, y, 0, x, y, raio);
      grad.addColorStop(0, `rgba(${r | 0},${g | 0},${b | 0},${alfa})`);
      grad.addColorStop(1, `rgba(${r | 0},${g | 0},${b | 0},0)`);
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(x, y, raio, 0, Math.PI * 2);
      ctx.fill();
    };

    const quadro = (agora: number) => {
      const dt = anterior ? Math.min(0.05, (agora - anterior) / 1000) : 0;
      anterior = agora;
      t += dt;

      const alvo = speakingRef.current ? 1 : 0;
      intensidade += (alvo - intensidade) * (1 - Math.exp(-dt * 3.2));
      faseGlobal += dt * VELOCIDADE_COR;

      if (t - paletaLidaEm > RELEITURA_PALETA) {
        paleta = PALETA.map((p) => readRgb(p.var, p.fallback));
        paletaLidaEm = t;
      }

      // Emite partículas proporcionalmente à intensidade — quieta, nasce pouco; falando, mais.
      acumulador += dt * TAXA_EMISSAO * intensidade;
      while (acumulador >= 1) {
        const livre = particulas.find((p) => !p.ativa);
        if (livre) nascer(livre);
        acumulador -= 1;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const cx = w / 2;
      const cy = h / 2;

      // Centelhas do anel — sempre orbitam; só ficam visíveis conforme fala.
      for (const c of centelhas) {
        c.ang += c.velAng * dt;
        const x = cx + Math.cos(c.ang) * raioEsfera;
        const y = cy + Math.sin(c.ang) * raioEsfera;
        pontoGlow(x, y, 3.4, corNaFase(paleta, faseGlobal + c.faseCor), intensidade * 0.9);
      }

      // Partículas emitidas — espalham, encolhem, somem. Vivem seu ciclo até o fim
      // mesmo que `speaking` já tenha desligado: não há corte abrupto.
      for (const p of particulas) {
        if (!p.ativa) continue;
        const a = (t - p.nascimento) / p.vida;
        if (a >= 1) {
          p.ativa = false;
          continue;
        }
        p.vx *= Math.max(0, 1 - 1.3 * dt); // arrasto maior: trava perto da borda, como o aro de faíscas da referência
        p.vy *= Math.max(0, 1 - 1.3 * dt);
        p.x += p.vx * dt + Math.sin(t * 3 + p.seed) * 0.12;
        p.y += p.vy * dt + Math.cos(t * 2.6 + p.seed) * 0.12;

        const entrada = 0.12;
        const saida = 0.7;
        const op = a < entrada ? a / entrada : a < saida ? 1 : 1 - (a - saida) / (1 - saida);
        const raio = p.raio * (1 - 0.3 * a) * 3;
        pontoGlow(cx + p.x, cy + p.y, raio, corNaFase(paleta, faseGlobal + p.faseCor), op);
      }

      raf = emTela ? requestAnimationFrame(quadro) : 0;
    };

    const iniciar = () => {
      if (raf || !emTela) return;
      anterior = 0;
      raf = requestAnimationFrame(quadro);
    };

    // Só anima enquanto a orbe está na tela — a mesma economia do resto do site.
    // (`visivel`, o estado de React que desmonta o shader, já é o outro efeito
    // acima — aqui é só o laço de partículas, próprio deste canvas.)
    const io = new IntersectionObserver(
      ([entry]) => {
        emTela = Boolean(entry?.isIntersecting);
        if (emTela) iniciar();
      },
      { rootMargin: "80px" },
    );
    io.observe(wrap);
    iniciar();

    return () => {
      io.disconnect();
      ro.disconnect();
      if (raf) cancelAnimationFrame(raf);
    };
    // `speaking` é lido via `speakingRef` dentro do laço — de propósito: evita
    // recriar o laço e a reserva de partículas a cada toggle de fala.
  }, [reduzido, size, particles]);

  return (
    <div ref={wrapRef} className={cn("relative", className)} style={{ width: size, height: size }}>
      {reduzido ? (
        // "Reduzir movimento" ativo: esfera estática em CSS, sem WebGL nenhum.
        // `data-speaking` ainda troca o brilho (box-shadow, sem animação) —
        // só a movimentação é que fica de fora.
        <div className="marts-orb" data-speaking={speaking} style={{ width: size, height: size }} aria-hidden />
      ) : visivel ? (
        // Shader em GPU, só montado enquanto a orbe está na tela — ver `emTela`
        // no efeito acima, que é quem desmonta isto ao sair de vista.
        <div style={{ width: size, height: size }} aria-hidden>
          <GradientOrb />
        </div>
      ) : (
        // Fora de vista: nem WebGL nem CSS animado, só o volume do espaço
        // reservado — evita o "pulo" de layout quando ela volta a aparecer.
        <div style={{ width: size, height: size }} aria-hidden />
      )}
      {particles && !reduzido && (
        <canvas
          ref={canvasRef}
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-1/2"
          style={{ width: size * ESCALA_CANVAS, height: size * ESCALA_CANVAS, transform: "translate(-50%, -50%)" }}
        />
      )}
    </div>
  );
}
