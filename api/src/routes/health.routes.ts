import { Router } from "express";
import { HealthController } from "../controllers/health.controller";

/**
 * Rotas de health check.
 */
const router = Router();

/**
 * GET /health
 * Retorna o status de saúde da API.
 */
router.get("/", HealthController.check);

/**
 * GET /health/details
 * Retorna informações detalhadas (apenas em desenvolvimento).
 */
router.get("/details", HealthController.details);

export default router;

