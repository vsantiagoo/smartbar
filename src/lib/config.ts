/**
 * Flags de ambiente. Sem Supabase configurado o app roda em MODO DEMO
 * (dados em memória) — ideal para refinar telas sem banco.
 */
export const isSupabaseConfigured: boolean = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
    process.env.SUPABASE_SERVICE_ROLE_KEY,
);

export const isDemoMode: boolean = !isSupabaseConfigured;

/** Botões de simulação (pagar Pix, aproximar cartão). Desligue em produção. */
const demoToolsEnabled: boolean = process.env.NEXT_PUBLIC_DEMO_TOOLS !== "false";

/**
 * Servidor: as rotas /api/mock/* só respondem fora de produção.
 *
 * O desenho anterior era `demoToolsEnabled && (isDemoMode || !production)` —
 * tinha um FLANCO: se um deploy em `NODE_ENV=production` subisse SEM as três
 * chaves do Supabase (esqueceu uma variável, troca de ambiente mal feita),
 * `isDemoMode` viraria `true` e as rotas `/api/mock/*` ficariam EXPOSTAS.
 * `/api/mock/pix/pay` autoriza qualquer pedido sem pagar. `/api/mock/rfid/tap`
 * destrava remotamente. Era controle de negócio ligado à presença de uma
 * variável de ambiente — forma errada.
 *
 * Agora: em produção, não importa a configuração, as rotas de demo são 404.
 * Ponto. A ferramenta de demo serve a desenvolvimento e staging; produção
 * nunca precisa dela.
 */
export const simulationAllowed: boolean = demoToolsEnabled && process.env.NODE_ENV !== "production";

export const DEMO_ADMIN = {
  email: "recepcao@hotelaurora.com.br",
  password: "smartbar123",
  cookie: "smartbar_demo_admin",
} as const;

export const DEMO_HOTEL_SLUG = "hotel-aurora";
export const DEMO_ROOM_TOKEN = "aurora-101";
