# Cores do design system

Escalas, códigos e **onde cada cor é aplicada**, componente por componente. Cada quadradinho é a cor
de verdade. Os códigos são lidos de `tokens.json` (gerado pelo `theme.ts`) e a aplicação de cada cor
foi levantada no código dos componentes — não é descrição de memória.

Onde há transparência (`brand-700` a 85%, por exemplo), o quadradinho mostra a cor cheia e o texto diz
a porcentagem aplicada. Sobre o fundo claro, a cor translúcida fica mais clara do que a amostra.

## Como ler

| Termo | Significa |
| --- | --- |
| `brand-700` | Token do sistema: família `brand`, passo 700 da escala 50→950 |
| `brand-700` · 85% | O mesmo token aplicado com 85% de opacidade (`bg-brand-700/85`) |
| fundo, texto, borda, anel | A propriedade em que a cor é usada. `hover`, `foco` e `escuro` indicam o estado |
| valor fixo | Hex escrito direto no código, fora das escalas |
| Tailwind, fora do sistema | Cor da paleta padrão do Tailwind, que não é um token do sistema |

## As cinco escalas

Cada cor-base gera sozinha os 11 passos (50 a 950): os claros são misturados com branco, os escuros com preto.
A **base** de cada escala é o passo marcado como papel: `brand-700`, `crimson-500`, `gold-500`, `ok-500` e `danger-500`.

### Primária · azul corporativo (`brand`)

<!--scale:brand-->

| Passo | Cor | RGB | Uso |
| --- | --- | --- | --- |
| `brand-50` | `#F4F5F8` | 244 245 248 | Fundo de aviso discreto em superfície branca. |
| `brand-100` | `#D5DAE4` | 213 218 228 | Divisórias e bordas sobre branco. |
| `brand-200` | `#B6C0CF` | 182 192 207 | Estados desabilitados. |
| `brand-300` | `#97A5BB` | 151 165 187 | Borda do campo em foco (Input). |
| `brand-400` | `#788AA7` | 120 138 167 | Ícones de apoio sobre fundo claro. |
| `brand-500` | `#596F93` | 89 111 147 | Ponto do selo informativo (Badge tone=info). |
| `brand-600` | `#3A557F` | 58 85 127 | Passo intermediário da escala; pouco usado direto. |
| `brand-700` **(base)** | `#1B3A6B` | 27 58 107 | PRIMÁRIA. Botão principal, texto da marca, item ativo de menu. Branco por cima dá 11,27:1. |
| `brand-800` | `#152E55` | 21 46 85 | Botão principal em hover; fundo do cartão de destaque (.glass-navy). |
| `brand-900` | `#10223F` | 16 34 63 | Sombra das superfícies de vidro. |
| `brand-950` | `#0A1629` | 10 22 41 | Fundo das seções escuras (fecho da home) e da sombra mais profunda. |

### Secundária · vermelho executivo (`crimson`)

<!--scale:crimson-->

| Passo | Cor | RGB | Uso |
| --- | --- | --- | --- |
| `crimson-50` | `#FCF4F5` | 252 244 245 | Fundo de alerta suave. |
| `crimson-100` | `#F1C9D0` | 241 201 208 | Borda de alerta. |
| `crimson-200` | `#E69EAA` | 230 158 170 | Passo claro da escala. |
| `crimson-300` | `#DA7485` | 218 116 133 | Passo claro da escala. |
| `crimson-400` | `#CF495F` | 207 73 95 | Passo claro da escala. |
| `crimson-500` **(base)** | `#C41E3A` | 196 30 58 | SECUNDÁRIA. Urgência e reposição. Branco por cima dá 5,84:1. |
| `crimson-600` | `#AC1A33` | 172 26 51 | Texto do selo de urgência (Badge tone=danger); hover do botão danger. |
| `crimson-700` | `#93172C` | 147 23 44 | Passo escuro da escala. |
| `crimson-800` | `#7B1324` | 123 19 36 | Passo escuro da escala. |
| `crimson-900` | `#630F1D` | 99 15 29 | Passo escuro da escala. |
| `crimson-950` | `#4A0B16` | 74 11 22 | Passo escuro da escala. |

