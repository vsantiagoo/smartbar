Tela de login do painel: card em vidro azul-petróleo com borda de luz animada, barra de ações no canto e fundo liso.

`src/components/admin/sections/aurum-login-card.tsx` · `login-toolbar.tsx` · `src/app/admin/login/page.tsx`

É a entrada da equipe do hotel (`/admin/login`). O card nasceu do protótipo
**AurumLogin** e foi adaptado: submete direto na Server Action `loginAction`
(`useActionState`), usa o i18n do sistema e herda os tokens de cor. O formulário
antigo (`login-form.tsx`) não é mais usado.

## Peças

| Peça | O que faz |
| --- | --- |
| `AurumLoginCard` | O card. Props: `demoEmail`, `demoPassword` (só no modo demonstração), `className`, `style`. |
| `LoginToolbar` | Canto superior direito: **home** (volta ao site), **idioma** (PT padrão, EN, ES) e **tema claro/escuro**. Os três são os mesmos botões do cabeçalho do hóspede. |
| `#login-root` | A casca da página. Recebe `data-theme="dark"` pelo botão de tema, como o `#guest-root` do hóspede, e usa o **mesmo cookie** (`sb-appearance`): a escolha vale nas duas telas. |

`ThemeToggle` deixou de depender do app do hóspede: agora recebe `label` (o
`aria-label` já traduzido) e `rootId` (o elemento que recebe `data-theme`, padrão
`guest-root`). Na tela do hóspede nada mudou.

## Fundo

Liso, sem listras: **`#E8F0F9`** no claro (`.login-root` em `globals.css`). No
escuro usa o mesmo degradê `sky-1` → `sky-4` do hóspede. Não leva a textura
`brand-diagonals`.

## O vidro do card

Material do botão de referência (liquid glass azul-petróleo), escopado no
componente — não é uma das superfícies `.glass-*`.

| Camada | Valor |
| --- | --- |
| Tinta | degradê `rgb(36 56 66 / .86)` no topo → `rgb(70 94 106 / .86)` na base (mais clara embaixo) |
| Desfoque | `blur(30px) saturate(1.6)` — sem escurecer o fundo |
| Aro | fio externo teal, aro claro no topo, **aro branco forte embaixo** |
| Refração | sombra interna junto às bordas e luz acumulada na base |
| Brilho especular | realce na quina de cima e faixa de luz subindo da base |

Os valores moram nas variáveis `--glass`, `--blurfx` e `--sb-surface` no topo do
CSS do componente.

## Borda animada e o ícone central

O card tem o contorno cortado em duas quinas (`--cut: 46px`) e um **rastro de luz**
que percorre a borda (cinco camadas, 9s por volta, `au-tail` → `au-core`).

Fechado, as duas pontas se unem no centro e formam o **ícone de quadrado
arredondado com uma diagonal**. A borda dele **pulsa suave** (`au-tip-pulse`,
3,4s): o halo vai de 2,6px a 5,2px e a opacidade de 0,5 a 1; o fio acompanha
(0,72 → 1). Ao passar o mouse, as pontas se separam e o card abre.

## Tipografia e cor

| Elemento | Valor |
| --- | --- |
| "SMARTBAR" | 10,5px, caixa-alta, espaçamento `.22em`, **mesmo glow do botão "Entrar" da barra de menu** (`0 0 8px` branco + `0 0 18px` azul-claro) |
| "Login" | fonte de sistema (SF Pro Display / Segoe UI), **27px, peso 300**, `#B8D0EE`, halo azul-claro |
| Subtítulo | 11,5px, peso 300 |
| Rótulos | 9,5px, caixa-alta, espaçamento `.11em` |
| Campos | 17px, 38px de altura, raio 8px, **afundados** no vidro (tinta escura + sombra interna) |
| Botão "Entrar" | vidro fosco, ver abaixo |
| Dica de repouso | 9,5px, branca, peso 300, opacidade pulsando |

O halo do "Login" é azul-claro e **fraco junto da letra**, de propósito: um halo
branco forte colado no texto dissolve a borda das letras e lê como desfoque.

### Botão "Entrar"

Pílula de vidro fosco translúcido: tinta branca em degradê (`.30` → `.18`),
`blur(14px) saturate(1.4)`, fio de luz na borda, brilho interno no topo, texto
branco, raio 14px e 40px de altura. **Hover:** sobe 1px, borda e preenchimento
clareiam (`.38` → `.24`) e um brilho desliza de uma ponta à outra (0,8s).

## Tamanho

O card é ampliado por **`zoom: 1.25`** no `.au-scene`: 280px parado → 350px, 368px
aberto → 460px. O zoom escala o conjunto inteiro (texto, campos, pontas e rastro)
sem quebrar proporção. O JS divide o espaço do pai por esse zoom para o limite de
largura em telas estreitas. A altura acompanha o conteúdo (`ResizeObserver`), então
trocar de idioma ou aparecer a mensagem de erro não deixa sobra nem vaza do card.

## Exceção às regras de tamanho do sistema

**Este card foge de propósito das regras de tamanho do design system.** Campos de
38px (o sistema pede 44px), raio de 8px (o sistema usa `chip` 12px ou pílula) e
textos de 9,5px a 11,5px (o sistema não desce de 12px). É uma decisão de design da
tela de entrada — compacta e minimalista — e **não deve ser copiada** para telas
operacionais do painel ou do hóspede, onde valem o alvo de toque de 44px e o
mínimo de 12px.

## Contraste (calculado)

Sobre o vidro, com tinta a 86% sobre `#E8F0F9`:

| Par | Razão | AA |
| --- | --- | --- |
| "Login" `#B8D0EE` sobre o topo do vidro | 5,18:1 | passa |
| Branco sobre o topo do vidro | 8,18:1 | passa |
| Branco sobre a base do vidro | 5,01:1 | passa |
| Rótulos (branco a 60%) sobre o topo | 4,15:1 | **reprova** (texto pequeno) |
| Rótulos (branco a 60%) sobre a base | 2,91:1 | **reprova** |
| Placeholder (branco a 36%) sobre o campo | 2,84:1 | **reprova** — é só placeholder |
| Texto branco no botão fosco | 3,67:1 | **reprova** para texto de 17px |

Pendências conhecidas: clarear os rótulos e o texto do botão, ou escurecer o vidro
na metade de baixo, leva todos os pares a 4,5:1. Ainda não foi feito.

## Regras

- O submit é a Server Action `loginAction`; o campo de e-mail se chama `email`.
  Mudar o nome quebra o login.
- Textos vêm do dicionário (`admin.login.heading`, `.hint`, `.loading`,
  `.showPassword` e as chaves antigas). Nada de texto fixo no componente.
- Respeita `prefers-reduced-motion` pelo bloco global de `globals.css`: o rastro, o
  pulso e o deslize do botão param.
- Navegadores sem suporte a `zoom` (Firefox anterior à versão 126) mostram o card no
  tamanho sem ampliação.

## O que o consumidor fornece

Só a página: ela lê o idioma e a aparência dos cookies, monta o `I18nProvider` e
passa as credenciais de demonstração quando o modo demo está ligado.
