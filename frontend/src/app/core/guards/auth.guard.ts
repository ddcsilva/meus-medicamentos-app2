import { inject } from "@angular/core";
import { Router, CanActivateFn, UrlTree } from "@angular/router";
import { AuthService } from "../services/auth.service";

/**
 * Guard de autenticação para proteger rotas que requerem usuário autenticado.
 *
 * Redireciona para `/auth/login` se o usuário não estiver autenticado.
 * Aguarda o carregamento inicial do estado de autenticação antes de decidir.
 *
 * @example
 * // Em app.routes.ts
 * {
 *   path: 'medicamentos',
 *   canActivate: [authGuard],
 *   component: MedicamentosComponent
 * }
 */
export const authGuard: CanActivateFn = async (): Promise<boolean | UrlTree> => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Aguarda o carregamento inicial do estado de autenticação
  if (authService.authLoading()) {
    await waitForAuthLoading(authService);
  }

  // Verifica se o usuário está autenticado
  if (authService.isAuthenticated()) {
    return true;
  }

  // Redireciona para login se não autenticado
  console.log("🔒 Acesso negado: usuário não autenticado. Redirecionando para login...");
  return router.createUrlTree(["/auth/login"]);
};

/**
 * Guard inverso para impedir que usuários autenticados acessem rotas públicas (ex: login).
 *
 * Redireciona para `/medicamentos` se o usuário já estiver autenticado.
 *
 * @example
 * // Em app.routes.ts
 * {
 *   path: 'login',
 *   canActivate: [guestGuard],
 *   component: LoginComponent
 * }
 */
export const guestGuard: CanActivateFn = async (): Promise<boolean | UrlTree> => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Aguarda o carregamento inicial do estado de autenticação
  if (authService.authLoading()) {
    await waitForAuthLoading(authService);
  }

  // Se não autenticado, permite acesso à rota pública
  if (!authService.isAuthenticated()) {
    return true;
  }

  // Redireciona para medicamentos se já autenticado
  console.log("🔓 Usuário já autenticado. Redirecionando para medicamentos...");
  return router.createUrlTree(["/medicamentos"]);
};

/**
 * Aguarda o carregamento do estado de autenticação.
 * Usa polling simples para verificar quando authLoading se torna false.
 *
 * @param authService - Instância do AuthService
 * @param timeout - Tempo máximo de espera em ms (padrão: 5000)
 */
async function waitForAuthLoading(
  authService: AuthService,
  timeout: number = 5000
): Promise<void> {
  const startTime = Date.now();

  return new Promise((resolve) => {
    const checkInterval = setInterval(() => {
      if (!authService.authLoading() || Date.now() - startTime > timeout) {
        clearInterval(checkInterval);
        resolve();
      }
    }, 50);
  });
}

