# Referência do design system

Documento técnico **só do design system**: tokens, escalas, material de vidro,
movimento, regras de tamanho e acessibilidade, e o catálogo de componentes. Não
fala de produto, público nem voz — isso fica no README.

Os valores saem do código (`src/lib/theme.ts`, `tailwind.config.ts`,
`src/app/globals.css`). Quando este texto e o código discordarem, o código manda.

## Como os documentos se dividem

| Documento | Do que trata |
| --- | --- |
| `referencia.md` (este) | O design system: tokens, escalas, vidro, movimento, componentes |
| `README.md` | O produto: promessa, públicos, voz, regras de uso gerais |
| `identidade-visual.md` | A marca e o site: logotipo, fotos, climas da home |
| `cores.md` | As cores: escalas com os códigos e **onde cada cor é aplicada em cada componente** |
| `tokens.json` | Todos os valores, em formato de máquina (cor, tipo, espaço, raio, sombra, desfoque) |
| `components/<Nome>/README.md` | Um componente: props, visual, regras |

## Princípios

1. **Nenhum hex solto.** A cor mora em `theme.ts` e chega aos componentes como
   variável CSS. Trocar o tema recolore tudo, inclusive por hotel.
2. **O vidro precisa de algo atrás.** O fundo é um degradê preso, não uma cor lisa;
   sobre fundo chapado todo vidro vira retângulo cinza.
3. **Nível é altura, não cor.** Três alturas de vidro; cada uma define desfoque e
   sombra. A cor é escolha de contraste.
4. **A luz vem de uma direção.** Topo aceso, laterais mudas, base insinuada. Aro
   igual nos quatro lados denuncia vidro sintético.
5. **Cantos generosos.** Na dúvida, arredonde mais.
6. **Movimento discreto e reversível.** E sempre respeitando `prefers-reduced-motion`.

## Cor

Oito cores-base geram, cada uma, a escala 50→950 em `deriveScale()`: claros
misturados com branco, escuros com preto. **Os códigos de cada passo e a cor de cada
componente estão em `cores.md`** (no PDF, com amostras coloridas).

| Papel | Escala | Base | Onde |
| --- | --- | --- | --- |
| Primária | `brand` | `brand-700` `#1B3A6B` | Botão principal, marca, item ativo |
| Secundária | `crimson` | `crimson-500` `#C41E3A` | Urgência, reposição |
| Destaque | `gold` | `gold-500` `#F39200` | Ação principal, "ao vivo", anel de foco |
| Sucesso | `ok` | `ok-500` `#27AE60` | Pago, estoque em dia |
| Erro | `danger` | `danger-500` `#E74C3C` | Recusado, sem estoque |

**Neutros:** `ink` `#2D3D34` (texto), `ink-soft` `#5B6861`, `ink-faint` `#89928D`.
**Fundo:** `sky-1` `#CFDCEE` → `sky-2` `#DEE2EA` → `sky-3` `#EBE8E7` → `sky-4`
`#F6EDE4`, em degradê preso (`background-attachment: fixed`).
**Marca (logotipo):** `#F2F5FA` (traço no escuro), `#4DA3FF` ("Bar"), `#76B6FC`
(ponto), `#E1EEFF` (núcleo), `#308BFF` (halo).

### Regras de cor

- Branco sobre `brand-700` dá 11,27:1; sobre `crimson-500`, 5,84:1. `ink` sobre
  `gold-500` dá 4,88:1 — **o ouro nunca recebe texto branco**.
- **`ink-faint` não é cor de texto** (2,47:1, reprova no AA). Só placeholder e ícone
  decorativo. Para texto apagado, `ink-soft` (4,50:1, no limite).
- Selo colorido usa o passo **600** no texto (`gold-600`, `ok-600`, `crimson-600`).
- Whitelabel (Premium): o hotel troca `primary` e `accent` só na área do hóspede.

### Modo escuro

