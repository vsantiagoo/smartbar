// Gera SmartBar-DNA-da-Marca.html e SmartBar-Design-System.html a partir dos arquivos do DS (ds/project).
// Uso: node build-docs.js <ds/project> <public/logo> <saida>
const fs = require("fs");
const path = require("path");
const [, , DS, LOGO, OUT] = process.argv;
fs.mkdirSync(OUT, { recursive: true });
const rd = (p) => fs.readFileSync(p, "utf8");
const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/* ───────── markdown mínimo ───────── */
function inline(s) {
  return esc(s)
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/(^|[^*])\*([^*\n]+)\*/g, "$1<em>$2</em>");
}
function md(src, { h1 = true, shift = 0 } = {}) {
  const lines = src.replace(/\r/g, "").split("\n");
  const out = [];
  let i = 0;
  const flushPara = (buf) => { if (buf.length) out.push(`<p>${inline(buf.join(" "))}</p>`); };
  let para = [];
  while (i < lines.length) {
    const l = lines[i];
    if (/^```/.test(l)) {
      flushPara(para); para = [];
      const code = []; i++;
      while (i < lines.length && !/^```/.test(lines[i])) code.push(lines[i++]);
      i++; out.push(`<pre><code>${esc(code.join("\n"))}</code></pre>`); continue;
    }
    const h = /^(#{1,4}) (.*)$/.exec(l);
    if (h) {
      flushPara(para); para = [];
      const lvl = Math.min(6, h[1].length + shift);
      if (h[1].length === 1 && !h1) { i++; continue; }
      out.push(`<h${lvl}>${inline(h[2])}</h${lvl}>`); i++; continue;
    }
    if (/^\|/.test(l) && /^\|[\s:|-]+\|?$/.test(lines[i + 1] || "")) {
      flushPara(para); para = [];
      const cells = (r) => r.replace(/^\||\|$/g, "").split("|").map((c) => c.trim());
      const head = cells(l); i += 2;
      const rows = [];
      while (i < lines.length && /^\|/.test(lines[i])) rows.push(cells(lines[i++]));
      out.push(`<table><thead><tr>${head.map((c) => `<th>${inline(c)}</th>`).join("")}</tr></thead><tbody>${rows.map((r) => `<tr>${r.map((c) => `<td>${inline(c)}</td>`).join("")}</tr>`).join("")}</tbody></table>`);
      continue;
    }
    if (/^> ?/.test(l)) {
      flushPara(para); para = [];
      const q = [];
      while (i < lines.length && /^> ?/.test(lines[i])) q.push(lines[i++].replace(/^> ?/, ""));
      out.push(`<blockquote>${inline(q.join(" "))}</blockquote>`); continue;
    }
    if (/^(- |\d+\. )/.test(l)) {
      flushPara(para); para = [];
      const ordered = /^\d+\./.test(l);
      const items = [];
      while (i < lines.length && (/^(- |\d+\. )/.test(lines[i]) || /^  +\S/.test(lines[i]))) {
        if (/^  +\S/.test(lines[i])) items[items.length - 1] += " " + lines[i].trim();
        else items.push(lines[i].replace(/^(- |\d+\. )/, ""));
        i++;
      }
      out.push(`<${ordered ? "ol" : "ul"}>${items.map((t) => `<li>${inline(t)}</li>`).join("")}</${ordered ? "ol" : "ul"}>`);
      continue;
    }
    if (!l.trim()) { flushPara(para); para = []; i++; continue; }
    para.push(l.trim()); i++;
  }
  flushPara(para);
  return out.join("\n");
}

