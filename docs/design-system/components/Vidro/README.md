As seis superfícies de vidro — o material do sistema.

`src/app/globals.css`

Não são componentes, são classes. Cada uma tem desfoque e saturação próprios, e
misturá-las é o erro mais comum: dois cartões lado a lado com desfoques
diferentes parecem um erro de renderização, não uma escolha.

| Classe | Fundo | Desfoque · saturação | Onde |
| --- | --- | --- | --- |
| `.glass` | branco 10% | 16px · 1.6 | Cartão padrão sobre fundo claro |
| `.glass-strong` | branco 82% | 28px · 1.5 | Quando o texto precisa ser lido sem esforço |
| `.glass-frost` | cinza-azulado 12% | 26px · 1.05 | Painéis de escrita; raio próprio de 29px |
| `.glass-navy` | `brand-800` 82% | 28px · 1.4 | Cartão de destaque, texto branco |
| `.glass-dark` | preto-azulado 42% | 20px · 1.3 | Cabeçalho e menu sobre foto |
| `.glass-tint` | **nenhum** | 16px · 1.6 | Botões, chips e itens ativos |

## A regra do `.glass-tint`

É o único sem cor própria. Ele traz desfoque, borda luminosa e brilho interno —
nada mais. **A cor vem de um `bg-{cor}/{alpha}` ao lado:**

```
glass-tint bg-brand-700/85     ← botão principal
glass-tint bg-gold-500/85      ← botão de destaque
glass-tint border-white/60 bg-white/40
```

Sem o `bg-`, o elemento fica transparente e some.

## Por que funciona

O fundo da página é um degradê preso (`background-attachment: fixed`) que desce
do frio (`sky-1`) ao quente (`sky-4`). O vidro precisa de algo atrás para
desfocar — sobre um fundo chapado, todas as seis viram retângulos cinzentos.

O relevo vem do **fio de luz interno** (`inset 0 1px 0`), não do preenchimento.
É por isso que `.glass` funciona com apenas 10% de branco.

## Regras

- Uma superfície por nível de profundidade. Cartão dentro de cartão: o de fora
  é `.glass`, o de dentro não é vidro nenhum.
- Texto branco só em `.glass-navy` e `.glass-dark`. Nas outras quatro, `ink`.
- Raio e padding não vêm da classe — cada componente escolhe o seu. A classe é
  só o material.
