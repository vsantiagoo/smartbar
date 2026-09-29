# SmartBar

Minibar inteligente para hotéis. A trava só abre depois que o consumo está pago.

Este é o sistema de design do produto, extraído do código que está no ar — não
uma proposta. Cada valor aqui foi gerado executando `src/lib/theme.ts`, lendo
`tailwind.config.ts` e `src/app/globals.css`. Quando os dois discordarem, o
código manda.

## A promessa, e o que ela exige da interface

> **A trava só abre depois que o consumo está pago.**

Uma frase que serve aos dois lados: o hotel não perde, o hóspede não leva susto
no check-out. Isso tem consequência direta no desenho.

- **Nada de letra miúda.** Preço e total aparecem no tamanho do texto normal,
  nunca em `caption`. Se uma informação muda o que a pessoa vai pagar, ela não
  cabe numa legenda.
- **Cada etapa do pagamento diz onde a pessoa está.** Sem tela ambígua entre
  "pagando" e "pago" — a trava é física, e a dúvida vira chamado na recepção.
- **A confirmação é verde e explícita** (`ok-500`), a recusa é vermelha e
  explica o que fazer (`danger-500`). Nunca só um ícone.

## Três públicos, uma linguagem

| Público | O que quer | Como a interface responde |
| --- | --- | --- |
| Hóspede | Consumir rápido, pagar sem susto | Botões grandes, preço sempre visível, zero jargão |
| Recepção e governança | Menos conferência manual | Estado por cor e por forma, listas densas em `body-sm` |
| Gestão | Recuperar faturamento | Números em `numeral`, comparação antes de detalhe |

## Cor

Oito cores-base. Cada uma gera sozinha a escala 50→950 — claros misturados com
branco, escuros com preto — em `deriveScale()`. **Não existe hex solto nos
componentes:** tudo lê os tokens via CSS variables.

| Papel | Token | Onde aparece |
| --- | --- | --- |
| Primária | `brand-700` | Botão principal, marca, item ativo |
| Secundária | `crimson-500` | Urgência, reposição |
| Destaque | `gold-500` | Ação principal, "ao vivo", anel de foco |
| Sucesso | `ok-500` | Pago, estoque em dia |
| Erro | `danger-500` | Recusado, sem estoque |
| Texto | `ink` | Corpo e títulos |
| Fundo | `sky-1` → `sky-4` | Degradê fixo da página |

O fundo não é chapado: desce do azul-acinzentado frio (`sky-1`) ao tom quente
(`sky-4`), preso em `background-attachment: fixed`. É por isso que as
superfícies de vidro funcionam — há algo atrás delas para desfocar.

### Regras que não se quebram

- **Texto sobre cor forte:** branco sobre `brand-700` (11,27:1) e sobre
  `crimson-500` (5,84:1); `ink` sobre `gold-500` (4,88:1). O ouro nunca recebe
  texto branco.
- **`ink-faint` não é cor de texto.** Dá 2,47:1 sobre o fundo e reprova no AA.
  Serve para placeholder e ícone decorativo, nada mais. Precisa de texto
  apagado legível? Use `ink-soft` (4,50:1, no limite — não clareie mais).
- **Selo colorido usa o passo 600 no texto**, não o 500: `gold-600` sobre
  `gold-500/15`, `ok-600` sobre `ok-500/12`. O 500 como texto não passa.
- **Whitelabel (Premium):** um hotel pode sobrescrever `primary` e `accent`
  apenas na área do hóspede. O painel e o site permanecem na marca.

## Tipografia

A interface usa a **fonte do sistema operacional** — San Francisco no Apple,
Segoe UI no Windows, Roboto no Android. Nada a baixar, texto sempre nativo.
Duas exceções, ambas do Google Fonts:

- **Arial Bold** (700) apenas na palavra "SmartBar" — é a fonte do logotipo, não do texto da interface.
- **Plus Jakarta Sans** (800) apenas nos números grandes de resultados da home (`impact-stats.tsx`) — herança da logo antiga, quando a palavra usava essa fonte.
- **Doto** (700/800), pontilhada, apenas em números de destaque.