### Destaque · ouro (`gold`)

<!--scale:gold-->

| Passo | Cor | RGB | Uso |
| --- | --- | --- | --- |
| `gold-50` | `#FEFAF2` | 254 250 242 | Fundo de destaque bem leve. |
| `gold-100` | `#FCE5C2` | 252 229 194 | Borda de destaque. |
| `gold-200` | `#FAD091` | 250 208 145 | Passo claro da escala. |
| `gold-300` | `#F8BB61` | 248 187 97 | Passo claro da escala. |
| `gold-400` | `#F5A730` | 245 167 48 | Botão de destaque em hover. |
| `gold-500` **(base)** | `#F39200` | 243 146 0 | DESTAQUE. Botão de ação principal, sinal de ao vivo, anel de foco. Texto ink por cima dá 4,88:1. |
| `gold-600` | `#D58000` | 213 128 0 | Texto do selo de atenção (Badge tone=warn) — o gold-500 como texto não teria contraste. |
| `gold-700` | `#B76E00` | 183 110 0 | Passo escuro da escala. |
| `gold-800` | `#995C00` | 153 92 0 | Passo escuro da escala. |
| `gold-900` | `#7A4A00` | 122 74 0 | Passo escuro da escala. |
| `gold-950` | `#5C3700` | 92 55 0 | Passo escuro da escala. |

### Sucesso · verde (`ok`)

<!--scale:ok-->

| Passo | Cor | RGB | Uso |
| --- | --- | --- | --- |
| `ok-50` | `#F4FBF7` | 244 251 247 | Fundo de confirmação. |
| `ok-100` | `#CBECD9` | 203 236 217 | Borda de confirmação. |
| `ok-200` | `#A2DCBB` | 162 220 187 | Passo claro da escala. |
| `ok-300` | `#79CD9C` | 121 205 156 | Passo claro da escala. |
| `ok-400` | `#50BD7E` | 80 189 126 | Passo claro da escala. |
| `ok-500` **(base)** | `#27AE60` | 39 174 96 | SUCESSO. Pagamento aprovado, estoque em dia. Ponto do selo ok. |
| `ok-600` | `#229854` | 34 152 84 | Texto do selo de sucesso (Badge tone=ok). |
| `ok-700` | `#1D8348` | 29 131 72 | Passo escuro da escala. |
| `ok-800` | `#186D3C` | 24 109 60 | Passo escuro da escala. |
| `ok-900` | `#145830` | 20 88 48 | Passo escuro da escala. |
| `ok-950` | `#0F4224` | 15 66 36 | Passo escuro da escala. |

### Erro · vermelho (`danger`)

<!--scale:danger-->

| Passo | Cor | RGB | Uso |
| --- | --- | --- | --- |
| `danger-50` | `#FEF6F5` | 254 246 245 | Fundo de erro. |
| `danger-100` | `#F9D4D0` | 249 212 208 | Borda de erro. |
| `danger-200` | `#F5B2AB` | 245 178 171 | Passo claro da escala. |
| `danger-300` | `#F09086` | 240 144 134 | Passo claro da escala. |
| `danger-400` | `#EC6E61` | 236 110 97 | Passo claro da escala. |
| `danger-500` **(base)** | `#E74C3C` | 231 76 60 | ERRO. Pagamento recusado, sem estoque. |
| `danger-600` | `#CA4335` | 202 67 53 | Texto de erro sobre fundo claro. |
| `danger-700` | `#AE392D` | 174 57 45 | Passo escuro da escala. |
| `danger-800` | `#913026` | 145 48 38 | Passo escuro da escala. |
| `danger-900` | `#74261E` | 116 38 30 | Passo escuro da escala. |
| `danger-950` | `#581D17` | 88 29 23 | Passo escuro da escala. |

