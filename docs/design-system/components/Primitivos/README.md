As peças pequenas do painel: carregamento, vazio, nível, "ao vivo", número pontilhado e cartão de indicador.

`src/components/ui/primitives.tsx`

## As seis peças

| Peça | Para quê | Props principais |
| --- | --- | --- |
| `Skeleton` | Espaço reservado enquanto o conteúdo carrega. Bloco pulsante em `brand-700/10`, raio 16px, decorativo. | `className` (dá o tamanho) |
| `EmptyState` | Lista ou tela sem nada. Ícone em tile de vidro, título, descrição curta e uma ação opcional. | `icon`, `title`, `description?`, `action?` |
| `Meter` | Barra de progresso ou de nível, em pílula de 8px de altura. | `value`, `max`, `tone`, `label` |
| `LiveDot` | Ponto pulsante "ao vivo" (Realtime), com o anel `pulse-ring`. | `tone` (`ok` ou `warn`) |
| `DotNumber` | Número em fonte pontilhada (Doto), extrabold. | `children` |
| `KpiCard` | Cartão de indicador: rótulo, ícone, valor grande e dica. `.glass`, raio `card`, 20px de padding. | `label`, `value`, `hint?`, `icon`, `tone` |

## Tons

`Meter` pinta o preenchimento conforme a criticidade:

| Tom | Cor |
| --- | --- |
| `info` | `brand-600` |
| `ok` | `ok-500` |
| `warn` | `gold-500` |
| `danger` | `crimson-500` |

`KpiCard` usa o tom só no tile do ícone, no mesmo par de fundo e texto do `Badge`:
`info` `brand-700/10` · `brand-700`; `gold` `gold-500/15` · `gold-600`; `danger`
`crimson-500/10` · `crimson-600`; `ok` `ok-500/12` · `ok-600`. O texto vai no passo
600, como no resto do sistema.

## Regras

- `Meter` é um `role="meter"` com `aria-valuenow`, `aria-valuemin` e `aria-valuemax`;
  o `label` é obrigatório. O valor é limitado a 0–100% mesmo se passar do `max`.
- `Skeleton` e `LiveDot` são `aria-hidden`: quem usa avisa o estado de outro jeito.
- O valor do `KpiCard` entra em 2,1rem; passe o número já formatado (ou um `DotNumber`).
- `EmptyState` explica o que fazer, não só que está vazio — sempre que der, passe a `action`.
