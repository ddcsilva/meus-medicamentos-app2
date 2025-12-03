import { firestore } from "firebase-admin";
import { Medicamento, TipoMedicamento } from "./medicamento.model";
import {
  CreateMedicamentoDto,
  UpdateMedicamentoDto,
  MedicamentoResponseDto,
} from "./medicamento.dto";
import {
  MedicamentoFirestoreDoc,
  MedicamentoFirestoreCreate,
  MedicamentoFirestoreUpdate,
  MedicamentoFirestoreSnapshot,
  calcularStatusValidade,
} from "./medicamento.firestore";

// ============================================================================
// Firestore -> Modelo de Domínio
// ============================================================================

/**
 * Converte um Timestamp do Firestore para string ISO.
 *
 * @param timestamp - Timestamp do Firestore
 * @returns String no formato ISO 8601
 */
function timestampToISO(timestamp: firestore.Timestamp): string {
  return timestamp.toDate().toISOString();
}

/**
 * Converte um Timestamp do Firestore para string de data (YYYY-MM-DD).
 *
 * @param timestamp - Timestamp do Firestore
 * @returns String no formato YYYY-MM-DD
 */
function timestampToDateString(timestamp: firestore.Timestamp): string {
  const date = timestamp.toDate();
  return date.toISOString().split("T")[0];
}

/**
 * Converte uma string de data para Timestamp do Firestore.
 *
 * @param dateString - String no formato YYYY-MM-DD ou ISO 8601
 * @returns Timestamp do Firestore
 */
function dateStringToTimestamp(dateString: string): firestore.Timestamp {
  const date = new Date(dateString);
  return firestore.Timestamp.fromDate(date);
}

/**
 * Converte um snapshot do Firestore para o modelo de domínio Medicamento.
 *
 * @param snapshot - Snapshot do documento com ID e dados
 * @returns Modelo de domínio Medicamento
 */
export function firestoreToMedicamento(
  snapshot: MedicamentoFirestoreSnapshot
): Medicamento {
  const { id, data } = snapshot;

  return {
    id,
    nome: data.nome,
    droga: data.droga,
    generico: data.generico,
    marca: data.marca,
    laboratorio: data.laboratorio,
    tipo: data.tipo,
    validade: timestampToDateString(data.validade),
    statusValidade: calcularStatusValidade(data.validade),
    quantidadeTotal: data.quantidadeTotal,
    quantidadeAtual: data.quantidadeAtual,
    fotoUrl: data.fotoUrl,
    observacoes: data.observacoes,
    criadoPor: data.criadoPor,
    criadoEm: timestampToISO(data.criadoEm),
    atualizadoEm: timestampToISO(data.atualizadoEm),
  };
}

/**
 * Converte um DocumentSnapshot do Firestore para o modelo de domínio.
 *
 * @param doc - DocumentSnapshot do Firestore
 * @returns Modelo de domínio Medicamento ou null se não existir
 */
export function documentSnapshotToMedicamento(
  doc: firestore.DocumentSnapshot
): Medicamento | null {
  if (!doc.exists) {
    return null;
  }

  const data = doc.data() as MedicamentoFirestoreDoc;

  return firestoreToMedicamento({
    id: doc.id,
    data,
  });
}

/**
 * Converte um QuerySnapshot do Firestore para lista de modelos de domínio.
 *
 * @param querySnapshot - QuerySnapshot do Firestore
 * @returns Lista de modelos de domínio Medicamento
 */
export function querySnapshotToMedicamentos(
  querySnapshot: firestore.QuerySnapshot
): Medicamento[] {
  return querySnapshot.docs.map((doc) => {
    const data = doc.data() as MedicamentoFirestoreDoc;
    return firestoreToMedicamento({ id: doc.id, data });
  });
}

// ============================================================================
// DTO -> Firestore
// ============================================================================

/**
 * Converte um DTO de criação para dados do Firestore.
 *
 * @param dto - DTO de criação
 * @param userId - UID do usuário que está criando
 * @returns Dados prontos para salvar no Firestore
 */
export function createDtoToFirestore(
  dto: CreateMedicamentoDto,
  userId: string
): MedicamentoFirestoreCreate {
  const now = firestore.Timestamp.now();

  return {
    nome: dto.nome.trim(),
    droga: dto.droga.trim(),
    generico: dto.generico,
    marca: dto.marca.trim(),
    laboratorio: dto.laboratorio.trim(),
    tipo: dto.tipo,
    validade: dateStringToTimestamp(dto.validade),
    quantidadeTotal: dto.quantidadeTotal,
    quantidadeAtual: dto.quantidadeAtual,
    fotoUrl: dto.fotoUrl?.trim(),
    observacoes: dto.observacoes?.trim(),
    criadoPor: userId,
    criadoEm: now,
    atualizadoEm: now,
  };
}