## Neutros, fundo e marca

### Texto (`ink`)

| Cor | Token | RGB | Onde |
| --- | --- | --- | --- |
| `#2D3D34` | `ink` | 45 61 52 | Texto e títulos. Verde-escuro, não preto: 11,48:1 sobre branco (AAA). |
| `#5B6861` | `ink-soft` | 91 104 97 | Legendas e texto de apoio. 4,50:1 sobre o fundo — exatamente no limite do AA. Não clareie mais. |
| `#89928D` | `ink-faint` | 137 146 141 | SÓ para placeholder e ícone decorativo. 2,47:1 sobre o fundo: REPROVA no AA. Nunca use em texto que precise ser lido. |

### Fundo da página (`sky`)

<!--gradient:sky-->

O fundo é um degradê preso, do azul-acinzentado frio ao tom quente, nunca uma cor lisa.

| Cor | Token | RGB | Onde |
| --- | --- | --- | --- |
| `#CFDCEE` | `sky-1` | 207 220 238 | Topo do degradê da página (azul-acinzentado). |
| `#DEE2EA` | `sky-2` | 222 226 234 | 38% do degradê. É o fundo médio contra o qual o texto é medido. |
| `#EBE8E7` | `sky-3` | 235 232 231 | 72% do degradê. |
| `#F6EDE4` | `sky-4` | 246 237 228 | Base do degradê (tom quente). O fundo vai do frio ao quente de cima para baixo. |

**No modo escuro** o degradê muda para quatro tons profundos (dentro de `data-theme="dark"`):

| Cor | Token | RGB |
| --- | --- | --- |
| `#151C2B` | `sky-1` (escuro) | 21 28 43 |
| `#101622` | `sky-2` (escuro) | 16 22 34 |
| `#0C111B` | `sky-3` (escuro) | 12 17 27 |
| `#090C14` | `sky-4` (escuro) | 9 12 20 |

Texto no escuro: `ink` 228 233 240 (`#E4E9F0`), `ink-soft` 166 177 193 (`#A6B1C1`) e `ink-faint` 134 146 164 (`#8692A4`).

### Cores do logotipo

| Cor | Token | RGB | Onde |
| --- | --- | --- | --- |
| `#F2F5FA` | `logo-ink` | 242 245 250 | LOGO sobre fundo escuro: traço do ícone e a palavra "Smart". Medido nos vídeos de referência (242,245,250). |
| `#4DA3FF` | `logo-blue` | 77 163 255 | LOGO: a sílaba "Bar". Azul elétrico (77,163,255), igual nos dois fundos. |
| `#76B6FC` | `logo-dot` | 118 182 252 | LOGO: disco do ponto de luz (raio 7,6 em 100). |
| `#E1EEFF` | `logo-core` | 225 238 255 | LOGO: núcleo claro do ponto de luz (raio 3,5 em 100). |
| `#308BFF` | `logo-halo` | 48 139 255 | LOGO: cor do halo. A opacidade cai de 0,40 na borda do disco até 0 a 26,9; no pulso o raio dobra. |

Em fundo claro, o traço e o "Smart" usam `brand-700` (`#1B3A6B`). O ponto, o núcleo, o halo e o "Bar" nunca mudam de cor.

## Cores do material de vidro

As seis superfícies (`globals.css`). As tintas são degradês de cima para baixo; a luz vem de uma direção.

| Cor | Classe | Como é a tinta |
| --- | --- | --- |
| — | `.glass-chip` | Sem cor própria: a cor vem do `bg-` ao lado. Só desfoque, fio de luz e brilho. |
| `#FFFFFF` | `.glass` | Tinta branca de 17% no topo a 6% na base; borda em degradê branco de 50% a 4%. Para fundo claro. |
| — | `.glass-tint` | Sem cor própria: `glass-tint bg-brand-700/85`. É o vidro dos botões coloridos. |
| `#0E1420` | `.glass-dark` | Tinta `rgb(14 20 32)` a 46% → `rgb(6 10 18)` a 56% (`#060A12`). Cabeçalho e menu sobre foto. |
| `#FFFFFF` | `.glass-strong` | Tinta branca de 88% no topo a 72% na base. Quando o texto precisa de leitura. |
| `#1B3A6B` | `.glass-navy` | `brand-700` a 88% → `brand-900` (`#10223F`) a 92%. Cartão de destaque, texto branco. |

