"use client";
import { useEffect, useRef } from "react";
import { usePrefersReducedMotion } from "@/lib/marketing/use-scroll-progress";
import { clamp, cn } from "@/lib/utils";

/* ─────────────────────────────── Geometria ───────────────────────────────
   Espaço do modelo com y crescendo para baixo. Corpo = caixa chanfrada
   triangulada; arco = tubo octogonal varrido ao longo de pernas + semicírculo.
   A perna esquerda entra fundo no corpo e a direita, raso: ao subir LIFT, só a
   direita sai — a esquerda continua presa e vira o eixo do giro. */

const W = 30; // meia largura do corpo
const TOP = 0;
const BOT = 54;
const D = 17; // meia profundidade
const CH = 5; // chanfro
const BAND = TOP + (BOT - TOP) * 0.56;

const R = 19.5; // raio do arco (linha central)
const TUBE = 4.6;
const SIDES = 8;
const ARC_CY = TOP - 16;
const INS_LEFT = 22;
const INS_RIGHT = 7;
const NOTCH_TOP = TOP + 1;
const NOTCH_BOT = TOP + 5;

const LIFT = 13;
const SWING = 1.2; // rad
const HINGE_X = -R;
const CENTER_Y = 9;
const FOCAL = 380;
/* O enquadramento NÃO é um número fixo: no início medimos o maior raio que o
   desenho alcança em todas as poses possíveis (giro ocioso, inclinação do
   arraste, cadeado aberto) e a escala sai daí. Assim ele fica o maior possível
   dentro da caixa sem nunca ser cortado num ângulo específico. */
const EDGE_PAD = 7; // folga em px para a espessura do traço e o brilho
const FLOAT = 4; // amplitude da flutuação vertical, em unidades do modelo
/**
 * Quanto a caixa do cadeado pode avançar para fora da seção antes de ele travar.
 * A malha desenhada nunca encosta na parede da sua caixa, então essa folga é o
 * que deixa o cadeado chegar perto da linha que separa as telas — e só ali o
 * bloqueio dispara.
 */
const GRACE = 44;

interface Vtx {
  mx: number;
  my: number;
  mz: number;
  tx: number;
  ty: number;
  tz: number;
  sx: number;
  sy: number;
  sz: number;
  inside: boolean;
  /** Normal no espaço do MODELO: para onde esta parte da superfície aponta. */
  nx: number;
  ny: number;
  nz: number;
  /** Quanto este vértice recebe da luz da cena, recalculado a cada quadro. */
  lum: number;
}
type Tier = 0 | 1 | 2;
interface Edge {
  a: Vtx;
  b: Vtx;
  tier: Tier;
  clip: boolean;
}
interface Rail {
  pts: Vtx[];
  cum: number[];
  len: number;
  shackle: boolean;
}

function vtx(x: number, y: number, z: number, n?: [number, number, number]): Vtx {
  let [nx, ny, nz] = n ?? [0, 0, 0];
  // A normal TEM de ser unitária: se não for, o produto escalar com a luz passa
  // de 1 e o expoente fracionário do sombreamento devolve NaN — que depois vira
  // um índice de lote inexistente e apaga o desenho inteiro.
  const l = Math.hypot(nx, ny, nz);
  if (l > 0) {
    nx /= l;
    ny /= l;
    nz /= l;
  }
  return { mx: x, my: y, mz: z, tx: x, ty: y, tz: z, sx: 0, sy: 0, sz: 0, inside: false, nx, ny, nz, lum: 1 };
}

function isInsideBody(x: number, y: number, z: number): boolean {
  return Math.abs(x) < W - 0.2 && y > TOP + 0.2 && y < BOT - 0.2 && Math.abs(z) < D - 0.2;
}

function shackleCenterline(): [number, number][] {
  const pts: [number, number][] = [];
  for (let y = TOP + INS_LEFT; y > ARC_CY; y -= 5) pts.push([-R, y]);
  const n = 18;
  for (let i = 0; i <= n; i++) {
    const a = Math.PI - (i / n) * Math.PI;
    pts.push([Math.cos(a) * R, ARC_CY - Math.sin(a) * R]);
  }
  for (let y = ARC_CY + 5; y < NOTCH_TOP - 0.5; y += 5) pts.push([R, y]);
  // Anéis colados às bordas do entalhe deixam o degrau nítido.
  for (const y of [NOTCH_TOP - 0.4, NOTCH_TOP, NOTCH_BOT, NOTCH_BOT + 0.4, TOP + INS_RIGHT]) pts.push([R, y]);
  return pts;
}

