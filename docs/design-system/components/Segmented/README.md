Abas em pílula de vidro, com contador opcional.

`src/components/ui/segmented.tsx`

Filtra uma lista ou troca uma visão sem sair da página: os planos por perfil na home
(`plans-grid.tsx`), as categorias da vitrine do hóspede (`product-list.tsx`) e os
filtro de quartos do painel (`rooms-explorer.tsx`) e as abas do painel lateral (`side-panel.tsx`).

## Props

| Prop | O que faz |
| --- | --- |
| `options` | Lista de `{ value, label, count? }`. `count` mostra um número dentro da aba. |
| `value` / `onChange` | A aba ativa e o que fazer ao trocar. |
| `label` | Nome do grupo, para leitores de tela (`aria-label`). |

## O visual

Pílula `.glass` com 4px de respiro. Cada aba tem 36px de altura (`h-9`), 16px de
respiro lateral e texto `body-sm` semibold. A ativa vira `glass-tint` em
`brand-700/80` com texto branco; as outras ficam em `ink-soft` e acendem em
`white/70` no hover. O contador usa `brand-700/10` nas inativas e `white/20` na ativa.

**Não quebra linha nem estoura a tela:** com `max-w-full` e rolagem horizontal
(`.scroll-hide`), em telas estreitas as abas deslizam de lado, sem barra visível.

## Regras

- É um `role="tablist"` com `aria-selected` em cada aba. O painel de conteúdo
  fica a cargo de quem usa — o componente não liga aba a painel.
- Rótulos curtos (1–3 palavras). O número em `count` é do estado da aba, nunca decoração.
- Para navegar entre páginas com URL própria, use links, não Segmented.

## O que o consumidor fornece

As opções, o valor ativo e o `label`. O componente cuida de vidro, estados e rolagem.