Sombras e luz: `--rim-light` (aro branco, topo aceso) e `--rim-dark` (a mesma luz com menos alfa); as projeções
`--cast-1` a `--cast-3` usam `brand-950` (`#0A1629`) com 6% a 38% de opacidade.

## Cor de cada componente

Para cada componente: o vidro que usa e cada cor com o token, o código e **onde é aplicada**.

### Button

Seis variantes, todas em vidro; a cor da variante vem do `bg-` ao lado. Arquivo: `ui/button.tsx`. Vidro: `.glass`, `.glass-tint`.

| Cor | Token | Onde é aplicada |
| --- | --- | --- |
| `#1B3A6B` | `brand-700` · 85% | Variante `primary`: fundo (hover: `brand-800` a 90%, `#152E55`) |
| `#FFFFFF` | `branco` | Variante `primary` e `danger`: texto |
| `#F39200` | `gold-500` · 85% | Variante `accent`: fundo (hover: `gold-400` a 90%, `#F5A730`) |
| `#2D3D34` | `ink` | Variante `accent`, `glass`, `soft` e `ghost`: texto |
| `#C41E3A` | `crimson-500` · 85% | Variante `danger`: fundo (hover: `crimson-600` a 90%, `#AC1A33`) |
| `#FFFFFF` | `branco` | Variantes `glass`, `soft` e `ghost`: fundo no hover (80%, 60% e 50%) e borda a 60% (`soft`; `ghost` no hover); `soft` tem fundo a 40% |

### Input

Campo em pílula; também o `SearchField`. Arquivo: `ui/input.tsx`. Vidro: `.glass-chip`.

| Cor | Token | Onde é aplicada |
| --- | --- | --- |
| `#FFFFFF` | `branco` | Fundo a 55% (branco cheio ao focar) |
| `#2D3D34` | `ink` | Texto digitado |
| `#89928D` | `ink-faint` | Placeholder e ícone da lupa |
| `#97A5BB` | `brand-300` | Borda ao focar |
| `#1B3A6B` | `brand-700` · 10% | Anel de foco (4px) |

### Badge

Seis tons. Cada um tem fundo, texto e **ponto** (o pontinho opcional). Arquivo: `ui/badge.tsx`. Vidro: `.glass-chip`.

| Cor | Token | Onde é aplicada |
| --- | --- | --- |
| `#2D3D34` | `ink` · 8% | Tom `neutral`: fundo |
| `#2D3D34` | `ink` | Tom `neutral`: texto; tom `gold`: texto |
| `#89928D` | `ink-faint` | Tom `neutral`: ponto |
| `#1B3A6B` | `brand-700` · 10% | Tom `info`: fundo (escuro: branco a 10%) |
| `#1B3A6B` | `brand-700` | Tom `info`: texto (escuro: branco) |
| `#596F93` | `brand-500` | Tom `info`: ponto |
| `#27AE60` | `ok-500` · 12% | Tom `ok`: fundo |
| `#229854` | `ok-600` | Tom `ok`: texto |
| `#27AE60` | `ok-500` | Tom `ok`: ponto |
| `#F39200` | `gold-500` · 15% | Tom `warn`: fundo |
| `#D58000` | `gold-600` | Tom `warn`: texto |
| `#F39200` | `gold-500` | Tom `warn`: ponto; tom `gold`: fundo cheio |
| `#C41E3A` | `crimson-500` · 10% | Tom `danger`: fundo |
| `#AC1A33` | `crimson-600` | Tom `danger`: texto |
| `#C41E3A` | `crimson-500` | Tom `danger`: ponto |
| `#0A1629` | `brand-950` | Tom `gold`: ponto |

