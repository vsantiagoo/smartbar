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
- **Títulos e logotipo:** Plus Jakarta Sans (`var(--font-heading)`), aplicada
  automaticamente em todo `h1`–`h4` por uma regra base em `globals.css`.
- **Números de destaque:** fonte pontilhada Doto (valores, contadores).
- **Entrelinha:** 1,6 no corpo; 1,2 em títulos. Títulos com `tracking-tight`.

Nunca reescreva a palavra "SmartBar" à mão — importe `Wordmark` (ou `Logo`).

### Caixa-alta: duas medidas, dois usos

Maiúsculas em corpo miúdo fecham — as letras têm todas a mesma altura e o olho
perde o apoio entre elas. Abrir a entreletra devolve a leitura, mas **quanto**
depende de para que serve o rótulo:

| Medida | Uso | Como |
| --- | --- | --- |
| `0.2em` | **Sobrescrita** de abertura de seção, no site | `<Eyebrow>` (`ui/eyebrow.tsx`) |
| `0.14em` | **Rótulo** de campo, grupo ou bloco, no painel e na vitrine | classe direta |

A sobrescrita abre uma seção — acontece uma vez por página e pode respirar. O
rótulo é lido de relance, muitas vezes ao dia: respiro demais atrapalha a
varredura. A `<Eyebrow>` ainda traz um fio antes do texto, que é o que a ancora
na margem; ele some quando o bloco é centralizado e não há margem para ancorar.

## 3. Logo (isotipo)

Frigobar + cadeado destravado + ondas de sinal — o gesto de "aproximar o cartão
e destravar". Definido em [`src/components/ui/logo.tsx`](../src/components/ui/logo.tsx).

- **Frigobar + cadeado:** seguem `currentColor` (controlado pelo `tone`).
- **Ondas de sinal:** sempre no degradê fixo da marca **âmbar → azul-marinho**
  (`#C98A2E → #5B4A38 → #1C3A63`); pulsam de dentro para fora.
- **Tons:** `brand` (azul, sobre claro) e `light` (branco, sobre escuro/foto).
- **Tamanhos:** `md` (padrão) e `sm` (reduzido, ao lado da barra de menus).

## 4. Forma

Cantos generosos são assinatura da marca. Mas "generoso" não é um número que se
escolhe na hora: há uma **escala óptica**, e o papel do elemento escolhe o degrau.

| Degrau | Valor | Papel |
| --- | --- | --- |
| `rounded-chip` | 12px | Selo, campo, ícone |
| `rounded-control` | 20px | Barra ou controle estreito |
| `rounded-inset` | 24px | Bloco aninhado dentro de um card |
| `rounded-card` | 28px | Card |
| `rounded-panel` | 32px | Painel, coluna, dropdown |
| `rounded-surface` | 36px | Superfície cheia, sheet, tela inteira |
| `rounded-full` | — | Botão, chip e menu em pílula |

**Aninhamento óptico:** o raio do filho é o do pai **menos** o respiro entre
eles. Um bloco de 24px dentro de um card de 28px pede 4px de padding para as
curvas ficarem concêntricas; com o mesmo raio nos dois, a curva interna parece
mais apertada que a externa.

Única exceção no código: a moldura da viewport no herói da landing, mais aberta
que `surface` de propósito — ela não é um material sobre a página, é a borda da
própria tela.

- **Sombras:** ver §5 — elevação é sempre `--cast-1..3`, nunca uma sombra avulsa.
- **Textura:** linhas diagonais sutis (`.brand-diagonals`).

## 5. Superfícies de vidro (glassmorfismo)

Definidas em [`src/app/globals.css`](../src/app/globals.css).

### A física: três decisões

1. **Distância óptica** (`--blur-1..3`). Um desfoque único na tela inteira
   achata tudo no mesmo plano. Quanto mais alto o elemento flutua, mais ele
   embaça o que está atrás.
2. **Luz direcional** (`--rim-light` / `--rim-dark`). Uma fonte só, vinda de
   cima: topo aceso, laterais quase mudas, base apenas insinuada, e uma sombra
   interna subindo do rodapé que dá espessura. Aro igual nos quatro lados é o
   maior delator de vidro sintético — na natureza a luz vem de uma direção.
3. **Sombra em camadas** (`--cast-1..3`). Contato (curta e densa, prova que o
   objeto toca o fundo) somada a ambiente (larga e difusa, prova que ele ocupa
   espaço). Uma camada só sempre parece adesivo colado na tela.