/**
 * Converte um DTO de atualização para dados do Firestore.
 *
 * Remove campos undefined para permitir atualizações parciais.
 *
 * @param dto - DTO de atualização
 * @returns Dados prontos para atualizar no Firestore
 */
export function updateDtoToFirestore(
  dto: UpdateMedicamentoDto
): MedicamentoFirestoreUpdate {
  const update: MedicamentoFirestoreUpdate = {
    atualizadoEm: firestore.FieldValue.serverTimestamp(),
  };

  if (dto.nome !== undefined) {
    update.nome = dto.nome.trim();
  }

  if (dto.droga !== undefined) {
    update.droga = dto.droga.trim();
  }

  if (dto.generico !== undefined) {
    update.generico = dto.generico;
  }

  if (dto.marca !== undefined) {
    update.marca = dto.marca.trim();
  }

  if (dto.laboratorio !== undefined) {
    update.laboratorio = dto.laboratorio.trim();
  }

  if (dto.tipo !== undefined) {
    update.tipo = dto.tipo;
  }

  if (dto.validade !== undefined) {
    update.validade = dateStringToTimestamp(dto.validade);
  }

  if (dto.quantidadeTotal !== undefined) {
    update.quantidadeTotal = dto.quantidadeTotal;
  }

  if (dto.quantidadeAtual !== undefined) {
    update.quantidadeAtual = dto.quantidadeAtual;
  }

  if (dto.fotoUrl !== undefined) {
    update.fotoUrl = dto.fotoUrl.trim();
  }

  if (dto.observacoes !== undefined) {
    update.observacoes = dto.observacoes.trim();
  }

  return update;
}

/**
 * Cria dados de atualização de quantidade para o Firestore.
 *
 * @param quantidadeAtual - Nova quantidade
 * @returns Dados para atualização
 */
export function quantidadeUpdateToFirestore(
  quantidadeAtual: number
): MedicamentoFirestoreUpdate {
  return {
    quantidadeAtual,
    atualizadoEm: firestore.FieldValue.serverTimestamp(),
  };
}

// ============================================================================
// Modelo de Domínio -> DTO de Resposta
// ============================================================================

/**
 * Converte o modelo de domínio para DTO de resposta.
 *
 * @param medicamento - Modelo de domínio
 * @returns DTO de resposta para o frontend
 */
export function medicamentoToResponseDto(
  medicamento: Medicamento
): MedicamentoResponseDto {
  return {
    id: medicamento.id,
    nome: medicamento.nome,
    droga: medicamento.droga,
    generico: medicamento.generico,
    marca: medicamento.marca,
    laboratorio: medicamento.laboratorio,
    tipo: medicamento.tipo,
    validade: medicamento.validade,
    statusValidade: medicamento.statusValidade,
    quantidadeTotal: medicamento.quantidadeTotal,
    quantidadeAtual: medicamento.quantidadeAtual,
    fotoUrl: medicamento.fotoUrl,
    observacoes: medicamento.observacoes,
    criadoPor: medicamento.criadoPor,
    criadoEm: medicamento.criadoEm,
    atualizadoEm: medicamento.atualizadoEm,
  };
}

/**
 * Converte uma lista de modelos de domínio para DTOs de resposta.
 *
 * @param medicamentos - Lista de modelos de domínio
 * @returns Lista de DTOs de resposta
 */
export function medicamentosToResponseDtos(
  medicamentos: Medicamento[]
): MedicamentoResponseDto[] {
  return medicamentos.map(medicamentoToResponseDto);
}

// ============================================================================
// Validação de Tipo
// ============================================================================

/**
 * Valida se uma string é um tipo de medicamento válido.
 *
 * @param tipo - String a validar
 * @returns true se é um tipo válido
 */
export function isValidTipoMedicamento(tipo: string): tipo is TipoMedicamento {
  const tiposValidos: TipoMedicamento[] = [
    "comprimido",
    "capsula",
    "liquido",
    "spray",
    "creme",
    "pomada",
    "gel",
    "gotas",
    "injetavel",
    "outro",
  ];

  return tiposValidos.includes(tipo as TipoMedicamento);
}

/**
 * Valida se uma string é uma data válida no formato YYYY-MM-DD.
 *
 * @param dateString - String a validar
 * @returns true se é uma data válida
 */
export function isValidDateString(dateString: string): boolean {
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

  if (!dateRegex.test(dateString)) {
    return false;
  }

  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date.getTime());
}

