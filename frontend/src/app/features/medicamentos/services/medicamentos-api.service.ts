import { Injectable, inject } from "@angular/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { ApiService } from "../../../core/api/api.service";
import {
  CreateMedicamentoDto,
  Medicamento,
  MedicamentoResponseDto,
  StatusValidade,
  UpdateMedicamentoDto,
  UpdateQuantidadeDto,
  mapResponseToMedicamento,
} from "../models";

/**
 * Interface para resposta padrão da API.
 */
interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

/**
 * Interface para resposta de lista da API.
 */
interface ApiListResponse {
  success: boolean;
  data: {
    items: MedicamentoResponseDto[];
    total: number;
  };
}

/**
 * Interface para filtros de listagem de medicamentos.
 */
export interface MedicamentosFilter {
  /** Filtrar por status de validade */
  status?: StatusValidade;

  /** Busca por nome ou droga */
  busca?: string;

  /** Ordenação (campo) */
  ordenarPor?: "nome" | "validade" | "quantidadeAtual" | "criadoEm";

  /** Direção da ordenação */
  ordem?: "asc" | "desc";

  /** Limite de resultados */
  limite?: number;
}

/**
 * Interface para resposta paginada da API.
 */
export interface MedicamentosListResponse {
  data: MedicamentoResponseDto[];
  total: number;
}

/**
 * Serviço de API para operações de medicamentos.
 *
 * Encapsula todas as chamadas HTTP relacionadas a medicamentos,
 * usando o ApiService como base e os DTOs definidos no modelo.
 *
 * @example
 * // Em um store ou componente
 * constructor(private medicamentosApi: MedicamentosApiService) {}
 *
 * carregarMedicamentos() {
 *   this.medicamentosApi.getAll().subscribe(medicamentos => {
 *     console.log(medicamentos);
 *   });
 * }
 */
@Injectable({
  providedIn: "root",
})
export class MedicamentosApiService {
  private readonly api = inject(ApiService);

  /** Endpoint base para medicamentos */
  private readonly endpoint = "/medicamentos";

  /**
   * Busca todos os medicamentos.
   *
   * @param filtros - Filtros opcionais para a listagem
   * @returns Observable com lista de medicamentos
   *
   * @example
   * // Todos os medicamentos
   * this.medicamentosApi.getAll().subscribe(medicamentos => { ... });
   *
   * // Com filtros
   * this.medicamentosApi.getAll({
   *   status: 'valido',
   *   ordenarPor: 'nome',
   *   ordem: 'asc'
   * }).subscribe(medicamentos => { ... });
   */
  getAll(filtros?: MedicamentosFilter): Observable<Medicamento[]> {
    const params = this.buildFilterParams(filtros);

    return this.api
      .get<ApiListResponse>(this.endpoint, { params })
      .pipe(
        map((response) => response.data.items.map(mapResponseToMedicamento))
      );
  }

  /**
   * Busca um medicamento pelo ID.
   *
   * @param id - ID do medicamento
   * @returns Observable com o medicamento encontrado
   *
   * @example
   * this.medicamentosApi.getById('abc123').subscribe(medicamento => {
   *   console.log(medicamento.nome);
   * });
   */
  getById(id: string): Observable<Medicamento> {
    return this.api
      .get<ApiResponse<MedicamentoResponseDto>>(`${this.endpoint}/${id}`)
      .pipe(map((response) => mapResponseToMedicamento(response.data)));
  }

  /**
   * Cria um novo medicamento.
   *
   * @param dto - Dados do medicamento a ser criado
   * @returns Observable com o medicamento criado
   *
   * @example
   * const novoMedicamento: CreateMedicamentoDto = {
   *   nome: 'Paracetamol',
   *   droga: 'Paracetamol',
   *   generico: true,
   *   marca: 'Genérico',
   *   laboratorio: 'Lab XYZ',
   *   tipo: 'comprimido',
   *   validade: '2024-12-31',
   *   quantidadeTotal: 20,
   *   quantidadeAtual: 20
   * };
   *
   * this.medicamentosApi.create(novoMedicamento).subscribe(medicamento => {
   *   console.log('Criado:', medicamento.id);
   * });
   */
  create(dto: CreateMedicamentoDto): Observable<Medicamento> {
    return this.api
      .post<ApiResponse<MedicamentoResponseDto>>(this.endpoint, dto)
      .pipe(map((response) => mapResponseToMedicamento(response.data)));
  }

  /**
   * Atualiza um medicamento existente.
   *
   * @param id - ID do medicamento a ser atualizado
   * @param dto - Dados a serem atualizados
   * @returns Observable com o medicamento atualizado
   *
   * @example
   * this.medicamentosApi.update('abc123', {
   *   nome: 'Novo Nome',
   *   observacoes: 'Atualizado'
   * }).subscribe(medicamento => {
   *   console.log('Atualizado:', medicamento);
   * });
   */
  update(id: string, dto: UpdateMedicamentoDto): Observable<Medicamento> {
    return this.api
      .put<ApiResponse<MedicamentoResponseDto>>(`${this.endpoint}/${id}`, dto)
      .pipe(map((response) => mapResponseToMedicamento(response.data)));
  }

