/**
 * Barrel file para exportar services.
 *
 * Services contêm a lógica de negócio da aplicação.
 * Eles orquestram operações entre controllers e repositories.
 */

// Erros de serviço
export {
  ServiceError,
  ValidationError,
  BusinessRuleError,
  UnauthorizedError,
  ForbiddenError,
  isServiceError,
  isValidationError,
} from "./errors";
export type { ServiceErrorCode } from "./errors";

// Serviço de medicamentos
export {
  MedicamentosService,
  getMedicamentosService,
  setMedicamentosService,
} from "./medicamentos.service";
export type {
  IMedicamentosService,
  MedicamentosEstatisticas,
} from "./medicamentos.service";
