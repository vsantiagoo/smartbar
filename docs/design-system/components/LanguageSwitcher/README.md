Seletor de idioma em pílula, com menu de vidro. Um só para a vitrine, o painel e o site.

`src/components/ui/language-switcher.tsx`

Mostra o globo e o código do idioma ativo (`PT`, `EN`, `ES`). O português do Brasil é o
padrão. Trocar o idioma grava o cookie e dá um refresh suave, para os textos que vêm do
servidor chegarem traduzidos sem recarregar a página.

## Props

| Prop | O que faz |
| --- | --- |
| `tone` | `dark` sobre faixa escura (cabeçalho do hóspede, do site e do login); `light` sobre vidro claro (painel do hotel). |
| `className` | Posicionamento do conjunto. |
| `buttonClassName` | **Substitui** as classes de tamanho do botão (ex.: menor na barra do site). |
| `onAfterSelect` | Roda depois de escolher — por exemplo, fechar o menu mobile do hóspede. |

## O visual

- **Botão:** pílula. `dark` usa `.glass-dark` + `.glass-liquid` com texto `white/80`;
  `light` usa `.glass-chip` em `white/60`. Tamanho `dark`: 36px, 40px a partir de
  360px, 44px a partir de `sm`; `light`: 44px.
- **Menu:** `.glass-strong` de 176px de largura, raio 24px, alinhado à direita. Cada
  opção tem 44px de altura; a ativa fica em `brand-700/10` com texto `brand-700`.

## Regras

- É um `menuitemradio` por idioma, com `aria-checked` na opção ativa.
- Os nomes dos idiomas vêm do dicionário (`common.lang.<código>`); o rótulo do botão é
  `common.language`.
- Fecha ao clicar fora. **Ainda não fecha com Esc nem navega por setas** — ver
  pendências na referência.
