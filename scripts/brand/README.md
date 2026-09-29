# Marca — geradores

Regeneram os arquivos da logo e os documentos do Design System. Pensados para rodar a cada mudança de marca.

| Script | O que faz |
| --- | --- |
| `outline.js` | Converte "SmartBar" (Arial Bold do Windows) em curvas → `text-paths.json`. Precisa de `npm i opentype.js`. |
| `gen.js <public/logo> <pasta-render>` | Gera os SVGs (estático, animado, 4K) e `frame.html` do vídeo. |
| `frames.ps1 [-R <pasta-render>]` | Renderiza os 173 quadros 4K do vídeo com o Edge; depois `ffmpeg -framerate 30 -i frames/f%04d.png -c:v libx264 -crf 14 -pix_fmt yuv420p smartbar-logo-4k.mp4`. |
| `build-docs.js <docs/design-system> <public/logo> <saida>` | Monta o HTML do DS e do DNA da marca a partir de `docs/design-system/` (tokens, READMEs, previews). PDF: `msedge --headless=new --no-pdf-header-footer --print-to-pdf=... arquivo.html`. |

`docs/design-system/` é a cópia versionada do Design System publicado (`tokens.json`, `README.md`, `dna-da-marca.md`, `components/*`). A geometria da logo vive em `src/components/ui/logo.tsx` e `src/app/globals.css` (`.sb-*`); `gen.js` repete os mesmos números — mude nos três juntos.
