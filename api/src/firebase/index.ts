/**
 * Barrel file para exportar módulos do Firebase Admin.
 *
 * O Firebase Admin SDK é configurado aqui para:
 * - Autenticação (verificação de tokens)
 * - Firestore (acesso ao banco de dados)
 * - Storage (upload de arquivos)
 */

// Admin SDK
export {
  initializeFirebase,
  isFirebaseInitialized,
  getApp,
  admin,
} from "./admin";

// Firestore
export {
  getFirestore,
  getCollection,
  getDocument,
  COLLECTIONS,
  timestampToDate,
  timestampToISO,
  dateToTimestamp,
  FieldValue,
  Timestamp,
} from "./firestore";
export type { CollectionName } from "./firestore";

// Auth
export {
  getAuth,
  verifyIdToken,
  getUserByUid,
  getUserByEmail,
  extractUserFromToken,
} from "./auth";
export type { TokenUser } from "./auth";

// Storage
export {
  getStorage,
  getBucket,
  uploadFile,
  uploadBuffer,
  getSignedUrl,
  deleteFile,
  fileExists,
} from "./storage";
