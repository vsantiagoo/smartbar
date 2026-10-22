#!/usr/bin/env node
/**
 * VERIFICAÇÃO DO SUPABASE — o passo que falta antes de ir ao ar.
 *
 * O schema, o seed e as políticas foram escritos e testados num Postgres, mas
 * nunca contra um projeto Supabase de verdade. Auth, Realtime e RLS sob a chave
 * `anon` só se comprovam lá. Este script faz essa prova e diz o que está
 * faltando, em vez de deixar a descoberta para a produção.
 *
 *   node scripts/verificar-supabase.mjs
 *
 * Lê `.env.local`. Não escreve nada que não possa desfazer: a única escrita é
 * uma transação de teste, removida no fim.
 */
import { createClient } from "@supabase/supabase-js";
import { readFileSync, existsSync } from "node:fs";

/* ─────────────────────────── ambiente ─────────────────────────── */

function carregarEnv() {
  if (!existsSync(".env.local")) return;
  for (const linha of readFileSync(".env.local", "utf8").split("\n")) {
    const m = linha.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
}
carregarEnv();

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const SERVICE = process.env.SUPABASE_SERVICE_ROLE_KEY;

const resultados = [];
const marcar = (nome, ok, detalhe = "") => {
  resultados.push({ nome, ok, detalhe });
  const selo = ok === true ? "  OK  " : ok === "aviso" ? " AVISO" : " FALHA";
  console.log(`[${selo}] ${nome}${detalhe ? ` — ${detalhe}` : ""}`);
};

if (!URL || !ANON || !SERVICE) {
  console.error("\nFaltam variáveis em .env.local:");
  if (!URL) console.error("  NEXT_PUBLIC_SUPABASE_URL");
  if (!ANON) console.error("  NEXT_PUBLIC_SUPABASE_ANON_KEY");
  if (!SERVICE) console.error("  SUPABASE_SERVICE_ROLE_KEY");
  console.error("\nSem elas o app roda em modo demonstração e não há o que verificar.\n");
  process.exit(1);
}

const servico = createClient(URL, SERVICE, { auth: { persistSession: false } });
const anonimo = createClient(URL, ANON, { auth: { persistSession: false } });

console.log(`\nVerificando ${URL}\n`);

/* ─────────────────────── 1 · o schema existe ─────────────────────── */

const TABELAS = [
  "hotels", "rooms", "products", "inventory",
  "stays", "transactions", "transaction_items",
  "restock_events", "hotel_members",
];

for (const t of TABELAS) {
  const { error } = await servico.from(t).select("*", { count: "exact", head: true });
  marcar(`tabela ${t}`, !error, error?.message ?? "");
}

/* ──────────────────── 2 · RLS fecha para a chave anon ──────────────────── */

/*
  Este é o teste que mais importa. A chave `anon` vai para o NAVEGADOR — ela é
  pública por definição. Se com ela der para ler transações ou hóspedes, os
  dados de todos os hotéis estão expostos na internet.

  O esperado é zero linhas (ou erro de permissão), NUNCA dados.
*/
for (const t of ["transactions", "stays", "hotels", "inventory"]) {
  const { data, error } = await anonimo.from(t).select("*").limit(1);
  const vazou = !error && Array.isArray(data) && data.length > 0;
  marcar(
    `RLS fecha ${t} para anon`,
    !vazou,
    vazou ? "VAZAMENTO: a chave pública leu dados desta tabela" : error ? "bloqueado pela política" : "nenhuma linha",
  );
}

/* ──────────────── 3 · a função de autorização está protegida ──────────────── */

const { error: erroRpcAnon } = await anonimo.rpc("smartbar_authorize_transaction", {
  p_transaction_id: "00000000-0000-0000-0000-000000000000",
  p_by: "pix_webhook",
});
marcar(
  "anon NÃO pode autorizar transação",
  Boolean(erroRpcAnon),
  erroRpcAnon ? "recusado, como deve ser" : "GRAVE: a chave pública conseguiu chamar a autorização",
);

const { error: erroRpcServico } = await servico.rpc("smartbar_authorize_transaction", {
  p_transaction_id: "00000000-0000-0000-0000-000000000000",
  p_by: "pix_webhook",
});
// Transação inexistente: a função deve responder, não estourar por permissão.
const semPermissao = erroRpcServico && /permission|not allowed|denied/i.test(erroRpcServico.message);
marcar(
  "service_role PODE autorizar",
  !semPermissao,
  semPermissao ? erroRpcServico.message : "função alcançável",
);

/* ─────────────────────── 4 · o seed foi aplicado ─────────────────────── */

const { count: nHoteis } = await servico.from("hotels").select("*", { count: "exact", head: true });
const { count: nQuartos } = await servico.from("rooms").select("*", { count: "exact", head: true });
const { count: nProdutos } = await servico.from("products").select("*", { count: "exact", head: true });
marcar(
  "seed aplicado",
  nHoteis > 0 && nQuartos > 0 && nProdutos > 0 ? true : "aviso",
  `${nHoteis ?? 0} hotéis · ${nQuartos ?? 0} quartos · ${nProdutos ?? 0} produtos`,
);

/* ───────────────── 5 · o estoque não aceita ficar negativo ───────────────── */

const { data: linha } = await servico.from("inventory").select("room_id,product_id,quantity").limit(1).maybeSingle();
if (linha) {
  const { error } = await servico
    .from("inventory")
    .update({ quantity: -1 })
    .eq("room_id", linha.room_id)
    .eq("product_id", linha.product_id);
  marcar(
    "banco recusa estoque negativo",
    Boolean(error),
    error ? "o CHECK está ativo" : "GRAVE: aceitou quantidade negativa",
  );
  // Se por acaso passou, devolve o valor original.
  if (!error) {
    await servico
      .from("inventory")
      .update({ quantity: linha.quantity })
      .eq("room_id", linha.room_id)
      .eq("product_id", linha.product_id);
  }
} else {
  marcar("banco recusa estoque negativo", "aviso", "sem linhas de inventário para testar");
}

/* ───────────────────────── 6 · Realtime responde ───────────────────────── */

const realtimeOk = await new Promise((resolve) => {
  const canal = anonimo.channel("verificacao-smartbar");
  const prazo = setTimeout(() => {
    canal.unsubscribe();
    resolve(false);
  }, 8000);
  canal.subscribe((estado) => {
    if (estado === "SUBSCRIBED") {
      clearTimeout(prazo);
      canal.unsubscribe();
      resolve(true);
    }
  });
});
marcar("Realtime aceita inscrição", realtimeOk, realtimeOk ? "" : "não inscreveu em 8s — confira se está habilitado");

/* ────────────────────────────── resumo ────────────────────────────── */

const falhas = resultados.filter((r) => r.ok === false);
const avisos = resultados.filter((r) => r.ok === "aviso");

console.log(`\n${resultados.length} verificações · ${falhas.length} falhas · ${avisos.length} avisos\n`);

if (falhas.length) {
  console.log("Precisa resolver antes de ir ao ar:");
  for (const f of falhas) console.log(`  · ${f.nome}${f.detalhe ? ` — ${f.detalhe}` : ""}`);
  console.log();
  process.exit(1);
}
console.log("Tudo certo do lado do banco. Falta o provedor Pix e o firmware da trava.\n");
