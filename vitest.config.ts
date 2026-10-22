import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

/**
 * Testes do DOMÍNIO — as regras que, se quebrarem, custam dinheiro.
 *
 * Rodam contra a implementação em memória do repositório (`data/mock`), e é por
 * isso que existem: o contrato `Repository` tem duas implementações, e a de
 * memória permite exercitar as regras de negócio sem subir banco nenhum. Esse
 * sempre foi o segundo motivo de ela existir — o primeiro é a demonstração.
 *
 * O que estes testes NÃO cobrem, e não têm como cobrir: a atomicidade sob
 * concorrência. Ela vive na função `security definer` do Postgres, com trava de
 * linha, e só um banco de verdade a exercita. Aqui se verifica a REGRA
 * (idempotência, ordem das operações, estoque não-negativo); lá se verifica que
 * ela resiste a duas requisições no mesmo milissegundo.
 *
 * `vite-tsconfig-paths` ensina o Vitest a resolver `@/…` do tsconfig.
 */
export default defineConfig({
  plugins: [tsconfigPaths()],
  resolve: {
    alias: {
      /*
        `server-only` existe para EXPLODIR se alguém importar um módulo de
        servidor dentro de um componente de cliente — é uma proteção real e
        deve continuar nos arquivos. Mas num teste em Node não há essa
        fronteira, e o pacote lança assim que é carregado. Aqui ele vira um
        módulo vazio: a proteção segue valendo onde importa, que é no build.
      */
      "server-only": new URL("./tests/stubs/server-only.ts", import.meta.url).pathname,
    },
  },
  test: {
    environment: "node",
    include: ["tests/**/*.test.ts"],
    // Cada arquivo num processo próprio: o banco em memória vive em
    // `globalThis`, e arquivos paralelos no mesmo processo se contaminariam.
    pool: "forks",
  },
});
