import { firestore } from "firebase-admin";
import { StatusValidade, TipoMedicamento } from "./medicamento.model";

/**
 * Estrutura do documento Medicamento no Firestore.
 *
 * Esta interface representa exatamente como os dados são armazenados
 * no Firestore, incluindo Timestamps nativos do Firebase.
 */
export interface MedicamentoFirestoreDoc {
  /** Nome comercial do medicamento */
  nome: string;

  /** Nome da droga / princípio ativo */
  droga: string;

  /** Indica se é medicamento genérico */
  generico: boolean;

  /** Nome da marca */
  marca: string;

  /** Nome do laboratório */
  laboratorio: string;

  /** Tipo de medicamento */
  tipo: TipoMedicamento;

  /** Data de validade como Timestamp do Firestore */
  validade: firestore.Timestamp;

  /** Quantidade total inicial do medicamento */
  quantidadeTotal: number;

  /** Quantidade atual disponível */
  quantidadeAtual: number;

  /** URL da foto do medicamento (opcional) */
  fotoUrl?: string;

  /** Observações adicionais (opcional) */
  observacoes?: string;

  /** UID do usuário que criou o medicamento */
  criadoPor: string;

  /** Data de criação como Timestamp do Firestore */
  criadoEm: firestore.Timestamp;

  /** Data da última atualização como Timestamp do Firestore */
  atualizadoEm: firestore.Timestamp;
}

/**
 * Dados para criação de um documento no Firestore.
 *
 * Exclui campos que são gerados automaticamente (id).
 */
export type MedicamentoFirestoreCreate = Omit<MedicamentoFirestoreDoc, never>;

/**
 * Dados para atualização de um documento no Firestore.
 *
 * Todos os campos são opcionais, exceto atualizadoEm que é sempre atualizado.
 */
export interface MedicamentoFirestoreUpdate {
  nome?: string;
  droga?: string;
  generico?: boolean;
  marca?: string;
  laboratorio?: string;
  tipo?: TipoMedicamento;
  validade?: firestore.Timestamp;
  quantidadeTotal?: number;
  quantidadeAtual?: number;
  fotoUrl?: string;
  observacoes?: string;
  atualizadoEm: firestore.Timestamp | firestore.FieldValue;
}

/**
 * Snapshot de um documento do Firestore com ID.
 */
export interface MedicamentoFirestoreSnapshot {
  id: string;
  data: MedicamentoFirestoreDoc;
}

/**
 * Campos indexados para queries no Firestore.
 */
export const FIRESTORE_INDEXED_FIELDS = {
  CRIADO_POR: "criadoPor",
  VALIDADE: "validade",
  NOME: "nome",
  QUANTIDADE_ATUAL: "quantidadeAtual",
  CRIADO_EM: "criadoEm",
  TIPO: "tipo",
  LABORATORIO: "laboratorio",
  GENERICO: "generico",
} as const;

/**
 * Tipo para campos indexados.
 */
export type FirestoreIndexedField =
  (typeof FIRESTORE_INDEXED_FIELDS)[keyof typeof FIRESTORE_INDEXED_FIELDS];

/**
 * Calcula o status de validade baseado na data de validade.
 *
 * Regras:
 * - vencido: validade < hoje
 * - prestes: validade entre hoje e +30 dias
 * - válido: validade > +30 dias
 *
 * @param validade - Data de validade como Timestamp ou Date
 * @returns Status de validade calculado
 */
export function calcularStatusValidade(
  validade: firestore.Timestamp | Date | string
): StatusValidade {
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);

  let dataValidade: Date;

  if (validade instanceof firestore.Timestamp) {
    dataValidade = validade.toDate();
  } else if (validade instanceof Date) {
    dataValidade = validade;
  } else {
    dataValidade = new Date(validade);
  }

  dataValidade.setHours(0, 0, 0, 0);

  const diffTime = dataValidade.getTime() - hoje.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return "vencido";
  }

  if (diffDays <= 30) {
    return "prestes";
  }

  return "valido";
}


