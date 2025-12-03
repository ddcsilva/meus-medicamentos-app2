import { HttpInterceptorFn, HttpRequest, HttpHandlerFn } from "@angular/common/http";
import { inject } from "@angular/core";
import { from, switchMap, catchError, of, first, filter, timeout } from "rxjs";
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

  // Aguarda o estado de autenticação estar disponível
  return authState(auth).pipe(
    // Aguarda até ter um valor definido (não undefined)
    first(),
    // Timeout de 5 segundos para não travar a requisição
    timeout(5000),
    switchMap((user) => {
      // Se não há usuário autenticado, continua sem token
      if (!user) {
        console.warn("[AuthInterceptor] Usuário não autenticado, requisição sem token");
        return next(req);
      }

      // Obtém o token ID do usuário e adiciona ao header
      return from(user.getIdToken()).pipe(
        switchMap((token) => {
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
      console.error("[AuthInterceptor] Erro no interceptor:", error);
      // Continua sem token em caso de erro ou timeout
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
