/**
 * Firebase Cloud Functions - Meus Medicamentos
 *
 * Este arquivo é o ponto de entrada para todas as Cloud Functions do sistema.
 * As funções aqui definidas são placeholders (stubs) para implementação futura.
 *
 * @module functions
 */

import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

// Importar funções de notificação (stubs)
import { scheduledExpiryCheck } from "./notifications/expiry-check";
import { scheduledLowStockCheck } from "./notifications/low-stock-check";
import { scheduledMonthlyReview } from "./notifications/monthly-review";

// Importar configurações
import { config } from "./config/environment";

// Inicializar Firebase Admin (apenas uma vez)
if (!admin.apps.length) {
  admin.initializeApp();
}

// Exportar configuração para uso em outras funções
export { config };

// =============================================================================
// FUNÇÕES AGENDADAS - NOTIFICAÇÕES
// =============================================================================

/**
 * Verificação diária de validade de medicamentos.
 *
 * Executa todos os dias às 8h (horário configurável).
 * Verifica medicamentos próximos da validade e envia notificações.
 *
 * @scheduled Diariamente às 8:00 (America/Sao_Paulo)
 *
 * TODO: Implementar lógica de verificação na V1
 * - Buscar medicamentos com validade próxima (30 dias)
 * - Buscar medicamentos com validade crítica (7 dias)
 * - Buscar medicamentos vencidos
 * - Enviar notificações por email/push
 */
export const dailyExpiryCheck = functions
  .region("southamerica-east1")
  .pubsub.schedule("0 8 * * *") // Todos os dias às 8:00
  .timeZone(config.timezone)
  .onRun(scheduledExpiryCheck);

/**
 * Verificação diária de estoque baixo.
 *
 * Executa todos os dias às 8h30 (após verificação de validade).
 * Verifica medicamentos com quantidade abaixo do mínimo.
 *
 * @scheduled Diariamente às 8:30 (America/Sao_Paulo)
 *
 * TODO: Implementar lógica de verificação na V1
 * - Buscar medicamentos com quantidade <= quantidadeMinima
 * - Agrupar por usuário
 * - Enviar notificações consolidadas
 */
export const dailyLowStockCheck = functions
  .region("southamerica-east1")
  .pubsub.schedule("30 8 * * *") // Todos os dias às 8:30
  .timeZone(config.timezone)
  .onRun(scheduledLowStockCheck);

/**
 * Revisão mensal de medicamentos.
 *
 * Executa no primeiro dia de cada mês às 9h.
 * Envia um resumo mensal para cada usuário.
 *
 * @scheduled Dia 1 de cada mês às 9:00 (America/Sao_Paulo)
 *
 * TODO: Implementar lógica de revisão na V1
 * - Gerar estatísticas do mês anterior
 * - Listar medicamentos que precisam de atenção
 * - Enviar email de resumo mensal
 */
export const monthlyReview = functions
  .region("southamerica-east1")
  .pubsub.schedule("0 9 1 * *") // Dia 1 de cada mês às 9:00
  .timeZone(config.timezone)
  .onRun(scheduledMonthlyReview);

// =============================================================================
// FUNÇÕES HTTP - ENDPOINTS AUXILIARES (FUTURO)
// =============================================================================

/**
 * Endpoint de health check para as functions.
 *
 * Útil para monitoramento e verificação de status.
 */
export const healthCheck = functions
  .region("southamerica-east1")
  .https.onRequest((_req, res) => {
    res.json({
      status: "ok",
      service: "meus-medicamentos-functions",
      timestamp: new Date().toISOString(),
      version: "1.0.0",
    });
  });

// =============================================================================
// TRIGGERS DE FIRESTORE (FUTURO)
// =============================================================================

/**
 * Trigger quando um medicamento é criado.
 *
 * TODO: Implementar na V2
 * - Verificar se já está vencido ou próximo da validade
 * - Enviar notificação imediata se necessário
 */
// export const onMedicamentoCreated = functions
//   .region("southamerica-east1")
//   .firestore.document("medicamentos/{medicamentoId}")
//   .onCreate(async (snapshot, context) => {
//     // Placeholder para implementação futura
//   });

/**
 * Trigger quando um medicamento é atualizado.
 *
 * TODO: Implementar na V2
 * - Verificar mudanças em quantidade ou validade
 * - Atualizar alertas conforme necessário
 */
// export const onMedicamentoUpdated = functions
//   .region("southamerica-east1")
//   .firestore.document("medicamentos/{medicamentoId}")
//   .onUpdate(async (change, context) => {
//     // Placeholder para implementação futura
//   });