  /**
   * Atualiza apenas a quantidade de um medicamento.
   *
   * Operação otimizada para atualização rápida de estoque.
   *
   * @param id - ID do medicamento
   * @param quantidade - Nova quantidade atual
   * @returns Observable com o medicamento atualizado
   *
   * @example
   * // Atualizar quantidade para 5 unidades
   * this.medicamentosApi.updateQuantidade('abc123', 5).subscribe(medicamento => {
   *   console.log('Nova quantidade:', medicamento.quantidadeAtual);
   * });
   */
  updateQuantidade(id: string, quantidade: number): Observable<Medicamento> {
    const dto: UpdateQuantidadeDto = { quantidadeAtual: quantidade };

    return this.api
      .patch<ApiResponse<MedicamentoResponseDto>>(
        `${this.endpoint}/${id}/quantidade`,
        dto
      )
      .pipe(map((response) => mapResponseToMedicamento(response.data)));
  }

  /**
   * Incrementa a quantidade de um medicamento.
   *
   * @param id - ID do medicamento
   * @param incremento - Valor a incrementar (padrão: 1)
   * @param quantidadeAtual - Quantidade atual do medicamento
   * @returns Observable com o medicamento atualizado
   *
   * @example
   * this.medicamentosApi.incrementarQuantidade('abc123', 5, 10).subscribe(medicamento => {
   *   console.log('Nova quantidade:', medicamento.quantidadeAtual); // 15
   * });
   */
  incrementarQuantidade(
    id: string,
    incremento: number = 1,
    quantidadeAtual: number
  ): Observable<Medicamento> {
    const novaQuantidade = quantidadeAtual + incremento;
    return this.updateQuantidade(id, novaQuantidade);
  }

  /**
   * Decrementa a quantidade de um medicamento.
   *
   * Não permite quantidade negativa.
   *
   * @param id - ID do medicamento
   * @param decremento - Valor a decrementar (padrão: 1)
   * @param quantidadeAtual - Quantidade atual do medicamento
   * @returns Observable com o medicamento atualizado
   *
   * @example
   * this.medicamentosApi.decrementarQuantidade('abc123', 2, 10).subscribe(medicamento => {
   *   console.log('Nova quantidade:', medicamento.quantidadeAtual); // 8
   * });
   */
  decrementarQuantidade(
    id: string,
    decremento: number = 1,
    quantidadeAtual: number
  ): Observable<Medicamento> {
    const novaQuantidade = Math.max(0, quantidadeAtual - decremento);
    return this.updateQuantidade(id, novaQuantidade);
  }

  /**
   * Exclui um medicamento.
   *
   * @param id - ID do medicamento a ser excluído
   * @returns Observable void
   *
   * @example
   * this.medicamentosApi.delete('abc123').subscribe(() => {
   *   console.log('Medicamento excluído');
   * });
   */
  delete(id: string): Observable<void> {
    return this.api.delete<void>(`${this.endpoint}/${id}`);
  }

  /**
   * Faz upload de foto para um medicamento.
   *
   * @param id - ID do medicamento
   * @param file - Arquivo de imagem
   * @returns Observable com o medicamento atualizado
   *
   * @example
   * this.medicamentosApi.uploadFoto('abc123', file).subscribe(medicamento => {
   *   console.log('URL da foto:', medicamento.fotoUrl);
   * });
   */
  uploadFoto(id: string, file: File): Observable<Medicamento> {
    return this.api
      .upload<MedicamentoResponseDto>(`${this.endpoint}/${id}/foto`, file, "foto")
      .pipe(map(mapResponseToMedicamento));
  }

  /**
   * Remove a foto de um medicamento.
   *
   * @param id - ID do medicamento
   * @returns Observable com o medicamento atualizado
   */
  removeFoto(id: string): Observable<Medicamento> {
    return this.api
      .delete<ApiResponse<MedicamentoResponseDto>>(`${this.endpoint}/${id}/foto`)
      .pipe(map((response) => mapResponseToMedicamento(response.data)));
  }

  /**
   * Constrói os parâmetros de query string a partir dos filtros.
   *
   * @param filtros - Filtros de listagem
   * @returns Objeto com parâmetros de query
   */
  private buildFilterParams(
    filtros?: MedicamentosFilter
  ): Record<string, string> | undefined {
    if (!filtros) {
      return undefined;
    }

    const params: Record<string, string> = {};

    if (filtros.status) {
      params["status"] = filtros.status;
    }

    if (filtros.busca) {
      params["busca"] = filtros.busca;
    }

    if (filtros.ordenarPor) {
      params["ordenarPor"] = filtros.ordenarPor;
    }

    if (filtros.ordem) {
      params["ordem"] = filtros.ordem;
    }

    if (filtros.limite) {
      params["limite"] = filtros.limite.toString();
    }

    return Object.keys(params).length > 0 ? params : undefined;
  }
}
