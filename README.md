# SmartBar

Gestão inteligente de minibares para hotéis (SaaS B2B2C). O hóspede escolhe no celular, paga no Pix (ou lança na conta com o cartão-chave RFID) e a trava do frigobar libera em segundos. O **Supabase é a única fonte de verdade do estoque**: o item só é abatido no instante em que o pagamento/identidade é validado.

**Stack:** Next.js 15 (App Router) · React 19 · TypeScript estrito · Tailwind CSS 3 · Supabase (PostgreSQL, Auth, Realtime) · Vercel.

## Rodar agora (modo demonstração — sem banco)

```bash
npm install
npm run dev        # http://localhost:3100 se usar -- -p 3100
```

Sem variáveis do Supabase o app roda com dados em memória (mesma lógica de negócio). Tudo funciona, inclusive tempo real entre abas.

O `npm run dev` apaga a pasta `.next` antes de subir (script `predev` → `npm run clean`). Isso evita o erro `EINVAL: invalid argument, readlink ... .next\build-manifest.json`, que acontece nesta pasta sincronizada pelo OneDrive quando sobra cache de um `npm run build`. Para limpar manualmente: `npm run clean`.

Se o erro aparecer no `npm run build`, é porque sobrou build antigo que o OneDrive converteu em atalho de nuvem (o arquivo fica com o atributo `ReparsePoint` e o Node não consegue lê-lo). Apague a pasta pelo PowerShell e rode de novo:

```powershell
Remove-Item .next -Recurse -Force
```

| Frente | URL | O que testar |
| --- | --- | --- |
| Site público (landing) | `/` | Hero em glassmorfismo, telas que acompanham o scroll, menu flutuante |
| Hóspede (QR do quarto) | `/h/hotel-aurora/q/aurora-101` | Vitrine → carrinho → checkout → Pix → trava liberada |
| Painel do hotel | `/admin` | Login demo: `recepcao@hotelaurora.com.br` / `smartbar123` |
| Design system | `/design-system` | Referências, **editor de cores ao vivo**, componentes |

Para ver o tempo real: abra `/admin` numa aba e o app do hóspede em outra; pague o Pix (botão "Simular pagamento") e o painel atualiza sozinho. O botão **Simular venda** no dashboard faz o mesmo sem a segunda aba.

## Mapa de telas → arquivos (para refinar uma por uma)

Cada tela é uma página fina que compõe **seções independentes**. Para mudar um bloco, edite só o arquivo da seção.

**Site público** — `src/app/page.tsx` · seções em `src/components/marketing/`

| Seção | Arquivo | Observação |
| --- | --- | --- |
| Cabeçalho fixo | `site-header.tsx` | Marca reduzida fora da barra; dentro, vidro escuro (`.glass-dark`) com o menu centralizado e o CTA à direita |
| Menu das seções | `section-nav.tsx` | Fica dentro do cabeçalho; acende a seção visível (`use-active-section.ts`) |
| Hero | `hero.tsx` | Fotos de hotel em crossfade (`hero-slideshow.tsx`, arquivos em `public/images/hero/`), moldura branca vazada e as três provas curtas. Vídeo de fundo **pendente** (ver nota abaixo) |
| Como funciona | `scroll-story.tsx` | 3 telas em tela cheia que trocam conforme o scroll (crossfade) |
| Resultados | `impact-stats.tsx` | Números de referência do Plano de Negócios |
| Planos | `plans-grid.tsx` | Cards Básico/Plus/Premium |
| Explorar agora | `quick-links.tsx` | Atalhos para hóspede/admin/design system |
| CTA final + rodapé | `final-cta.tsx` | |

> **Vídeo do hero pendente.** O pedido é um vídeo de 15s (16:9, 1080p, multi-take, sem SFX) gerado com Seedance 2.5 via CLI Higgsfield. A conta Higgsfield está no plano gratuito com 10 créditos; o mínimo técnico do modelo (4s, 480p, sem áudio) já custa 12 créditos — não dá para gerar nem um teste. Assim que a conta tiver crédito, gere com `higgsfield generate create seedance_2_5 --mode t2v --duration 15 --aspect-ratio 16:9 --resolution 1080p --bitrate-mode high --generate-audio true`, salve em `public/videos/hero.mp4` e troque `HERO_VIDEO_SRC` em `hero.tsx`.

**Hóspede** — `src/app/h/[hotelId]/q/[roomId]/…` · seções em `src/components/guest/sections/`

| Tela | Página | Seções |
| --- | --- | --- |
| Vitrine | `page.tsx` | `catalog-hero` · `product-list` · `how-it-works` · `cart-bar` |
| Checkout | `checkout/page.tsx` | `checkout-screen` · `order-summary` · `payment-methods` |
| Pedido | `pedido/[token]/page.tsx` | `order-tracker` → `pix-payment` · `rfid-waiting` · `order-success` · `order-failure` |

**Admin** — `src/app/admin/…` · seções em `src/components/admin/sections/`

