Sinais da marca: três desenhos próprios, não ícones de biblioteca.

`src/components/ui/marks.tsx`

Um conjunto genérico de ícones fala de software em geral: cadeado, caixa, QR. Estes três
falam do SmartBar. É a mesma diferença entre uma foto de banco de imagens e uma foto do
seu hotel.

## Os três sinais

| Componente | Conta | O detalhe de autoria |
| --- | --- | --- |
| `MarkRoomCode` | Escolher no celular: o aparelho do hóspede com o código do quarto | O quarto módulo não fecha, abre-se em "L" para fora da grade — o código é uma porta, não um fim |
| `MarkUnlock` | Pagar e destravar: a trava no instante seguinte ao pagamento | A perna esquerda continua presa, a direita já saiu e o arco girou; no lugar do segredo há um ponto aceso, porque a trava é eletrônica |
| `MarkShelf` | Estoque que baixa sozinho: duas prateleiras vistas de frente | Os itens têm alturas diferentes de propósito — é um armário no meio do dia, não um armário cheio |

## Props

| Prop | O que faz |
| --- | --- |
| `className` | Tamanho e cor (o traço herda `currentColor`). |
| `title` | Rótulo acessível. **Sem ele o desenho é decorativo** e some do leitor de tela. |

## Regras do traço

Valem para qualquer sinal novo, e são as mesmas do cadeado da declaração:

- Grade de **24**, traço de **1,5** — espesso o bastante para sobreviver a 20px.
- Ponta e junta **arredondadas**, nunca em esquadro.
- **`currentColor`**, para o sinal herdar a cor de quem o usa.
- **Um detalhe assimétrico** em cada um: é onde mora a autoria.
