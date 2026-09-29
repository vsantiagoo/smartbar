Controle de quantidade em pílula: − 1 +.

`src/components/ui/stepper.tsx`

É o que o hóspede usa para dizer quantas unidades quer de cada item — na vitrine
(`product-list.tsx`) e na barra do pedido (`cart-bar.tsx`).

## Props

| Prop | O que faz |
| --- | --- |
| `value` | A quantidade atual. |
| `max` | O teto — em geral o estoque disponível do item. |
| `onChange(next)` | Chamado com o novo valor. |
| `label` | Nome do item, usado só para leitores de tela ("Adicionar um Água mineral"). |

## O visual

Pílula `glass-tint` em `brand-700/85` com texto branco. Dois botões redondos de
36px (`size-9`) dentro de um respiro de 4px, o que dá **44px de altura total** —
o alvo de toque do Brandbook. O número fica no meio, em `.tabular`, para não dançar
a cada toque.

## Regras

- **O botão "+" desliga em `max`** (opacidade 35%). O botão "−" **não** desliga em
  zero: quem usa é responsável por travar o mínimo em `onChange` (o carrinho remove
  o item quando chega a 0).
- O número é `aria-live="polite"`: o leitor de tela anuncia a mudança sem
  interromper.
- Sem estoque, não mostre o Stepper — mostre o selo "Esgotado".
- Não confunda com indicador de progresso de etapas; o SmartBar não tem um.

## O que o consumidor fornece

`value`, `max`, o `label` do item e o que fazer no `onChange`. O componente cuida
de tamanho, cor, alvo de toque e acessibilidade.