### GlassCard

A cor vem da superfície escolhida: `glass`, `strong`, `solid` (usa `glass-strong`) ou `navy`. Arquivo: `ui/glass-card.tsx`. Vidro: `.glass`, `.glass-strong`, `.glass-navy`.

| Cor | Token | Onde é aplicada |
| --- | --- | --- |
| `#1B3A6B` | `brand-700` · 88% | Superfície `navy`: tinta de cima (desce até `brand-900` a 92%, `#10223F`) |
| `#FFFFFF` | `branco` | Superfície `navy`: texto |
| `#5B6861` | `ink-soft` | Texto de apoio (`hint`) do card |

### Segmented

Pílula `.glass` com abas; a ativa vira `glass-tint`. Arquivo: `ui/segmented.tsx`. Vidro: `.glass`, `.glass-tint`.

| Cor | Token | Onde é aplicada |
| --- | --- | --- |
| `#1B3A6B` | `brand-700` · 80% | Aba ativa: fundo |
| `#FFFFFF` | `branco` | Aba ativa: texto; contador da ativa: texto (fundo branco a 20%); hover das inativas: fundo a 70% |
| `#5B6861` | `ink-soft` | Aba inativa: texto (no hover vira `ink`) |
| `#1B3A6B` | `brand-700` · 10% | Contador da aba inativa: fundo (escuro: branco a 10%) |
| `#1B3A6B` | `brand-700` | Contador da aba inativa: texto |

### Stepper

Contador de quantidade em pílula. Arquivo: `ui/stepper.tsx`. Vidro: `.glass-tint`.

| Cor | Token | Onde é aplicada |
| --- | --- | --- |
| `#1B3A6B` | `brand-700` · 85% | Fundo da pílula |
| `#FFFFFF` | `branco` | Número e sinais de + e −; hover dos botões: fundo a 15% |

### Eyebrow

O rótulo miúdo acima do título de seção. Arquivo: `ui/eyebrow.tsx`.

| Cor | Token | Onde é aplicada |
| --- | --- | --- |
| `#596F93` | `brand-500` | Tom `light`: texto e fio (o fio herda a cor, a 45%) |
| `#FFFFFF` | `branco` | Tom `dark`: texto e fio, a 55% |

### Sheet

O painel é `.glass-strong`; a cortina atrás escurece a tela. Arquivo: `ui/sheet.tsx`. Vidro: `.glass-strong`.

| Cor | Token | Onde é aplicada |
| --- | --- | --- |
| `#0A1629` | `brand-950` · 40% | Cortina atrás do sheet (com desfoque de 3px) |
| `#1B3A6B` | `brand-700` · 20% | Alça de arrastar (só no celular) |
| `#1B3A6B` | `brand-700` · 10% | Botão de fechar: fundo no hover |
| `#FFFFFF` | `branco` | Fio entre o conteúdo e o rodapé: a 70% |

### Primitivos

Skeleton, EmptyState, Meter, LiveDot, DotNumber e KpiCard. Arquivo: `ui/primitives.tsx`. Vidro: `.glass-chip`, `.glass`.

| Cor | Token | Onde é aplicada |
| --- | --- | --- |
| `#1B3A6B` | `brand-700` · 10% | Skeleton: fundo; EmptyState: fundo do tile do ícone; Meter: trilho; KpiCard tom `info`: fundo do tile |
| `#1B3A6B` | `brand-700` | EmptyState: ícone; KpiCard tom `info`: ícone |
| `#2D3D34` | `ink` | EmptyState: título; DotNumber: texto |
| `#5B6861` | `ink-soft` | EmptyState: descrição; KpiCard: rótulo e dica |
| `#3A557F` | `brand-600` | Meter tom `info`: preenchimento |
| `#27AE60` | `ok-500` | Meter tom `ok`: preenchimento; LiveDot tom `ok` |
| `#F39200` | `gold-500` | Meter tom `warn`: preenchimento; LiveDot tom `warn` |
| `#C41E3A` | `crimson-500` | Meter tom `danger`: preenchimento |
| `#F39200` | `gold-500` · 15% | KpiCard tom `gold`: fundo do tile (ícone em `gold-600`) |
| `#C41E3A` | `crimson-500` · 10% | KpiCard tom `danger`: fundo do tile (ícone em `crimson-600`) |
| `#27AE60` | `ok-500` · 12% | KpiCard tom `ok`: fundo do tile (ícone em `ok-600`) |

