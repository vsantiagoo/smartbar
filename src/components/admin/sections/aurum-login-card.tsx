"use client";

/**
 * AurumLoginCard — card "vidro preto" com rastro de luz na borda, adaptado do
 * protótipo AurumLogin para o painel do SmartBar.
 *
 * O que mudou em relação ao protótipo original:
 *
 *  • TOKENS: os aliases `--sb-*` agora apontam para o DESIGN SYSTEM do
 *    SmartBar (brand/gold/ink/sky). O tema ainda reage ao localStorage e aos
 *    overrides por hotel, porque as variáveis que consumimos (--brand-700,
 *    --gold-500 etc.) são as mesmas que `theme.ts` injeta.
 *  • EYEBROW: o "• Aurum" vira um bloco com o LOGO animado do SmartBar em
 *    tamanho pequeno + "Aurum · SmartBar" com o mesmo text-shadow glow do
 *    botão "Entrar" da barra de menu (site-header.tsx).
 *  • SUBMIT: o Aurum original expunha um `onSubmit({ username, password })`.
 *    Aqui plugamos direto na Server Action `loginAction` do SmartBar via
 *    `useActionState` + `<form action={action}>` nativo, preservando o fluxo
 *    de erro ("admin.login.error") que o form legado já falava. O campo
 *    `name="username"` vira `name="email"` para bater com o loginAction.
 *  • i18n: todos os labels passam a vir do dicionário via `useI18n`.
 *
 * Não copiei nada que não fosse estritamente necessário — o CSS e a animação
 * do Aurum ficam intactos (tudo que depende de refs e cálculos de layout).
 */

import {
  useActionState,
  useEffect,
  useRef,
  type CSSProperties,
} from "react";
import { loginAction, type LoginState } from "@/app/admin/actions";
import { LogoMark } from "@/components/ui/logo";
import { useI18n } from "@/lib/i18n/client";

export interface AurumLoginCardProps {
  demoEmail?: string;
  demoPassword?: string;
  className?: string;
  style?: CSSProperties;
}

/** Mesmo glow do botão "Entrar" do site-header (text-shadow branco + azul). */
const GLOW_SHADOW =
  "0 0 8px rgb(255 255 255 / 0.9), 0 0 18px rgb(140 200 255 / 0.75)";

