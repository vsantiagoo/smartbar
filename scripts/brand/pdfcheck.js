// Confere um PDF de verdade: renderiza cada página com pdf.js num Edge headless e mede a fração de "tinta".
// Uso: node pdfcheck.js <nome-em-public/_check> ...   (ex.: id.pdf ds.pdf)
const { spawn } = require("child_process");
const path = require("path");
const EDGE = "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe";
const PORT = 9444;
const UD = path.join(process.env.TEMP || ".", "sb-pdfcheck-profile");
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
(async () => {
  const proc = spawn(EDGE, ["--headless=new", "--disable-gpu", `--remote-debugging-port=${PORT}`, `--user-data-dir=${UD}`, "about:blank"], { stdio: "ignore" });
  let target;
  for (let i = 0; i < 60 && !target; i++) { try { target = (await (await fetch(`http://127.0.0.1:${PORT}/json`)).json()).find((t) => t.type === "page"); } catch {} if (!target) await sleep(250); }
  const ws = new WebSocket(target.webSocketDebuggerUrl); await new Promise((r) => (ws.onopen = r));
  let id = 0; const pend = new Map();
  ws.onmessage = (m) => { const d = JSON.parse(m.data); if (d.id && pend.has(d.id)) { pend.get(d.id)(d); pend.delete(d.id); } };
  const send = (method, params = {}) => new Promise((r) => { const i = ++id; pend.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
  const ev = async (expression) => (await send("Runtime.evaluate", { expression, returnByValue: true })).result.result.value;
  for (const f of process.argv.slice(2)) {
    await send("Page.navigate", { url: `http://localhost:3100/_check/view.html?f=/_check/${f}` });
    let t = "";
    for (let i = 0; i < 240; i++) { await sleep(1000); t = await ev("document.title"); if (/^(pronto|erro)/.test(t || "")) break; }
    const ink = await ev("JSON.stringify(window.__ink||[])");
    const arr = JSON.parse(ink || "[]").map(Number);
    console.log(f, "|", t, "| páginas:", arr.length, "| menor tinta:", Math.min(...arr).toFixed(1) + "%", "| por página:", arr.join(" "));
  }
  ws.close(); proc.kill();
})();