### ProductTile

Sem foto, o tile é um degradê diagonal (do canto de cima à esquerda ao de baixo à direita) com o ícone por cima. Cada `iconKey` tem o seu par. Arquivo: `ui/product-icon.tsx`. Vidro: `.glass-chip`.

| Ícone (`iconKey`) | De | Para | Ícone |
| --- | --- | --- | --- |
| `glass-water` | `#E0F2FE` sky-100 (Tailwind, fora do sistema) | `#D5DAE4` brand-100 | `#3A557F` brand-600 |
| `cup-soda` | `#F1C9D0` crimson-100 | `#FCE5C2` gold-100 | `#AC1A33` crimson-600 |
| `grape` | `#D5DAE4` brand-100 | `#F1C9D0` crimson-100 | `#1B3A6B` brand-700 |
| `nut` | `#FCE5C2` gold-100 | `#FEF3C7` amber-100 (Tailwind, fora do sistema) | `#D58000` gold-600 |
| `cookie` | `#FCE5C2` gold-100 | `#FCF4F5` crimson-50 | `#D58000` gold-600 |
| `wheat` | `#FEF3C7` amber-100 (Tailwind, fora do sistema) | `#FEFAF2` gold-50 | `#D58000` gold-600 |
| `popcorn` | `#FEFAF2` gold-50 | `#F1C9D0` crimson-100 | `#AC1A33` crimson-600 |
| `package` | `#D5DAE4` brand-100 | `#FFFFFF` branco | `#3A557F` brand-600 |

### Logo

Cores próprias da marca; o ponto e o halo nunca mudam. Arquivo: `ui/logo.tsx`.

| Cor | Token | Onde é aplicada |
| --- | --- | --- |
| `#1B3A6B` | `brand-700` | Contorno, linha e "Smart" no tom `brand` (fundo claro) |
| `#F2F5FA` | `valor fixo` | Contorno, linha e "Smart" no tom `light` (fundo escuro) |
| `#4DA3FF` | `valor fixo` | A palavra "Bar" |
| `#76B6FC` | `valor fixo` | Disco do ponto de luz |
| `#E1EEFF` | `valor fixo` | Núcleo do ponto |
| `#308BFF` | `valor fixo` | Halo do ponto (degradê de 90% a 0%) |

### LanguageSwitcher

Dois tons: sobre faixa escura e sobre vidro claro. Arquivo: `ui/language-switcher.tsx`. Vidro: `.glass-dark`, `.glass-liquid`, `.glass-chip`, `.glass-strong`.

| Cor | Token | Onde é aplicada |
| --- | --- | --- |
| `#FFFFFF` | `branco` | Tom `dark`: texto a 80% (hover: fundo a 15%). Tom `light`: fundo a 60% (hover: 80%) |
| `#5B6861` | `ink-soft` | Tom `light`: texto; opção inativa do menu: texto |
| `#2D3D34` | `ink` | Tom `light`: texto no hover |
| `#1B3A6B` | `brand-700` · 10% | Opção ativa do menu: fundo |
| `#1B3A6B` | `brand-700` | Opção ativa do menu: texto |
| `#1B3A6B` | `brand-700` · 5% | Opção do menu: fundo no hover |
| `#89928D` | `ink-faint` | Código do idioma ao lado do nome (`PT`, `EN`, `ES`) |
| `#E8F0F9` | `valor fixo` | Fio de luz da borda (`.glass-liquid`) |

