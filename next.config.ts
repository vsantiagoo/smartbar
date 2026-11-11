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
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), interest-cohort=(), payment=(), usb=(), magnetometer=(), gyroscope=(), accelerometer=()" },
  { key: "X-DNS-Prefetch-Control", value: "on" },
  /*
    Cross-Origin-Opener-Policy: cada aba fica isolada no seu PROCESSO. Um
    outro site que abra uma popup para o SmartBar não consegue falar
    diretamente com ela via `window.opener` nem especular com Spectre sobre
    a memória da nossa aba. `same-origin-allow-popups` deixa os botões de
    pagamento Pix abrirem popups próprias sem travar — o controle aqui é
    quem pode conversar com a gente, não o contrário.

    Cross-Origin-Resource-Policy: casa com a COOP. Recursos nossos (JS, JSON
    de API, imagens hospedadas) só podem ser embedados por nós mesmos.
    Isso fecha hotlinking e um vetor de Spectre do lado do carregador.
  */
  { key: "Cross-Origin-Opener-Policy", value: "same-origin-allow-popups" },
  { key: "Cross-Origin-Resource-Policy", value: "same-origin" },
];

/*
  A CSP vive em src/middleware.ts, não aqui — precisa de NONCE por request
  para proteger scripts inline do Next sem precisar de 'unsafe-inline'. CSP
  estática neste arquivo seria obrigada a frouxar com `'unsafe-inline'` para
  a hidratação do Next não quebrar, o que anula metade do valor da CSP.
*/

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: "/:path*",
        headers: SEGURANCA,
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
