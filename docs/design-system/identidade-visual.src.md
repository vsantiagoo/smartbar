# Identidade visual SmartBar

Guia da marca e do site — o que já está pronto e no ar. Tudo foi conferido contra o código e contra as telas reais (capturadas do próprio site). O app do hóspede e o painel do hotel ainda estão em construção e **ficam fora deste guia**: quando forem finalizados, entram aqui herdando tudo o que está abaixo. Onde algo é **proposta** e ainda não existe no código, está marcado assim: *(proposta)*.

## 1. A ideia visual

Uma marca de tecnologia para hotelaria, com o clima de hotel premium: **vidro fosco sobre degradê**, **azul-marinho com laranja de destaque**, **cantos muito arredondados**, títulos grandes e leves, e **uma luz azul** — a do logotipo — que é a única coisa que se mexe sozinha.

No site, três climas se alternam: o **cinematográfico** (foto de hotel à noite e vídeo do produto, no topo, no meio e no fecho), o **noturno** (a seção azul-marinho da história) e o **claro** (degradê frio-quente, com cartões de vidro).

## 2. Logotipo

Um quadrado arredondado, uma linha vertical e **um ponto de luz azul**, ao lado da palavra SmartBar. O quadrado é o compartimento, a linha é a porta e o ponto é a trava inteligente *(leitura proposta)*.

@@logo@@

**Versões:** horizontal (ícone + palavra) e só o ícone. O ícone sozinho é o que aparece no celular e na aba do navegador. **Fundos:** a versão para fundo escuro usa traço e "Smart" em `#F2F5FA`; a versão para fundo claro usa `#1B3A6B`. O ponto de luz e o "Bar" (`#4DA3FF`) são azuis nos dois e **nunca mudam de cor**.

**Construção** (o lado do ícone vale 100): contorno de 4,55 com canto externo de 17; linha vertical a 40,4 de 16,95 a 83,05; ponto no centro (65,2 · 50) com disco de raio 7,6 e núcleo de 3,5; halo azul de raio 26,9. A palavra é Arial Bold, com altura de caixa-alta de 45,6% do ícone; a tinta do "S" fica a 19,1% do contorno. Tudo escala a partir de uma medida só, o lado do ícone.

**Tamanhos em uso no site**

| Onde | Lado do ícone | Palavra |
| --- | --- | --- |
| Cabeçalho | 28 px (32 px a partir de 640 px) | Só a partir de 1024 px |
| Rodapé | 24 px | Sim |
| Selo "SmartBar · Minibar inteligente" | 20 px | Não |

**Área de respiro** *(proposta)*: meio lado do ícone em todos os lados. **Tamanho mínimo** *(proposta, baseada no menor uso real)*: ícone de 20 px sozinho; palavra a partir de 24 px de ícone.

**Movimento.** A cada carga ou recarga da página: o contorno se desenha no sentido horário, a linha desce, o ponto nasce com um flash de luz e o texto surge deslizando (≈ 1,7 s). Depois disso **só a luz azul pulsa**, em ciclos de 2 s. Nas seções abaixo da dobra a entrada toca quando a logo aparece na tela. No celular só o ícone fica visível no cabeçalho.

**Nunca:** recolorir o ponto ou o "Bar"; trocar a fonte da palavra; escrever "SmartBar" à mão (use o componente); esticar ou girar; pôr sobre fundo que esconda o traço; animar outra parte da logo além da luz.

**Ícone de aba, de tela inicial e imagem de compartilhamento.** Usam a mesma marca, com ajuste ótico para tamanhos pequenos (traços um pouco mais grossos, ponto maior) sobre azul-marinho `#0A1629`. A imagem de compartilhamento (1200×630) leva o logotipo, o título do site e o selo "Minibar inteligente · Pix ou cartão-chave".

@@og@@

## 3. Cor

A paleta é aberta: oito cores-base, e cada uma gera sozinha a escala de 50 a 950. Não existe hex solto nos componentes — tudo lê os tokens.

| Papel | Cor | Onde aparece no site |
| --- | --- | --- |
| **Primária** | Azul-marinho `#1B3A6B` | Marca, botão principal, plano em destaque |
| **Destaque** | Laranja `#F39200` | Botão de ação principal, palavras-chave dos títulos, ícones dos passos |
| **Secundária** | Carmim `#C41E3A` | Urgência |
| **Sucesso** | Verde `#27AE60` | Confirmação |
| **Erro** | Vermelho `#E74C3C` | Recusa |
| **Texto** | Verde-escuro `#2D3D34` | Corpo e títulos — nunca preto puro |
| **Luz da marca** | Azul `#4DA3FF` (halo `#308BFF`) | Só o logotipo |

