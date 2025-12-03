import { User } from '@angular/fire/auth';
import { AuthErrorInfo } from './auth-error-info.model';

/**
 * Interface para o resultado de operações de autenticação.
 *
 * Representa o resultado de operações como login e logout,
 * incluindo sucesso, dados do usuário e informações de erro.
 *
 * @example
 * const result: AuthResult = await authService.login(credentials);
 * if (result.success) {
 *   console.log('Usuário:', result.user?.email);
 * } else {
 *   console.error('Erro:', result.error?.message);
 * }
 */
export interface AuthResult {
  success: boolean;
  user?: User | null;
  error?: AuthErrorInfo;
}
