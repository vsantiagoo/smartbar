/*
  Substituto de `server-only` nos testes.

  O pacote real lança assim que é carregado fora de um Server Component — é a
  proteção que impede um módulo de servidor de vazar para o cliente. Em Node,
  rodando testes, não existe essa fronteira e a proteção só atrapalha.

  O vitest.config aponta `server-only` para cá. Nos arquivos de produção o
  import continua, e continua valendo no build do Next.
*/
export {};
