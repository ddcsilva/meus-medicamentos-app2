import { HttpInterceptorFn, HttpRequest, HttpHandlerFn } from "@angular/common/http";
import { inject } from "@angular/core";
import { from, switchMap, catchError, first, filter, timeout, take } from "rxjs";
import { Auth, authState } from "@angular/fire/auth";
import { environment } from "../../../environments/environment";

/**
 * Interceptor HTTP que adiciona o token de autenticação do Firebase
 * em todas as requisições para a API.
 *
 * O token é obtido automaticamente do usuário autenticado via Firebase Auth
 * e adicionado no header Authorization como Bearer token.
 *
 * @example
 * // Requisição original:
 * GET /api/medicamentos
 *
 * // Requisição com interceptor:
 * GET /api/medicamentos
 * Authorization: Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...
 */
export const authInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
) => {
  const auth = inject(Auth);

  // Só adiciona token para requisições à nossa API
  if (!isApiRequest(req.url)) {
    return next(req);
  }

  // Obtém o usuário atual diretamente (mais rápido que authState)
  const currentUser = auth.currentUser;

  if (!environment.production) {
    console.log("[AuthInterceptor] Verificando autenticação...", {
      hasCurrentUser: !!currentUser,
      url: req.url,
    });
  }

  // Se já há um usuário autenticado, obtém o token imediatamente
  if (currentUser) {
    return from(currentUser.getIdToken()).pipe(
      switchMap((token) => {
        if (!environment.production) {
          console.log("[AuthInterceptor] Token obtido com sucesso");
        }
        const authReq = req.clone({
          setHeaders: {
            Authorization: `Bearer ${token}`,
          },
        });
        return next(authReq);
      }),
      catchError((error) => {
        console.error("[AuthInterceptor] Erro ao obter token:", error);
        // Se falhar ao obter token, tenta sem token (API retornará 401)
        return next(req);
      })
    );
  }

  // Se não há usuário atual, aguarda o estado de autenticação
  // Primeiro, tenta aguardar um pouco para ver se o usuário aparece
  return authState(auth).pipe(
    // Aguarda até ter um valor definido (pode ser null se não autenticado)
    filter((user) => user !== undefined),
    take(1),
    // Timeout de 5 segundos (mais tempo para o Firebase Auth inicializar)
    timeout(5000),
    switchMap((user) => {
      // Se não há usuário autenticado, continua sem token
      if (!user) {
        if (!environment.production) {
          console.warn(
            "[AuthInterceptor] Usuário não autenticado, requisição sem token"
          );
        }
        return next(req);
      }

      // Obtém o token ID do usuário e adiciona ao header
      return from(user.getIdToken()).pipe(
        switchMap((token) => {
          if (!environment.production) {
            console.log("[AuthInterceptor] Token obtido via authState");
          }
          const authReq = req.clone({
            setHeaders: {
              Authorization: `Bearer ${token}`,
            },
          });
          return next(authReq);
        }),
        catchError((error) => {
          console.error("[AuthInterceptor] Erro ao obter token:", error);
          // Continua sem token em caso de erro
          return next(req);
        })
      );
    }),
    catchError((error) => {
      // Timeout ou erro no authState
      if (!environment.production) {
        console.warn(
          "[AuthInterceptor] Timeout ou erro ao aguardar autenticação:",
          error
        );
      }
      // Continua sem token - a API retornará 401 se necessário
      return next(req);
    })
  );
};

/**
 * Verifica se a URL é uma requisição para a API do backend.
 *
 * @param url - URL da requisição
 * @returns true se é uma requisição para a API
 */
function isApiRequest(url: string): boolean {
  // Verifica se a URL começa com a base URL da API
  return url.startsWith(environment.apiBaseUrl);
}
