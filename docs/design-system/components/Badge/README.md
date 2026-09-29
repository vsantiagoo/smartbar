Selo de estado em pílula, com ponto opcional.

`src/components/ui/badge.tsx`

## Os tons dizem coisas diferentes

| Tom | Significa | Fundo · texto |
| --- | --- | --- |
| `neutral` | Sem estado | `ink/8` · `ink` |
| `info` | Em andamento | `brand-700/10` · `brand-700` |
| `ok` | Concluído, saudável | `ok-500/12` · `ok-600` |
| `warn` | Precisa de atenção hoje | `gold-500/15` · `gold-600` |
| `danger` | Bloqueado agora | `crimson-500/10` · `crimson-600` |
| `gold` | Plano ou recurso pago | `gold-500` cheio · `ink` |

Repare que o texto usa sempre o passo **600**, nunca o 500: `gold-500` como
texto sobre fundo claro não alcança 4,5:1. O fundo usa o 500 com alfa baixo.

## Ponto e pulso

`dot` acende o ponto; `pulse` faz ele pulsar (`pulse-ring`) e serve **só para
dado que está chegando agora** — venda ao vivo, trava abrindo. Um pulso
permanente vira ruído e some da percepção em minutos.

## Regras

- O selo nomeia o estado, não a ação: "Sem estoque", não "Repor".
- Estado nunca é só cor: o texto sempre diz o que é. Quem não distingue
  vermelho de verde precisa ler a mesma informação.
- Um selo por objeto. Dois lado a lado viram uma frase que ninguém lê.

## O que o consumidor fornece

O texto do estado. O componente cuida de cor, raio, ponto e pulso.
