As cinco superfícies de vidro — o material do sistema.

`src/app/globals.css`

Não são componentes, são classes. O que separa uma da outra não é a cor: é a
**altura**. Nível é o quanto o elemento flutua, e disso saem o desfoque e a
sombra. A cor é escolha de contraste contra o fundo, e vem depois.

| Nível | Desfoque | Sombra | Classes | Onde |
| --- | --- | --- | --- | --- |
| 1 · apoiada | 14px | nenhuma projetada | `.glass-chip` | Selo, campo, ícone |
| 2 · elevada | 22px | `--cast-1` | `.glass` · `.glass-tint` · `.glass-dark` | Cards, barras, botões |
| 3 · sobreposta | 34px | `--cast-2` | `.glass-strong` · `.glass-navy` | Sheet, dropdown, destaque |

O `--cast-3` fica reservado ao **hover** do nível 3: um elemento já no fundo
máximo da escala parado não teria para onde a sombra crescer ao ser destacado.

Misturar níveis sem motivo é o erro mais comum — dois cartões lado a lado com
desfoques diferentes parecem um erro de renderização, não uma escolha.

## As classes sem cor própria

`.glass-tint` e `.glass-chip` não definem `background`. Eles trazem desfoque,
borda luminosa e brilho interno — nada mais. **A cor vem de um
`bg-{cor}/{alpha}` ao lado:**

```
glass-tint bg-brand-700/85     ← botão principal
glass-tint bg-gold-500/85      ← botão de destaque
glass-chip bg-white/40
```

Sem o `bg-`, o elemento fica transparente e some. É por isso que nesses dois a
luz fica só no aro (`border-top-color` / `border-bottom-color`) em vez do
degradê de borda que as outras usam.

## Por que funciona

O fundo da página é um degradê preso (`background-attachment: fixed`) que desce
do frio (`sky-1`) ao quente (`sky-4`). O vidro precisa de algo atrás para
desfocar — sobre um fundo chapado, todas viram retângulos cinzentos.

O relevo vem da **luz direcional**, não do preenchimento: topo aceso, laterais
quase mudas, base apenas insinuada, e uma sombra interna subindo do rodapé que
dá espessura. Aro igual nos quatro lados é o maior delator de vidro sintético —
na natureza a luz vem de uma direção. É por isso que `.glass` funciona com uma
tinta de apenas 17% de branco no topo, caindo para 6% na base.

A tinta e a borda são **degradês**, não preenchimentos chapados. A borda usa a
dobradinha `padding-box` + `border-box` sobre uma borda transparente.

## No escuro

Mudam os alfas e o aro (`--rim-dark`). O degradê de tinta, o degradê de borda e
as camadas de sombra continuam: chapar tudo numa cor lisa apagaria a luz
direcional justamente na vitrine do hóspede, onde o material mais aparece.

## Regras

- Uma superfície por nível de profundidade. Cartão dentro de cartão: o de fora
  é `.glass`, o de dentro não é vidro nenhum.
- Texto branco só em `.glass-navy` e `.glass-dark`. Nas outras, `ink`.
- Raio e padding não vêm da classe — cada componente escolhe o seu na escala de
  raios. A classe é só o material.
- Para destacar um card, `.lift`: ele sobe 3px e **troca de camadas** de sombra.
  Não basta escurecer; sombra que só escurece faz o card parecer pressionado
  contra o fundo em vez de erguido dele.
