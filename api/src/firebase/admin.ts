import * as admin from "firebase-admin";
import { env } from "../config/env";
import path from "path";
import fs from "fs";

/**
 * Flag para controlar se o Firebase foi inicializado.
 */
let isInitialized = false;

/**
 * Obtém as credenciais do Firebase Admin.
 *
 * Prioridade:
 * 1. Arquivo de credenciais (FIREBASE_SERVICE_ACCOUNT_PATH)
 * 2. Variáveis de ambiente individuais (PROJECT_ID, PRIVATE_KEY, CLIENT_EMAIL)
 * 3. Credenciais padrão do ambiente (Application Default Credentials)
 */
function getCredentials(): admin.credential.Credential | undefined {
  const { firebase } = env;

  // Opção 1: Arquivo de credenciais
  if (firebase.serviceAccountPath) {
    const absolutePath = path.isAbsolute(firebase.serviceAccountPath)
      ? firebase.serviceAccountPath
      : path.resolve(process.cwd(), firebase.serviceAccountPath);

    if (fs.existsSync(absolutePath)) {
      console.info(
        `[Firebase] Carregando credenciais do arquivo: ${absolutePath}`
      );
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const serviceAccount = require(absolutePath);
      return admin.credential.cert(serviceAccount);
    } else {
      console.warn(
        `[Firebase] Arquivo de credenciais não encontrado: ${absolutePath}`
      );
    }
  }

  // Opção 2: Variáveis de ambiente individuais
  if (firebase.projectId && firebase.privateKey && firebase.clientEmail) {
    console.info("[Firebase] Carregando credenciais de variáveis de ambiente");
    return admin.credential.cert({
      projectId: firebase.projectId,
      privateKey: firebase.privateKey,
      clientEmail: firebase.clientEmail,
    });
  }

  // Opção 3: Credenciais padrão do ambiente (GCP, Cloud Functions, etc.)
  console.info(
    "[Firebase] Tentando usar Application Default Credentials (ADC)"
  );
  return admin.credential.applicationDefault();
}

/**
 * Inicializa o Firebase Admin SDK.
 *
 * Esta função é idempotente - pode ser chamada múltiplas vezes
 * mas só inicializa o Firebase uma vez.
 */
export function initializeFirebase(): admin.app.App {
  if (isInitialized) {
    return admin.app();
  }

  try {
    const credential = getCredentials();

    const app = admin.initializeApp({
      credential,
      projectId: env.firebase.projectId,
      storageBucket: env.firebase.projectId
        ? `${env.firebase.projectId}.appspot.com`
        : undefined,
    });

    isInitialized = true;
    console.info("[Firebase] Admin SDK inicializado com sucesso");

    return app;
  } catch (error) {
    console.error("[Firebase] Erro ao inicializar Admin SDK:", error);
    throw error;
  }
}

/**
 * Verifica se o Firebase foi inicializado.
 */
export function isFirebaseInitialized(): boolean {
  return isInitialized;
}

/**
 * Obtém a instância do app Firebase.
 *
 * Inicializa automaticamente se ainda não foi inicializado.
 */
export function getApp(): admin.app.App {
  if (!isInitialized) {
    return initializeFirebase();
  }
  return admin.app();
}

// Re-exporta o módulo admin para uso direto se necessário
export { admin };


