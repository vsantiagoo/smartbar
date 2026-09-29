Faz o bloco subir e aparecer quando entra na tela — uma vez só.

`src/components/ui/reveal.tsx` (animação em `.reveal`, `globals.css`)

## A transição

O bloco começa invisível e 28px abaixo; ao entrar na tela, sobe até o lugar e
aparece. **0,9s**, curva `cubic-bezier(0.22, 1, 0.36, 1)` (entra rápido, assenta
devagar, sem quique). Opacidade e deslocamento correm juntos.

## Quando dispara

Um `IntersectionObserver` com `threshold: 0.12` e margem inferior de −8%: o bloco
precisa ter 12% visível, e a faixa dos últimos 8% da tela não conta — assim ele
aparece um pouco antes de o leitor chegar ao fim dele. Dispara **uma vez** e
desconecta; rolar de volta não esconde de novo. Sem `IntersectionObserver`, o bloco
já nasce visível.

## Cascata

`delay` (em ms) atrasa a entrada de um bloco — use em listas, com um passo
pequeno (`i * 90`):

```tsx
{items.map((item, i) => (
  <Reveal key={item.id} delay={i * 90}><Card {...item} /></Reveal>
))}
```

## Regras

- **Nada acima da dobra que precise aparecer de imediato.** O conteúdo nasce
  invisível e só aparece depois que o JavaScript liga; o herói e o cabeçalho ficam
  fora do Reveal.
- `prefers-reduced-motion`: o bloco já aparece no lugar, sem movimento.
- O Reveal é um `<div>`; `className` vai nele. Não aninhe um Reveal dentro de outro.

## O que o consumidor fornece

O conteúdo e, se quiser cascata, o `delay`. O componente cuida do observador, da
curva e da preferência de movimento.