Escopado: vale dentro de um elemento com `data-theme="dark"` — hoje o `#guest-root`
(app do hóspede) e o `#login-root` (tela de login). Reescreve só texto, fundo e
vidro; marca, ouro e sucesso continuam vindo do tema.

| Token | Claro | Escuro |
| --- | --- | --- |
| `--ink` / `--ink-soft` / `--ink-faint` | do tema | `228 233 240` / `166 177 193` / `134 146 164` |
| `--sky-1` … `--sky-4` | `#CFDCEE` … `#F6EDE4` | `21 28 43` · `16 22 34` · `12 17 27` · `9 12 20` |

A escolha é gravada no cookie `sb-appearance` e **vale nas duas telas**. O botão é o
`ThemeToggle`.

## Tipografia

Fonte do sistema operacional no texto (San Francisco, Segoe UI, Roboto). Exceções:

| Família | Uso |
| --- | --- |
| Sistema (`sans`) | Toda a interface |
| Arial Bold (`logo`) | Só a palavra "SmartBar" — nunca digite à mão, importe `Wordmark` |
| Plus Jakarta Sans (`stat`, `heading`) | Números grandes dos resultados da home (800) |
| Doto (`dot`) | Números de destaque, pontilhada |
| Mono | Código |

| Estilo | Tamanho | Entrelinha | Peso | Uso |
| --- | --- | --- | --- | --- |
| `display` | 3,2rem | 1,2 | 700 | Título do hero, único por página |
| `title-1` | 2,8rem | 1,2 | 700 | Abertura de seção pesada |
| `title-2` | 2,6rem | 1,2 | 700 | Título de seção |
| `title-3` | 2,2rem | 1,2 | 700 | Subtítulo de seção |
| `title-4` | 1,5rem | 1,2 | 600 | Título de cartão |
| `title-5` | 1,125rem | 1,3 | 600 | Cabeçalho de bloco |
| `body-lg` | 1,125rem | 1,6 | 400 | Linha de apoio do hero |
| `body` | 1rem | 1,6 | 400 | Corpo padrão |
| `body-sm` | 0,875rem | 1,6 | 400 | O mais usado: descrições, listas, painel |
| `caption` | 0,75rem | 1,5 | 600 | Selos, rótulos e legendas curtas |
| `button-sm` / `md` / `lg` | 0,875 / 0,95 / 1rem | 1 | 600 | Botões |
| `stat-number` | 2,8rem | 1 | 800 | Números dos resultados |
| `numeral` | 2,6rem | 1 | 800 | Números de destaque (Doto) |

**Preço e total nunca vão em `caption`.** Se muda o que a pessoa paga, tem tamanho de
texto normal.

## Espaçamento

Grade de 4px. Passos em uso: `space-1` 4 · `1.5` 6 · `2` 8 · `3` **12** (o mais usado)
· `4` 16 · `5` 20 · `6` 24 · `8` 32 · `10` 40 · `16` 64 · `24` 96. Padding de cartão:
`md` 20 (celular) / 24, `lg` 24 / 32. Respiro entre seções: 96.

## Raio

| Token | Valor | Papel |
| --- | --- | --- |
| `rounded-full` | 9999px | Botão, chip, campo, aba, menu — o dominante |
| `rounded-chip` | 12px | Selo, campo, ícone; contorno do foco |
| `rounded-control` | 20px | Barra ou controle estreito |
| `rounded-inset` | 24px | Bloco aninhado dentro de um card |
| `rounded-card` | 28px | Card, a superfície padrão |
| `rounded-panel` | 32px | Painel, coluna, dropdown |
| `rounded-surface` | 36px | Superfície cheia, sheet, tela |

**Aninhamento óptico:** o raio do filho é o do pai **menos** o respiro entre eles
(24px dentro de um card de 28px pede 4px de padding).

## Material de vidro

Seis classes em três níveis. Misturar níveis sem motivo parece erro de renderização.

