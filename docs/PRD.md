# PRD — SmartBar

> Documento de produto. A voz da marca e a identidade visual estão em
> [DNA-DA-MARCA.md](DNA-DA-MARCA.md) e [BRANDBOOK.md](BRANDBOOK.md). O guia
> técnico (rodar, arquitetura, onde editar) está no [README](../README.md).

## 1. Visão

SmartBar é um SaaS **B2B2C** que transforma o minibar do hotel em receita
recuperada. O hóspede escolhe os itens no próprio celular, paga na hora (Pix ou
lançamento na conta do quarto pelo cartão-chave RFID) e a trava do frigobar
libera por 15 segundos. O item só é abatido do estoque no instante em que o
pagamento ou a identidade é validada — **o Supabase é a única fonte de verdade
do estoque**.

**Promessa central:** *a trava só abre depois que o consumo está pago.*

## 2. Problema

O minibar tradicional é operado na confiança e conferido no check-out. Isso gera:

- **Perda de estoque (shrinkage):** consumo não declarado, erro de conferência.
- **Check-out lento:** conferência manual de frigobar quarto a quarto.
- **Custo de governança:** tempo da equipe repondo e auditando às cegas.
- **Experiência ruim:** cobrança-surpresa no check-out, atrito com o hóspede.

Máquinas de vending resolvem parte, mas custam caro e não cabem em cada quarto.

## 3. Solução

Um QR Code por quarto abre a vitrine no navegador do hóspede — **sem app, sem
cadastro**. Pagamento confirma o consumo; a trava IoT libera; o estoque daquele
quarto se atualiza sozinho e o painel da recepção vê tudo em tempo real.

## 4. Usuários

| Persona | Quem é | O que precisa |
| --- | --- | --- |
| **Hóspede** | Anônimo, no celular, sem instalar nada | Consumir rápido, pagar com confiança, sem cobrança-surpresa |
| **Recepção / governança** | Equipe do hotel | Ver vendas em tempo real, saber o que repor, agilizar o check-out |
| **Gestão do hotel** | Decisor da compra | Recuperar faturamento, reduzir perda e custo operacional |
| **Hardware (ESP32)** | Leitor RFID + relé da trava | Autenticar e receber o comando de destravar |

## 5. Escopo (o que o produto faz)

### Fluxo do hóspede
1. Lê o QR Code do quarto → vitrine (`/h/{hotel}/q/{quarto}`).
2. Monta o carrinho; preço e estoque são **revalidados no servidor**.
3. Escolhe pagar:
   - **Pix:** BR Code copia-e-cola; a confirmação chega por webhook do gateway.
   - **Conta do quarto:** aproxima o cartão-chave do leitor (RFID) para provar a identidade.
4. Confirmado o pagamento/identidade: a trava libera por 15 s e o estoque baixa.

### Fluxo da equipe (painel `/admin`)
- **Visão geral:** faturamento ao vivo, KPIs, últimas vendas aprovadas.
- **Quartos:** status do frigobar, consumo da estadia, valor para o check-out.
- **Reposição:** lista de quartos a repor; confirmar reposição atualiza o estoque.

### Regras de negócio inegociáveis
- **Preço e estoque nunca vêm do cliente** — o servidor revalida no checkout.
- **Abatimento atômico e idempotente:** uma RPC no Postgres confere todos os
  itens com trava de linha, abate o estoque e autoriza numa transação só;
  reenvios não duplicam nem deixam estoque negativo.
- **Hóspede é anônimo:** não acessa o banco. O pedido é acompanhado por um
  `public_token` não adivinhável.

## 6. Planos

| Plano | Preço (ref.) | Destaques |
| --- | --- | --- |
| **Básico** | R$ 14,90/quarto/mês (mín. R$ 299) | QR dinâmico, catálogo e carrinho, Pix copia-e-cola, dashboard básico |
| **Plus** | R$ 24,90/quarto/mês (mín. R$ 490) | Tudo do Básico + trava IoT, estoque em tempo real, suporte 24/7 |
| **Premium** | R$ 39,90/quarto/mês (mín. R$ 990) | Tudo do Plus + integração com PMS, IA preditiva, whitelabel + SLA 2h |

Preços são de catálogo (referência); ajustáveis por hotel na implantação.

## 7. Métricas de sucesso

Referências do Plano de Negócios (comparativo de setor sem pagamento prévio),
**não medições de um cliente específico**:

- **−95%** de perda de estoque (de ~22% para menos de 1%).
- **75%** mais rápido no check-out.
- **60%** menos tempo de governança.
- **60×** mais barato que máquinas de vending.

Métricas de produto a instrumentar: conversão da vitrine, ticket médio, tempo
até destravar, taxa de Pix vs. conta do quarto, acurácia do estoque.

## 8. Fora de escopo / ainda simulado

- **Gateway Pix:** hoje gera um BR Code válido (CRC16) sem chamar rede. Falta
  implementar o provedor real (Asaas / Mercado Pago).
- **Trava IoT:** hoje só registra o comando; falta a publicação MQTT/TLS.
- **Firmware do ESP32:** o contrato do endpoint existe; o firmware, não.
- **Integração com PMS** (Premium): não implementada.
- **Vídeo do hero:** pendente de créditos de geração (ver README).

## 9. Arquitetura (resumo)

```
Hóspede ──► /api/checkout ──► transactions (pending) ──► Pix (gateway)
                                                            │ webhook
ESP32 (RFID) ─► /api/iot/rfid ─┐                            ▼
                               └► smartbar_authorize_transaction()  ← RPC atômica
                                    • confere itens (lock de linha)
                                    • abate estoque + autoriza (idempotente)
                                    • realtime → hóspede e painel
                                    └► unlock → MQTT → ESP32 → relé → trava 15 s
```

- **Duas implementações do mesmo contrato** (`lib/data/repository.ts`):
  Supabase (produção) e mock em memória (demo, sem banco).
- **Tempo real:** painel escuta `postgres_changes`; hóspede escuta um canal
  broadcast por token. Há polling de segurança nos dois lados.

Detalhes completos no [README](../README.md#arquitetura).

## 10. Segurança (resumo)

- Rotas de API externas validam entrada com Zod.
- `service_role` só no servidor (guarda `server-only`); equipe usa sessão + RLS.
- Webhook Pix e rota IoT usam comparação *timing-safe* de token/chave.
- Rotas de simulação (`/api/mock/*`) se desligam fora de demo/produção.
- Em produção: definir `IOT_DEVICE_KEY`, `PIX_WEBHOOK_TOKEN` e
  `NEXT_PUBLIC_DEMO_TOOLS=false`.

## 11. Roadmap

1. **Validar contra um Supabase real** (Auth, Realtime, repositório de produção) — ainda não testado.
2. Implementar o provedor Pix real e apontar o webhook.
3. Publicação MQTT/TLS da trava + firmware do ESP32.
4. Integração com PMS e IA preditiva de consumo (Premium).
5. Whitelabel por hotel (cores próprias na área do hóspede).
6. Vídeo do hero.
