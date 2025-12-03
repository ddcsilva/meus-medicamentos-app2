import { Injectable, inject } from "@angular/core";
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
  HttpParams,
} from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError, map } from "rxjs/operators";
import { environment } from "../../../environments/environment";

/**
 * Interface para erros de API padronizados.
 */
export interface ApiError {
  /** Código de status HTTP */
  status: number;

  /** Mensagem de erro amigável */
  message: string;

  /** Código de erro (ex: 'UNAUTHORIZED', 'NOT_FOUND') */
  code: string;

  /** Detalhes adicionais do erro (opcional) */
  details?: Record<string, unknown>;

  /** Erro original para debugging */
  originalError?: HttpErrorResponse;
}

/**
 * Opções para requisições HTTP.
 */
export interface RequestOptions {
  /** Headers adicionais */
  headers?: HttpHeaders | Record<string, string | string[]>;

  /** Query params */
  params?: HttpParams | Record<string, string | string[]>;

  /** Se deve incluir credenciais */
  withCredentials?: boolean;

  /** Tipo de resposta */
  responseType?: "json" | "text" | "blob" | "arraybuffer";
}

/**
 * Serviço HTTP genérico para comunicação com a API.
 *
 * Encapsula HttpClient e fornece:
 * - URL base da API centralizada via environment
 * - Métodos tipados para GET/POST/PUT/PATCH/DELETE
 * - Tratamento de erros padronizado
 * - Suporte a headers e query params customizados
 *
 * @example
 * // Em um serviço de domínio
 * @Injectable({ providedIn: 'root' })
 * export class MedicamentosApi {
 *   private api = inject(ApiService);
 *
 *   listar(): Observable<Medicamento[]> {
 *     return this.api.get<Medicamento[]>('/medicamentos');
 *   }
 *
 *   criar(dto: CreateMedicamentoDto): Observable<Medicamento> {
 *     return this.api.post<Medicamento>('/medicamentos', dto);
 *   }
 * }
 */
@Injectable({
  providedIn: "root",
})
export class ApiService {
  private readonly http = inject(HttpClient);

  /**
   * URL base da API construída a partir do environment.
   */
  private readonly baseUrl: string = environment.apiBaseUrl;

  constructor() {
    // Log apenas em desenvolvimento
    if (!environment.production) {
      console.log("🌐 API Base URL:", this.baseUrl);
    }
  }

  /**
   * Constrói a URL completa concatenando baseUrl com o endpoint.
   *
   * @param endpoint - Caminho relativo do endpoint (ex: '/medicamentos')
   * @returns URL completa
   */
  private buildUrl(endpoint: string): string {
    // Remove barra duplicada se houver
    const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
    return `${this.baseUrl}${cleanEndpoint}`;
  }

  /**
   * Converte as opções de requisição para o formato do HttpClient.
   */
  private buildHttpOptions(options?: RequestOptions): {
    headers?: HttpHeaders;
    params?: HttpParams;
    withCredentials?: boolean;
  } {
    if (!options) {
      return {};
    }

    const httpOptions: {
      headers?: HttpHeaders;
      params?: HttpParams;
      withCredentials?: boolean;
    } = {};

    if (options.headers) {
      httpOptions.headers =
        options.headers instanceof HttpHeaders
          ? options.headers
          : new HttpHeaders(options.headers as Record<string, string>);
    }

    if (options.params) {
      httpOptions.params =
        options.params instanceof HttpParams
          ? options.params
          : new HttpParams({ fromObject: options.params as Record<string, string> });
    }

    if (options.withCredentials !== undefined) {
      httpOptions.withCredentials = options.withCredentials;
    }

    return httpOptions;
  }

  /**
   * Trata erros HTTP e converte para ApiError padronizado.
   *
   * @param error - Erro HTTP original
   * @returns Observable com erro tratado
   */
  private handleError(error: HttpErrorResponse): Observable<never> {
    const apiError = this.mapHttpError(error);

    // Log em desenvolvimento
    if (!environment.production) {
      console.error("❌ API Error:", apiError);
    }

    return throwError(() => apiError);
  }

  /**
   * Mapeia um HttpErrorResponse para ApiError.
   *
   * @param error - Erro HTTP original
   * @returns Erro padronizado
   */
  private mapHttpError(error: HttpErrorResponse): ApiError {
    // Erro de rede ou cliente
    if (error.status === 0) {
      return {
        status: 0,
        code: "NETWORK_ERROR",
        message: "Erro de conexão. Verifique sua internet.",
        originalError: error,
      };
    }

    // Mapeia códigos HTTP para mensagens amigáveis
    const errorMessages: Record<number, { code: string; message: string }> = {
      400: {
        code: "BAD_REQUEST",
        message: "Requisição inválida. Verifique os dados enviados.",
      },
      401: {
        code: "UNAUTHORIZED",
        message: "Sessão expirada. Faça login novamente.",
      },
      403: {
        code: "FORBIDDEN",
        message: "Você não tem permissão para realizar esta ação.",
      },
      404: {
        code: "NOT_FOUND",
        message: "Recurso não encontrado.",
      },
      409: {
        code: "CONFLICT",
        message: "Conflito ao processar a requisição.",
      },
      422: {
        code: "VALIDATION_ERROR",
        message: "Dados inválidos. Verifique os campos.",
      },
      429: {
        code: "TOO_MANY_REQUESTS",
        message: "Muitas requisições. Aguarde um momento.",
      },
      500: {
        code: "INTERNAL_ERROR",
        message: "Erro interno do servidor. Tente novamente.",
      },
      502: {
        code: "BAD_GATEWAY",
        message: "Servidor indisponível. Tente novamente.",
      },
      503: {
        code: "SERVICE_UNAVAILABLE",
        message: "Serviço temporariamente indisponível.",
      },
      504: {
        code: "GATEWAY_TIMEOUT",
        message: "Tempo limite excedido. Tente novamente.",
      },
    };

    const mappedError = errorMessages[error.status] || {
      code: "UNKNOWN_ERROR",
      message: "Erro desconhecido. Tente novamente.",
    };

    // Tenta extrair mensagem do corpo da resposta
    const serverMessage = this.extractServerMessage(error);

    return {
      status: error.status,
      code: mappedError.code,
      message: serverMessage || mappedError.message,
      details: error.error,
      originalError: error,
    };
  }

