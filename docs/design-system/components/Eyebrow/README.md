Sobrescrita de abertura de seção: o rótulo miúdo acima do título.

`src/components/ui/eyebrow.tsx`

Vinha repetido em quatro seções com três entreletras diferentes (0,16, 0,18 e 0,08), e
cada abertura soava num tom ligeiramente distinto. Agora é uma peça só, com uma medida
só.

## Props

| Prop | O que faz |
| --- | --- |
| `children` | O texto do rótulo. |
| `tone` | `light` para fundo claro (texto `brand-500`); `dark` para fundo escuro (`white/55`). |
| `centered` | Centraliza o rótulo e **remove o fio**, porque sem margem não há onde ancorá-lo. |
| `className` | Ajustes de espaçamento por quem usa. |

## O visual

`text-xs` (12px), `font-semibold`, caixa-alta, entreletra de **0,2em**. Antes do texto
vai um fio de 28px (`h-px w-7`) a 45% de opacidade, com 12px de espaço.

Duas decisões tipográficas:

- **Entreletra de 0,2em.** Caixa-alta em corpo miúdo fecha: as maiúsculas têm a mesma
  altura e o olho perde o apoio entre elas. Abrir a entreletra devolve a leitura e dá
  o tom editorial — é o rótulo de uma página de revista, não um texto de interface.
- **O fio antes do texto.** É o que separa uma sobrescrita de um parágrafo pequeno em
  maiúsculas: ancora o rótulo na margem e abre a seção.

## Regras

- **Use só para abrir uma seção**, uma vez por página.
- **Não use** como rótulo de campo, de grupo de menu ou de bloco dentro do painel e da
  vitrine. Lá a caixa-alta é funcional, lida de relance muitas vezes ao dia, e vale
  `tracking-[0.14em]`, a medida de rótulo do produto.