| Nível | Desfoque | Sombra | Classes | Onde |
| --- | --- | --- | --- | --- |
| 1 · apoiada | `--blur-1` 14px | nenhuma projetada | `.glass-chip` | Selo, campo, ícone |
| 2 · elevada | `--blur-2` 22px | `--cast-1` | `.glass` · `.glass-tint` · `.glass-dark` | Cards, barras, botões |
| 3 · sobreposta | `--blur-3` 34px | `--cast-2` | `.glass-strong` · `.glass-navy` | Sheet, dropdown, destaque |

- `.glass-tint` e `.glass-chip` **não têm cor própria**: a cor vem de um `bg-{cor}/{alpha}`
  ao lado (`glass-tint bg-brand-700/85`). Sem o `bg-`, o elemento some.
- Tinta e borda são **degradês** (`padding-box` + `border-box`), nunca preenchimento chapado.
- Luz: `--rim-light` (fundo claro) e `--rim-dark` (fundo escuro). Sombras: `--cast-1`
  (contato + ambiente), `--cast-2`, `--cast-3` (reservada ao hover do nível 3).
- Texto branco só em `.glass-navy` e `.glass-dark`; nas outras, `ink`.
- Cartão dentro de cartão: o de fora é vidro, o de dentro não.
- `.lift` ergue o card 3px e troca as camadas de sombra.
- `.glass-liquid` desenha um fio de luz na borda (cor `#E8F0F9`); `.glass-liquid-shimmer`
  o faz pulsar.

## Movimento

| Animação | Duração | Uso |
| --- | --- | --- |
| `fade-up` | 0,4s | Entrada de bloco |
| `flash-in` | 2,2s | Realce de item novo (`gold-500`) |
| `pulse-ring` | 1,8s, infinita | Anel de pulso |
| `sheet-up` | 0,32s | Subida do sheet |
| `pop-in` | 0,5s | Aparição com leve estouro |
| `orbit` / `orbit-slow` | 30s / 46s | Órbitas decorativas |
| `blob-a` / `blob-b` | 18s / 22s | Manchas de fundo |
| `signal-ping` | 1,8s | Ondas da marca, de dentro para fora |
| `liquid-shimmer` | 3,4s | Fio de luz pulsante do botão Home |
| `nudge-shake` | 0,5s | Tremor curto no hover (`.shake-hover`) |

Também: `<Reveal>` (sobe 28px ao rolar, uma vez), `useSmoothScroll` (rolagem
amortecida) e `active:scale-[0.97]` em todo botão.

**`prefers-reduced-motion`:** um bloco global em `globals.css` zera animação,
transição e rolagem suave. Não reimplemente por componente.

## Tamanho e acessibilidade

- **Alvo de toque mínimo: 44px.** Botão `sm` 36px (`h-9`), `md` **44px** (`h-11`), `lg`
  56px (`h-14`), `icon` 44px. `Input` também `h-11`, texto 0,95rem, em pílula.
- **Foco visível:** contorno de 2px em `gold-500`, deslocado 2px, raio 12px. Nunca
  remova sem pôr outro.
- **Contraste conferido por código** (`contrastRatio()` em `theme.ts`). No sistema, o único
  par que reprova é `ink-faint` sobre o fundo, restrito a placeholder. O card de login
  tem pares próprios que reprovam (ver Pendências).
- Texto mínimo: `caption`, 12px.

## Catálogo de componentes

### Documentados

