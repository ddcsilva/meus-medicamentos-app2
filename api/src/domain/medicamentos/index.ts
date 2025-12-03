/**
 * Barrel file para exportar módulos do domínio de medicamentos.
 */

// Modelo de domínio
export {
  StatusValidade,
  TipoMedicamento,
  TIPOS_MEDICAMENTO,
  Medicamento,
  MedicamentoPartial,
} from "./medicamento.model";

// DTOs
export {
  CreateMedicamentoDto,
  UpdateMedicamentoDto,
  UpdateQuantidadeDto,
  MedicamentoResponseDto,
  MedicamentosListResponseDto,
  MedicamentosFiltrosDto,
} from "./medicamento.dto";

// Estrutura do Firestore
export {
  MedicamentoFirestoreDoc,
  MedicamentoFirestoreCreate,
  MedicamentoFirestoreUpdate,
  MedicamentoFirestoreSnapshot,
  FIRESTORE_INDEXED_FIELDS,
  calcularStatusValidade,
} from "./medicamento.firestore";
export type { FirestoreIndexedField } from "./medicamento.firestore";

// Funções de mapeamento
export {
  firestoreToMedicamento,
  documentSnapshotToMedicamento,
  querySnapshotToMedicamentos,
  createDtoToFirestore,
  updateDtoToFirestore,
  quantidadeUpdateToFirestore,
  medicamentoToResponseDto,
  medicamentosToResponseDtos,
  isValidTipoMedicamento,
  isValidDateString,
} from "./medicamento.mapper";

