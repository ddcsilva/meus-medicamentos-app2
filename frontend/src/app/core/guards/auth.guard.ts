import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { waitForAuthReady } from './auth/utils';

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

  if (authService.authLoading()) {
    await waitForAuthReady(authService);
  }

  if (authService.isAuthenticated()) {
    return true;
  }

  console.log('🔒 Acesso negado: usuário não autenticado. Redirecionando para login...');
  return router.createUrlTree(['/auth/login']);
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

  if (authService.authLoading()) {
    await waitForAuthReady(authService);
  }

  if (!authService.isAuthenticated()) {
    return true;
  }

  console.log('🔓 Usuário já autenticado. Redirecionando para medicamentos...');
  return router.createUrlTree(['/medicamentos']);
};
