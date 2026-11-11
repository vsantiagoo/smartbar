Bottom sheet mobile-first em vidro, para fluxos curtos sem sair da tela (o carrinho).

`src/components/ui/sheet.tsx`

No celular sobe do rodapé, com uma alça no topo; a partir de `sm` vira um diálogo
centralizado. É o nível 3 do vidro: interrompe a leitura, então usa `.glass-strong`.

## Props

| Prop | O que faz |
| --- | --- |
| `open` | Mostra ou esconde. Fechado, não renderiza nada. |
| `onClose` | Chamado por Esc, clique fora e botão de fechar. |
| `title` | Título do diálogo; também é o `aria-label`. |
| `children` | O conteúdo, que rola dentro do sheet. |
| `footer` | Opcional. Área fixa embaixo (ação principal), separada por um fio. |

## O visual

- **Painel:** `.glass-strong`, largura máxima 512px, altura máxima 88dvh. Raio
  `surface` (36px) — só nos cantos de cima no celular, em todos a partir de `sm`.
- **Entrada:** `animate-sheet-up` (0,32s).
- **Fundo:** `brand-950/40` com desfoque de 3px, que também é o alvo do clique fora.
- **Cabeçalho:** título em 20px semibold e botão de fechar redondo de 40px.
- **Rodapé:** respeita a área segura do aparelho (`safe-area-inset-bottom`).

## Regras

- É um `role="dialog"` com `aria-modal`.
- Enquanto aberto, trava a rolagem da página e a devolve ao fechar.
- Quem usa decide o que vai no `footer`; o sheet só reserva o espaço.
- Pendências conhecidas: o botão de fechar tem 40px (o sistema pede 44px) e o
  `aria-label` "Fechar" está fixo em português. Ver a referência.
