import { Router } from "express";
import healthRoutes from "./health.routes";
import medicamentosRoutes from "./medicamentos.routes";

/**
 * Router principal que agrega todas as rotas da API.
 */
const router = Router();

/**
 * Rotas de health check.
 * GET /health
 * GET /health/details
 */
router.use("/health", healthRoutes);

/**
 * Rotas de medicamentos (protegidas por autenticação).
 *
 * GET    /medicamentos              - Lista medicamentos
 * GET    /medicamentos/estatisticas - Estatísticas
 * GET    /medicamentos/:id          - Busca por ID
 * POST   /medicamentos              - Cria medicamento
 * PUT    /medicamentos/:id          - Atualiza medicamento
 * PATCH  /medicamentos/:id/quantidade - Atualiza quantidade
 * DELETE /medicamentos/:id          - Remove medicamento
 */
router.use("/medicamentos", medicamentosRoutes);

export default router;
