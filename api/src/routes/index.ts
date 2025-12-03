import { Router } from "express";
import healthRoutes from "./health.routes";

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
 * Rotas de medicamentos (a serem implementadas).
 * GET    /medicamentos
 * GET    /medicamentos/:id
 * POST   /medicamentos
 * PUT    /medicamentos/:id
 * PATCH  /medicamentos/:id/quantidade
 * DELETE /medicamentos/:id
 */
// router.use("/medicamentos", medicamentosRoutes);

export default router;