| Componente | Arquivo | O que é |
| --- | --- | --- |
| `Button` | `ui/button.tsx` | Botão em vidro, 6 variantes e 4 tamanhos |
| `Input` · `SearchField` | `ui/input.tsx` | Campo em pílula de vidro |
| `Badge` | `ui/badge.tsx` | Selo de estado |
| `GlassCard` | `ui/glass-card.tsx` | Card: superfícies `glass`, `strong`, `solid`, `navy`; padding `none`, `sm`, `md`, `lg` |
| `Segmented` | `ui/segmented.tsx` | Abas em pílula, com contador |
| `Stepper` | `ui/stepper.tsx` | Contador de quantidade |
| `Reveal` | `ui/reveal.tsx` | Entrada ao rolar |
| `Logo` · `LogoMark` · `Wordmark` · `InViewIntro` | `ui/logo.tsx`, `ui/logo-inview.tsx` | Logotipo e palavra, medidas dos vídeos de referência; entrada quando a logo aparece na tela |
| Vidro | `app/globals.css` | As seis superfícies (classes, não componente) |
| `LoginCard` | `admin/sections/aurum-login-card.tsx`, `login-toolbar.tsx` | Tela de login: vidro azul-petróleo, borda animada, botão fosco, barra home/idioma/tema |
| `ThemeToggle` | `guest/sections/theme-toggle.tsx` | Pílula claro/escuro. Props: `initialDark`, `label`, `rootId` (padrão `guest-root`) |
| `LanguageSwitcher` | `ui/language-switcher.tsx` | Seletor de idioma (PT, EN, ES); `tone` `dark` ou `light` |
| `Eyebrow` | `ui/eyebrow.tsx` | Rótulo miúdo acima do título de seção, entreletra 0,2em |
| `Sheet` | `ui/sheet.tsx` | Bottom sheet mobile-first em `.glass-strong`; fecha com Esc, clique fora e botão |
| Sinais da marca | `ui/marks.tsx` | Três desenhos próprios (celular, trava, prateleira): grade 24, traço 1,5 |
| `ProductTile` | `ui/product-icon.tsx` | Tile do produto em vidro: foto por SKU ou ícone sobre degradê |
| Primitivos | `ui/primitives.tsx` | `Skeleton`, `EmptyState`, `Meter`, `LiveDot`, `DotNumber`, `KpiCard` |

Todos os componentes de `ui/` e os dois do hóspede e do login têm README próprio em
`components/`. `components/Cover` tem só uma pré-visualização (`preview.html`); não há
componente com esse nome no código.

## Exceções documentadas

- **Card de login** (`LoginCard`): campos de 38px, raio de 8px, textos de 9,5px a
  11,5px e vidro próprio, fora das classes `.glass-*`. Decisão de design da tela de
  entrada; não copiar para telas operacionais.
- **Wordmark** em Arial Bold, fora da fonte do sistema.
- **Plus Jakarta Sans 800** e **Doto**: só nos números de destaque.

## Pendências conhecidas

- **Contraste do card de login.** Rótulos pequenos (4,15:1 no topo, 2,91:1 na base),
  placeholder (2,84:1) e o texto do botão fosco (3,67:1) reprovam o AA. Detalhes e
  números em `components/LoginCard`.
- **Alvo de toque do `Sheet`:** o botão de fechar tem 40px (`size-10`); o sistema pede 44px.
- **Acessibilidade do `Sheet` e do `LanguageSwitcher`:** o `aria-label` "Fechar" do sheet
  está fixo em português, e o menu de idioma fecha só com clique fora (sem Esc nem setas).
- **Cor fora das escalas:** os degradês do `ProductTile` usam `sky-100` e `amber-100`
  da paleta padrão do Tailwind, e não tokens do sistema.
- **Código sem uso:** `admin/sections/login-form.tsx` (substituído pelo `LoginCard`).
- **Material do login** vive só no CSS do componente; se outra tela precisar, vira
  classe em `globals.css`.

## Como mudar o design system

| Quero mudar | Onde |
| --- | --- |
| Cores | `src/lib/theme.ts` (ou editor ao vivo em `/design-system` → **Copiar tema** → `DEFAULT_THEME`) |
| Raio, sombra, animação, família de fonte | `tailwind.config.ts` |
| Vidro, modo escuro, utilitários | `src/app/globals.css` |
| Componentes | `src/components/ui/` |
| Textos | `src/lib/content/copy.ts` |

Ao alterar algo aqui, atualize também `tokens.json` e o README do componente
afetado.
