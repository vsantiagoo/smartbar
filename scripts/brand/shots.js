// Captura telas reais do SmartBar (site, app do hóspede, painel) via Chrome DevTools Protocol no Edge headless.
// Uso: node shots.js <pasta-saida> [base-url]   (o servidor de desenvolvimento precisa estar rodando)
// O painel usa o cookie de sessão do MODO DEMO (src/lib/config.ts), só no perfil temporário do Edge.
const { spawn } = require("child_process");
const fs = require("fs");
const path = require("path");
const OUT = process.argv[2];
const BASE = process.argv[3] || "http://localhost:3100";
const PORT = 9333;
const EDGE = "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe";
const UD = path.join(OUT, "_profile");
fs.mkdirSync(OUT, { recursive: true });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

(async () => {
  const proc = spawn(EDGE, ["--headless=new", "--disable-gpu", "--hide-scrollbars", `--remote-debugging-port=${PORT}`, `--user-data-dir=${UD}`, "about:blank"], { stdio: "ignore" });
  let target;
  for (let i = 0; i < 60 && !target; i++) {
    try { target = (await (await fetch(`http://127.0.0.1:${PORT}/json`)).json()).find((t) => t.type === "page"); } catch {}
    if (!target) await sleep(250);
  }
  if (!target) throw new Error("Edge não abriu");
  const ws = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((r) => (ws.onopen = r));
  let id = 0; const pending = new Map(); const waiters = [];
  ws.onmessage = (m) => {
    const d = JSON.parse(m.data);
    if (d.id && pending.has(d.id)) { pending.get(d.id)(d); pending.delete(d.id); }
    if (d.method) waiters.filter((w) => w.m === d.method).forEach((w) => w.r(d.params));
  };
  const send = (method, params = {}) => new Promise((r) => { const i = ++id; pending.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
  const event = (m) => new Promise((r) => waiters.push({ m, r }));
  const viewport = (width, height, dpr, mobile) => send("Emulation.setDeviceMetricsOverride", { width, height, deviceScaleFactor: dpr, mobile });
  const go = async (url) => { const e = event("Page.loadEventFired"); await send("Page.navigate", { url }); await e; await sleep(2500); };
  const scroll = async (y) => { await send("Runtime.evaluate", { expression: `window.scrollTo({top:${y},behavior:'instant'})` }); await sleep(2400); };
  const shot = async (name) => {
    const r = await send("Page.captureScreenshot", { format: "jpeg", quality: 84 });
    fs.writeFileSync(path.join(OUT, name + ".jpg"), Buffer.from(r.result.data, "base64"));
    console.log("ok", name);
  };
  await send("Page.enable"); await send("Network.enable");

  // ── Site, desktop 1440×900
  await viewport(1440, 900, 1, false);
  await go(BASE + "/");
  for (const [n, y] of [["site-1-hero", 0], ["site-2-declaracao", 880], ["site-3-como-funciona", 1290], ["site-4-resultados", 1830], ["site-5-planos", 2330], ["site-6-explorar", 3480], ["site-7-produto", 4100], ["site-8-rodape", 6000]]) { await scroll(y); await shot(n); }

  // ── Site, celular 390×844
  await viewport(390, 844, 2, true);
  await go(BASE + "/");
  await shot("site-m-1-hero");
  await scroll(900); await shot("site-m-2-declaracao");

  // ── App do hóspede (celular)
  await go(BASE + "/h/hotel-aurora/q/aurora-101");
  await shot("guest-1-vitrine");
  await scroll(650); await shot("guest-2-lista");

  // ── Login e painel (desktop), sessão demo
  await viewport(1440, 900, 1, false);
  await go(BASE + "/admin/login");
  await shot("admin-1-login");
  await send("Network.setCookie", { name: "smartbar_demo_admin", value: "1", url: BASE + "/" });
  await go(BASE + "/admin");
  await shot("admin-2-visao-geral");
  await scroll(700); await shot("admin-3-visao-geral-baixo");
  await go(BASE + "/admin/quartos");
  await shot("admin-4-quartos");
  await go(BASE + "/admin/reposicao");
  await shot("admin-5-reposicao");

  ws.close(); proc.kill();
  await sleep(500);
  try { fs.rmSync(UD, { recursive: true, force: true }); } catch {}
})().catch((e) => { console.error(e); process.exit(1); });
