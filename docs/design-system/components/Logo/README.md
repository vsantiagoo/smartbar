Logotipo SmartBar 2.0: ícone com luz pulsante + a palavra.

`src/components/ui/logo.tsx` — exporta `Logo` (ícone + palavra), `LogoMark` (só o
ícone) e `Wordmark` (só a palavra).

## O desenho

Tudo em unidades do quadrado do ícone (o lado externo vale 100):

| Parte | Medida |
| --- | --- |
| Contorno | traço 4,55 · canto externo 17 · pontas redondas |
| Linha vertical | x 40,4 · de 16,95 a 83,05 · traço 3,05 · pontas redondas |
| Ponto de luz | centro (65,2 · 50) · disco r 7,6 `logo-dot` · núcleo r 3,5 `logo-core` |
| Halo | degradê `logo-halo` de raio 26,9; opacidade 0,40 na borda do disco → 0 |
| Palavra | Arial Bold · altura da caixa-alta 45,6% do ícone · "S" a 19,1% do contorno |

**Não há anéis nem ondas** — só um ponto e o halo suave. O tamanho todo vem de uma
variável, `--logo-size` (o lado do ícone): a palavra vale 63,7% dela e o
afastamento deriva dela, então a proporção nunca se desfaz. Para mudar de tamanho:

```tsx
<Logo className="[--logo-size:2rem]" />
<Logo className="[--logo-size:1.75rem] sm:[--logo-size:2rem]" />
```

## Fundo e tom

`tone="light"` (traço e "Smart" em `logo-ink`) para fundo escuro — cabeçalho do
site, rodapé. `tone="brand"` (padrão; `brand-700`) para fundo claro — painel,
login, área do hóspede. O ponto, o halo e o "Bar" são azuis nos dois.

## Movimento

Puro CSS (`.sb-*` em `globals.css`), sem JavaScript:

1. **Entrada — a cada carga ou recarga da página (≈ 1,7 s).** O contorno se
   desenha no sentido horário a partir do canto superior esquerdo (0,09–0,59 s);
   a linha desce (0,62–0,78 s); o ponto nasce com um flash de luz (0,9–1,45 s);
   a palavra clareia e desliza (1,15–1,7 s).
2. **Depois, só a luz pulsa.** Ciclo de 2 s, repouso → pico → repouso, com o raio
   do halo indo a 2,1× — é o pulso do GIF de loop da marca. Nada mais se mexe.

Repouso e pico foram medidos: o brilho médio do halo é **45** no repouso e **≈105**
no pico (referência: 45 e 109). `intro={false}` liga só o pulso (rodapé, painel).
`prefers-reduced-motion` pula a entrada e para o pulso.

## Celular

Abaixo de 1024px o cabeçalho mostra **só o ícone**, com a luz pulsando — passe
`wordmarkClassName="hidden lg:inline-block"` no `Logo`.

## Arquivos

No projeto (`public/logo/`): `smartbar-logo-{dark,light}.svg` e `smartbar-icon-{dark,light}.svg`
(vetor, texto em curvas) e `smartbar-logo-animated-dark.svg` / `smartbar-icon-animated-dark.svg`
(com a entrada e o pulso).

Pasta de entrega "Entrega 4K" (para mockups e peças): SVG 4K (3840 px, texto em curvas — abre igual
sem a fonte instalada), PNG 4K transparente (logo 3840×1034, ícone 3840×3840, versões para fundo
escuro e claro) e `smartbar-logo-4k.mp4` (3840×2160, entrada + dois ciclos do pulso).

## Regras

- **Não recolora o ponto nem o "Bar".** O azul é a assinatura.
- **Não redesenhe a proporção** — use `--logo-size`, nunca largura e altura soltas.
- **Nunca escreva "SmartBar" à mão** — use `Wordmark`.
- Área de respiro: metade do lado do ícone em volta.
- O link que envolve o logo leva `aria-label="SmartBar"`; o SVG é decorativo (`aria-hidden`).
