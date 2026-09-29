// Gera os SVGs da logo SmartBar 2.0 (mesma geometria/CSS de src/components/ui/logo.tsx + globals.css)
// e as páginas de renderização 4K. Uso: node gen.js <pasta-public-logo> <pasta-render>
const fs = require("fs");
const path = require("path");
const [, , OUT, RENDER] = process.argv;
const TP = JSON.parse(fs.readFileSync(path.join(__dirname, "text-paths.json"), "utf8"));

const TONES = {
  dark: { ink: "#f2f5fa", label: "para fundos escuros" },
  light: { ink: "#1b3a6b", label: "para fundos claros" },
};
const BLUE = "#4da3ff";
const HALO = "48 139 255";
const STOPS = [[0, 0.9], [0.177, 0.62], [0.29, 0.4], [0.363, 0.354], [0.46, 0.275], [0.556, 0.2], [0.653, 0.133], [0.75, 0.083], [0.847, 0.046], [1, 0]];

const CSS = (slide) => `
    .sb-halo{transform-origin:65.2px 50px;animation:sb-pulse 2s ease-in-out infinite}
    @keyframes sb-pulse{0%,100%{transform:scale(1)}50%{transform:scale(2.1)}}
    .sb-intro .sb-box{stroke-dasharray:1;animation:sb-draw .5s cubic-bezier(.45,0,.25,1) .09s both}
    .sb-intro .sb-line{stroke-dasharray:1;animation:sb-draw .16s ease-out .62s both}
    .sb-intro .sb-dot{transform-origin:65.2px 50px;animation:sb-pop .28s cubic-bezier(.2,.9,.3,1.25) .9s both}
    .sb-intro .sb-halo{animation:sb-flash .55s ease-in-out .9s both,sb-pulse 2s ease-in-out 1.75s infinite}
    .sb-intro .sb-word{animation:sb-slide .55s cubic-bezier(.16,.84,.3,1) 1.15s both}
    @keyframes sb-draw{from{stroke-dashoffset:1}to{stroke-dashoffset:0}}
    @keyframes sb-pop{from{transform:scale(0);opacity:0}to{transform:scale(1);opacity:1}}
    @keyframes sb-flash{0%{transform:scale(.4);opacity:0}55%{transform:scale(1.5);opacity:1}100%{transform:scale(1);opacity:1}}
    @keyframes sb-slide{from{opacity:0;transform:translateX(-${slide}px)}to{opacity:1;transform:none}}
`;

// Ícone em unidades 0–100 (lado externo do contorno = 100)
function icon(id, ink) {
  const stops = STOPS.map(([o, a]) => `<stop offset="${o}" stop-color="rgb(${HALO})" stop-opacity="${a}"/>`).join("");
  return `<defs><radialGradient id="${id}" gradientUnits="userSpaceOnUse" cx="65.2" cy="50" r="26.9">${stops}</radialGradient></defs>
  <circle class="sb-halo" cx="65.2" cy="50" r="26.9" fill="url(#${id})"/>
  <rect class="sb-box" pathLength="1" x="2.275" y="2.275" width="95.45" height="95.45" rx="14.7" fill="none" stroke="${ink}" stroke-width="4.55" stroke-linecap="round"/>
  <line class="sb-line" pathLength="1" x1="40.4" y1="16.95" x2="40.4" y2="83.05" stroke="${ink}" stroke-width="3.05" stroke-linecap="round"/>
  <g class="sb-dot"><circle cx="65.2" cy="50" r="7.6" fill="#76b6fc"/><circle cx="65.2" cy="50" r="3.5" fill="#e1eeff"/></g>`;
}

// Estático (sem <style>): sem animação as classes não fazem nada; halo em repouso
function iconSvg(tone, animated, size) {
  const { ink } = TONES[tone];
  const dim = size ? ` width="${size}" height="${size}"` : "";
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"${dim}${animated ? ' class="sb-intro"' : ""} overflow="visible">
${animated ? `  <style>${CSS(0)}</style>\n` : ""}  ${icon("sbh", ink)}
</svg>
`;
}

// Lockup 1040×280 (mesmo enquadramento do PNG de referência): ícone 230 em (25,25); texto Arial Bold 146,6 px
function logoSvg(tone, animated, width) {
  const { ink } = TONES[tone];
  const dim = width ? ` width="${width}" height="${Math.round((width * 280) / 1040)}"` : "";
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1040 280"${dim}${animated ? ' class="sb-intro"' : ""} overflow="visible">
${animated ? `  <style>${CSS(44)}</style>\n` : ""}  <svg x="25" y="25" width="230" height="230" viewBox="0 0 100 100" overflow="visible">
  ${icon("sbh", ink)}
  </svg>
  <g class="sb-word"><path fill="${ink}" d="${TP.smart}"/><path fill="${BLUE}" d="${TP.bar}"/></g>
</svg>
`;
}

fs.mkdirSync(OUT, { recursive: true });
fs.mkdirSync(RENDER, { recursive: true });
for (const t of Object.keys(TONES)) {
  fs.writeFileSync(path.join(OUT, `smartbar-icon-${t}.svg`), iconSvg(t, false));
  fs.writeFileSync(path.join(OUT, `smartbar-logo-${t}.svg`), logoSvg(t, false));
  // versões dimensionadas em 4K só para renderização de PNG
  fs.writeFileSync(path.join(RENDER, `icon-${t}-4k.svg`), iconSvg(t, false, 3840));
  fs.writeFileSync(path.join(RENDER, `logo-${t}-4k.svg`), logoSvg(t, false, 3840));
}
fs.writeFileSync(path.join(OUT, "smartbar-logo-animated-dark.svg"), logoSvg("dark", true));
fs.writeFileSync(path.join(OUT, "smartbar-icon-animated-dark.svg"), iconSvg("dark", true));

// Página de um quadro do vídeo 4K: fundo escuro 3840×2160, lockup centralizado (largura 2600), animação congelada em ?t=ms
const inner = logoSvg("dark", true, 2600).replace(/^<svg /, '<svg style="display:block;transform:translateX(75px)" ');
fs.writeFileSync(
  path.join(RENDER, "frame.html"),
  `<!doctype html><html><head><meta charset="utf-8"><style>html,body{margin:0;background:#090a0f;width:3840px;height:2160px;overflow:hidden}
body{display:flex;align-items:center;justify-content:center}</style></head><body>${inner}
<script>const t=+new URLSearchParams(location.search).get("t")||0;document.getAnimations().forEach(a=>{a.pause();a.currentTime=t;});</script></body></html>`
);
console.log("gerado em", OUT, "e", RENDER);
