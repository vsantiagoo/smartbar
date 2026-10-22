import type { NextConfig } from "next";

/**
 * CABEÇALHOS DE SEGURANÇA.
 *
 * Nenhum destes impede uma falha de lógica — eles reduzem o estrago quando uma
 * acontece, e fecham ataques que não dependem de bug nenhum do nosso lado.
 * Cada um está aqui por um motivo específico:
 *
 *  · HSTS — sem ele, a primeira visita em `http://` pode ser interceptada antes
 *    de o redirecionamento acontecer. Com ele, o navegador se recusa a usar
 *    texto claro neste domínio pelos próximos dois anos. `preload` só deve ser
 *    submetido à lista quando o domínio definitivo estiver no ar.
 *
 *  · X-Frame-Options / frame-ancestors — impedem que o site seja embutido num
 *    iframe invisível sobre uma página falsa. No nosso caso o risco é direto:
 *    a vitrine do hóspede tem botões que gastam dinheiro.
 *
 *  · X-Content-Type-Options — impede o navegador de "adivinhar" que um arquivo
 *    enviado é na verdade um script.
 *
 *  · Referrer-Policy — a URL do hóspede carrega o token do quarto. Sem isto,
 *    ela vaza inteira no cabeçalho `Referer` ao clicar num link externo.
 *
 *  · Permissions-Policy — o site não usa câmera, microfone nem localização.
 *    Declarar isso fecha a porta para qualquer script de terceiro tentar.
 */
const SEGURANCA = [
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), interest-cohort=()" },
  { key: "X-DNS-Prefetch-Control", value: "on" },
];

/*
  CSP em modo RELATÓRIO, de propósito.

  Uma política de conteúdo errada quebra o site inteiro e em silêncio — fonte
  que não carrega, imagem que não aparece, script que não roda. Em
  `Report-Only` o navegador aplica a regra, relata o que violaria e NÃO bloqueia
  nada. É assim que se descobre o que a política precisa permitir antes de ela
  passar a valer.

  `'unsafe-inline'` em script-src existe porque o Next injeta scripts inline de
  hidratação; sair disso exige nonce por requisição, que é o próximo passo e
  vale a pena. Deixar registrado aqui para não parecer descuido.
*/
const CSP_RELATORIO = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https:",
  "media-src 'self'",
  "font-src 'self' data:",
  // Supabase: REST, Auth e o websocket do Realtime.
  "connect-src 'self' https://*.supabase.co wss://*.supabase.co",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
].join("; ");

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [...SEGURANCA, { key: "Content-Security-Policy-Report-Only", value: CSP_RELATORIO }],
      },
      {
        // Nada que venha da API pode ser guardado em cache intermediário: são
        // respostas por hóspede, por pedido e por hotel.
        source: "/api/:path*",
        headers: [{ key: "Cache-Control", value: "no-store, must-revalidate" }],
      },
    ];
  },
};

export default nextConfig;