**O fundo não é chapado.** Nas seções claras ele desce do azul-acinzentado frio (`#CFDCEE`) ao tom quente (`#F6EDE4`), preso na tela. É isso que dá algo para o vidro desfocar. A seção "Como funciona" usa o azul mais profundo, `#0A1629`.

**O laranja também colore palavras.** Nos grandes títulos, a segunda metade da frase vai em laranja ("depois que o consumo está pago", "e o pagamento garantido", "Para menos de 1%") — é a assinatura tipográfica da marca. Uma expressão-chave por título, nunca duas.

@@colors@@

**Regras que não se quebram.** Branco sobre azul-marinho (11,27:1) e sobre carmim (5,84:1); texto escuro sobre laranja (4,88:1) — laranja nunca recebe texto branco. `ink-faint` (2,47:1) serve só para placeholder e ícone decorativo. Selo colorido usa o passo 600 no texto, não o 500.

## 4. Tipografia

O site usa a **fonte do sistema operacional** (San Francisco no Apple, Segoe UI no Windows, Roboto no Android): nada a baixar, sempre nativa. Há exceções, cada uma com um único trabalho:

- **Arial Bold** — só na palavra SmartBar, no logotipo.
- **Plus Jakarta Sans 800** — só nos números grandes de resultados (−95%, 75%, 60%, 60×). Herança da logo anterior; ver "Pontos em aberto".
- **Doto** (pontilhada) — reservada para números de destaque do produto (faturamento, contadores); ainda não aparece no site.

Entrelinha 1,6 no corpo e 1,2 nos títulos, com tracking apertado. Os grandes títulos de abertura (herói, declaração, "Como funciona") são de **peso regular (400)**, enormes (até 64–72 px) e com tracking bem apertado; os títulos de resultados e planos vão em negrito. O contraste com os botões e selos semibold é intencional. Preço sempre no tamanho do texto normal, nunca em letra miúda.

@@type@@

## 5. Forma, vidro e profundidade

**Cantos generosos são a assinatura.** A pílula domina — botões, selos, abas, menus. Cartões usam 28 px; painéis maiores, 32 a 40 px; o herói tem moldura branca com cantos de 40 a 48 px. Na dúvida, arredonde mais.

**Vidro.** Seis superfícies, cada uma com desfoque e saturação próprios; misturá-las é o erro mais comum.

| Classe | Onde | Fundo |
| --- | --- | --- |
| `.glass` | Cartões sobre fundo claro | Branco 10% |
| `.glass-strong` | Cartões que precisam de leitura | Branco 82% |
| `.glass-frost` | Cartões de resultados | Cinza-azulado 12% |
| `.glass-navy` | Cartão de destaque | Azul-marinho 82% |
| `.glass-dark` | Cabeçalho e menu sobre foto | Preto-azulado 42% |
| `.glass-tint` | Botões e itens ativos | Nenhum — a cor vem do `bg-` ao lado |

O relevo vem do **fio de luz interno** (um traço branco de 1 px no topo), não do preenchimento. Cartão dentro de cartão não é vidro: o de fora é `.glass`, o de dentro é um bloco sólido leve.

@@spacing@@

## 6. Imagem e fotografia

- **Hotel premium à noite ou ao entardecer.** Lobby com piso espelhado e luz quente; fachada iluminada na hora azul. Arquitetura, sem pessoas, com o **contraste do dourado quente contra o azul frio** — que é a própria paleta da marca.
- **A mesma fachada em três horários** (dia, tarde, noite), revelados por uma lente que cruza a foto conforme a rolagem, no fecho da página.
- **Legibilidade antes de tudo.** As fotos ganham uma camada de azul-marinho a 30% e um degradê que escurece o topo (75%) e a base (80%), para o texto branco ler sem esforço.
- **O produto em fundo preto.** O minibar em 3D, com garrafas e a trava acesa em azul, montando-se conforme a rolagem; e um cadeado em rede de linhas douradas sobre o fundo claro, na declaração da marca.

Evitar: banco de imagem genérico de "pessoas sorrindo", hotel de dia sem luz de destaque, foto sem camada de contraste sob texto.