export function AurumLoginCard({
  demoEmail,
  demoPassword,
  className = "",
  style,
}: AurumLoginCardProps) {
  const { t } = useI18n();
  const [state, formAction, pending] = useActionState<LoginState, FormData>(loginAction, {
    error: null,
  });
  const rootRef = useRef<HTMLDivElement>(null);

  // Toda a animação de abrir/fechar + rastro de luz vive aqui. Os IDs e
  // seletores são internos ao componente; nada escapa do escopo `.aurum`.
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const CUT = 46,
      SEAM = 6,
      R = 15,
      RT = 13,
      TIP = CUT - SEAM * Math.SQRT2,
      GAP = 1.7;
    root.style.setProperty("--cut", CUT + "px");
    root.style.setProperty("--seam", SEAM + "px");

    const $ = <T extends Element = HTMLElement>(sel: string) =>
      root.querySelector(sel) as T | null;

    const scene = $(".au-scene") as HTMLElement;
    const tilt = $(".au-tilt") as HTMLElement;
    const viewport = $(".au-viewport") as HTMLElement;
    const tipTL = $(".au-tip-tl") as HTMLElement;
    const tipBR = $(".au-tip-br") as HTMLElement;
    const outlinePaths = root.querySelectorAll<SVGPathElement>(".au-outline path");
    const paneIdle = $('[data-pane="idle"]') as HTMLElement;
    const paneLogin = $('[data-pane="login"]') as HTMLElement;
    const PANES: Record<string, HTMLElement> = { idle: paneIdle, login: paneLogin };
    const WIDTH: Record<string, number> = { idle: 260, login: 340 };
    const H: Record<string, number> = {};
    let current = "idle",
      want = "idle",
      busy = false;

    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const wait = (ms: number) => new Promise((r) => setTimeout(r, reduce ? 0 : ms));

    function framePath(w: number, h: number) {
      const o = 0.5,
        c = CUT,
        r = R,
        W = w - o,
        Hh = h - o;
      return `M${c},${o} L${W - r},${o} A${r},${r} 0 0 1 ${W},${o + r} L${W},${Hh - c} L${W - c},${Hh} L${o + r},${Hh} A${r},${r} 0 0 1 ${o},${Hh - r} L${o},${c} Z`;
    }
    function tipPaths() {
      const s = TIP,
        o = 0.5,
        k = RT;
      const tl = `M${s},${o} L${k},${o} A${k},${k} 0 0 0 ${o},${k} L${o},${s} Z`;
      const br = `M${o},${s - o} L${s - k},${s - o} A${k},${k} 0 0 0 ${s - o},${s - k} L${s - o},${o} Z`;
      tipTL.querySelectorAll("path").forEach((p) => p.setAttribute("d", tl));
      tipBR.querySelectorAll("path").forEach((p) => p.setAttribute("d", br));
    }

    const S = { p: 1 };
    scene.classList.add("au-joined");
    let lw = -1,
      lh = -1,
      lp = -1,
      rafId = 0;
    function loop() {
      const w = tilt.offsetWidth,
        h = tilt.offsetHeight;
      if (w !== lw || h !== lh) {
        const d = framePath(w, h);
        outlinePaths.forEach((p) => p.setAttribute("d", d));
      }
      if (w !== lw || h !== lh || S.p !== lp) {
        const dx = (w / 2 - TIP / 2 - GAP) * S.p,
          dy = (h / 2 - TIP / 2 - GAP) * S.p;
        tipTL.style.transform = `translate3d(${dx}px,${dy}px,0)`;
        tipBR.style.transform = `translate3d(${-dx}px,${-dy}px,0)`;
      }
      lw = w;
      lh = h;
      lp = S.p;
      rafId = requestAnimationFrame(loop);
    }
    const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
    function tween(to: number, dur: number) {
      return new Promise<void>((res) => {
        const from = S.p,
          t0 = performance.now();
        if (reduce) {
          S.p = to;
          return res();
        }
        (function f(now: number) {
          const k = Math.min(1, (now - t0) / dur);
          S.p = from + (to - from) * ease(k);
          if (k < 1) requestAnimationFrame(f);
          else res();
        })(t0);
      });
    }

    function maxWidth() {
      const pad = parseFloat(getComputedStyle(root as Element).paddingLeft) || 16;
      return Math.max(220, root!.clientWidth - pad * 2 || window.innerWidth);
    }
    function size(k: string) {
      scene.style.width = Math.min(WIDTH[k] ?? 0, maxWidth()) + "px";
      viewport.style.height = (H[k] ?? 0) + "px";
    }
    function measure() {
      if (busy) return;
      scene.classList.add("au-no-anim");
      for (const k of Object.keys(PANES)) {
        const pane = PANES[k];
        if (!pane) continue;
        scene.style.width = Math.min(WIDTH[k] ?? 0, maxWidth()) + "px";
        for (const kk of Object.keys(PANES)) PANES[kk]?.classList.remove("on");
        pane.style.visibility = "hidden";
        pane.classList.add("on");
        void scene.offsetWidth;
        H[k] = pane.offsetHeight;
        pane.classList.remove("on");
        pane.style.visibility = "";
      }
      PANES[current]?.classList.add("on");
      size(current);
      void scene.offsetWidth;
      scene.classList.remove("au-no-anim");
    }

    async function openPane() {
      paneIdle.classList.add("hide");
      await wait(140);
      paneIdle.classList.remove("on", "hide");
      paneLogin.classList.add("on", "hide");
      size("login");
      await wait(480);
      scene.classList.remove("au-joined");
      await tween(0, 520);
      paneLogin.classList.remove("hide");
      await wait(260);
      current = "login";
    }
    async function closePane() {
      paneLogin.classList.add("hide");
      await wait(170);
      await tween(1, 520);
      scene.classList.add("au-joined");
      paneLogin.classList.remove("on", "hide");
      paneIdle.classList.add("on", "hide");
      size("idle");
      await wait(520);
      paneIdle.classList.remove("hide");
      await wait(200);
      current = "idle";
    }
    async function runState() {
      if (busy) return;
      busy = true;
      while (current !== want) {
        if (want === "login") await openPane();
        else await closePane();
      }
      busy = false;
    }

    // ─── interação ───
    const openBtn = $(".au-hint") as HTMLButtonElement | null;
    const peekBtn = $(".au-eye") as HTMLButtonElement | null;
    const pass = $('input[name="password"]') as HTMLInputElement | null;

    let hovering = false;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const inUse = () =>
      scene.contains(document.activeElement) && document.activeElement !== openBtn;
    function show() {
      clearTimeout(timer);
      want = "login";
      runState();
    }
    function maybeHide(delay: number) {
      clearTimeout(timer);
      timer = setTimeout(() => {
        if (hovering || inUse()) return;
        want = "idle";
        runState();
      }, delay);
    }
    const onEnter = (e: PointerEvent) => {
      if (e.pointerType === "mouse") {
        hovering = true;
        show();
      }
    };
    const onLeave = (e: PointerEvent) => {
      if (e.pointerType === "mouse") {
        hovering = false;
        maybeHide(450);
      }
    };
    const onFocusIn = () => show();
    const onFocusOut = () => maybeHide(250);
    const onSceneClick = () => show();
    const onDocDown = (e: PointerEvent) => {
      if (!scene.contains(e.target as Node)) {
        if (document.activeElement && scene.contains(document.activeElement))
          (document.activeElement as HTMLElement).blur();
        maybeHide(120);
      }
    };

    scene.addEventListener("pointerenter", onEnter);
    scene.addEventListener("pointerleave", onLeave);
    scene.addEventListener("focusin", onFocusIn);
    scene.addEventListener("focusout", onFocusOut);
    openBtn?.addEventListener("click", onSceneClick);
    scene.addEventListener("click", onSceneClick);
    document.addEventListener("pointerdown", onDocDown);

    const onPeek = () => {
      if (!pass) return;
      pass.type = pass.type === "password" ? "text" : "password";
      if (peekBtn) peekBtn.style.color = pass.type === "text" ? "var(--gold-hi)" : "";
    };
    peekBtn?.addEventListener("click", onPeek);

    // A altura do card é fixada em px para animar; se o conteúdo muda com o card
    // aberto (troca de idioma, mensagem de erro), acompanha para não sobrar nem vazar.
    const ro = new ResizeObserver(() => {
      if (current !== "login" || busy) return;
      H.login = paneLogin.offsetHeight;
      viewport.style.height = H.login + "px";
    });
    ro.observe(paneLogin);

    // ─── parallax sutil ───
    const fine = matchMedia("(pointer:fine)").matches;
    const onMove = (e: PointerEvent) => {
      const rx = (e.clientY / window.innerHeight - 0.5) * -2.2;
      const ry = (e.clientX / window.innerWidth - 0.5) * 2.2;
      tilt.style.transform = `perspective(1400px) rotateX(${rx}deg) rotateY(${ry}deg)`;
    };
    if (fine) window.addEventListener("pointermove", onMove, { passive: true });

    // ─── init + resize ───
    tipPaths();
    let rt: ReturnType<typeof setTimeout> | undefined;
    const onResize = () => {
      clearTimeout(rt);
      rt = setTimeout(measure, 160);
    };
    window.addEventListener("resize", onResize);
    if (document.fonts?.ready) document.fonts.ready.then(measure);
    measure();
    rafId = requestAnimationFrame(loop);

    return () => {
      ro.disconnect();
      cancelAnimationFrame(rafId);
      clearTimeout(timer);
      clearTimeout(rt);
      scene.removeEventListener("pointerenter", onEnter);
      scene.removeEventListener("pointerleave", onLeave);
      scene.removeEventListener("focusin", onFocusIn);
      scene.removeEventListener("focusout", onFocusOut);
      openBtn?.removeEventListener("click", onSceneClick);
      scene.removeEventListener("click", onSceneClick);
      document.removeEventListener("pointerdown", onDocDown);
      peekBtn?.removeEventListener("click", onPeek);
      if (fine) window.removeEventListener("pointermove", onMove);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <div ref={rootRef} className={`aurum ${className}`} style={style}>
      <style>{CSS}</style>

      <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
        <defs>
          <filter id="au-fx-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2.2" />
          </filter>
          <filter id="au-fx-soft" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="2" />
          </filter>
        </defs>
      </svg>

      <div className="au-scene">
        <div className="au-lift">
          <div className="au-tilt">
            <div className="au-ghost au-shape" />

            <div className="au-glass au-shape">
              <div className="au-grain" />

              <div className="au-viewport">
                {/* repouso */}
                <section className="au-pane on" data-pane="idle">
                  <button className="au-hint" type="button">
                    {t("admin.login.hint")}
                  </button>
                </section>

                {/* login */}
                <section className="au-pane" data-pane="login">
                  {/* Eyebrow com o LOGO do SmartBar + "Aurum · SmartBar" com o glow
                      idêntico ao botão "Entrar" da barra de menu (site-header). */}
                  <div className="au-brand">
                    <LogoMark tone="light" intro={false} className="size-5 shrink-0" />
                    <span
                      className="au-brand-txt"
                      style={{ textShadow: GLOW_SHADOW }}
                    >
                      <b>SmartBar</b>
                    </span>
                  </div>

                  <div className="au-head">
                    <h1 className="au-title">
                      <b>{t("admin.login.heading")}</b>
                    </h1>
                    <p className="au-sub">{t("admin.login.subtitle")}</p>
                  </div>

                  {/* O form submete direto para a Server Action (useActionState). */}
                  <form className="au-form" action={formAction} noValidate>
                    <div className="au-field">
                      <label className="au-lbl" htmlFor="au-email">
                        {t("admin.login.email")}
                      </label>
                      <div className="au-wrap">
                        <svg className="au-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
                          <circle cx="12" cy="8" r="4" />
                          <path d="M4 21a8 8 0 0 1 16 0" />
                        </svg>
                        <input
                          type="email"
                          id="au-email"
                          name="email"
                          required
                          defaultValue={demoEmail}
                          placeholder="voce@hotel.com.br"
                          autoComplete="username"
                        />
                      </div>
                    </div>

                    <div className="au-field">
                      <label className="au-lbl" htmlFor="au-pass">
                        {t("admin.login.password")}
                      </label>
                      <div className="au-wrap">
                        <svg className="au-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
                          <rect x="4" y="10" width="16" height="11" rx="2" />
                          <path d="M8 10V7a4 4 0 0 1 8 0v3" />
                        </svg>
                        <input
                          type="password"
                          id="au-pass"
                          name="password"
                          required
                          defaultValue={demoPassword}
                          placeholder="••••••••"
                          autoComplete="current-password"
                        />
                        <button type="button" className="au-eye" aria-label={t("admin.login.showPassword")}>
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
                            <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Z" />
                            <circle cx="12" cy="12" r="3" />
                          </svg>
                        </button>
                      </div>
                      {state.error && (
                        <p className="au-err show" role="alert">
                          {t(state.error)}
                        </p>
                      )}
                    </div>

                    <button className="au-cta" type="submit" disabled={pending}>
                      <span className="au-cta-txt">
                        {pending ? t("admin.login.loading") : t("admin.login.submit")}
                      </span>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                        <path d="M5 12h13m-5-6 6 6-6 6" />
                      </svg>
                    </button>
                  </form>
                </section>
              </div>
            </div>

            {/* pontas */}
            <div className="au-tip au-tip-tl">
              <div className="au-fill" />
              <svg>
                <path className="au-t-halo" />
                <path className="au-t-edge" />
              </svg>
            </div>
            <div className="au-tip au-tip-br">
              <div className="au-fill" />
              <svg>
                <path className="au-t-halo" />
                <path className="au-t-edge" />
              </svg>
            </div>

            {/* contorno + rastro de luz */}
            <svg className="au-outline">
              <path className="au-o-hair" pathLength="1000" />
              <path className="au-o-tail" pathLength="1000" />
              <path className="au-o-glow" pathLength="1000" />
              <path className="au-o-mid" pathLength="1000" />
              <path className="au-o-core" pathLength="1000" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ===========================================================================
   CSS escopado em `.aurum`. Os tokens --sb-* agora apontam para as variáveis
   que `theme.ts` injeta no :root — então o card herda o tema do SmartBar
   (inclusive overrides por hotel) sem configuração extra.
   =========================================================================== */
const CSS = `
.aurum{
  /* ───── TOKENS → design system do SmartBar (canais RGB) ───── */
  /* O "accent" do Aurum (rastro de luz, CTA, foco) mapeia para o BRAND do
     SmartBar — o mesmo azul do botão "Entrar" na barra de menu. Assim o
     card herda o tema do hotel: trocar --brand-* via localStorage recolore
     o card junto. */
  --sb-accent:    var(--brand-500, 48 139 255);
  --sb-accent-2:  var(--brand-300, 140 200 255);
  --sb-on-accent: 255 255 255;
  /* Tinta sobre o vidro preto: branco off, não --ink (que é verde-escuro
     no SmartBar e perde legibilidade sobre o vidro). */
  --sb-ink:       242 239 234;
  /* Superfície SEMPRE escura — o card é vidro preto; não deriva do tema. */
  --sb-surface:   8 7 6;
  --sb-border:    255 255 255;
  /* ─────────────────────────────────────────────────── */

  /* Tipografia do SmartBar: título herda --font-heading (Plus Jakarta Sans). */
  font-family: var(--font-sans, inherit);

  --gold:    rgb(var(--sb-accent));
  --gold-hi: rgb(var(--sb-accent-2));
  --ink:     rgb(var(--sb-ink));
  --ink2:    rgb(var(--sb-ink) / .50);
  --ink3:    rgb(var(--sb-ink) / .26);
  --hair:    rgb(var(--sb-border) / .07);
  --glass:   rgb(var(--sb-surface) / .76);
  --blurfx:  blur(28px) saturate(60%) brightness(.30) contrast(1.04);

  --cut:46px; --seam:6px; --r:15px;
  --spring:cubic-bezier(.34,1.26,.44,1);
  --ease:cubic-bezier(.62,0,.3,1);

  position:relative; display:grid; place-items:center;
  color:var(--ink); -webkit-font-smoothing:antialiased;
  font-family:inherit;
}
.aurum *{box-sizing:border-box}

.aurum .au-shape{
  clip-path:polygon(var(--cut) 0,100% 0,100% calc(100% - var(--cut)),
    calc(100% - var(--cut)) 100%,0 100%,0 var(--cut));
  border-radius:var(--r);
}

.aurum .au-scene{position:relative;z-index:10;width:260px;transition:width .56s var(--spring)}
.aurum .au-scene.au-no-anim, .aurum .au-scene.au-no-anim *{transition:none !important}
.aurum .au-lift{animation:au-rise 1.1s cubic-bezier(.16,1,.3,1) both}
@keyframes au-rise{from{opacity:0;transform:translateY(20px) scale(.978)}to{opacity:1;transform:none}}
.aurum .au-tilt{position:relative;transition:transform .22s ease-out}

.aurum .au-ghost{position:absolute;inset:-12px -14px;border:1px solid rgb(var(--sb-border) / .04);
  pointer-events:none;animation:au-ghost 16s ease-in-out infinite}
@keyframes au-ghost{0%,100%{transform:translate(0,0)}50%{transform:translate(5px,-4px)}}

.aurum .au-glass{position:relative;z-index:1;background:var(--glass);
  backdrop-filter:var(--blurfx);-webkit-backdrop-filter:var(--blurfx);
  padding:22px;padding-top:calc(var(--cut) * .46 + 14px);padding-bottom:20px;
  box-shadow:0 22px 58px -24px rgba(0,0,0,.92)}
.aurum .au-glass::after{content:'';position:absolute;inset:0;pointer-events:none;
  background:radial-gradient(ellipse 80% 65% at 50% 46%,rgba(0,0,0,.26),transparent 80%)}
.aurum .au-glass::before{content:'';position:absolute;inset:0;pointer-events:none;z-index:2;
  background:linear-gradient(157deg,rgb(var(--sb-border) / .05),transparent 20%),
    linear-gradient(334deg,rgb(var(--sb-accent-2) / .03),transparent 24%)}
.aurum .au-grain{position:absolute;inset:0;pointer-events:none;z-index:2;opacity:.04;mix-blend-mode:overlay;
  background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='3'/%3E%3C/filter%3E%3Crect width='160' height='160' filter='url(%23n)'/%3E%3C/svg%3E")}

.aurum .au-outline{position:absolute;left:0;top:0;width:100%;height:100%;overflow:visible;pointer-events:none;z-index:13}
.aurum .au-outline path{fill:none;stroke-linejoin:round}
.aurum .au-o-hair{stroke:rgb(var(--sb-border) / .12);stroke-width:1}
.aurum .au-o-tail,.aurum .au-o-glow,.aurum .au-o-mid,.aurum .au-o-core{stroke-linecap:round}
.aurum .au-o-tail{stroke:rgb(var(--sb-accent) / .20);stroke-width:1;stroke-dasharray:200 800;animation:au-tail 9s linear infinite}
.aurum .au-o-glow{stroke:rgb(var(--sb-accent) / .5);stroke-width:3;stroke-dasharray:84 916;filter:url(#au-fx-glow);animation:au-glow 9s linear infinite}
.aurum .au-o-mid{stroke:rgb(var(--sb-accent-2) / .8);stroke-width:1.2;stroke-dasharray:52 948;animation:au-midk 9s linear infinite}
.aurum .au-o-core{stroke:color-mix(in srgb, rgb(var(--sb-accent-2)) 72%, #fff);stroke-width:1.1;stroke-dasharray:16 984;animation:au-core 9s linear infinite}
@keyframes au-tail{from{stroke-dashoffset:0}to{stroke-dashoffset:-1000}}
@keyframes au-glow{from{stroke-dashoffset:-116}to{stroke-dashoffset:-1116}}
@keyframes au-midk{from{stroke-dashoffset:-148}to{stroke-dashoffset:-1148}}
@keyframes au-core{from{stroke-dashoffset:-184}to{stroke-dashoffset:-1184}}

.aurum .au-tip{position:absolute;z-index:12;pointer-events:none;
  width:calc(var(--cut) - var(--seam) * 1.414);height:calc(var(--cut) - var(--seam) * 1.414);will-change:transform}
.aurum .au-tip-tl{top:0;left:0}
.aurum .au-tip-br{right:0;bottom:0}
.aurum .au-tip .au-fill{position:absolute;inset:0;
  backdrop-filter:blur(20px) saturate(90%) brightness(.6);-webkit-backdrop-filter:blur(20px) saturate(90%) brightness(.6)}
.aurum .au-tip-tl .au-fill{clip-path:polygon(0 0,100% 0,0 100%);border-top-left-radius:13px;
  background:linear-gradient(135deg,rgb(var(--sb-accent-2) / .22),transparent 60%),rgb(var(--sb-surface) / .64)}
.aurum .au-tip-br .au-fill{clip-path:polygon(100% 100%,100% 0,0 100%);border-bottom-right-radius:13px;
  background:linear-gradient(315deg,rgb(var(--sb-accent-2) / .16),transparent 60%),rgb(var(--sb-surface) / .64)}
.aurum .au-tip svg{position:absolute;left:0;top:0;width:100%;height:100%;overflow:visible}
.aurum .au-t-halo{fill:none;stroke:rgb(var(--sb-accent) / .5);stroke-width:2.6;filter:url(#au-fx-soft);
  opacity:.55;transition:opacity .35s ease,stroke-width .35s ease}
.aurum .au-t-edge{fill:none;stroke-width:1.05;stroke-linejoin:round;stroke:rgb(var(--sb-accent-2) / .85)}
.aurum .au-scene.au-joined .au-t-halo{opacity:1;stroke-width:3.4}

.aurum .au-viewport{position:relative;z-index:3;height:0;transition:height .56s var(--spring)}
.aurum .au-pane{position:absolute;left:0;top:0;width:100%;display:none;
  transition:opacity .26s ease,transform .32s cubic-bezier(.16,1,.3,1)}
.aurum .au-pane.on{display:block}
.aurum .au-pane.hide{opacity:0;transform:translateY(9px) scale(.984)}

/* === EYEBROW: LogoMark + "Aurum · SmartBar" com glow do botão do menu ==== */
.aurum .au-brand{display:flex;align-items:center;gap:8px;margin-bottom:12px}
.aurum .au-brand-txt{
  display:inline-flex;align-items:center;gap:6px;
  font-size:10px;letter-spacing:.22em;text-transform:uppercase;
  color:#f2f5fa;font-weight:500;
}
.aurum .au-brand-txt b{font-weight:700;letter-spacing:.24em}

.aurum .au-head{margin-bottom:14px}
.aurum .au-title{
  font-family: var(--font-heading, 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif);
  font-size:24px;font-weight:700;letter-spacing:-.018em;line-height:1.08;margin:0;
}
.aurum .au-title b{font-weight:600;background:linear-gradient(175deg,
  color-mix(in srgb, rgb(var(--sb-accent-2)) 85%, #fff),rgb(var(--sb-accent)) 58%,
  color-mix(in srgb, rgb(var(--sb-accent)) 68%, #000));
  -webkit-background-clip:text;background-clip:text;color:transparent}
.aurum .au-sub{margin:6px 0 0;font-size:10.5px;color:var(--ink2);font-weight:300;line-height:1.45}

.aurum .au-field{margin-bottom:9px}
.aurum .au-lbl{display:block;font-size:8.5px;letter-spacing:.11em;text-transform:uppercase;color:var(--ink2);margin-bottom:4px;font-weight:400}
.aurum .au-wrap{position:relative;display:flex;align-items:center}
.aurum .au-wrap .au-ico{position:absolute;left:10px;width:11px;height:11px;color:var(--ink3);transition:color .35s,filter .35s;pointer-events:none}
.aurum .au-wrap:focus-within .au-ico{color:var(--gold-hi);filter:drop-shadow(0 0 4px rgb(var(--sb-accent) / .5))}

.aurum input[type=text],.aurum input[type=email],.aurum input[type=password]{
  width:100%;height:34px;padding:0 30px;margin:0;
  background:rgb(var(--sb-border) / .022);border:1px solid var(--hair);border-radius:8px;
  color:var(--ink);font:300 12.5px/1 inherit;letter-spacing:.02em;outline:none;
  transition:border-color .3s,background .3s,box-shadow .3s}
.aurum input::placeholder{color:var(--ink3);font-weight:200;letter-spacing:.06em}
.aurum input:hover{border-color:rgb(var(--sb-border) / .13)}
.aurum input:focus{background:rgb(var(--sb-border) / .04);border-color:rgb(var(--sb-accent) / .42);
  box-shadow:0 0 0 2px rgb(var(--sb-accent) / .07)}
.aurum input.bad{border-color:rgba(226,75,74,.6)}

.aurum .au-err{display:none;margin:4px 0 0;font-size:9px;color:#e88a89;letter-spacing:.02em}
.aurum .au-err.show{display:block}

.aurum .au-eye{position:absolute;right:8px;display:grid;place-items:center;width:22px;height:22px;
  background:none;border:0;cursor:pointer;color:var(--ink3);transition:color .25s}
.aurum .au-eye:hover{color:var(--gold-hi)}
.aurum .au-eye svg{width:12px;height:12px}

.aurum .au-cta{position:relative;width:100%;height:36px;border:0;cursor:pointer;border-radius:9px;overflow:hidden;margin-top:6px;
  background:linear-gradient(180deg,rgb(var(--sb-accent-2)),rgb(var(--sb-accent)) 48%,color-mix(in srgb, rgb(var(--sb-accent)) 82%, #000));
  color:rgb(var(--sb-on-accent));font:500 12px/1 inherit;letter-spacing:.015em;
  display:flex;align-items:center;justify-content:center;gap:6px;
  box-shadow:0 6px 16px -10px rgb(var(--sb-accent) / .5),inset 0 1px 0 rgba(255,255,255,.5),inset 0 -1px 0 rgba(0,0,0,.28);
  transition:transform .28s var(--ease),box-shadow .28s var(--ease)}
.aurum .au-cta[disabled]{opacity:.7;cursor:progress}
.aurum .au-cta::after{content:'';position:absolute;inset:0;left:-140%;
  background:linear-gradient(100deg,transparent,rgba(255,255,255,.5),transparent);transition:left .8s ease}
.aurum .au-cta:hover:not([disabled]){transform:translateY(-1px);box-shadow:0 10px 22px -10px rgb(var(--sb-accent) / .6),inset 0 1px 0 rgba(255,255,255,.55),inset 0 -1px 0 rgba(0,0,0,.28)}
.aurum .au-cta:hover:not([disabled])::after{left:140%}
.aurum .au-cta:active{transform:translateY(0)}
.aurum .au-cta svg{width:12px;height:12px}

.aurum [data-pane="idle"]{padding-top:80px}
.aurum .au-hint{
  /* Dica no estado de repouso: menor que antes (8.5px, letter-spacing reduzido)
     para caber "PASSE O MOUSE PARA ENTRAR" dentro da largura util do card
     (~216px). Cor branca com opacidade pulsando.

     NOTA: NAO usar o shorthand font com inherit — inherit nao e valido
     dentro do shorthand font, o navegador descarta a declaracao inteira
     e cai no default de 16px. Precisa ser longhand. */
  display:block;width:100%;background:none;border:0;cursor:pointer;padding:4px 0;
  color:#ffffff;
  font-weight:300;
  font-size:8.5px;
  line-height:1.4;
  letter-spacing:.09em;
  text-transform:uppercase;
  white-space:nowrap;text-align:center;
  animation:au-hint 3.2s ease-in-out infinite;
}
.aurum .au-hint:focus-visible{outline:1px solid rgb(var(--sb-accent) / .5);outline-offset:3px;border-radius:4px}
@keyframes au-hint{0%,100%{opacity:.55}50%{opacity:.95}}

@media (prefers-reduced-motion:reduce){
  .aurum *,.aurum *::before,.aurum *::after{animation-duration:.01ms !important;animation-iteration-count:1 !important;transition-duration:.01ms !important}
}
`;
