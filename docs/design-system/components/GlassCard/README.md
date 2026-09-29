A superfície padrão do sistema: vidro com cantos de 28px.

`src/components/ui/glass-card.tsx` — exporta `GlassCard` e `SectionTitle`.

## Superfície

`glass` (padrão) · `strong` · `solid` · `navy`.

`solid` é hoje um apelido de `strong` — existe para o dia em que uma superfície
realmente opaca for necessária. Não conte com a diferença.

`navy` já vem com `text-white`; nas outras, o texto é `ink`.

## Padding

`none` · `sm` 16px · `md` 20→24px · `lg` 24→32px.

Os dois últimos crescem no `sm:` do Tailwind — apertado no celular, folgado no
desktop. Use `none` quando o conteúdo tem seu próprio respiro, como uma tabela
que precisa encostar na borda.

## SectionTitle

O cabeçalho do cartão: título em `title-5`, dica opcional em `body-sm` na cor
`ink-soft`, e um espaço à direita para uma ação. Use-o em vez de escrever um
`<h2>` à mão — é o que mantém o mesmo respiro entre o cabeçalho e o conteúdo em
todos os cartões.

## Regras

- **Cartão dentro de cartão não é vidro.** O de fora é `.glass`; o de dentro é
  um bloco comum com fundo sólido leve. Dois vidros empilhados viram uma mancha.
- Números em coluna pedem `.tabular` (`font-variant-numeric: tabular-nums`),
  senão os dígitos dançam a cada atualização ao vivo.
- O raio é 28px e não se negocia por cartão — é o que dá unidade à página. Se
  precisar de outro, provavelmente não é um cartão.

## O que o consumidor fornece

O conteúdo. O cartão cuida de material, raio e padding.