| Tela | Página | Seções |
| --- | --- | --- |
| Login | `login/page.tsx` | `login-form` |
| Início da recepção | `(panel)/page.tsx` | `command-bar` · `system-presentation` · `kpi-strip` · `impact-meter` · `revenue-chart` · `top-products` · `side-panel` |
| Quartos (busca) | `(panel)/quartos/page.tsx` | `rooms-explorer` |
| Quarto (detalhe) | `(panel)/quartos/[numero]/page.tsx` | `room-header` · `stay-history` · `room-inventory` · `checkout-summary` |
| Reposição | `(panel)/reposicao/page.tsx` | `restock-board` |

## O que é editável

- **Cores:** `src/lib/theme.ts` (única fonte). Ou abra `/design-system`, ajuste no editor (tem paletas prontas e checagem de contraste), clique em **Copiar tema** e cole em `DEFAULT_THEME`. Cada cor gera a escala 50→950.
- **Marca:** `src/components/ui/logo.tsx` — ícone (frigobar + cadeado + ondas animadas em degradê) e `Wordmark` (Plus Jakarta Sans). Nunca reescreva o texto "SmartBar" à mão em outro componente.
- **Textos:** `src/lib/content/copy.ts` — a voz da marca por seção (vitrine, checkout, Pix, sucesso, painel, site público).
- **Forma** (raios, sombras, animações): `tailwind.config.ts`; superfícies de vidro em `src/app/globals.css` — `.glass`/`.glass-strong` (cards claros), `.glass-navy` (card de destaque), `.glass-dark` (header/menu do site) e `.glass-tint` (botões e itens ativos: vidro + uma cor translúcida ao lado, ex. `glass-tint bg-brand-700/85`).
- **Movimento no scroll:** `src/lib/marketing/use-scroll-progress.ts` (`useSmoothScroll`, amortecimento em `damping`), `scroll-story.tsx` (pausa de cada tela em `HOLD`), `<Reveal>` em `src/components/ui/reveal.tsx` (entrada ao aparecer na tela).
- **Componentes base:** `src/components/ui/`.
- **Whitelabel por hotel** (plano Premium): `hotels.brand` (`primary`, `accent`) sobrescreve as cores só na área do hóspede.

## Arquitetura

```
Hóspede (celular) ──► /api/checkout ──► transactions (pending) ──► Pix (gateway)
                                                                      │ webhook
ESP32 (leitor RFID) ─► /api/iot/rfid ─┐                               ▼
                                      └──► smartbar_authorize_transaction()   ← RPC atômica no Postgres
                                            • confere todos os itens (lock de linha)
                                            • abate o estoque + autoriza (idempotente)
                                            • realtime.send → canal do hóspede
                                            • linha alterada → Realtime do painel
                                            └► dispatchUnlock() → MQTT → ESP32 → relé → trava 15 s
```

- **Hóspede é anônimo:** não toca no banco. Só o servidor (service_role) lê/escreve; o pedido é acompanhado por um `public_token` não adivinhável.
- **Preço e estoque nunca vêm do cliente:** o servidor revalida tudo no checkout.
- **Equipe:** Supabase Auth + RLS por `hotel_members`. `middleware.ts` protege `/admin`.
- **Tempo real:** o painel escuta `postgres_changes` (`transactions`, `inventory`); o hóspede escuta um canal `broadcast` `tx:{token}` emitido pelo próprio banco. Há polling de segurança nos dois lados.
- **Duas implementações do mesmo contrato** (`src/lib/data/repository.ts`): `supabase/repo.ts` (produção) e `mock/repo.ts` (demo).

## Ligar o Supabase

1. Crie o projeto e rode `supabase/migrations/0001_smartbar_schema.sql` e depois `supabase/seed.sql` (SQL Editor ou `supabase db reset`).
2. Em *Authentication → Users* crie o usuário da recepção e vincule-o ao hotel (comentário no fim do `seed.sql`).
3. Copie `.env.example` para `.env.local` e preencha `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` e `SUPABASE_SERVICE_ROLE_KEY` (nunca com prefixo `NEXT_PUBLIC_`).
4. Em produção defina `NEXT_PUBLIC_DEMO_TOOLS=false` (as rotas `/api/mock/*` também se desligam sozinhas).

## Deploy (Vercel)

Importe o repositório, configure as variáveis do `.env.example` e faça o deploy. Aponte o webhook do gateway Pix para `/api/pix/webhook` (header `asaas-access-token` = `PIX_WEBHOOK_TOKEN`).

## O que ainda é simulado

- **Gateway Pix:** `src/lib/payments/pix.ts` gera um BR Code válido (com CRC16) sem chamar rede. Implemente `PixProvider` para Asaas/Mercado Pago.
- **Trava IoT:** `src/lib/iot/unlock.ts` só registra o comando. Troque por publicação MQTT/TLS.
- **ESP32:** o contrato do endpoint está em `src/app/api/iot/rfid/route.ts`.
- **Integração PMS** (botão "Enviar ao PMS"): plano Premium, ainda não implementada.
- **Vídeo do hero:** pendente de créditos na Higgsfield (ver acima).

## Verificação feita

`tsc --noEmit` (strict + `noUncheckedIndexedAccess`), `next build`, migration + seed executadas num Postgres real (atomicidade, idempotência, estoque nunca negativo, RLS de reposição) e fluxos ponta a ponta no navegador. **Ainda não testado contra um projeto Supabase real** (Auth, Realtime e o repositório de produção) — faça um teste com o seu projeto antes de ir ao ar.