Entrelinha 1,6 no corpo e 1,2 nos títulos, com `tracking-tight`. O tamanho mais
usado do produto é `body-sm` (14px) — o painel e as listas vivem nele; `body`
(16px) é para leitura corrida.

**Nunca escreva "SmartBar" à mão.** Importe `Wordmark` ou `Logo`. A palavra tem
caixa, peso e fonte próprios, e reescrevê-la à mão foi como as primeiras
inconsistências apareceram.

## Marca

O logotipo é um contorno quadrado arredondado com uma linha vertical e **um
ponto de luz azul** que pulsa; ao lado, "Smart" em branco (ou azul-marinho no
claro) e "Bar" em azul elétrico. Proporções, animação e regras estão em
`components/Logo`. Todas as medidas vêm dos vídeos de referência da marca, não
de estimativa.

## Forma

Cantos generosos são a assinatura. A pílula (`radius-pill`) domina: botões,
selos, campos, abas e menus — 60 das ocorrências de raio no código. Cartões
usam `radius-card` (28px) e painéis maiores vão a 32 ou 40px. Na dúvida,
arredonde mais.

## Vidro

O material do sistema. Seis superfícies, cada uma com desfoque e saturação
próprios — misturá-las é o erro mais comum.

| Classe | Onde | Fundo |
| --- | --- | --- |
| `.glass` | Cartões sobre fundo claro | Branco 10% |
| `.glass-strong` | Cartões que precisam de leitura | Branco 82% |
| `.glass-frost` | Painéis de escrita | Cinza-azulado 12% |
| `.glass-navy` | Cartão de destaque | `brand-800` 82% |
| `.glass-dark` | Cabeçalho sobre foto | Preto-azulado 42% |
| `.glass-tint` | Botões e itens ativos | **nenhum** |

`.glass-tint` é o único sem cor própria: ele traz só desfoque, borda luminosa e
brilho interno. **A cor vem de um `bg-{cor}/{alpha}` ao lado** —
`glass-tint bg-brand-700/85`. Esquecer o `bg-` deixa o botão invisível.

## Movimento

Discreto e sempre reversível.

- **Entrada ao rolar:** `<Reveal>` — sobe 28px e aparece, uma vez só.
- **Rolagem amortecida:** `useSmoothScroll`, com perseguição exponencial
  independente da taxa de quadros.
- **Ondas da marca:** `signal-ping`, em sequência de dentro para fora.
- **Toque:** `active:scale-[0.97]` em todo botão.

Tudo respeita `prefers-reduced-motion` — um bloco global em `globals.css` zera
animação, transição e rolagem suave. Não reimplemente essa checagem por
componente.

## Acessibilidade

- Alvo de toque mínimo de **44px** (o botão `md`).
- Foco visível: contorno de 2px em `gold-500`, deslocado 2px, raio 12px.
  Nunca remova sem colocar outro.
- Contraste conferido por código (`contrastRatio()` em `theme.ts`), não a olho.
- O único par que reprova é `ink-faint` sobre o fundo, e ele está restrito a
  placeholder por isso.

## Voz

Profissional, direta, orientada a resultado, sem jargão técnico. Os textos
ficam num só arquivo, `src/lib/content/copy.ts`.

**Assim:**
- "Sirva-se. Pague em segundos."
- "Você só paga o que consumir. Sem cobranças surpresa no check-out."
- "A trava libera. O estoque se atualiza."

**Assim não:**
- Jargão exposto ao usuário: "RPC", "webhook", "idempotente".
- Promessa vaga: "solução inovadora e disruptiva".
- Tom de cobrança ou desconfiança com o hóspede.

## Onde isto mora no código

| O quê | Arquivo |
| --- | --- |
| Cores (fonte única) | `src/lib/theme.ts` |
| Forma, sombras, animações | `tailwind.config.ts` |
| Superfícies de vidro e utilitários | `src/app/globals.css` |
| Componentes | `src/components/ui/` |
| Textos | `src/lib/content/copy.ts` |
| Editor de cores ao vivo | `/design-system` |

Para mudar as cores: abra `/design-system`, use o editor, clique em **Copiar
tema** e cole em `DEFAULT_THEME`. Ou edite os hex direto. A escala inteira se
regenera sozinha.