function buildMesh() {
  const edges: Edge[] = [];
  const add = (a: Vtx, b: Vtx, tier: Tier, clip: boolean) => edges.push({ a, b, tier, clip });

  // ── Arco: tubo octogonal ──
  const line = shackleCenterline();
  const rings: Vtx[][] = line.map(([cx, cy], i) => {
    const p = line[Math.max(0, i - 1)]!;
    const q = line[Math.min(line.length - 1, i + 1)]!;
    let tx = q[0] - p[0];
    let ty = q[1] - p[1];
    const l = Math.hypot(tx, ty) || 1;
    tx /= l;
    ty /= l;
    // Normal no plano, sempre apontando para o lado de dentro do arco.
    const nx = -ty;
    const ny = tx;
    const notched = cx > 0 && cy >= NOTCH_TOP && cy <= NOTCH_BOT;
    return Array.from({ length: SIDES }, (_, k) => {
      const th = (k / SIDES) * Math.PI * 2 + Math.PI / SIDES;
      const c = Math.cos(th);
      const r = notched && c > 0.2 ? TUBE * 0.3 : TUBE;
      const sn = Math.sin(th);
      // A direção radial do anel já é a normal da superfície do tubo — sai de graça.
      return vtx(cx + r * c * nx, cy + r * c * ny, r * sn, [c * nx, c * ny, sn]);
    });
  });

  /*
    RITMO DO TUBO. Os trinta e cinco aros transversais vinham todos no mesmo
    peso: de longe aquilo não lia como um tubo, lia como uma tela de arame, e a
    trama competia com a silhueta. Agora um a cada três é uma COSTELA (nível 1)
    e os outros recuam para o nível 2 — a geometria é a mesma, só a leitura
    muda. Objeto torneado tem ritmo; malha de software tem densidade uniforme.
  */
  rings.forEach((ring, i) => {
    const costela: Tier = i % 3 === 0 ? 1 : 2;
    ring.forEach((v, k) => {
      add(v, ring[(k + 1) % SIDES]!, costela, true);
      const next = rings[i + 1];
      if (next) {
        // As longitudinais são a estrutura do tubo: elas é que desenham a curva.
        add(v, next[k]!, 0, true);
        add(v, next[(k + 1) % SIDES]!, 2, true);
      }
    });
  });
  for (const ring of [rings[0]!, rings[rings.length - 1]!]) {
    const c = ring.reduce((s, v) => ({ x: s.x + v.mx / SIDES, y: s.y + v.my / SIDES, z: s.z + v.mz / SIDES }), {
      x: 0,
      y: 0,
      z: 0,
    });
    const center = vtx(c.x, c.y, c.z);
    for (const v of ring) add(center, v, 2, true);
    rings.push([center]);
  }

  // ── Corpo: caixa chanfrada em fatias ──
  const profile = (inset: number, z: number): Vtx[] => {
    const x0 = -W + inset;
    const x1 = W - inset;
    const y0 = TOP + inset;
    const y1 = BOT - inset;
    /*
      Normal do perfil: a direção que sai do eixo do corpo e passa pelo canto.
      Nos chanfros das fatias extremas ela também inclina para fora em z, que é
      para onde a quina de verdade aponta.
    */
    const cy = (TOP + BOT) / 2;
    const face = inset > 0 ? Math.sign(z) * 0.72 : 0;
    const p = (px: number, py: number): Vtx => {
      const dx = px;
      const dy = py - cy;
      const l = Math.hypot(dx, dy) || 1;
      return vtx(px, py, z, [dx / l, dy / l, face]);
    };
    return [
      p(x0 + CH, y0),
      p(x1 - CH, y0),
      p(x1, y0 + CH),
      p(x1, y1 - CH),
      p(x1 - CH, y1),
      p(x0 + CH, y1),
      p(x0, y1 - CH),
      p(x0, y0 + CH),
    ];
  };
  const slices = [profile(CH, D), profile(0, D - CH), profile(0, 0), profile(0, -D + CH), profile(CH, -D)];
  const sliceTier: Tier[] = [0, 0, 2, 0, 0];
  const linkTier: Tier[] = [0, 1, 1, 0];

  slices.forEach((s, j) => {
    s.forEach((v, k) => {
      add(v, s[(k + 1) % 8]!, sliceTier[j]!, false);
      const n = slices[j + 1];
      if (n) {
        add(v, n[k]!, linkTier[j]!, false);
        add(v, n[(k + 1) % 8]!, 2, false);
      }
    });
  });

  const bodyExtra: Vtx[] = [];
  for (const [face, z] of [
    [slices[0]!, D],
    [slices[4]!, -D],
  ] as const) {
    const center = vtx(0, (TOP + BOT) / 2, z, [0, 0, Math.sign(z)]);
    bodyExtra.push(center);
    for (const v of face) add(center, v, 2, false);
    const nFace: [number, number, number] = [0, 0, Math.sign(z)];
    const top = vtx(0, TOP + CH, z, nFace);
    const bottom = vtx(0, BOT - CH, z, nFace);
    const left = vtx(-W + CH, BAND, z, nFace);
    const right = vtx(W - CH, BAND, z, nFace);
    bodyExtra.push(top, bottom, left, right);
    add(top, bottom, 1, false);
    add(left, right, 1, false);
  }
  for (const x of [-W, W]) {
    const nSide: [number, number, number] = [Math.sign(x), 0, 0];
    const a = vtx(x, BAND, D - CH, nSide);
    const b = vtx(x, BAND, -D + CH, nSide);
    bodyExtra.push(a, b);
    add(a, b, 1, false);
  }

  const shackleVerts = rings.flat();
  const bodyVerts = [...slices.flat(), ...bodyExtra];

  const rail = (pts: Vtx[], shackle: boolean): Rail => {
    const cum = [0];
    for (let i = 1; i < pts.length; i++) {
      const a = pts[i - 1]!;
      const b = pts[i]!;
      cum.push(cum[i - 1]! + Math.hypot(b.mx - a.mx, b.my - a.my, b.mz - a.mz));
    }
    return { pts, cum, len: cum[cum.length - 1]!, shackle };
  };
  const tubeRings = rings.slice(0, line.length);
  const rails = [
    rail(tubeRings.map((r) => r[1]!), true),
    rail(tubeRings.map((r) => r[5]!), true),
    rail([...slices[1]!, slices[1]![0]!], false),
    rail([...slices[3]!, slices[3]![0]!], false),
  ];

  return { edges, shackleVerts, bodyVerts, rails };
}

