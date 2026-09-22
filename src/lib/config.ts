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
export const demoToolsEnabled: boolean = process.env.NEXT_PUBLIC_DEMO_TOOLS !== "false";

/**
 * Servidor: as rotas /api/mock/* só respondem se as ferramentas de demo estiverem
 * ligadas E (estamos em modo demo OU fora de produção).
 */
export const simulationAllowed: boolean = demoToolsEnabled && (isDemoMode || process.env.NODE_ENV !== "production");

export const DEMO_ADMIN = {
  email: "recepcao@hotelaurora.com.br",
  password: "smartbar123",
  cookie: "smartbar_demo_admin",
} as const;

export const DEMO_HOTEL_SLUG = "hotel-aurora";
export const DEMO_ROOM_TOKEN = "aurora-101";
