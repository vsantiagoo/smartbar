# Brandbook — SmartBar

> Identidade **visual**. A essência e o tom estão em
> [DNA-DA-MARCA.md](DNA-DA-MARCA.md); o produto, em [PRD.md](PRD.md).
>
> **Fonte única no código:** as cores vivem em
> [`src/lib/theme.ts`](../src/lib/theme.ts) e a forma (raios, sombras,
> animações) em [`tailwind.config.ts`](../tailwind.config.ts). Este documento
> descreve; o código decide. Ao mudar um, atualize o outro.

## 1. Cores

Cada cor-base gera automaticamente a escala 50→950 (claros com branco, escuros
com preto). Edite em `theme.ts` ou no editor ao vivo em `/design-system`
(**Copiar tema** → colar em `DEFAULT_THEME`).

| Papel | Hex | Vira a escala | Uso |
| --- | --- | --- | --- |
| Primária — Azul Corporativo | `#1B3A6B` | `brand` | CTAs, títulos, navegação |
| Secundária — Vermelho Executivo | `#C41E3A` | `crimson` | Urgência, alertas, reposição |
| Destaque — Ouro | `#F39200` | `gold` | Foco, "ao vivo", premium |
| Sucesso | `#27AE60` | `ok` | Aprovado, estoque em dia |
| Erro | `#E74C3C` | `danger` | Falha, sem estoque |
| Texto | `#2D3D34` | `ink` / `ink-soft` / `ink-faint` | Corpo, títulos e legendas |
| Fundo · topo | `#CFDCEE` | `sky-1` | Início do degradê da página |
| Fundo · base | `#F6EDE4` | `sky-4` | Fim do degradê da página |

- **Texto:** verde-escuro `#2D3D34`, contraste ~11,5:1 sobre branco (AAA). As
  variações `ink-soft`/`ink-faint` (mais claras) são para legendas e apoio.
- **Fundo:** degradê fixo do topo azul-acinzentado à base quente.
- **Whitelabel (Premium):** um hotel pode sobrescrever `primary` e `accent` só
  na área do hóspede.

## 2. Tipografia

- **Interface e corpo:** fonte do **sistema operacional** (San Francisco no
  Apple, Segoe UI no Windows, Roboto no Android). Nada a baixar, texto sempre nativo.
- **Logotipo "SmartBar":** Plus Jakarta Sans (via `Wordmark`).
- **Números de destaque:** fonte pontilhada Doto (valores, contadores).
- **Entrelinha:** 1,6 no corpo; 1,2 em títulos. Títulos com `tracking-tight`.

Nunca reescreva a palavra "SmartBar" à mão — importe `Wordmark` (ou `Logo`).

## 3. Logo (isotipo)

Frigobar + cadeado destravado + ondas de sinal — o gesto de "aproximar o cartão
e destravar". Definido em [`src/components/ui/logo.tsx`](../src/components/ui/logo.tsx).

- **Frigobar + cadeado:** seguem `currentColor` (controlado pelo `tone`).
- **Ondas de sinal:** sempre no degradê fixo da marca **âmbar → azul-marinho**
  (`#C98A2E → #5B4A38 → #1C3A63`); pulsam de dentro para fora.
- **Tons:** `brand` (azul, sobre claro) e `light` (branco, sobre escuro/foto).
- **Tamanhos:** `md` (padrão) e `sm` (reduzido, ao lado da barra de menus).

## 4. Forma

- **Raios:** pílula (`rounded-full`) em botões, chips e menus; cartões amplos
  (`4xl` = 2rem, `5xl` = 2.5rem). Cantos generosos são assinatura da marca.
- **Sombras:** `soft` (elevação suave), `glass` (brilho de vidro nas bordas),
  `press` (realce ao pressionar).
- **Textura:** linhas diagonais sutis (`.brand-diagonals`).

## 5. Superfícies de vidro (glassmorfismo)

Definidas em [`src/app/globals.css`](../src/app/globals.css):

| Classe | Onde | Descrição |
| --- | --- | --- |
| `.glass` / `.glass-strong` | Cartões sobre fundo claro | Branco translúcido + desfoque |
| `.glass-navy` | Cartão de destaque | Azul-marinho translúcido |
| `.glass-dark` | Cabeçalho/menu do site | Vidro escuro, legível sobre foto |
| `.glass-tint` | Botões e itens ativos | Vidro + uma cor ao lado (ex. `glass-tint bg-brand-700/85`) |

O `.glass-tint` só traz desfoque, borda luminosa e brilho interno; **a cor vem
de um `bg-{cor}/{alpha}` ao lado**.

## 6. Movimento

- **Entrada ao rolar:** `<Reveal>` (fade-up quando o bloco aparece).
- **Scroll amortecido:** `useSmoothScroll` (`lib/marketing/use-scroll-progress.ts`).
- **Ondas do logo:** `signal-ping`, em sequência.
- **Acessibilidade:** tudo respeita `prefers-reduced-motion` (desliga animações).

## 7. Voz da marca (resumo)

Profissional, direto, orientado a resultado, empático com a operação e **sem
jargão técnico**. Os textos ficam num só lugar,
[`src/lib/content/copy.ts`](../src/lib/content/copy.ts). O detalhamento do tom
está em [DNA-DA-MARCA.md](DNA-DA-MARCA.md).

## 8. Acessibilidade

- Contraste do texto conferido (função `contrastRatio` em `theme.ts`).
- Foco visível com contorno na cor de destaque do hotel.
- Alvo de toque mínimo de 44px em botões (tamanho `md`).
