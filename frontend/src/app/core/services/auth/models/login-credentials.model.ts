/**
 * Interface para dados de login.
 *
 * Representa as credenciais necessárias para autenticação
 * via e-mail e senha.
 *
 * @example
 * const credentials: LoginCredentials = {
 *   email: 'usuario@example.com',
 *   password: 'senha123'
 * };
 * await authService.login(credentials);
 */
export interface LoginCredentials {
  email: string;
  password: string;
}
