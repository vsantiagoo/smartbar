Campo de texto em pílula, com variante de busca.

`src/components/ui/input.tsx` — exporta `Input` e `SearchField`.

Altura 44px, o mesmo alvo de toque do botão `md`, para que campo e botão
alinhem numa linha sem ajuste.

## O foco

Ao focar, a borda vai para `brand-300`, o fundo fica branco sólido e entra um
**anel de 4px** em `brand-700/10`. O anel é largo e fraco de propósito: engrossar
a borda faria o campo pular de tamanho.

Isso é o foco do campo. O foco de teclado global — contorno de 2px em
`gold-500` — vale para todo o resto e está em `globals.css`.

## O placeholder

Usa `ink-faint`, que dá **2,47:1** e reprova no AA. É aceitável aqui porque
placeholder não é conteúdo: ele desaparece quando a pessoa digita.

**Por isso o placeholder nunca substitui o rótulo.** Todo campo precisa de um
`<label>` visível, ou de um `aria-label` quando o desenho não comporta um. Um
formulário só com placeholders fica ilegível para quem tem baixa visão e vazio
para quem usa leitor de tela.

## Regras

- `SearchField` já traz `type="search"` e a lupa em `ink-faint`, posicionada com
  `pointer-events-none` para não roubar o clique.
- Não coloque unidade nem máscara dentro do placeholder ("R$ 0,00"): use texto
  de apoio abaixo do campo.

## O que o consumidor fornece

O `<label>`, o `placeholder` e o controle do valor. O componente cuida de
altura, raio, foco e estado.
