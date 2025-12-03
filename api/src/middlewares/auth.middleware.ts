import { Request, Response, NextFunction } from "express";
import { verifyIdToken, extractUserFromToken, TokenUser } from "../firebase";
import { createAppError } from "./error.middleware";

/**
 * Estende a interface Request do Express para incluir o usuário autenticado.
 */
declare global {
  namespace Express {
    interface Request {
      user?: TokenUser;
    }
  }
}

/**
 * Extrai o token Bearer do header Authorization.
 *
 * @param authHeader - Header de autorização
 * @returns Token ou null
 */
function extractBearerToken(authHeader: string | undefined): string | null {
  if (!authHeader) {
    return null;
  }

  const parts = authHeader.split(" ");

  if (parts.length !== 2 || parts[0].toLowerCase() !== "bearer") {
    return null;
  }

  return parts[1];
}

/**
 * Middleware de autenticação obrigatória.
 *
 * Verifica o token Firebase no header Authorization e adiciona
 * os dados do usuário em req.user.
 *
 * @example
 * router.get('/protected', authMiddleware, (req, res) => {
 *   console.log(req.user?.uid);
 * });
 */
export async function authMiddleware(
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const token = extractBearerToken(req.headers.authorization);

    if (!token) {
      throw createAppError(
        "Token de autenticação não fornecido.",
        401,
        "UNAUTHORIZED"
      );
    }

    const decodedToken = await verifyIdToken(token);
    req.user = extractUserFromToken(decodedToken);

    next();
  } catch (error) {
    // Erros do Firebase Auth
    const err = error as { code?: string; message?: string };

    if (err.code === "auth/id-token-expired") {
      next(createAppError("Token expirado.", 401, "TOKEN_EXPIRED"));
      return;
    }

    if (err.code === "auth/id-token-revoked") {
      next(createAppError("Token revogado.", 401, "TOKEN_REVOKED"));
      return;
    }

    if (err.code === "auth/argument-error") {
      next(createAppError("Token inválido.", 401, "INVALID_TOKEN"));
      return;
    }

    // Se já é um AppError, repassa
    if ((error as { statusCode?: number }).statusCode) {
      next(error);
      return;
    }

    // Erro genérico de autenticação
    next(createAppError("Falha na autenticação.", 401, "AUTH_FAILED"));
  }
}

/**
 * Middleware de autenticação opcional.
 *
 * Tenta verificar o token, mas não falha se não houver token.
 * Útil para rotas que funcionam para usuários autenticados e anônimos.
 *
 * @example
 * router.get('/public', optionalAuthMiddleware, (req, res) => {
 *   if (req.user) {
 *     // Usuário autenticado
 *   } else {
 *     // Usuário anônimo
 *   }
 * });
 */
export async function optionalAuthMiddleware(
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const token = extractBearerToken(req.headers.authorization);

    if (token) {
      const decodedToken = await verifyIdToken(token);
      req.user = extractUserFromToken(decodedToken);
    }

    next();
  } catch {
    // Ignora erros e continua sem usuário
    next();
  }
}

/**
 * Factory para criar middleware que verifica se o usuário é dono do recurso.
 *
 * @param getResourceOwnerId - Função que extrai o ID do dono do recurso
 * @returns Middleware de verificação de propriedade
 *
 * @example
 * router.put('/medicamentos/:id', authMiddleware, ownerMiddleware(
 *   async (req) => {
 *     const med = await getMedicamento(req.params.id);
 *     return med?.criadoPor;
 *   }
 * ), updateHandler);
 */
export function ownerMiddleware(
  getResourceOwnerId: (req: Request) => Promise<string | undefined>
): (req: Request, res: Response, next: NextFunction) => Promise<void> {
  return async (
    req: Request,
    _res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      if (!req.user) {
        throw createAppError("Usuário não autenticado.", 401, "UNAUTHORIZED");
      }

      const ownerId = await getResourceOwnerId(req);

      if (!ownerId) {
        throw createAppError("Recurso não encontrado.", 404, "NOT_FOUND");
      }

      if (ownerId !== req.user.uid) {
        throw createAppError(
          "Você não tem permissão para acessar este recurso.",
          403,
          "FORBIDDEN"
        );
      }

      next();
    } catch (error) {
      next(error);
    }
  };
}


