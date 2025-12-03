/**
 * Barrel file para exportar repositories.
 *
 * Repositories são responsáveis pela persistência de dados.
 * Eles abstraem o acesso ao Firestore.
 */

// Erros de repositório
export {
  RepositoryError,
  NotFoundError,
  PermissionDeniedError,
  ServiceUnavailableError,
  TimeoutError,
  DuplicateError,
  isRepositoryError,
  isNotFoundError,
} from "./errors";
export type { RepositoryErrorCode } from "./errors";

// Repositório de medicamentos
export {
  MedicamentosRepository,
  getMedicamentosRepository,
  setMedicamentosRepository,
} from "./medicamentos.repository";
export type { IMedicamentosRepository } from "./medicamentos.repository";
