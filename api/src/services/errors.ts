/**
 * Códigos de erro do serviço.
 */
export type ServiceErrorCode =
  | "SERVICE_ERROR"
  | "VALIDATION_ERROR"
  | "BUSINESS_RULE_ERROR"
  | "UNAUTHORIZED"
  | "FORBIDDEN";

/**
 * Erro base do serviço.
 *
 * Representa erros de lógica de negócio que podem ocorrer
 * durante operações no serviço.
 */
export class ServiceError extends Error {
  readonly code: ServiceErrorCode;
  readonly statusCode: number;

  constructor(
    message: string,
    code: ServiceErrorCode = "SERVICE_ERROR",
    statusCode?: number
  ) {
    super(message);
    this.name = "ServiceError";
    this.code = code;
    this.statusCode = statusCode || this.getDefaultStatusCode(code);

    // Mantém o stack trace correto
    Error.captureStackTrace(this, this.constructor);
  }

  /**
   * Obtém o status HTTP padrão para um código de erro.
   */
  private getDefaultStatusCode(code: ServiceErrorCode): number {
    const statusCodes: Record<ServiceErrorCode, number> = {
      SERVICE_ERROR: 500,
      VALIDATION_ERROR: 400,
      BUSINESS_RULE_ERROR: 422,
      UNAUTHORIZED: 401,
      FORBIDDEN: 403,
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
 * Erro de validação de dados.
 */
export class ValidationError extends ServiceError {
  readonly fields?: Record<string, string>;

  constructor(message: string, fields?: Record<string, string>) {
    super(message, "VALIDATION_ERROR", 400);
    this.name = "ValidationError";
    this.fields = fields;
  }

  toJSON(): object {
    return {
      ...super.toJSON(),
      fields: this.fields,
    };
  }
}

/**
 * Erro de regra de negócio.
 */
export class BusinessRuleError extends ServiceError {
  constructor(message: string) {
    super(message, "BUSINESS_RULE_ERROR", 422);
    this.name = "BusinessRuleError";
  }
}

/**
 * Erro de não autorizado.
 */
export class UnauthorizedError extends ServiceError {
  constructor(message: string = "Não autorizado") {
    super(message, "UNAUTHORIZED", 401);
    this.name = "UnauthorizedError";
  }
}

/**
 * Erro de acesso proibido.
 */
export class ForbiddenError extends ServiceError {
  constructor(message: string = "Acesso negado") {
    super(message, "FORBIDDEN", 403);
    this.name = "ForbiddenError";
  }
}

/**
 * Verifica se um erro é um erro de serviço.
 */
export function isServiceError(error: unknown): error is ServiceError {
  return error instanceof ServiceError;
}

/**
 * Verifica se um erro é um erro de validação.
 */
export function isValidationError(error: unknown): error is ValidationError {
  return error instanceof ValidationError;
}


