Ação em pílula de vidro, em seis variantes e quatro tamanhos.

`src/components/ui/button.tsx` — exporta `Button` e `buttonClasses()`.

Toda variante é vidro: a base traz `.glass-tint` (desfoque, borda luminosa,
brilho interno) e **a cor entra como um `bg-{cor}/{alpha}` ao lado**. Esquecer o
`bg-` deixa o botão transparente.

## Qual variante

| Variante | Fundo | Quando |
| --- | --- | --- |
| `primary` | `brand-700/85` | A ação da tela. Uma por vez. |
| `accent` | `gold-500/85` | A ação que move dinheiro ou abre a trava. Texto `ink`, nunca branco. |
| `danger` | `crimson-500/85` | Cancelar, recusar, remover. |
| `glass` | branco 10% | Ação secundária sobre fundo claro. |
| `soft` | branco 40% | Terceira opção, sem peso. |
| `ghost` | nenhum | Voltar e fechar. Só ganha fundo no hover. |

## Tamanhos

`sm` 36px · `md` 44px · `lg` 56px · `icon` 44×44.

**`md` é o padrão porque 44px é o alvo de toque mínimo do Brandbook.** Use `sm`
só em barra densa, onde o dedo não é o alvo principal.

## Regras

- O rótulo diz o que acontece: "Pagar com Pix", não "Enviar". A confirmação
  depois usa o mesmo verbo no passado.
- `loading` troca o ícone por um giro e desabilita o botão — não empilhe seu
  próprio estado de carregamento por cima.
- Link com cara de botão: use `buttonClasses()` num `<Link>`, não um `<button>`
  com `onClick` de navegação.
- O ouro (`accent`) é a ação que mexe com dinheiro ou com a trava. Usá-lo em
  ação comum gasta o único sinal forte que a tela tem.

## O que o consumidor fornece

O texto do rótulo e, quando houver, o `icon` — um ícone do `lucide-react` em
`size-4`. O componente cuida de altura, raio, foco e estado desabilitado.
