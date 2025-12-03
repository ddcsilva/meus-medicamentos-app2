/**
 * Códigos de erro do repositório.
 */
export type RepositoryErrorCode =
  | "REPOSITORY_ERROR"
  | "NOT_FOUND"
  | "PERMISSION_DENIED"
  | "SERVICE_UNAVAILABLE"
  | "TIMEOUT"
  | "DUPLICATE"
  | "VALIDATION_ERROR";

/**
 * Erro base do repositório.
 *
 * Representa erros de persistência que podem ocorrer
 * durante operações no banco de dados.
 */
export class RepositoryError extends Error {
  readonly code: RepositoryErrorCode;
  readonly statusCode: number;

  constructor(
    message: string,
    code: RepositoryErrorCode = "REPOSITORY_ERROR",
    statusCode?: number
  ) {
    super(message);
    this.name = "RepositoryError";
    this.code = code;
    this.statusCode = statusCode || this.getDefaultStatusCode(code);

    // Mantém o stack trace correto
    Error.captureStackTrace(this, this.constructor);
  }

  /**
   * Obtém o status HTTP padrão para um código de erro.
   */
  private getDefaultStatusCode(code: RepositoryErrorCode): number {
    const statusCodes: Record<RepositoryErrorCode, number> = {
      REPOSITORY_ERROR: 500,
      NOT_FOUND: 404,
      PERMISSION_DENIED: 403,
      SERVICE_UNAVAILABLE: 503,
      TIMEOUT: 504,
      DUPLICATE: 409,
      VALIDATION_ERROR: 400,
    };

    return statusCodes[code];
  }

  /**
   * Converte o erro para um objeto JSON.
   */
  toJSON(): object {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      statusCode: this.statusCode,
    };
  }
}

/**
 * Erro de recurso não encontrado.
 */
export class NotFoundError extends RepositoryError {
  constructor(message: string = "Recurso não encontrado") {
    super(message, "NOT_FOUND", 404);
    this.name = "NotFoundError";
  }
}

/**
 * Erro de permissão negada.
 */
export class PermissionDeniedError extends RepositoryError {
  constructor(message: string = "Permissão negada") {
    super(message, "PERMISSION_DENIED", 403);
    this.name = "PermissionDeniedError";
  }
}

/**
 * Erro de serviço indisponível.
 */
export class ServiceUnavailableError extends RepositoryError {
  constructor(message: string = "Serviço indisponível") {
    super(message, "SERVICE_UNAVAILABLE", 503);
    this.name = "ServiceUnavailableError";
  }
}

/**
 * Erro de timeout.
 */
export class TimeoutError extends RepositoryError {
  constructor(message: string = "Tempo limite excedido") {
    super(message, "TIMEOUT", 504);
    this.name = "TimeoutError";
  }
}

/**
 * Erro de duplicação.
 */
export class DuplicateError extends RepositoryError {
  constructor(message: string = "Recurso já existe") {
    super(message, "DUPLICATE", 409);
    this.name = "DuplicateError";
  }
}

/**
 * Verifica se um erro é um erro de repositório.
 */
export function isRepositoryError(error: unknown): error is RepositoryError {
  return error instanceof RepositoryError;
}

/**
 * Verifica se um erro é um erro de não encontrado.
 */
export function isNotFoundError(error: unknown): error is NotFoundError {
  return error instanceof NotFoundError;
}