### ThemeToggle

Pílula claro/escuro com botão deslizante. O botão tem cor própria em cada modo. Arquivo: `guest/sections/theme-toggle.tsx`. Vidro: `.glass-dark`, `.glass-liquid`.

| Cor | Token | Onde é aplicada |
| --- | --- | --- |
| `#FCD34D` | `amber-300 (Tailwind, fora do sistema)` · 70% | Ícone do sol nas pontas (Tailwind, fora do sistema) |
| `#BAE6FD` | `sky-200 (Tailwind, fora do sistema)` · 70% | Ícone da lua nas pontas (Tailwind, fora do sistema) |
| `#FFEEBA` | `valor fixo` | Botão no modo claro: início do degradê radial (termina em `#F6C04A`, com glow da mesma cor a 60%) |
| `#F6C04A` | `valor fixo` | Botão no modo claro: fim do degradê e glow |
| `#5A3B00` | `valor fixo` | Botão no modo claro: ícone do sol |
| `#D6E6FF` | `valor fixo` | Botão no modo escuro: início do degradê (termina em `#7BA2EC`) |
| `#7BA2EC` | `valor fixo` | Botão no modo escuro: fim do degradê e glow a 60% |
| `#16233F` | `valor fixo` | Botão no modo escuro: ícone da lua |

### LoginCard

O card de login tem paleta própria, fora das escalas (vidro azul-petróleo). Arquivo: `admin/sections/aurum-login-card.tsx`, `login-toolbar.tsx`.

| Cor | Token | Onde é aplicada |
| --- | --- | --- |
| `#E8F0F9` | `valor fixo` | Fundo liso da página de login (modo claro) |
| `#243842` | `valor fixo` · 86% | Vidro do card: tinta do topo (desce até `#465E6A` a 86%) |
| `#465E6A` | `valor fixo` · 86% | Vidro do card: tinta da base |
| `#B8D0EE` | `valor fixo` | Título "Login" (com halo em `#8CC8FF` e `#4DA3FF`) |
| `#8CC8FF` | `valor fixo` | Halo do título e glow do "SMARTBAR" (com branco) |
| `#F2F5FA` | `valor fixo` | "SMARTBAR" no topo do card |
| `#F2EFEA` | `valor fixo` | Texto do card (`ink`): rótulos a 60%, placeholder a 36%, texto digitado a 100% |
| `#08161E` | `valor fixo` · 30% | Campos de e-mail e senha (afundados no vidro) |
| `#596F93` | `brand-500` | Acento do card: rastro de luz da borda, foco dos campos e halo do ícone central |
| `#97A5BB` | `brand-300` | Acento claro: miolo do rastro de luz e fio das pontas |
| `#FFFFFF` | `branco` | Botão "Entrar" (vidro fosco): tinta de 30% a 18%, borda a 22%, texto branco |
| `#283E4A` | `valor fixo` · 64% | Pontas recortadas do card: preenchimento (o rastro de luz corre pela borda) |
| `#FFFFFF` | `branco` · 85% | Barra de ações: ícone do botão Home (hover: fundo branco a 15%) |
| `#E88A89` | `valor fixo` | Mensagem de erro do login |

## Cores fora das escalas

Estas cores não são tokens do sistema. Estão listadas aqui para ficarem visíveis:

- **Tailwind padrão:** `sky-100` (`#E0F2FE`) e `amber-100` (`#FEF3C7`) no `ProductTile`; `amber-300` (`#FCD34D`) e `sky-200` (`#BAE6FD`) no `ThemeToggle`. Não confundir com o `sky-1…sky-4` do sistema, que é o fundo da página.
- **Botão do `ThemeToggle`:** seis valores fixos no CSS (`.theme-knob`), dois por modo.
- **Card de login:** a paleta própria da tabela acima.
- **Logotipo:** cinco cores fixas, por desenho (são tokens `logo-*` em `tokens.json`).

