import { getApp, admin } from "./admin";

/**
 * Instância cacheada do Firestore.
 */
let firestoreInstance: admin.firestore.Firestore | null = null;

/**
 * Obtém a instância do Firestore.
 *
 * Inicializa o Firebase automaticamente se necessário.
 *
 * @example
 * const db = getFirestore();
 * const medicamentosRef = db.collection('medicamentos');
 */
export function getFirestore(): admin.firestore.Firestore {
  if (!firestoreInstance) {
    const app = getApp();
    firestoreInstance = app.firestore();

    // Configurações do Firestore
    firestoreInstance.settings({
      ignoreUndefinedProperties: true,
    });
  }

  return firestoreInstance;
}

/**
 * Nomes das coleções do Firestore.
 */
export const COLLECTIONS = {
  MEDICAMENTOS: "medicamentos",
  USUARIOS: "usuarios",
} as const;

/**
 * Tipo para nomes de coleções.
 */
export type CollectionName = (typeof COLLECTIONS)[keyof typeof COLLECTIONS];

/**
 * Obtém uma referência para uma coleção.
 *
 * @param collectionName - Nome da coleção
 * @returns Referência da coleção
 *
 * @example
 * const medicamentosRef = getCollection('medicamentos');
 */
export function getCollection(
  collectionName: CollectionName
): admin.firestore.CollectionReference {
  return getFirestore().collection(collectionName);
}

/**
 * Obtém uma referência para um documento.
 *
 * @param collectionName - Nome da coleção
 * @param docId - ID do documento
 * @returns Referência do documento
 *
 * @example
 * const medicamentoRef = getDocument('medicamentos', 'abc123');
 */
export function getDocument(
  collectionName: CollectionName,
  docId: string
): admin.firestore.DocumentReference {
  return getFirestore().collection(collectionName).doc(docId);
}

/**
 * Converte um Timestamp do Firestore para Date.
 */
export function timestampToDate(
  timestamp: admin.firestore.Timestamp | null | undefined
): Date | null {
  if (!timestamp) return null;
  return timestamp.toDate();
}

/**
 * Converte um Timestamp do Firestore para string ISO.
 */
export function timestampToISO(
  timestamp: admin.firestore.Timestamp | null | undefined
): string | null {
  if (!timestamp) return null;
  return timestamp.toDate().toISOString();
}

/**
 * Cria um Timestamp do Firestore a partir de uma Date.
 */
export function dateToTimestamp(
  date: Date | string | null | undefined
): admin.firestore.Timestamp | null {
  if (!date) return null;
  const d = typeof date === "string" ? new Date(date) : date;
  return admin.firestore.Timestamp.fromDate(d);
}

/**
 * Obtém o FieldValue para operações especiais.
 */
export const FieldValue = admin.firestore.FieldValue;

/**
 * Obtém o Timestamp do Firestore.
 */
export const Timestamp = admin.firestore.Timestamp;