/* ──────────────────────────────── Estilo ──────────────────────────────── */

/*
  LUZ DA CENA — uma fonte só, vinda de cima, da esquerda e da frente, FIXA no
  espaço da câmera. Como ela não gira junto, é o cadeado que passa por baixo
  dela: a face virada para a luz acende e a oposta apaga, e isso muda enquanto
  ele roda. É a mesma regra do vidro (Brandbook §5): aro igual nos quatro lados
  é o delator de material sintético, porque na natureza a luz vem de uma direção.

  y negativo é para cima (o modelo cresce para baixo) e z negativo é em direção
  à câmera.
*/
const LIGHT: [number, number, number] = (() => {
  const v: [number, number, number] = [-0.38, -0.82, -0.43];
  const l = Math.hypot(...v);
  return [v[0] / l, v[1] / l, v[2] / l];
})();
/** Quanto a face na sombra ainda aparece. Zero apagaria metade do desenho. */
const AMBIENT = 0.3;

const TIER_ALPHA = [0.95, 0.44, 0.17] as const;
const TIER_WIDTH = [1.15, 0.72, 0.55] as const;
const BUCKETS = 12;
const PARTICLES = [
  { rail: 0, speed: 30, u: 0.05 },
  { rail: 1, speed: 23, u: 0.55 },
  { rail: 2, speed: 26, u: 0.2 },
  { rail: 3, speed: 19, u: 0.7 },
] as const;
const TRAIL = 16;

function readRgb(name: string, fallback: [number, number, number]): [number, number, number] {
  const raw = getComputedStyle(document.documentElement).getPropertyValue(name).trim().split(/\s+/).map(Number);
  return raw.length === 3 && raw.every((n) => Number.isFinite(n)) ? (raw as [number, number, number]) : fallback;
}

/** Mola amortecida em subpassos (estável mesmo com quadros longos). */
function spring(pos: number, vel: number, target: number, k: number, c: number, dt: number): [number, number] {
  const h = dt / 2;
  for (let i = 0; i < 2; i++) {
    vel += (-k * (pos - target) - c * vel) * h;
    pos += vel * h;
  }
  return [pos, vel];
}

/**
 * Cadeado 3D em wireframe, com a linguagem do "Orbit" (traço finíssimo em dois
 * níveis + ponto de luz com halo), mas em malha 3D real recalculada a cada
 * quadro: gira de forma orgânica, vibra e destrava só do lado direito no hover,
 * e pode ser arrastado — ao soltar, volta por mola com um leve arremesso.
 */