/* ───────── CSS compartilhado ───────── */
const CSS = `
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html{font-size:14.5px;-webkit-print-color-adjust:exact;print-color-adjust:exact}
body{font-family:system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;color:#2d3d34;background:#fff;line-height:1.6}
@page{size:A4;margin:16mm 18mm 18mm 18mm}
@page cover{size:A4;margin:0}
.cover{page:cover;width:210mm;height:296mm;background:#090a0f;color:#fff;position:relative;overflow:hidden;display:flex;flex-direction:column;justify-content:flex-end;padding:22mm 20mm 20mm;break-after:page}
.cover::before{content:"";position:absolute;inset:0;background:radial-gradient(circle at 78% 18%,rgba(48,139,255,.22),transparent 45%),radial-gradient(circle at 12% 92%,rgba(243,146,0,.10),transparent 40%)}
.cover>*{position:relative}
.cover .lg{width:112mm;height:auto;display:block;margin-bottom:16mm}
.cover .tag{display:inline-block;align-self:flex-start;border:1px solid rgba(243,146,0,.5);color:#f39200;border-radius:999px;padding:3px 13px;font-size:.72rem;font-weight:700;letter-spacing:.07em;text-transform:uppercase;margin-bottom:6mm}
.cover h1{color:#fff;font-size:2.7rem;line-height:1.05;letter-spacing:-.03em;font-weight:800;margin-bottom:5mm;max-width:150mm}
.cover p{color:rgba(255,255,255,.66);font-size:1.02rem;max-width:130mm}
.cover .ver{position:absolute;top:14mm;right:20mm;font-size:.72rem;letter-spacing:.06em;color:rgba(255,255,255,.35)}
main{max-width:178mm;margin:0 auto}
h1{font-size:1.9rem;letter-spacing:-.02em;color:#1b3a6b;margin:0 0 3mm}
h2{font-size:1.32rem;letter-spacing:-.015em;color:#1b3a6b;margin:8mm 0 2.5mm;break-after:avoid}
h3{font-size:1.02rem;color:#2d3d34;margin:5mm 0 2mm;break-after:avoid}
h4{font-size:.9rem;color:#5b6861;margin:4mm 0 1.5mm}
p{margin-bottom:2.6mm;font-size:.9rem}
ul,ol{margin:0 0 3mm 5.5mm;font-size:.9rem}li{margin-bottom:1.2mm}
blockquote{border-left:3px solid #f39200;background:#fdf7ec;margin:3mm 0 4mm;padding:3mm 4mm;font-size:1.05rem;font-weight:600;color:#1b3a6b;break-inside:avoid}
code{font-family:ui-monospace,Consolas,monospace;font-size:.78rem;background:#f1f4f2;border-radius:4px;padding:1px 5px;color:#1b3a6b}
pre{background:#0e1626;color:#e6edf7;border-radius:8px;padding:3mm 4mm;margin:2mm 0 3.5mm;overflow:hidden;break-inside:avoid}pre code{background:none;color:inherit;padding:0}
table{width:100%;border-collapse:collapse;margin:2mm 0 4mm;font-size:.82rem;break-inside:avoid}
th{text-align:left;font-size:.68rem;letter-spacing:.05em;text-transform:uppercase;color:#89928d;padding:4px 8px;border-bottom:1.5px solid #dfe5e1}
td{padding:5px 8px;border-bottom:1px solid #eef1ee;vertical-align:top}
.sec{break-before:page}
.comp{border:1px solid #dfe5e1;border-radius:12px;overflow:hidden;margin:0 0 6mm}
.comp-head{background:#f6f8f6;padding:3mm 4.5mm;display:flex;justify-content:space-between;gap:8px;align-items:baseline}
.comp-head b{color:#1b3a6b;font-size:1.02rem}.comp-head span{font-size:.72rem;color:#89928d}
.comp iframe{display:block;width:100%;border:0;background:#fff}
.comp .body{padding:3mm 4.5mm}
.strip{display:flex;gap:0;margin:2mm 0 3mm;border-radius:8px;overflow:hidden;border:1px solid #dfe5e1}
.strip div{flex:1;height:34px;font-size:.55rem;display:flex;align-items:flex-end;justify-content:center;padding-bottom:2px;font-weight:600}
.sw{display:inline-block;width:14px;height:14px;border-radius:4px;border:1px solid rgba(0,0,0,.1);vertical-align:-3px;margin-right:6px}
.sp{display:flex;align-items:center;gap:8px;padding:2px 0;font-size:.8rem}.sp i{display:block;height:9px;background:#1b3a6b;border-radius:3px}
.rd{display:inline-block;width:44px;height:30px;background:#eaf0f8;border:1px solid #b6c0cf;margin-right:8px;vertical-align:middle}
.ty{padding:3px 0;border-bottom:1px solid #eef1ee;display:flex;gap:10px;align-items:baseline}.ty small{width:92px;flex:none;color:#89928d;font-size:.68rem;font-weight:600}
`;
const wrap = (title, body) => `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><title>${title}</title><style>${CSS}</style></head><body>${body}</body></html>`;
const logoSvg = rd(path.join(LOGO, "smartbar-logo-dark.svg")).replace(/^<svg /, '<svg class="lg" ');
const cover = (tag, title, lead) => `<section class="cover"><span class="ver">v1.1 · 2026</span>${logoSvg}<span class="tag">${tag}</span><h1>${title}</h1><p>${lead}</p></section>`;

