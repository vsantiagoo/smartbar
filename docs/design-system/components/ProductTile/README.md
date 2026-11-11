Tile do produto em vidro: foto real por SKU, ou ícone sobre um degradê da marca.

`src/components/ui/product-icon.tsx`

O arquivo se chama `product-icon.tsx`, mas o componente exportado é `ProductTile`.

## Props

| Prop | O que faz |
| --- | --- |
| `iconKey` | A chave do ícone e da cor do degradê (ver tabela). Chave desconhecida cai em `package`. |
| `sku` | Opcional. Se houver foto cadastrada para o SKU, ela substitui o ícone. |
| `className` | **Tamanho e raio** — o tile não tem medida própria. |

## Foto ou ícone

- **Com foto:** a imagem vem de `public/images/products/<SKU>`. PNG é um recorte
  transparente do produto, mostrado **inteiro** e flutuando no vidro
  (`object-contain` com 6px de folga); JPG é foto com fundo, que **preenche** o
  quadrado (`object-cover`). Hoje há fotos para oito SKUs.
- **Sem foto:** ícone da biblioteca sobre um degradê da marca, a 50% do tile e traço de 1,6.

| `iconKey` | Ícone | Degradê |
| --- | --- | --- |
| `glass-water` | copo d'água | `sky-100` → `brand-100` |
| `cup-soda` | copo de refrigerante | `crimson-100` → `gold-100` |
| `grape` | uva | `brand-100` → `crimson-100` |
| `nut` | castanha | `gold-100` → âmbar |
| `cookie` | biscoito | `gold-100` → `crimson-50` |
| `wheat` | trigo | âmbar → `gold-50` |
| `popcorn` | pipoca | `gold-50` → `crimson-100` |
| `package` | pacote (padrão) | `brand-100` → branco |

Atenção: `sky-100` e `amber-100` vêm da paleta padrão do Tailwind, **não** das escalas do
sistema (o `sky` do sistema é o fundo da página, `sky-1` a `sky-4`). É uma pendência
conhecida; ver a referência.

## O visual

`.glass-chip` com `.specular-tile` (o aro especular do vidro fica por cima da imagem),
raio `3xl` e degradê em diagonal. É decorativo (`aria-hidden`): o nome do produto vem do
texto ao lado, nunca do tile.

## Regras

- Dois produtos podem partilhar o mesmo `iconKey` (água sem e com gás), por isso a foto é
  mapeada por **SKU**, não por ícone.
- Foto nova entra em `public/images/products/` e no mapa `PRODUCT_IMAGES`.
- Sem foto, o produto continua legível: o ícone é o plano B, não um erro.
