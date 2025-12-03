import { getApp, admin } from "./admin";

/**
 * Instância cacheada do Auth.
 */
let authInstance: admin.auth.Auth | null = null;

/**
 * Obtém a instância do Firebase Auth.
 *
 * Inicializa o Firebase automaticamente se necessário.
 *
 * @example
 * const auth = getAuth();
 * const user = await auth.getUser(uid);
 */
export function getAuth(): admin.auth.Auth {
  if (!authInstance) {
    const app = getApp();
    authInstance = app.auth();
  }

  return authInstance;
}

/**
 * Verifica um token de ID do Firebase.
 *
 * @param idToken - Token de ID do Firebase
 * @returns Dados do token decodificado
 *
 * @example
 * const decodedToken = await verifyIdToken(token);
 * console.log(decodedToken.uid);
 */
export async function verifyIdToken(
  idToken: string
): Promise<admin.auth.DecodedIdToken> {
  const auth = getAuth();
  return auth.verifyIdToken(idToken);
}

/**
 * Obtém informações de um usuário pelo UID.
 *
 * @param uid - UID do usuário
 * @returns Registro do usuário
 */
export async function getUserByUid(
  uid: string
): Promise<admin.auth.UserRecord> {
  const auth = getAuth();
  return auth.getUser(uid);
}

/**
 * Obtém informações de um usuário pelo email.
 *
 * @param email - Email do usuário
 * @returns Registro do usuário
 */
export async function getUserByEmail(
  email: string
): Promise<admin.auth.UserRecord> {
  const auth = getAuth();
  return auth.getUserByEmail(email);
}

/**
 * Interface para dados de usuário extraídos do token.
 */
export interface TokenUser {
  uid: string;
  email: string | undefined;
  emailVerified: boolean;
  name?: string;
  picture?: string;
}

/**
 * Extrai dados do usuário de um token decodificado.
 *
 * @param decodedToken - Token decodificado
 * @returns Dados do usuário
 */
export function extractUserFromToken(
  decodedToken: admin.auth.DecodedIdToken
): TokenUser {
  return {
    uid: decodedToken.uid,
    email: decodedToken.email,
    emailVerified: decodedToken.email_verified ?? false,
    name: decodedToken.name,
    picture: decodedToken.picture,
  };
}