## 7. Iconografia

Ícones de **linha, traço uniforme e pontas redondas** (biblioteca Lucide), no tamanho do texto ao lado — 16 px em botões e listas, 20 a 28 px nos cartões de passos. Em fundo escuro, os ícones dos passos ("01, 02, 03") vão em laranja. Ícone decorativo nunca carrega significado sozinho: o rótulo está sempre ao lado.

## 8. Movimento

O site se mexe pouco e com propósito. Uma curva única domina as entradas — `cubic-bezier(0.22, 1, 0.36, 1)`: chega rápido e assenta devagar, sem quique.

| Intenção | Duração | Onde |
| --- | --- | --- |
| Entrada por rolagem | 0,9 s, sobe 28 px | Blocos do site (`Reveal`), em cascata de 90 ms |
| Logotipo | ≈ 1,7 s uma vez; depois pulso de 2 s | Ver seção 2 |
| Toque em botão | 0,2 s, encolhe a 97% | Todos os botões |
| Cenas que seguem a rolagem | Ligadas à rolagem | Montagem do produto, lente dia–noite, história |

**Sempre** respeitar `prefers-reduced-motion`: com a preferência ligada, tudo aparece já no lugar e a luz do logotipo para.

## 9. Grade e composição

- **Largura:** conteúdo centralizado em no máximo 72 rem (1152 px), com 24 px de margem lateral no celular e 40 px a partir de 640 px.
- **Ritmo vertical:** seções com 48 px (celular) a 64 px de respiro; em blocos de fecho, até 96 px.
- **Cabeçalho:** três colunas — logotipo, barra de menus em vidro escuro (sempre centralizada), espaço do mesmo peso. Abaixo de 1024 px o texto da logo sai e o menu desliza na horizontal.
- **Herói:** ocupa a altura da tela, com moldura branca a 12 px (20 px a partir de 640 px) da borda.
- **Alvo de toque mínimo:** 44 px.

## 10. O site, seção por seção

@@fig site-1-hero|Herói — foto do lobby com camada azul, título leve, botão laranja e menu de vidro escuro.@@

@@fig site-2-declaracao|Declaração da marca sobre o degradê claro, com o cadeado em linhas douradas; em seguida, a seção azul-marinho "Como funciona".@@

@@fig site-3-como-funciona|"Como funciona": três passos em cartões de vidro sobre azul-marinho, ícones laranja e a segunda metade do título em laranja.@@

@@fig site-4-resultados|Resultados: números grandes em cartões de vidro fosco.@@

@@fig site-5-planos|Planos por perfil: o seletor troca os preços; o plano em destaque é o cartão azul-marinho com botão laranja.@@

@@fig site-6-explorar|Explorar: três atalhos em vidro.@@

@@fig site-7-produto|O produto: minibar em 3D sobre fundo preto, montado conforme a rolagem.@@

@@fig site-8-rodape|Fecho: fachada do hotel, chamada final, botão laranja e logotipo discreto.@@

**No celular**

@@figs site-m-1-hero,site-m-2-declaracao|Herói e declaração no celular: só o ícone da logo no cabeçalho, menu que desliza na horizontal e botões em largura total.@@

## 11. Checklist de consistência

1. A logo é o componente (ou o arquivo oficial), nunca redesenhada nem digitada.
2. Nenhum hex solto: cor vem de token.
3. Um botão principal por seção; laranja só no que move a pessoa adiante.
4. Uma superfície de vidro por nível de profundidade.
5. Foto com camada de contraste sob o texto.
6. Movimento com `prefers-reduced-motion` respeitado.
7. Alvos de toque de 44 px.

## 12. Pontos em aberto

- **Números de resultados em Plus Jakarta Sans.** O código diz que usam "a mesma fonte da logo", mas a logo agora é Arial Bold. Duas saídas: trocar os números para Arial Bold (coerente com a logo) ou aceitar a Jakarta como fonte de números grandes. O guia registra o estado atual.
- **A Plus Jakarta Sans ainda é baixada** no carregamento só por causa desses números; se eles mudarem, ela pode sair.
- **Slogan.** "Consumo sem atrito." é proposta (ver DNA da marca); o site continua com "A tecnologia do consumo sem atrito."
- **Tamanho mínimo e área de respiro** do logotipo estão como proposta até serem aprovados.
- **App do hóspede e painel do hotel** entram neste guia quando estiverem finalizados.
