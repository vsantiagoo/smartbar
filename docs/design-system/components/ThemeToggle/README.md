Pílula claro/escuro, com um botão deslizante entre o sol e a meia-lua.

`src/components/guest/sections/theme-toggle.tsx`

Aparece no cabeçalho do app do hóspede e na barra da tela de login. Alterna o modo
escuro **só dentro da casca** que recebe — o resto do site não muda.

## Props

| Prop | O que faz |
| --- | --- |
| `initialDark` | O estado inicial, lido do cookie no servidor para a página não piscar. |
| `label` | O `aria-label`, já traduzido. Quem usa o componente passa o texto do seu próprio provider de idioma. |
| `rootId` | O `id` do elemento que recebe `data-theme="dark"`. Padrão `guest-root`; no login é `login-root`. |

## O visual

Pílula `.glass-dark` com `.glass-liquid` (fio de luz na borda). Sol à esquerda com
brilho quente, meia-lua à direita com brilho frio; o botão deslizante (`.theme-knob`)
cobre o lado ativo e leva o glow. Tamanhos: 36×46px no celular estreito, 40×56px a
partir de 360px e 44×64px a partir de `sm`.

## Como funciona

- Liga ou desliga `data-theme="dark"` no elemento `rootId`. As variáveis escuras de
  `globals.css` valem dentro dele.
- Grava a escolha no cookie **`sb-appearance`** (`dark` ou `light`, 1 ano,
  `samesite=lax`, `secure` só em HTTPS). O cookie é o mesmo do hóspede e do login:
  a preferência acompanha a pessoa nas duas telas.
- É um `role="switch"` com `aria-checked`.

## Regras

- Não escreva o texto do `label` dentro do componente: ele não conhece o idioma.
- Em `http://localhost` o cookie não leva `secure` (derrubaria o cookie em dev).
- A casca precisa pintar o próprio fundo no escuro (`#guest-root`, `.login-root`).