  /**
   * Tenta extrair mensagem de erro do corpo da resposta.
   */
  private extractServerMessage(error: HttpErrorResponse): string | null {
    if (!error.error) {
      return null;
    }

    // Tenta diferentes formatos de resposta de erro
    if (typeof error.error === "string") {
      return error.error;
    }

    if (error.error.message) {
      return error.error.message;
    }

    if (error.error.error) {
      return typeof error.error.error === "string"
        ? error.error.error
        : error.error.error.message;
    }

    return null;
  }

  /**
   * Faz uma requisição GET.
   *
   * @param endpoint - Caminho relativo do endpoint
   * @param options - Opções da requisição (headers, params)
   * @returns Observable com a resposta tipada
   *
   * @example
   * this.api.get<Medicamento[]>('/medicamentos').subscribe(medicamentos => {
   *   console.log(medicamentos);
   * });
   *
   * // Com query params
   * this.api.get<Medicamento[]>('/medicamentos', {
   *   params: { status: 'valido', limit: '10' }
   * });
   */
  get<T>(endpoint: string, options?: RequestOptions): Observable<T> {
    return this.http
      .get<T>(this.buildUrl(endpoint), this.buildHttpOptions(options))
      .pipe(catchError((error) => this.handleError(error)));
  }

  /**
   * Faz uma requisição POST.
   *
   * @param endpoint - Caminho relativo do endpoint
   * @param body - Corpo da requisição
   * @param options - Opções da requisição (headers, params)
   * @returns Observable com a resposta tipada
   *
   * @example
   * this.api.post<Medicamento>('/medicamentos', novoMedicamento).subscribe(medicamento => {
   *   console.log('Criado:', medicamento);
   * });
   */
  post<T>(endpoint: string, body: unknown, options?: RequestOptions): Observable<T> {
    return this.http
      .post<T>(this.buildUrl(endpoint), body, this.buildHttpOptions(options))
      .pipe(catchError((error) => this.handleError(error)));
  }

  /**
   * Faz uma requisição PUT.
   *
   * @param endpoint - Caminho relativo do endpoint
   * @param body - Corpo da requisição
   * @param options - Opções da requisição (headers, params)
   * @returns Observable com a resposta tipada
   *
   * @example
   * this.api.put<Medicamento>('/medicamentos/123', medicamentoAtualizado).subscribe(medicamento => {
   *   console.log('Atualizado:', medicamento);
   * });
   */
  put<T>(endpoint: string, body: unknown, options?: RequestOptions): Observable<T> {
    return this.http
      .put<T>(this.buildUrl(endpoint), body, this.buildHttpOptions(options))
      .pipe(catchError((error) => this.handleError(error)));
  }

  /**
   * Faz uma requisição PATCH.
   *
   * @param endpoint - Caminho relativo do endpoint
   * @param body - Corpo da requisição (atualização parcial)
   * @param options - Opções da requisição (headers, params)
   * @returns Observable com a resposta tipada
   *
   * @example
   * this.api.patch<Medicamento>('/medicamentos/123/quantidade', { quantidadeAtual: 5 }).subscribe(medicamento => {
   *   console.log('Quantidade atualizada:', medicamento);
   * });
   */
  patch<T>(endpoint: string, body: unknown, options?: RequestOptions): Observable<T> {
    return this.http
      .patch<T>(this.buildUrl(endpoint), body, this.buildHttpOptions(options))
      .pipe(catchError((error) => this.handleError(error)));
  }

  /**
   * Faz uma requisição DELETE.
   *
   * @param endpoint - Caminho relativo do endpoint
   * @param options - Opções da requisição (headers, params)
   * @returns Observable com a resposta tipada
   *
   * @example
   * this.api.delete<void>('/medicamentos/123').subscribe(() => {
   *   console.log('Medicamento excluído');
   * });
   */
  delete<T>(endpoint: string, options?: RequestOptions): Observable<T> {
    return this.http
      .delete<T>(this.buildUrl(endpoint), this.buildHttpOptions(options))
      .pipe(catchError((error) => this.handleError(error)));
  }

  /**
   * Faz upload de arquivo via POST multipart/form-data.
   *
   * @param endpoint - Caminho relativo do endpoint
   * @param file - Arquivo a ser enviado
   * @param fieldName - Nome do campo do arquivo (padrão: 'file')
   * @param additionalData - Dados adicionais para enviar junto
   * @returns Observable com a resposta tipada
   *
   * @example
   * this.api.upload<{ url: string }>('/upload', file, 'foto').subscribe(response => {
   *   console.log('URL:', response.url);
   * });
   */
  upload<T>(
    endpoint: string,
    file: File,
    fieldName: string = "file",
    additionalData?: Record<string, string>
  ): Observable<T> {
    const formData = new FormData();
    formData.append(fieldName, file);

    if (additionalData) {
      Object.entries(additionalData).forEach(([key, value]) => {
        formData.append(key, value);
      });
    }

    return this.http
      .post<ApiResponse<T>>(this.buildUrl(endpoint), formData)
      .pipe(
        map((response) => response.data),
        catchError((error) => this.handleError(error))
      );
  }
}

/**
 * Interface para resposta padrão da API.
 */
interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}
