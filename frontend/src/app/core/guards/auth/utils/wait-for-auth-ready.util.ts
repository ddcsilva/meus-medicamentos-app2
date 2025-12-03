import { toObservable } from '@angular/core/rxjs-interop';
import { catchError, filter, firstValueFrom, timeout } from 'rxjs';
import { AuthService } from '../../../services/auth.service';

/**
 * Aguarda o carregamento do estado de autenticação de forma reativa.
 *
 * Converte o signal `authLoading` em Observable e aguarda até que
 * seu valor seja `false`, indicando que o estado de autenticação foi carregado.
 *
 * Usa operadores RxJS para implementação eficiente:
 * - `toObservable()`: Converte signal em Observable
 * - `filter()`: Aguarda até loading ser false
 * - `timeout()`: Evita espera infinita
 * - `firstValueFrom()`: Converte Observable em Promise
 *
 * @param authService - Instância do AuthService
 * @param timeoutMs - Tempo máximo de espera em ms (padrão: 5000)
 *
 * @example
 * // Em um guard
 * if (authService.authLoading()) {
 *   await waitForAuthReady(authService);
 * }
 * // Agora pode verificar authService.isAuthenticated() com segurança
 */
export async function waitForAuthReady(authService: AuthService, timeoutMs: number = 5000): Promise<void> {
  const authLoading$ = toObservable(authService.authLoading);

  await firstValueFrom(
    authLoading$.pipe(
      filter((loading) => !loading),
      timeout(timeoutMs),
      catchError(() => {
        console.warn('⏱️ Timeout aguardando estado de autenticação');
        return [false];
      })
    )
  );
}
