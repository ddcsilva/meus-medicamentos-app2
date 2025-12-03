/**
 * Interface para representar um usuário autenticado.
 */
export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  emailVerified: boolean;
}

/**
 * Interface para dados de login.
 */
export interface LoginRequest {
  email: string;
  password: string;
}

/**
 * Interface para resposta de login.
 */
export interface LoginResponse {
  success: boolean;
  user?: AuthUser;
  error?: {
    code: string;
    message: string;
  };
}

/**
 * Mapeia um User do Firebase para AuthUser.
 */
export function mapFirebaseUser(user: {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  emailVerified: boolean;
}): AuthUser {
  return {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
    photoURL: user.photoURL,
    emailVerified: user.emailVerified,
  };
}
