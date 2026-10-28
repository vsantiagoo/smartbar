/**
 * DADOS DA EMPRESA — fonte única da verdade (item 19 da conformidade).
 *
 * Tudo que é identidade jurídica, contato e encarregado de dados (LGPD) mora
 * aqui, e só aqui. Rodapé, páginas legais e e-mails de resposta a titular leem
 * deste objeto — então corrigir um dado é mudar UMA linha, não caçar o CNPJ
 * espalhado por dez arquivos.
 *
 * ⚠️ O QUE FALTA SER REAL antes de ir ao ar: os campos marcados com
 * `PREENCHER`. Enquanto estiverem assim, as páginas legais mostram um aviso de
 * rascunho em vez de fingir que são definitivas. Preencha e o aviso some
 * sozinho (ver `empresaPendente`).
 *
 * Base legal dos textos: LGPD (Lei 13.709/2018), CDC (Lei 8.078/1990) e Marco
 * Civil da Internet (Lei 12.965/2014). Estes textos NÃO substituem revisão de
 * um advogado — são um ponto de partida sério, não um parecer.
 */

const PREENCHER = "[PREENCHER]" as const;

export const EMPRESA = {
  /** Nome comercial — este já é definitivo. */
  nomeFantasia: "SmartBar",
  /** Razão social registrada na Junta Comercial. */
  razaoSocial: PREENCHER,
  /** CNPJ, no formato 00.000.000/0001-00. */
  cnpj: PREENCHER,
  /** Endereço da sede (rua, número, bairro, cidade/UF, CEP). */
  endereco: PREENCHER,
  /** E-mail de contato geral — respondido pela operação. */
  emailContato: PREENCHER,
  /** E-mail exclusivo para pedidos de titular de dados (LGPD, art. 18). */
  emailPrivacidade: PREENCHER,
  /**
   * Encarregado pelo Tratamento de Dados Pessoais (DPO), exigido pela LGPD
   * art. 41. Pode ser pessoa ou e-mail de um comitê — mas tem de existir e ser
   * público.
   */
  encarregadoDados: PREENCHER,
  /** Cidade/UF do foro eleito para dirimir questões (ver Termos). */
  foro: PREENCHER,
  /** País de operação — define a lei aplicável. Já definitivo. */
  pais: "Brasil",
} as const;

/** Campos ainda não preenchidos. Vazio = pronto para produção. */
export const empresaPendente: readonly string[] = Object.entries(EMPRESA)
  .filter(([, v]) => v === PREENCHER)
  .map(([k]) => k);

/** `true` enquanto houver dado de rascunho — liga o aviso nas páginas legais. */
export const empresaEmRascunho: boolean = empresaPendente.length > 0;

/**
 * Data da última revisão das páginas legais. Atualize ao mudar qualquer texto —
 * a LGPD e o CDC esperam que o titular saiba de quando é a versão que aceitou.
 */
export const LEGAL_ATUALIZADO_EM = "2026-10-28" as const;
