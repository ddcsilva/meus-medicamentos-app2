/**
 * Interface para informações de erro de autenticação.
 *
 * Encapsula o código do erro do Firebase e uma mensagem amigável
 * traduzida para o usuário.
 *
 * @example
 * const errorInfo: AuthErrorInfo = {
 *   code: 'auth/invalid-credential',
 *   message: 'Credenciais inválidas. Verifique e-mail e senha.'
 * };
 */
export interface AuthErrorInfo {
  code: string;
  message: string;
}