A tinta e a borda são **degradês**, não preenchimentos chapados — a luz entra
por cima e se apaga descendo. A borda usa a dobradinha `padding-box` +
`border-box` sobre uma borda transparente.

### Os três níveis

Nível é **altura**, não cor: a cor é escolha de contraste sobre o fundo.

| Nível | Desfoque | Sombra | Classes | Onde |
| --- | --- | --- | --- | --- |
| 1 · Apoiada | 14px | nenhuma projetada | `.glass-chip` | Selo, campo, ícone |
| 2 · Elevada | 22px | `--cast-1` | `.glass` · `.glass-tint` · `.glass-dark` | Cards, barras, botões |
| 3 · Sobreposta | 34px | `--cast-2` | `.glass-strong` · `.glass-navy` | Sheet, dropdown, destaque |

O `--cast-3` fica reservado ao **hover** do nível 3: se um elemento já está no
fundo máximo da escala parado, ao destacá-lo a sombra não tem para onde crescer.

`.glass-tint` e `.glass-chip` **não** definem `background`: a cor vem de um
`bg-{cor}/{alpha}` ao lado (ex. `glass-tint bg-brand-700/85`). Por isso a luz
neles fica só no aro, via `border-top-color` / `border-bottom-color`.

No **modo escuro** o que muda são os alfas e o aro (`--rim-dark`). O degradê de
tinta, o degradê de borda e as camadas de sombra continuam: chapar tudo numa cor
lisa apagaria a luz direcional justamente na vitrine, onde o vidro mais aparece.

## 6. Movimento

**A curva da marca é `cubic-bezier(0.16, 1, 0.3, 1)`.** Quase toda a distância é
vencida no primeiro terço do tempo e o resto é desaceleração — é assim que uma
coisa com massa chega. Uma curva simétrica (`ease`, `ease-in-out`) faz o
elemento parecer puxado por um motor, em velocidade constante: o movimento mais
denunciador de interface gerada.

- **Entrada ao rolar:** `<Reveal>`. A opacidade usa a mesma curva num tempo
  menor que o deslocamento; se as duas terminassem juntas, o último trecho do
  deslize pareceria um tranco.
- **Destaque de card:** `.lift` — o gesto único de elevação, no site e no
  produto. Sobe 3px e **troca de camadas** de sombra (nível 2 → 3). Não basta
  escurecer: a sombra precisa ficar mais larga, senão o card parece pressionado
  contra o fundo em vez de erguido dele. É o erro mais comum de hover em vidro.
- **Scroll amortecido:** `useSmoothScroll` (`lib/marketing/use-scroll-progress.ts`).
- **Ondas do logo:** `signal-ping`, em sequência.
- **Acessibilidade:** tudo respeita `prefers-reduced-motion` (desliga animações).

## 6.1. Sinais da marca

Ícones de biblioteca falam de software em geral: cadeado, caixa, QR. Os sinais
em [`ui/marks.tsx`](../src/components/ui/marks.tsx) falam do SmartBar — o
celular do hóspede com o código do quarto, a trava no instante seguinte ao
pagamento, a prateleira com os níveis em alturas diferentes.

Regras do traço: grade de 24, traço de **1.5**, ponta e junta arredondadas,
`currentColor`, e **um detalhe assimétrico em cada um** — é ali que mora a
autoria. No `MarkRoomCode`, o quarto módulo não fecha: o código ali não é um
fim, é uma porta.

O cadeado grande da declaração ([`lock-3d.tsx`](../src/components/marketing/lock-3d.tsx))
é peça à parte: geometria 3D desenhada à mão, com interação de arraste.

Lucide continua valendo para o **vocabulário comum** de interface (setas,
check, chevron). Um sinal da marca se desenha quando o conceito é do produto.

## 7. Voz da marca (resumo)

Profissional, direto, orientado a resultado, empático com a operação e **sem
jargão técnico**. Os textos ficam num só lugar,
[`src/lib/content/copy.ts`](../src/lib/content/copy.ts). O detalhamento do tom
está em [DNA-DA-MARCA.md](DNA-DA-MARCA.md).

## 8. Acessibilidade

- Contraste do texto conferido (função `contrastRatio` em `theme.ts`).
- Foco visível com contorno na cor de destaque do hotel.
- Alvo de toque mínimo de 44px em botões (tamanho `md`).