/* ───────── DNA ───────── */
const dnaMd = rd(path.join(DS, "dna-da-marca.md"));
fs.writeFileSync(
  path.join(OUT, "SmartBar-DNA-da-Marca.html"),
  wrap("SmartBar — DNA da marca", cover("DNA da marca", "Consumo sem atrito.", "Essência, promessa, slogan, voz e identidade — extraídos do que o site já diz e faz.") + `<main class="sec">${md(dnaMd, { h1: false })}</main>`)
);

/* ───────── Design System ───────── */
const tokens = JSON.parse(rd(path.join(DS, "tokens.json")));
const cssVars = ":root{" + [
  ...tokens.color.tokens.map((t) => `--${t.name}:${t.value}`),
  ...tokens.radius.tokens.map((t) => `--${t.name}:${t.value}`),
  ...tokens.spacing.tokens.map((t) => `--space-${t.name.replace("space-", "").replace(".", "_")}:${t.value}`),
].join(";") + "}";
const lum = (hex) => { const n = parseInt(hex.slice(1), 16); return (0.299 * (n >> 16) + 0.587 * ((n >> 8) & 255) + 0.114 * (n & 255)) / 255; };

const fams = ["brand", "crimson", "gold", "ok", "danger"];
let colors = "";
for (const f of fams) {
  const steps = tokens.color.tokens.filter((t) => t.name.startsWith(f + "-"));
  colors += `<h3>${f}</h3><div class="strip">${steps.map((t) => `<div style="background:${t.value};color:${lum(t.value) > 0.6 ? "#2d3d34" : "#fff"}">${t.name.split("-")[1]}</div>`).join("")}</div>`;
  const key = steps.filter((t) => !/^Passo/.test(t.usage));
  colors += `<table><thead><tr><th>Token</th><th>Hex</th><th>Uso</th></tr></thead><tbody>${key.map((t) => `<tr><td><span class="sw" style="background:${t.value}"></span><code>${t.name}</code></td><td>${t.value.toUpperCase()}</td><td>${esc(t.usage)}</td></tr>`).join("")}</tbody></table>`;
}
const others = tokens.color.tokens.filter((t) => !fams.some((f) => t.name.startsWith(f + "-")));
colors += `<h3>Neutros, fundo e logotipo</h3><table><thead><tr><th>Token</th><th>Hex</th><th>Uso</th></tr></thead><tbody>${others.map((t) => `<tr><td><span class="sw" style="background:${t.value}"></span><code>${t.name}</code></td><td>${t.value.toUpperCase()}</td><td>${esc(t.usage)}</td></tr>`).join("")}</tbody></table>`;

let type = "";
for (const g of tokens.type.groups) {
  type += `<h3>${g.name}</h3>` + g.styles.map((s) => {
    const fam = tokens.type.families[s.family || g.family] || "";
    return `<div class="ty"><small>${s.name}</small><span style="font-family:${fam.replace(/"/g, "'")};font-size:${s.fontSize};font-weight:${s.fontWeight};line-height:1.15;letter-spacing:${s.letterSpacing || "0"}">${esc(s.sample || "Texto de exemplo")}</span></div><p style="font-size:.74rem;color:#5b6861;margin:1px 0 2mm">${s.fontSize} · peso ${s.fontWeight} — ${esc(s.usage)}</p>`;
  }).join("");
}
const sp = tokens.spacing.tokens.map((t) => `<div class="sp"><i style="width:${t.value}"></i><span><code>${t.name}</code> ${t.value} — ${esc(t.usage)}</span></div>`).join("");
const rad = tokens.radius.tokens.map((t) => `<tr><td><span class="rd" style="border-radius:${t.value}"></span><code>${t.name}</code></td><td>${t.value}</td><td>${esc(t.usage)}</td></tr>`).join("");
const tabl = (list) => `<table><thead><tr><th>Token</th><th>Valor</th><th>Uso</th></tr></thead><tbody>${list.map((t) => `<tr><td><code>${t.name}</code></td><td style="font-size:.7rem">${esc(t.value)}</td><td>${esc(t.usage)}</td></tr>`).join("")}</tbody></table>`;

