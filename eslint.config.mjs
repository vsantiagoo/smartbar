import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

/**
 * ESLint do SmartBar — formato novo (flat config).
 *
 * POR QUE ESLint 9 E NÃO 10: o `eslint-config-next` do Next 15 declara peer
 * `^7 || ^8 || ^9`. A 10 já é a versão corrente do ESLint, mas instalá-la aqui
 * quebraria o preset do Next. Subir junto, quando o Next publicar suporte.
 *
 * POR QUE O `FlatCompat`: o `eslint-config-next` ainda é publicado no formato
 * antigo (não exporta flat config). O compat traduz, e some daqui no dia em que
 * o preset for publicado no formato novo.
 *
 * O QUE ESTE LINTER COBRE: o `tsc` já roda com `noUnusedLocals` e
 * `noUnusedParameters` (ver `npm run typecheck`), então variável e import
 * órfãos o compilador já pega. O linter entra para o que ele NÃO vê —
 * dependências de hooks, acessibilidade e as regras do próprio Next.
 */
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const compat = new FlatCompat({ baseDirectory: __dirname });

const config = [
  {
    ignores: [".next/**", "node_modules/**", "out/**", "build/**", "next-env.d.ts"],
  },
  ...compat.extends("next/core-web-vitals", "next/typescript"),

  /*
    `scripts/brand/` são utilitários de linha de comando, rodados à mão com
    `node gen.js ...` para gerar os SVGs e as páginas de render da marca. Não
    entram no bundle e não passam por bundler nenhum: ali `require()` é a forma
    certa, não um resquício.
  */
  {
    files: ["scripts/**/*.js"],
    rules: { "@typescript-eslint/no-require-imports": "off" },
  },
];

export default config;