export function Lock3D({ className }: { className?: string }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!wrap || !canvas || !ctx) return;

    const { edges, shackleVerts, bodyVerts, rails } = buildMesh();
    const [gr, gg, gb] = readRgb("--gold-500", [243, 146, 0]);
    const goldA = (a: number) => `rgba(${gr},${gg},${gb},${a.toFixed(3)})`;

    /*
      Degradê "neon" da malha, de cima para baixo: o azul da marca no arco
      (a parte que prende) esquenta até o dourado no corpo (a parte que libera).
      São os tokens do sistema — nenhum hex novo. Fica opaco: a transparência
      de cada aresta vem do `globalAlpha`, então basta UM degradê por redimensionamento.
    */
    const NEON: [number, [number, number, number]][] = [
      [0, readRgb("--brand-700", [27, 58, 107])],
      [0.38, readRgb("--brand-600", [58, 85, 127])],
      [0.6, readRgb("--brand-500", [89, 111, 147])],
      [0.78, readRgb("--gold-400", [245, 167, 48])],
      [1, readRgb("--gold-500", [243, 146, 0])],
    ];

    const particles = PARTICLES.map((p) => ({
      rail: p.rail as number,
      speed: p.speed as number,
      u: p.u as number,
      trail: [] as { x: number; y: number }[],
    }));

    const st = {
      t: 0,
      open: 0,
      openV: 0,
      hover: false,
      shakeAt: -10,
      x: 0,
      y: 0,
      vx: 0,
      vy: 0,
      drag: false,
      grabX: 0,
      grabY: 0,
      lastX: 0,
      lastY: 0,
      lastT: 0,
      velX: 0,
      velY: 0,
      tiltX: 0,
      tiltY: 0,
      /** Enquanto `t` não passar disso, a trava fica fechada (depois de escapar da mão). */
      holdClosedUntil: 0,
    };

    let w = 0;
    let h = 0;
    let dpr = 1;
    /*
      O degradê da malha é redesenhado a cada quadro entre o TOPO DO ARCO e a
      BASE DO CORPO já projetados — ou seja, ao longo do eixo do próprio
      cadeado. Antes ele era fixo em coordenadas de tela: a cor ficava parada e
      o objeto deslizava por dentro dela ao girar, que é o delator de um objeto
      que não carrega a própria cor. Um gradiente por quadro é barato.
    */
    const AXIS_TOP = { x: 0, y: ARC_CY - R, z: 0 };
    const AXIS_BOT = { x: 0, y: BOT, z: 0 };
    const axA = { sx: 0, sy: 0, sz: 0 };
    const axB = { sx: 0, sy: 0, sz: 0 };
    let mesh: CanvasGradient | string = "#000";
    const meshGradient = (): CanvasGradient | string => {
      project(AXIS_TOP.x, AXIS_TOP.y, AXIS_TOP.z, axA);
      project(AXIS_BOT.x, AXIS_BOT.y, AXIS_BOT.z, axB);
      // De topo e base no mesmo pixel sai um gradiente inválido: cai na cor do meio.
      if (Math.hypot(axB.sx - axA.sx, axB.sy - axA.sy) < 1) {
        const [r, gg2, b] = NEON[2]![1];
        return `rgb(${r},${gg2},${b})`;
      }
      const g = ctx.createLinearGradient(axA.sx, axA.sy, axB.sx, axB.sy);
      for (const [stop, [r, gg2, b]] of NEON) g.addColorStop(stop, `rgb(${r},${gg2},${b})`);
      return g;
    };
    const resize = () => {
      dpr = Math.min(2, window.devicePixelRatio || 1);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.max(1, Math.round(w * dpr));
      canvas.height = Math.max(1, Math.round(h * dpr));
    };
    resize();

    // Rotação e projeção da cena (recalculadas a cada quadro).
    let cyw = 1;
    let syw = 0;
    let cpt = 1;
    let spt = 0;
    let crl = 1;
    let srl = 0;
    let S = 1;
    let ox = 0;
    let oy = 0;
    const project = (x: number, y: number, z: number, out: { sx: number; sy: number; sz: number }) => {
      y -= CENTER_Y;
      const x1 = x * crl - y * srl;
      const y1 = x * srl + y * crl;
      const x2 = x1 * cyw + z * syw;
      const z2 = -x1 * syw + z * cyw;
      const y3 = y1 * cpt - z2 * spt;
      const z3 = y1 * spt + z2 * cpt;
      const k = FOCAL / (FOCAL + z3);
      out.sx = ox + x2 * k * S;
      out.sy = oy + y3 * k * S;
      out.sz = z3;
    };

    /*
      Gira uma DIREÇÃO com a mesma matriz da câmera — sem o deslocamento do
      centro e sem a divisão da perspectiva, que valem para pontos, não para
      normais. É o que leva a normal do modelo para o espaço onde a luz mora.
    */
    const dir = { x: 0, y: 0, z: 0 };
    const rotDir = (x: number, y: number, z: number) => {
      const x1 = x * crl - y * srl;
      const y1 = x * srl + y * crl;
      const x2 = x1 * cyw + z * syw;
      const z2 = -x1 * syw + z * cyw;
      dir.x = x2;
      dir.y = y1 * cpt - z2 * spt;
      dir.z = y1 * spt + z2 * cpt;
    };

    /** Lambert meio-a-meio: sem o "/2 + 0.5" a metade na sombra sumiria de vez. */
    const shade = (v: Vtx, swc: number, sws: number) => {
      if (v.nx === 0 && v.ny === 0 && v.nz === 0) {
        v.lum = 1;
        return;
      }
      // O arco também gira na dobradiça: a normal acompanha o mesmo giro.
      const nx = v.nx * swc - v.nz * sws;
      const nz = v.nx * sws + v.nz * swc;
      rotDir(nx, v.ny, nz);
      const d = dir.x * LIGHT[0] + dir.y * LIGHT[1] + dir.z * LIGHT[2];
      v.lum = AMBIENT + (1 - AMBIENT) * clamp(d * 0.5 + 0.5, 0, 1) ** 1.35;
    };

    let liftP = 0;
    let swingA = 0;
    const openXform = (v: Vtx) => {
      const y = v.my - LIFT * liftP;
      const dx = v.mx - HINGE_X;
      const c = Math.cos(swingA);
      const s = Math.sin(swingA);
      v.tx = HINGE_X + dx * c - v.mz * s;
      v.ty = y;
      v.tz = dx * s + v.mz * c;
      v.inside = isInsideBody(v.tx, v.ty, v.tz);
    };

    const tmp = { sx: 0, sy: 0, sz: 0 };
    const paths: Path2D[][] = [[], [], []];

    /*
      Varre as poses extremas — giro ocioso, tremor, inclinação máxima do
      arraste e cadeado aberto — e devolve o maior afastamento do centro que o
      desenho chega a ter (à escala 1). É o que substitui o enquadramento
      chutado: de posse desse raio, a escala é sempre a maior que ainda cabe.
    */
    const measureFitRadius = (yawSpan: number, pitchSpan: number): number => {
      const keepS = S;
      const keepOx = ox;
      const keepOy = oy;
      S = 1;
      ox = 0;
      oy = 0;
      let r = 1;
      const look = (v: Vtx, useT: boolean) => {
        project(useT ? v.tx : v.mx, useT ? v.ty : v.my, useT ? v.tz : v.mz, tmp);
        r = Math.max(r, Math.abs(tmp.sx), Math.abs(tmp.sy));
      };
      for (const open of [0, 1.1]) {
        liftP = clamp(open / 0.4, 0, 1);
        swingA = -SWING * clamp((open - 0.3) / 0.7, 0, 1.12);
        for (const v of shackleVerts) openXform(v);
        for (let i = 0; i <= 12; i++) {
          const yaw = -0.42 - yawSpan + (2 * yawSpan * i) / 12;
          for (let j = 0; j <= 8; j++) {
            const pitch = 0.2 - pitchSpan + (2 * pitchSpan * j) / 8;
            for (const roll of [-0.05, 0.05]) {
              cyw = Math.cos(yaw);
              syw = Math.sin(yaw);
              cpt = Math.cos(pitch);
              spt = Math.sin(pitch);
              crl = Math.cos(roll);
              srl = Math.sin(roll);
              for (const v of shackleVerts) look(v, true);
              for (const v of bodyVerts) look(v, false);
            }
          }
        }
      }
      S = keepS;
      ox = keepOx;
      oy = keepOy;
      return r;
    };
    /*
      Dois raios: o do repouso (giro ocioso + tremor + abertura no hover) e o
      do arraste, que inclina bem mais. Se usássemos só o segundo, o cadeado
      ficaria pequeno o tempo todo por causa de uma pose rara — então a escala
      cede aos poucos, acompanhando a própria inclinação de quem arrasta.
    */
    const fitIdle = measureFitRadius(0.69, 0.06) + FLOAT;
    const fitDrag = measureFitRadius(1.29, 0.51) + FLOAT;

    const draw = () => {
      const t = st.t;
      const idle = reduced ? 0 : 1;
      const since = t - st.shakeAt;
      const env = reduced ? 0 : Math.exp(-since * 7) * (since >= 0 ? 1 : 0);

      const yaw =
        -0.42 +
        idle * (Math.sin(t * 0.21) * 0.42 + Math.sin(t * 0.53 + 1.7) * 0.17 + Math.sin(t * 1.31 + 0.4) * 0.05) +
        st.tiltY +
        Math.sin(since * 63) * 0.05 * env;
      const pitch = 0.2 + idle * Math.sin(t * 0.37 + 0.9) * 0.06 + st.tiltX;
      const roll = idle * Math.sin(t * 0.29 + 2.2) * 0.05;
      cyw = Math.cos(yaw);
      syw = Math.sin(yaw);
      cpt = Math.cos(pitch);
      spt = Math.sin(pitch);
      crl = Math.cos(roll);
      srl = Math.sin(roll);
      const tilted = clamp(Math.max(Math.abs(st.tiltX) / 0.45, Math.abs(st.tiltY) / 0.6), 0, 1);
      S = Math.max(0.1, Math.min(w, h) / 2 - EDGE_PAD) / (fitIdle + (fitDrag - fitIdle) * tilted);
      ox = w / 2;
      oy = h / 2 + idle * Math.sin(t * 0.6) * 4 * S;

      liftP = clamp(st.open / 0.4, 0, 1);
      swingA = -SWING * clamp((st.open - 0.3) / 0.7, 0, 1.12);

      const swc = Math.cos(swingA);
      const sws = Math.sin(swingA);
      for (const v of shackleVerts) {
        openXform(v);
        project(v.tx, v.ty, v.tz, v);
        shade(v, swc, sws);
      }
      for (const v of bodyVerts) {
        project(v.tx, v.ty, v.tz, v);
        shade(v, 1, 0);
      }

      for (let tier = 0; tier < 3; tier++) for (let b = 0; b < BUCKETS; b++) paths[tier]![b] = new Path2D();

      /*
        O bucket era só profundidade. Agora é profundidade VEZES luz — ou seja,
        "quanto esta aresta se faz presente". Uma aresta perto mas virada para
        longe da luz recua; uma aresta ao fundo, de cara para a luz, respira.
        Combinar os dois num fator só mantém o custo igual ao de antes: nada de
        multiplicar o número de lotes.
      */
      const push = (
        tier: Tier,
        x1: number,
        y1: number,
        z1: number,
        x2: number,
        y2: number,
        z2: number,
        lum: number,
      ) => {
        const depth = clamp(0.5 - (z1 + z2) / 240, 0, 1);
        const n = clamp(depth * (0.24 + 0.76 * lum), 0, 1);
        const b = clamp(Math.floor(n * BUCKETS), 0, BUCKETS - 1) || 0;
        const p = paths[tier]![b]!;
        p.moveTo(x1, y1);
        p.lineTo(x2, y2);
      };

      for (const e of edges) {
        const { a, b } = e;
        if (e.clip && (a.inside || b.inside)) {
          if (a.inside && b.inside) continue;
          // Corta a aresta exatamente na parede do corpo (bisseção).
          const out = a.inside ? b : a;
          const inn = a.inside ? a : b;
          let lo = 0;
          let hi = 1;
          for (let i = 0; i < 6; i++) {
            const m = (lo + hi) / 2;
            const inside = isInsideBody(
              out.tx + (inn.tx - out.tx) * m,
              out.ty + (inn.ty - out.ty) * m,
              out.tz + (inn.tz - out.tz) * m,
            );
            if (inside) hi = m;
            else lo = m;
          }
          project(
            out.tx + (inn.tx - out.tx) * lo,
            out.ty + (inn.ty - out.ty) * lo,
            out.tz + (inn.tz - out.tz) * lo,
            tmp,
          );
          // O ponto de corte nasce na parede do corpo: herda a luz de quem ficou fora.
          push(e.tier, out.sx, out.sy, out.sz, tmp.sx, tmp.sy, tmp.sz, out.lum);
          continue;
        }
        push(e.tier, a.sx, a.sy, a.sz, b.sx, b.sy, b.sz, (a.lum + b.lum) / 2);
      }

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      ctx.lineCap = "round";
      const boost = 1 + 0.18 * clamp(st.open, 0, 1);
      mesh = meshGradient();
      ctx.strokeStyle = mesh;
      for (let tier = 0; tier < 3; tier++) {
        for (let b = 0; b < BUCKETS; b++) {
          const n = (b + 0.5) / BUCKETS;
          const a = Math.min(1, TIER_ALPHA[tier]! * (0.13 + 0.87 * n) * boost);
          // Brilho: só as arestas da frente ganham um traço largo e translúcido
          // por baixo — é o que dá o halo de neon sem borrar a malha inteira.
          /*
            O bucket `n` já é a profundidade (1 = mais perto da câmera), então
            sai de graça: aresta perto engrossa, aresta longe afina. Sem isto o
            traço tem a mesma espessura no fundo e na frente — o objeto vira
            desenho técnico, porque é justamente a espessura que o olho usa
            para ordenar o que está na frente.
          */
          const lw = TIER_WIDTH[tier]! * (0.6 + 0.78 * n);
          if (tier === 0 && n > 0.45) {
            ctx.globalAlpha = a * 0.17;
            ctx.lineWidth = lw * 6;
            ctx.stroke(paths[tier]![b]!);
          }
          ctx.globalAlpha = a;
          ctx.lineWidth = lw;
          ctx.stroke(paths[tier]![b]!);
        }
      }
      ctx.globalAlpha = 1;

      if (reduced) return;

      // Feixes de luz: ponto com halo correndo pelas arestas, deixando rastro.
      for (const p of particles) {
        const r = rails[p.rail]!;
        let i = 1;
        const d = p.u * r.len;
        while (i < r.cum.length - 1 && r.cum[i]! < d) i++;
        const a = r.pts[i - 1]!;
        const b = r.pts[i]!;
        const seg = r.cum[i]! - r.cum[i - 1]! || 1;
        const f = clamp((d - r.cum[i - 1]!) / seg, 0, 1);
        const x = a.tx + (b.tx - a.tx) * f;
        const y = a.ty + (b.ty - a.ty) * f;
        const z = a.tz + (b.tz - a.tz) * f;
        if (r.shackle && isInsideBody(x, y, z)) {
          p.trail.length = 0;
          continue;
        }
        project(x, y, z, tmp);
        p.trail.push({ x: tmp.sx, y: tmp.sy });
        if (p.trail.length > TRAIL) p.trail.shift();

        // O feixe é um ponto no espaço: perto dilata, longe encolhe.
        const kp = clamp(FOCAL / (FOCAL + tmp.sz), 0.72, 1.3);

        for (let j = 1; j < p.trail.length; j++) {
          const q = j / p.trail.length;
          ctx.strokeStyle = goldA(q ** 1.6 * 0.6);
          ctx.lineWidth = (0.5 + q * 1.6) * kp;
          ctx.beginPath();
          ctx.moveTo(p.trail[j - 1]!.x, p.trail[j - 1]!.y);
          ctx.lineTo(p.trail[j]!.x, p.trail[j]!.y);
          ctx.stroke();
        }
        const halo = ctx.createRadialGradient(tmp.sx, tmp.sy, 0, tmp.sx, tmp.sy, 11 * kp);
        halo.addColorStop(0, goldA(0.38 * kp));
        halo.addColorStop(1, goldA(0));
        ctx.fillStyle = halo;
        ctx.beginPath();
        ctx.arc(tmp.sx, tmp.sy, 11 * kp, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = goldA(1);
        ctx.beginPath();
        ctx.arc(tmp.sx, tmp.sy, 2.2 * kp, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "rgba(255,250,228,0.95)";
        ctx.beginPath();
        ctx.arc(tmp.sx, tmp.sy, 1 * kp, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const step = (dt: number) => {
      st.t += dt;
      const soft = reduced;
      const wantsOpen = st.hover && st.t >= st.holdClosedUntil;
      [st.open, st.openV] = spring(st.open, st.openV, wantsOpen ? 1 : 0, soft ? 400 : 70, soft ? 40 : 11, dt);

      if (st.drag) {
        st.velX *= 0.9;
        st.velY *= 0.9;
        const ty = clamp(st.velX * 0.0022, -0.6, 0.6);
        const tx = clamp(-st.velY * 0.0022, -0.45, 0.45);
        st.tiltY += (ty - st.tiltY) * Math.min(1, dt * 10);
        st.tiltX += (tx - st.tiltX) * Math.min(1, dt * 10);
      } else {
        [st.x, st.vx] = spring(st.x, st.vx, 0, soft ? 400 : 110, soft ? 40 : 10, dt);
        [st.y, st.vy] = spring(st.y, st.vy, 0, soft ? 400 : 110, soft ? 40 : 10, dt);
        st.tiltY += (0 - st.tiltY) * Math.min(1, dt * 5);
        st.tiltX += (0 - st.tiltX) * Math.min(1, dt * 5);
      }

      const since = st.t - st.shakeAt;
      const env = reduced ? 0 : Math.exp(-since * 7) * (since >= 0 ? 1 : 0);
      const shx = Math.sin(since * 55) * 5 * env;
      const shy = Math.sin(since * 71 + 1) * 3 * env;
      wrap.style.transform = `translate3d(${(st.x + shx).toFixed(2)}px, ${(st.y + shy).toFixed(2)}px, 0)`;

      const energy = 1 + 0.7 * clamp(st.open, 0, 1);
      for (const p of particles) {
        const len = rails[p.rail]!.len;
        const nu = p.u + (dt * p.speed * energy) / len;
        if (nu >= 1) p.trail.length = 0;
        p.u = nu % 1;
      }
    };

    let raf = 0;
    let prev = 0;
    let visible = false;
    const frame = (now: number) => {
      if (!visible) {
        raf = 0;
        return;
      }
      const dt = prev ? Math.min(1 / 30, (now - prev) / 1000) : 1 / 60;
      prev = now;
      step(dt);
      draw();
      raf = requestAnimationFrame(frame);
    };
    const start = () => {
      if (raf || !visible) return;
      prev = 0;
      raf = requestAnimationFrame(frame);
    };

    // Só anima enquanto estiver na tela.
    const io = new IntersectionObserver(
      ([entry]) => {
        visible = Boolean(entry?.isIntersecting);
        start();
      },
      { rootMargin: "120px" },
    );
    io.observe(wrap);
    const ro = new ResizeObserver(() => {
      resize();
      draw();
    });
    ro.observe(canvas);

    const onEnter = () => {
      st.hover = true;
      st.shakeAt = st.t;
    };
    const onLeave = () => {
      st.hover = false;
    };
    const onDown = (e: PointerEvent) => {
      st.drag = true;
      st.grabX = e.clientX - st.x;
      st.grabY = e.clientY - st.y;
      st.lastX = e.clientX;
      st.lastY = e.clientY;
      st.lastT = performance.now();
      st.velX = 0;
      st.velY = 0;
      wrap.setPointerCapture(e.pointerId);
      wrap.style.zIndex = "20";
    };
    /*
      O cadeado vive dentro da sua seção. Aqui saem os limites do arraste em
      pixels, medidos entre a caixa dele e a da seção — recalculados a cada
      movimento porque a página pode ter rolado.
    */
    const dragLimits = () => {
      const section = wrap.closest("section");
      if (!section) return null;
      const s = section.getBoundingClientRect();
      const b = wrap.getBoundingClientRect();
      const homeLeft = b.left - st.x;
      const homeTop = b.top - st.y;
      return {
        x0: Math.min(s.left - homeLeft, s.right - homeLeft - b.width) - GRACE,
        x1: Math.max(s.left - homeLeft, s.right - homeLeft - b.width) + GRACE,
        y0: Math.min(s.top - homeTop, s.bottom - homeTop - b.height) - GRACE,
        y1: Math.max(s.top - homeTop, s.bottom - homeTop - b.height) + GRACE,
      };
    };

    /** Escapou da mão: treme, fecha a trava e volta sozinho para o lugar. */
    const snapHome = (e: PointerEvent) => {
      st.drag = false;
      st.shakeAt = st.t;
      st.holdClosedUntil = st.t + 0.9;
      st.vx = 0;
      st.vy = 0;
      st.velX = 0;
      st.velY = 0;
      if (wrap.hasPointerCapture(e.pointerId)) wrap.releasePointerCapture(e.pointerId);
      wrap.style.zIndex = "";
    };

    const onMove = (e: PointerEvent) => {
      if (!st.drag) return;
      const now = performance.now();
      const ms = Math.max(1, now - st.lastT);
      st.velX = st.velX * 0.6 + ((e.clientX - st.lastX) / ms) * 1000 * 0.4;
      st.velY = st.velY * 0.6 + ((e.clientY - st.lastY) / ms) * 1000 * 0.4;
      st.lastX = e.clientX;
      st.lastY = e.clientY;
      st.lastT = now;

      const wantX = e.clientX - st.grabX;
      const wantY = e.clientY - st.grabY;
      const lim = dragLimits();
      if (!lim) {
        st.x = wantX;
        st.y = wantY;
        return;
      }
      // Livre dentro da seção; ao alcançar a linha que a separa da tela
      // vizinha, o cadeado trava na mão e volta sozinho.
      if (wantX < lim.x0 || wantX > lim.x1 || wantY < lim.y0 || wantY > lim.y1) {
        snapHome(e);
        return;
      }
      st.x = wantX;
      st.y = wantY;
    };
    const onUp = (e: PointerEvent) => {
      if (!st.drag) return;
      st.drag = false;
      // A velocidade do arrasto vira impulso da mola: o cadeado é "arremessado" de volta.
      st.vx = clamp(st.velX, -2400, 2400);
      st.vy = clamp(st.velY, -2400, 2400);
      if (wrap.hasPointerCapture(e.pointerId)) wrap.releasePointerCapture(e.pointerId);
      wrap.style.zIndex = "";
    };

    wrap.addEventListener("pointerenter", onEnter);
    wrap.addEventListener("pointerleave", onLeave);
    wrap.addEventListener("pointerdown", onDown);
    wrap.addEventListener("pointermove", onMove);
    wrap.addEventListener("pointerup", onUp);
    wrap.addEventListener("pointercancel", onUp);

    return () => {
      if (raf) cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      wrap.removeEventListener("pointerenter", onEnter);
      wrap.removeEventListener("pointerleave", onLeave);
      wrap.removeEventListener("pointerdown", onDown);
      wrap.removeEventListener("pointermove", onMove);
      wrap.removeEventListener("pointerup", onUp);
      wrap.removeEventListener("pointercancel", onUp);
    };
  }, [reduced]);

  return (
    <div
      ref={wrapRef}
      className={cn("relative cursor-grab touch-none select-none active:cursor-grabbing", className)}
      role="img"
      aria-label="Cadeado 3D: passe o mouse para destravar, arraste para mover"
    >
      <canvas ref={canvasRef} className="size-full" />
    </div>
  );
}
