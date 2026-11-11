import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const DEMO_COOKIE = "smartbar_demo_admin";

/**
 * MIDDLEWARE DA APLICAÇÃO. Faz duas coisas, em ordem:
 *
 *   1. CSP com nonce POR REQUEST (todas as rotas).
 *   2. Guarda de sessão do /admin/*.
 *
 * ----------------------------------------------------------------------
 * POR QUE NONCE POR REQUEST, E NÃO CSP ESTÁTICO NO next.config.ts
 *
 * A CSP anterior vivia em `next.config.ts` como `Content-Security-Policy-Report-Only`
 * com `'unsafe-inline' 'unsafe-eval'` em `script-src`. Era bom para DESCOBRIR
 * o que a app faz, não para impedir XSS: Report-Only avisa, não bloqueia; e
 * `unsafe-inline` legitima qualquer `<script>` inline, inclusive um que um
 * atacante consiga injetar via bug de escape.
 *
 * O padrão do Next para sair dessa é gerar um NONCE por requisição, colocar
 * esse nonce no `script-src 'nonce-xxxx'` e passar o mesmo nonce para os
 * scripts inline que a aplicação precisa injetar (hidratação do Next + o
 * `THEME_BOOT` do layout). Com `'strict-dynamic'`, scripts com nonce confiável
 * podem carregar outros scripts (os chunks do Next) sem precisar whitelistar
 * cada caminho.
 *
 * O nonce viaja pela app via `x-nonce` request header — convenção do Next.
 * `layout.tsx` lê de `next/headers` e usa em `<script nonce={...}>`.
 *
 * PORQUE STYLE-SRC AINDA TEM `unsafe-inline`: Tailwind e o motor de tema
 * injetam CSS inline (via `<style>` do layout e atributos `style=`). Aplicar
 * nonce também a estilos exige mudar `dangerouslySetInnerHTML` e TODO
 * `className` dinâmico para carregar nonce. Risco de XSS por STYLE é menor
 * que por SCRIPT (estilo não executa código), e por isso o setor aceita
 * `'unsafe-inline' style-src` como compromisso enquanto a parte de script fica
 * blindada. Documentado para não parecer descuido.
 *
 * ----------------------------------------------------------------------
 * GUARDA DO /admin
 *
 * Com Supabase: renova a sessão e exige usuário.
 * Em modo demo (sem env): exige o cookie de demonstração.
 * A verificação de VÍNCULO com o hotel acontece em requireAdmin() + RLS.
 */
const EM_DEV = process.env.NODE_ENV !== "production";

export async function middleware(request: NextRequest) {
  // --- 1. Nonce (SÓ EM PRODUÇÃO) ---
  //
  // Em dev a CSP com nonce traz dois problemas sem ganho de segurança:
  //
  //   (a) O Fast Refresh do Next usa `eval`/`new Function`, e qualquer CSP
  //       que não permita `unsafe-eval` bloqueia o HMR — componentes client
  //       param de hidratar, o cadeado não anima, botões não respondem.
  //   (b) O nonce muda a cada request. O React compara os atributos do HTML
  //       SSR com o DOM re-hidratado e acusa hydration mismatch no inline
  //       script do THEME_BOOT, o que esfarela a árvore client.
  //
  // Dev não é alvo público: fica sem CSP. Em produção a CSP volta estrita,
  // com nonce, `strict-dynamic` e tudo mais.
  const nonce = EM_DEV ? "" : geraNonce();
  const csp = EM_DEV ? null : montaCsp(nonce);

  // O header de request só precisa carregar o nonce em produção.
  const requestHeaders = new Headers(request.headers);
  if (nonce) requestHeaders.set("x-nonce", nonce);

  // --- 2. Guarda do /admin/* ---
  const { pathname } = request.nextUrl;
  const dentroDoAdmin = pathname.startsWith("/admin");
  const isLogin = pathname === "/admin/login";

  let response: NextResponse;

  if (!dentroDoAdmin) {
    // Rota comum: só prossegue, aplicando o nonce no request.
    response = NextResponse.next({ request: { headers: requestHeaders } });
  } else {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    const supabaseMode = Boolean(url && anon && process.env.SUPABASE_SERVICE_ROLE_KEY);

    let authenticated: boolean;
    response = NextResponse.next({ request: { headers: requestHeaders } });

    if (supabaseMode) {
      const supabase = createServerClient(url!, anon!, {
        cookies: {
          getAll: () => request.cookies.getAll(),
          setAll: (list) => {
            list.forEach(({ name, value }) => request.cookies.set(name, value));
            response = NextResponse.next({ request: { headers: requestHeaders } });
            list.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
          },
        },
      });
      const { data } = await supabase.auth.getUser();
      authenticated = Boolean(data.user);
    } else {
      authenticated = request.cookies.get(DEMO_COOKIE)?.value === "1";
    }

    if (!authenticated && !isLogin) {
      const login = request.nextUrl.clone();
      login.pathname = "/admin/login";
      login.search = "";
      response = NextResponse.redirect(login);
    } else if (authenticated && isLogin) {
      const home = request.nextUrl.clone();
      home.pathname = "/admin";
      response = NextResponse.redirect(home);
    }
  }

  // --- CSP no response (toda rota, inclusive os redirects acima) ---
  if (csp) response.headers.set("Content-Security-Policy", csp);
  return response;
}

/*
  Base64url de 128 bits. Web Crypto está disponível no Edge runtime do Next.
  Base64url (sem +/=) porque o nonce vai dentro do header HTTP e sem padding.
*/
function geraNonce(): string {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  let b64 = "";
  for (const byte of bytes) b64 += String.fromCharCode(byte);
  return btoa(b64).replaceAll("+", "-").replaceAll("/", "_").replaceAll("=", "");
}

/**
 * CSP de PRODUÇÃO. Em dev o middleware nem chama esta função — ver comentário
 * no `middleware()` sobre por que dev fica sem CSP.
 */
function montaCsp(nonce: string): string {
  return [
    "default-src 'self'",
    // Só scripts com nonce deste request OU carregados por um script nonceado
    // (strict-dynamic). Sem 'unsafe-inline' nem 'unsafe-eval'.
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob: https:",
    "media-src 'self'",
    "font-src 'self' data:",
    "connect-src 'self' https://*.supabase.co wss://*.supabase.co",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "object-src 'none'",
    "upgrade-insecure-requests",
  ].join("; ");
}

/*
  Rodar o middleware em TUDO menos:
    - assets do Next (_next/static, _next/image)
    - arquivos públicos já otimizados (favicon, imagens, manifesto)
    - rotas de API (que não precisam de CSP e são custosas; elas setam
      Cache-Control próprio em next.config.ts).

  Esse matcher padrão veio direto da documentação do Next sobre middleware
  de nonce — é a forma recomendada de não re-executar em cada chunk.
*/
export const config = {
  matcher: [
    {
      source: "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff|woff2)$).*)",
      missing: [
        { type: "header", key: "next-router-prefetch" },
        { type: "header", key: "purpose", value: "prefetch" },
      ],
    },
  ],
};
