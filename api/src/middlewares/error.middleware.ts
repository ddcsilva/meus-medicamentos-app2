import { Request, Response, NextFunction } from "express";
import { env } from "../config/env";
import { isRepositoryError, RepositoryError } from "../repositories";
import { isServiceError, isValidationError, ServiceError } from "../services";

/**
 * Interface para erros da aplicação.
 */
export interface AppError extends Error {
  statusCode?: number;
  code?: string;
  details?: unknown;
  fields?: Record<string, string>;
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
 * Extrai informações de erro de diferentes tipos de erros.
 */
function extractErrorInfo(err: unknown): {
  statusCode: number;
  code: string;
  message: string;
  details?: unknown;
  fields?: Record<string, string>;
} {
  // Erros de repositório
  if (isRepositoryError(err)) {
    return {
      statusCode: (err as RepositoryError).statusCode,
      code: (err as RepositoryError).code,
      message: err.message,
    };
  }

  // Erros de validação (com campos)
  if (isValidationError(err)) {
    return {
      statusCode: err.statusCode,
      code: err.code,
      message: err.message,
      fields: err.fields,
    };
  }

  // Erros de serviço
  if (isServiceError(err)) {
    return {
      statusCode: (err as ServiceError).statusCode,
      code: (err as ServiceError).code,
      message: err.message,
    };
  }

  // Erros da aplicação (AppError)
  const appErr = err as AppError;
  if (appErr.statusCode) {
    return {
      statusCode: appErr.statusCode,
      code: appErr.code || "APP_ERROR",
      message: appErr.message,
      details: appErr.details,
    };
  }

  // Erro genérico
  const genericErr = err as Error;
  return {
    statusCode: 500,
    code: "INTERNAL_ERROR",
    message: genericErr.message || "Erro interno do servidor.",
  };
}

/**
 * Middleware de tratamento de erros.
 *
 * Captura todos os erros e retorna uma resposta JSON padronizada.
 */
export function errorMiddleware(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  const { statusCode, code, message, details, fields } = extractErrorInfo(err);

  // Log do erro
  console.error(`[ERROR] ${code}: ${message}`, {
    statusCode,
    stack: env.isDevelopment && err instanceof Error ? err.stack : undefined,
    details,
    fields,
  });

  // Resposta padronizada
  const errorResponse: Record<string, unknown> = {
    code,
    message,
  };

  // Incluir campos de validação se existirem
  if (fields) {
    errorResponse.fields = fields;
  }

  // Incluir detalhes em desenvolvimento
  if (env.isDevelopment && details) {
    errorResponse.details = details;
  }

  res.status(statusCode).json({
    success: false,
    error: errorResponse,
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
