import { Request, Response } from "express";
import { env } from "../config/env";

/**
 * Interface para resposta do health check.
 */
interface HealthCheckResponse {
  status: "ok" | "error";
  timestamp: string;
  uptime: number;
  environment: string;
  version: string;
}

/**
 * Controller para health check da API.
 */
export class HealthController {
  /**
   * Retorna o status de saúde da API.
   *
   * GET /health
   */
  static check(_req: Request, res: Response): void {
    const response: HealthCheckResponse = {
      status: "ok",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: env.nodeEnv,
      version: "1.0.0",
    };

    res.status(200).json(response);
  }

  /**
   * Retorna informações detalhadas (apenas em desenvolvimento).
   *
   * GET /health/details
   */
  static details(_req: Request, res: Response): void {
    if (!env.isDevelopment) {
      res.status(403).json({
        success: false,
        error: {
          code: "FORBIDDEN",
          message: "Detalhes disponíveis apenas em desenvolvimento.",
        },
      });
      return;
    }

    const response = {
      status: "ok",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: env.nodeEnv,
      version: "1.0.0",
      memory: {
        rss: `${Math.round(process.memoryUsage().rss / 1024 / 1024)} MB`,
        heapUsed: `${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)} MB`,
        heapTotal: `${Math.round(process.memoryUsage().heapTotal / 1024 / 1024)} MB`,
      },
      node: {
        version: process.version,
        platform: process.platform,
        arch: process.arch,
      },
    };

    res.status(200).json(response);
  }
}

