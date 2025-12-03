import { Request, Response, NextFunction } from "express";
import { env } from "../config/env";

/**
 * Interface para erros da aplicação.
 */
export interface AppError extends Error {
  statusCode?: number;
  code?: string;
  details?: unknown;
}

/**
 * Cria um erro da aplicação.
 */
export function createAppError(
  message: string,
  statusCode: number = 500,
  code?: string,
  details?: unknown
): AppError {
  const error: AppError = new Error(message);
  error.statusCode = statusCode;
  error.code = code;
  error.details = details;
  return error;
}

/**
 * Middleware de tratamento de erros.
 *
 * Captura todos os erros e retorna uma resposta JSON padronizada.
 */
export function errorMiddleware(
  err: AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  const statusCode = err.statusCode || 500;
  const code = err.code || "INTERNAL_ERROR";
  const message = err.message || "Erro interno do servidor.";

  // Log do erro
  console.error(`[ERROR] ${code}: ${message}`, {
    statusCode,
    stack: env.isDevelopment ? err.stack : undefined,
    details: err.details,
  });

  // Resposta padronizada
  res.status(statusCode).json({
    success: false,
    error: {
      code,
      message,
      ...(env.isDevelopment && err.details && { details: err.details }),
    },
  });
}

/**
 * Middleware para rotas não encontradas.
 */
export function notFoundMiddleware(
  req: Request,
  _res: Response,
  next: NextFunction
): void {
  const error = createAppError(
    `Rota não encontrada: ${req.method} ${req.originalUrl}`,
    404,
    "NOT_FOUND"
  );
  next(error);
}

