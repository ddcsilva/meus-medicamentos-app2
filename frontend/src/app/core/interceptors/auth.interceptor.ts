import {
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
} from "@angular/common/http";
import { inject } from "@angular/core";
import { Auth, authState, User } from "@angular/fire/auth";
import { catchError, first, from, switchMap, timeout } from "rxjs";
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

  // Função auxiliar para adicionar token à requisição
  const addTokenToRequest = (token: string) => {
    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
    return next(authReq);
  };

  // Função auxiliar para obter token do usuário
  const getTokenFromUser = (user: User) => {
    return from(user.getIdToken()).pipe(
      switchMap((token) => {
        if (!environment.production) {
          console.log("[AuthInterceptor] Token obtido com sucesso");
        }
        return addTokenToRequest(token);
      }),
      catchError((error) => {
        console.error("[AuthInterceptor] Erro ao obter token:", error);
        return next(req);
      })
    );
  };

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
    return getTokenFromUser(currentUser);
  }

  // Se não há usuário atual, aguarda o estado de autenticação
  // O Firebase Auth pode ainda não ter inicializado completamente
  return authState(auth).pipe(
    // Pega o primeiro valor emitido (pode ser User ou null)
    first(),
    // Timeout de 5 segundos para o Firebase Auth inicializar
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

      // Obtém o token ID do usuário
      return getTokenFromUser(user);
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
