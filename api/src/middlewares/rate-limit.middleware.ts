import rateLimit from "express-rate-limit";
import { env } from "../config/env";

/**
 * Rate limiter padrão para a API.
 *
 * Limita requisições por IP para prevenir abuso.
 *
 * Configuração:
 * - 100 requisições por 15 minutos em produção
 * - 1000 requisições por 15 minutos em desenvolvimento
 */
export const apiRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: env.isProduction ? 100 : 1000, // Limite por IP
  message: {
    success: false,
    error: {
      code: "TOO_MANY_REQUESTS",
      message: "Muitas requisições. Tente novamente em alguns minutos.",
    },
  },
  standardHeaders: true, // Retorna rate limit info nos headers `RateLimit-*`
  legacyHeaders: false, // Desabilita headers `X-RateLimit-*`
  skip: (req) => {
    // Não aplica rate limit para health checks
    return req.path === "/health" || req.path === "/";
  },
});

/**
 * Rate limiter mais restritivo para operações de escrita.
 *
 * Limita criação/atualização/exclusão de recursos.
 *
 * Configuração:
 * - 30 requisições por 15 minutos em produção
 * - 300 requisições por 15 minutos em desenvolvimento
 */
export const writeRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: env.isProduction ? 30 : 300, // Limite por IP
  message: {
    success: false,
    error: {
      code: "TOO_MANY_REQUESTS",
      message: "Muitas operações de escrita. Tente novamente em alguns minutos.",
    },
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Rate limiter para autenticação.
 *
 * Mais restritivo para prevenir ataques de força bruta.
 *
 * Configuração:
 * - 5 tentativas por 15 minutos
 */
export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: env.isProduction ? 5 : 50, // Limite por IP
  message: {
    success: false,
    error: {
      code: "TOO_MANY_REQUESTS",
      message: "Muitas tentativas de autenticação. Tente novamente mais tarde.",
    },
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Rate limiter para upload de arquivos.
 *
 * Limita uploads para prevenir abuso de storage.
 *
 * Configuração:
 * - 10 uploads por 15 minutos em produção
 * - 100 uploads por 15 minutos em desenvolvimento
 */
export const uploadRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: env.isProduction ? 10 : 100, // Limite por IP
  message: {
    success: false,
    error: {
      code: "TOO_MANY_REQUESTS",
      message: "Muitos uploads. Tente novamente em alguns minutos.",
    },
  },
  standardHeaders: true,
  legacyHeaders: false,
});