const order = ["Logo", "Button", "Badge", "Vidro", "GlassCard", "Input", "Stepper", "Segmented", "Reveal"];
const comps = order.map((n) => {
  const dir = path.join(DS, "components", n);
  const readme = rd(path.join(dir, "README.md"));
  let prev = rd(path.join(dir, "preview.html"));
  const h = /height=(\d+)/.exec(prev.split("\n")[0]);
  const height = h ? +h[1] + 12 : 220;
  prev = prev.replace(/^<!--.*?-->\n?/, "");
  const png = path.join(OUT, "prev", n + ".png");
  const shot = fs.existsSync(png) ? `<img style="display:block;width:100%" alt="Prévia do componente ${n}" src="data:image/png;base64,${fs.readFileSync(png).toString("base64")}">` : null;
  const srcdoc = ("<!doctype html><html><head><meta charset=utf-8><style>" + cssVars + "</style></head><body>" + prev + "</body></html>").replace(/&/g, "&amp;").replace(/"/g, "&quot;");
  fs.mkdirSync(path.join(OUT, "prev"), { recursive: true });
  fs.writeFileSync(path.join(OUT, "prev", n + ".html"), "<!doctype html><html><head><meta charset=utf-8><style>" + cssVars + "html,body{margin:0}</style></head><body>" + prev + "</body></html>");
  fs.writeFileSync(path.join(OUT, "prev", n + ".h"), String(height));
  const [first, ...rest] = readme.split("\n");
  return `<div class="comp"><div class="comp-head"><b>${n}</b><span>${esc(first)}</span></div>${shot || `<iframe style="height:${height}px" srcdoc="${srcdoc}"></iframe>`}<div class="body">${md(rest.join("\n"), { h1: false, shift: 2 })}</div></div>`;
}).join("");

const brandBook = md(rd(path.join(DS, "README.md")), { h1: false, shift: 0 });
fs.writeFileSync(
  path.join(OUT, "SmartBar-Design-System.html"),
  wrap("SmartBar — Design System",
    cover("Design System", "Fundações do produto SmartBar", "Tokens, componentes e regras extraídos do código que está no ar. O código manda.") +
    `<main><h1 style="margin-top:0">Brand book</h1>${brandBook}</main>
    <main class="sec"><h1>Cores</h1>${colors}</main>
    <main class="sec"><h1>Tipografia</h1>${type}</main>
    <main class="sec"><h1>Espaçamento, raios, sombras e desfoque</h1><h3>Espaçamento</h3>${sp}<h3>Raios</h3><table><thead><tr><th>Token</th><th>Valor</th><th>Uso</th></tr></thead><tbody>${rad}</tbody></table><h3>Sombras</h3>${tabl(tokens.shadow.tokens)}<h3>Desfoque</h3>${tabl(tokens.blur.tokens)}</main>
    <main class="sec"><h1>Componentes</h1>${comps}</main>
    <main class="sec"><h1>DNA da marca</h1>${md(dnaMd, { h1: false, shift: 1 })}</main>`)
);

/* ───────── Identidade visual (guia com telas reais do site) ───────── */
const idSrcPath = [path.join(DS, "identidade-visual.src.md"), path.join(DS, "..", "identidade-visual.src.md")].find((p) => fs.existsSync(p)) || "";
if (fs.existsSync(idSrcPath)) {
  const src = rd(idSrcPath);
  const FIG = /^@@figs? ([^|]*)\|(.*)@@$/;
  const FRAG = /^@@(logo|og|colors|type|spacing)@@$/;

  // 1) texto limpo para o artifact (sem marcadores)
  const clean = src.split("\n").map((l) => {
    const m = FIG.exec(l);
    if (m) return "*" + (l.startsWith("@@figs") ? "Telas: " : "Tela: ") + m[2] + "*";
    return FRAG.test(l) ? "" : l;
  }).join("\n").replace(/\n{3,}/g, "\n\n");
  fs.writeFileSync(path.join(DS, "identidade-visual.md"), clean);

  // 2) documento com figuras
  const shotsDir = path.join(OUT, "..", "shots");
  const iconsDir = path.join(OUT, "..", "icons");
  const b64 = (p, mime) => "data:" + mime + ";base64," + fs.readFileSync(p).toString("base64");
  const img = (n) => `<img src="${b64(path.join(shotsDir, n + ".jpg"), "image/jpeg")}" alt="${n}">`;
  const fig = (names, cap) => `<figure class="fig${names.length > 1 ? " row" + names.length : ""}">${names.map(img).join("")}<figcaption>${inline(cap)}</figcaption></figure>`;
  const chip = (t) => `<div style="background:${t.value};color:${lum(t.value) > 0.6 ? "#2d3d34" : "#fff"}">${t.name.split("-").slice(-1)[0]}<br>${t.value.slice(1).toUpperCase()}</div>`;
  const compactColors = fams.map((f) => {
    const steps = tokens.color.tokens.filter((t) => t.name.startsWith(f + "-"));
    return `<div class="cs"><b>${f}</b><div class="strip">${steps.map(chip).join("")}</div></div>`;
  }).join("") + `<h3>Neutros, fundo e logotipo</h3><div class="strip big">${others.map((t) => `<div style="background:${t.value};color:${lum(t.value) > 0.6 ? "#2d3d34" : "#fff"}">${t.name}<br>${t.value.slice(1).toUpperCase()}</div>`).join("")}</div>`;
  const wanted = ["display", "title-3", "title-5", "body", "body-sm", "caption", "button-md", "wordmark", "stat-number"];
  const typeCompact = wanted.map((n) => {
    for (const g of tokens.type.groups) for (const st of g.styles) if (st.name === n) {
      const fam = (tokens.type.families[st.family || g.family] || "").replace(/"/g, "'");
      return `<div class="ty"><small>${st.name}</small><span style="font-family:${fam};font-size:${st.fontSize};font-weight:${st.fontWeight};line-height:1.15;letter-spacing:${st.letterSpacing || "0"}">${esc(st.sample || "Texto de exemplo")}</span></div><p style="font-size:.72rem;color:#5b6861;margin:1px 0 2mm">${st.fontSize} · peso ${st.fontWeight} — ${esc(st.usage)}</p>`;
    }
    return "";
  }).join("");
  const icon = (f, w, extra = "") => `<img src="${b64(path.join(iconsDir, f), "image/png")}" alt="" style="width:${w};${extra}">`;
  const frag = {
    logo: `<figure class="fig"><img src="${b64(path.join(OUT, "prev", "Logo.png"), "image/png")}" alt="Logotipo"><figcaption>Logotipo: fundo escuro, fundo claro e só o ícone (celular).</figcaption></figure>`,
    og: `<figure class="fig"><img src="${b64(path.join(iconsDir, "opengraph-image.png"), "image/png")}" alt="Imagem de compartilhamento"><figcaption>Imagem de compartilhamento (1200×630) e ícones de aba e de tela inicial.</figcaption><div class="icons">${icon("icon-512.png", "16mm")}${icon("apple-icon.png", "16mm", "border-radius:4mm")}${icon("icon-512.png", "8mm")}${icon("icon-512.png", "4mm")}</div></figure>`,
    colors: compactColors,
    type: typeCompact,
    spacing: `<h3>Espaçamento e raios</h3>${sp}<table><thead><tr><th>Raio</th><th>Valor</th><th>Uso</th></tr></thead><tbody>${rad}</tbody></table>`,
  };
  const slots = [];
  const marked = src.split("\n").map((l) => {
    let m = FIG.exec(l);
    if (m) { slots.push(fig(m[1].split(",").map((x) => x.trim()), m[2])); return "SLOT" + (slots.length - 1) + "X"; }
    m = FRAG.exec(l);
    if (m) { slots.push(frag[m[1]]); return "SLOT" + (slots.length - 1) + "X"; }
    return l;
  }).join("\n");
  const body = md(marked, { h1: false }).replace(/<p>SLOT(\d+)X<\/p>/g, (_, i) => slots[+i]);
  const extra = ".fig{margin:3mm 0 5mm;break-inside:avoid}.fig img{display:block;width:100%;border:1px solid #dfe5e1;border-radius:8px}.fig figcaption{font-size:.74rem;color:#5b6861;margin-top:1.5mm}.fig.row2{display:grid;grid-template-columns:repeat(2,1fr);gap:3mm;max-width:110mm}.fig.row2 figcaption{grid-column:1/-1}.icons{display:flex;gap:6mm;align-items:flex-end;margin-top:3mm;padding:3mm;background:#dee2ea;border-radius:8px}.icons img{border:0!important;border-radius:0}.cs{margin:0 0 2mm}.cs b{font-size:.75rem;text-transform:uppercase;letter-spacing:.05em;color:#5b6861}.strip.big{flex-wrap:wrap;border:0;gap:2px}.strip.big div{flex:1 1 22%;height:42px}.strip div{text-align:center;font-size:.5rem;line-height:1.15}";
  const cov = cover("Identidade visual", "Marca e site.", "Logotipo, cor, tipografia, forma, imagem, movimento e as telas reais do site — em um guia só.");
  fs.writeFileSync(path.join(OUT, "SmartBar-Identidade-Visual.html"), wrap("SmartBar — Identidade visual", cov + `<main class="sec">${body}</main>`).replace("</style>", extra + "</style>"));
  console.log("Identidade visual gerada.");
}

console.log("HTMLs gerados em", OUT);
