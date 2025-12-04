import { Injectable, computed, inject, signal } from "@angular/core";
import { firstValueFrom } from "rxjs";
import { ApiError } from "../../../core/api/api.service";
import {
  CreateMedicamentoDto,
  Medicamento,
  MedicamentosFiltros,
  StatusValidade,
  TipoMedicamento,
  UpdateMedicamentoDto,
} from "../models";
import {
  aplicarFiltros,
  extrairMarcas,
  extrairTipos,
  temFiltrosAtivos,
} from "../utils/medicamentos-filter.utils";
import {
  MedicamentosApiService,
  MedicamentosFilter,
} from "./medicamentos-api.service";

/**
 * Interface para o estado de erro.
 */
export interface StoreError {
  message: string;
  code?: string;
  action?: string;
}

/**
 * Resultado de uma operação de atualização de quantidade.
 */
export interface QuantidadeUpdateResult {
  /** Se a operação foi bem sucedida */
  success: boolean;
  /** Medicamento atualizado (se sucesso) */
  medicamento?: Medicamento;
  /** Erro (se falha) */
  error?: StoreError;
  /** Quantidade anterior */
  quantidadeAnterior?: number;
  /** Nova quantidade */
  quantidadeNova?: number;
}

/**
 * Re-export do tipo de filtros para uso externo.
 */
export type MedicamentosStoreFilters = MedicamentosFiltros;

/**
 * Store de Medicamentos com Angular Signals.
 *
 * Gerencia o estado de:
 * - Lista de medicamentos
 * - Item selecionado
 * - Loading (global e por item)
 * - Erro
 * - Filtros
 *
 * @example
 * // Em um componente
 * @Component({...})
 * export class MedicamentosListComponent {
 *   private store = inject(MedicamentosStore);
 *
 *   // Consumir signals
 *   items = this.store.items;
 *   loading = this.store.loading;
 *   error = this.store.error;
 *
 *   // Contagens
 *   totalItems = this.store.totalItems;
 *   validosCount = this.store.validosCount;
 *   vencidosCount = this.store.vencidosCount;
 *
 *   ngOnInit() {
 *     this.store.loadAll();
 *   }
 *
 *   incrementar(medicamento: Medicamento) {
 *     this.store.incrementarQuantidade(medicamento.id, medicamento.quantidadeAtual);
 *   }
 * }
 */
@Injectable({
  providedIn: "root",
})
export class MedicamentosStore {
  private readonly api = inject(MedicamentosApiService);

  // ========================================
  // SIGNALS PRIVADOS (Estado interno)
  // ========================================

  /** Lista de medicamentos */
  private readonly _items = signal<Medicamento[]>([]);

  /** Medicamento selecionado */
  private readonly _selected = signal<Medicamento | null>(null);

  /** Estado de loading global */
  private readonly _loading = signal<boolean>(false);

  /** Estado de loading por item (para operações individuais) */
  private readonly _itemLoading = signal<Set<string>>(new Set());

  /** Erro atual */
  private readonly _error = signal<StoreError | null>(null);

  /** Filtros ativos */
  private readonly _filters = signal<MedicamentosStoreFilters>({});

  // ========================================
  // SIGNALS PÚBLICOS (Readonly)
  // ========================================

  /** Lista de medicamentos (readonly) */
  readonly items = this._items.asReadonly();

  /** Medicamento selecionado (readonly) */
  readonly selected = this._selected.asReadonly();

  /** Estado de loading global (readonly) */
  readonly loading = this._loading.asReadonly();

  /** Erro atual (readonly) */
  readonly error = this._error.asReadonly();

  /** Filtros ativos (readonly) */
  readonly filters = this._filters.asReadonly();

  // ========================================
  // COMPUTED SIGNALS
  // ========================================

  /** Total de medicamentos */
  readonly totalItems = computed(() => this._items().length);

  /** Contagem de medicamentos válidos */
  readonly validosCount = computed(
    () => this._items().filter((m) => m.statusValidade === "valido").length
  );

  /** Contagem de medicamentos prestes a vencer */
  readonly prestesCount = computed(
    () => this._items().filter((m) => m.statusValidade === "prestes").length
  );

  /** Contagem de medicamentos vencidos */
  readonly vencidosCount = computed(
    () => this._items().filter((m) => m.statusValidade === "vencido").length
  );

  /** Contagem de medicamentos com estoque baixo (< 5 unidades) */
  readonly estoqueBaixoCount = computed(
    () =>
      this._items().filter(
        (m) => m.quantidadeAtual < 5 && m.quantidadeAtual > 0
      ).length
  );

  /** Contagem de medicamentos sem estoque */
  readonly semEstoqueCount = computed(
    () => this._items().filter((m) => m.quantidadeAtual === 0).length
  );

  /**
   * Lista filtrada de medicamentos.
   *
   * Usa as funções utilitárias puras para aplicar filtros e ordenação.
   */
  readonly filteredItems = computed(() => {
    const items = this._items();
    const filters = this._filters();

    return aplicarFiltros(items, filters);
  });

  /**
   * Indica se há filtros ativos.
   */
  readonly hasActiveFilters = computed(() => {
    return temFiltrosAtivos(this._filters());
  });

  /**
   * Lista de marcas únicas (para dropdown de filtro).
   */
  readonly marcasDisponiveis = computed(() => {
    return extrairMarcas(this._items());
  });

  /**
   * Lista de tipos únicos (para dropdown de filtro).
   */
  readonly tiposDisponiveis = computed(() => {
    return extrairTipos(this._items());
  });

  /** Indica se há erro */
  readonly hasError = computed(() => this._error() !== null);

  /** Indica se a lista está vazia */
  readonly isEmpty = computed(
    () => this._items().length === 0 && !this._loading()
  );

  // ========================================
  // MÉTODOS DE AÇÃO - CRUD
  // ========================================

  /**
   * Carrega todos os medicamentos.
   *
   * @param filters - Filtros opcionais para a API
   */
  async loadAll(filters?: MedicamentosFilter): Promise<void> {
    this._loading.set(true);
    this._error.set(null);

    try {
      const items = await firstValueFrom(this.api.getAll(filters));
      this._items.set(items);
    } catch (error) {
      this._handleError(error, "loadAll");
    } finally {
      this._loading.set(false);
    }
  }

  /**
   * Carrega um medicamento pelo ID.
   *
   * @param id - ID do medicamento
   * @returns Medicamento carregado ou null
   */
  async loadById(id: string): Promise<Medicamento | null> {
    this._loading.set(true);
    this._error.set(null);

    try {
      const medicamento = await firstValueFrom(this.api.getById(id));
      this._selected.set(medicamento);
      return medicamento;
    } catch (error) {
      this._handleError(error, "loadById");
      return null;
    } finally {
      this._loading.set(false);
    }
  }

  /**
   * Cria um novo medicamento.
   *
   * @param dto - Dados do medicamento
   * @returns Medicamento criado ou null
   */
  async create(dto: CreateMedicamentoDto): Promise<Medicamento | null> {
    this._loading.set(true);
    this._error.set(null);

    try {
      const medicamento = await firstValueFrom(this.api.create(dto));

      // Adiciona à lista local
      this._items.update((items) => [...items, medicamento]);

      return medicamento;
    } catch (error) {
      this._handleError(error, "create");
      return null;
    } finally {
      this._loading.set(false);
    }
  }

  /**
   * Atualiza um medicamento existente.
   *
   * @param id - ID do medicamento
   * @param dto - Dados a atualizar
   * @returns Medicamento atualizado ou null
   */
  async update(
    id: string,
    dto: UpdateMedicamentoDto
  ): Promise<Medicamento | null> {
    this._setItemLoading(id, true);
    this._error.set(null);

    try {
      const medicamento = await firstValueFrom(this.api.update(id, dto));

      // Atualiza na lista local
      this._updateItemInList(medicamento);

      // Atualiza selected se for o mesmo
      if (this._selected()?.id === id) {
        this._selected.set(medicamento);
      }

      return medicamento;
    } catch (error) {
      this._handleError(error, "update");
      return null;
    } finally {
      this._setItemLoading(id, false);
    }
  }

  /**
   * Exclui um medicamento.
   *
   * @param id - ID do medicamento
   * @returns true se excluído com sucesso
   */
  async delete(id: string): Promise<boolean> {
    this._setItemLoading(id, true);
    this._error.set(null);

    try {
      await firstValueFrom(this.api.delete(id));

      // Remove da lista local
      this._items.update((items) => items.filter((m) => m.id !== id));

      // Limpa selected se for o mesmo
      if (this._selected()?.id === id) {
        this._selected.set(null);
      }

      return true;
    } catch (error) {
      this._handleError(error, "delete");
      return false;
    } finally {
      this._setItemLoading(id, false);
    }
  }

  // ========================================
  // MÉTODOS DE AÇÃO - QUANTIDADE
  // ========================================

  /**
   * Atualiza a quantidade de um medicamento.
   *
   * Suporta atualização otimista para UX mais rápida.
   *
   * @param id - ID do medicamento
   * @param quantidade - Nova quantidade
   * @param options - Opções de atualização
   * @returns Resultado da operação
   */
  async updateQuantidade(
    id: string,
    quantidade: number,
    options: { optimistic?: boolean } = { optimistic: true }
  ): Promise<QuantidadeUpdateResult> {
    // Validação: não permitir quantidade negativa
    if (quantidade < 0) {
      const error: StoreError = {
        message: "Quantidade não pode ser negativa.",
        code: "VALIDATION_ERROR",
        action: "updateQuantidade",
      };
      this._error.set(error);
      return { success: false, error };
    }

    // Buscar medicamento atual para rollback
    const medicamentoAtual = this._items().find((m) => m.id === id);
    if (!medicamentoAtual) {
      const error: StoreError = {
        message: "Medicamento não encontrado.",
        code: "NOT_FOUND",
        action: "updateQuantidade",
      };
      this._error.set(error);
      return { success: false, error };
    }

    const quantidadeAnterior = medicamentoAtual.quantidadeAtual;

    // Atualização otimista: atualiza UI antes da confirmação da API
    if (options.optimistic) {
      this._updateQuantidadeLocal(id, quantidade);
    }

    this._setItemLoading(id, true);
    this._error.set(null);

    try {
      const medicamento = await firstValueFrom(
        this.api.updateQuantidade(id, quantidade)
      );

      // Atualiza com dados confirmados da API
      this._updateItemInList(medicamento);

      // Atualiza selected se for o mesmo
      if (this._selected()?.id === id) {
        this._selected.set(medicamento);
      }

      return {
        success: true,
        medicamento,
        quantidadeAnterior,
        quantidadeNova: quantidade,
      };
    } catch (error) {
      // Rollback em caso de erro
      if (options.optimistic) {
        this._updateQuantidadeLocal(id, quantidadeAnterior);
      }

      this._handleError(error, "updateQuantidade");

      return {
        success: false,
        error: this._error()!,
        quantidadeAnterior,
      };
    } finally {
      this._setItemLoading(id, false);
    }
  }

  /**
   * Incrementa a quantidade de um medicamento.
   *
   * @param id - ID do medicamento
   * @param quantidadeAtual - Quantidade atual
   * @param incremento - Valor a incrementar (padrão: 1)
   * @returns Resultado da operação
   */
  async incrementarQuantidade(
    id: string,
    quantidadeAtual: number,
    incremento: number = 1
  ): Promise<QuantidadeUpdateResult> {
    const novaQuantidade = quantidadeAtual + incremento;
    return this.updateQuantidade(id, novaQuantidade);
  }

  /**
   * Decrementa a quantidade de um medicamento.
   *
   * @param id - ID do medicamento
   * @param quantidadeAtual - Quantidade atual
   * @param decremento - Valor a decrementar (padrão: 1)
   * @returns Resultado da operação
   */
  async decrementarQuantidade(
    id: string,
    quantidadeAtual: number,
    decremento: number = 1
  ): Promise<QuantidadeUpdateResult> {
    const novaQuantidade = Math.max(0, quantidadeAtual - decremento);
    return this.updateQuantidade(id, novaQuantidade);
  }

  /**
   * Incrementa a quantidade de um medicamento de forma rápida.
   * Usa o medicamento da lista para obter a quantidade atual.
   *
   * @param id - ID do medicamento
   * @param incremento - Valor a incrementar (padrão: 1)
   * @returns Resultado da operação
   */
  async incrementarRapido(
    id: string,
    incremento: number = 1
  ): Promise<QuantidadeUpdateResult> {
    const medicamento = this._items().find((m) => m.id === id);
    if (!medicamento) {
      const error: StoreError = {
        message: "Medicamento não encontrado.",
        code: "NOT_FOUND",
        action: "incrementarRapido",
      };
      this._error.set(error);
      return { success: false, error };
    }
    return this.incrementarQuantidade(id, medicamento.quantidadeAtual, incremento);
  }

  /**
   * Decrementa a quantidade de um medicamento de forma rápida.
   * Usa o medicamento da lista para obter a quantidade atual.
   *
   * @param id - ID do medicamento
   * @param decremento - Valor a decrementar (padrão: 1)
   * @returns Resultado da operação
   */
  async decrementarRapido(
    id: string,
    decremento: number = 1
  ): Promise<QuantidadeUpdateResult> {
    const medicamento = this._items().find((m) => m.id === id);
    if (!medicamento) {
      const error: StoreError = {
        message: "Medicamento não encontrado.",
        code: "NOT_FOUND",
        action: "decrementarRapido",
      };
      this._error.set(error);
      return { success: false, error };
    }

    // Não permitir decrementar abaixo de zero
    if (medicamento.quantidadeAtual === 0) {
      return {
        success: true,
        medicamento,
        quantidadeAnterior: 0,
        quantidadeNova: 0,
      };
    }

    return this.decrementarQuantidade(id, medicamento.quantidadeAtual, decremento);
  }

  // ========================================
  // MÉTODOS DE AÇÃO - FILTROS
  // ========================================

  /**
   * Define os filtros ativos.
   *
   * @param filters - Novos filtros
   */
  setFilters(filters: MedicamentosStoreFilters): void {
    this._filters.set(filters);
  }

  /**
   * Atualiza parcialmente os filtros.
   *
   * @param filters - Filtros a atualizar
   */
  updateFilters(filters: Partial<MedicamentosStoreFilters>): void {
    this._filters.update((current) => ({ ...current, ...filters }));
  }

  /**
   * Limpa todos os filtros.
   */
  clearFilters(): void {
    this._filters.set({});
  }

  /**
   * Define o filtro de busca.
   *
   * @param busca - Texto de busca
   */
  setBusca(busca: string): void {
    this._filters.update((current) => ({ ...current, busca }));
  }

  /**
   * Define o filtro de status.
   *
   * @param status - Status de validade
   */
  setStatusFilter(status: StatusValidade | null): void {
    this._filters.update((current) => ({ ...current, status }));
  }

  /**
   * Define a ordenação.
   *
   * @param ordenarPor - Campo de ordenação
   * @param ordem - Direção (asc/desc)
   */
  setOrdenacao(
    ordenarPor: "nome" | "validade" | "quantidadeAtual" | "criadoEm" | "droga" | "atualizadoEm" | null,
    ordem: "asc" | "desc" = "asc"
  ): void {
    this._filters.update((current) => ({ ...current, ordenarPor, ordem }));
  }

  /**
   * Define o filtro de tipo.
   *
   * @param tipo - Tipo de medicamento
   */
  setTipoFilter(tipo: TipoMedicamento | string | null): void {
    this._filters.update((current) => ({ ...current, tipo }));
  }

  /**
   * Define o filtro de genérico.
   *
   * @param generico - true = genérico, false = referência, null = todos
   */
  setGenericoFilter(generico: boolean | null): void {
    this._filters.update((current) => ({ ...current, generico }));
  }

  /**
   * Define o filtro de marca.
   *
   * @param marca - Nome da marca
   */
  setMarcaFilter(marca: string | null): void {
    this._filters.update((current) => ({ ...current, marca }));
  }

  /**
   * Define o filtro de quantidade baixa.
   *
   * @param ativo - Se deve filtrar por quantidade baixa
   * @param limite - Limite para considerar quantidade baixa (padrão: 5)
   */
  setQuantidadeBaixaFilter(ativo: boolean, limite: number = 5): void {
    this._filters.update((current) => ({
      ...current,
      quantidadeBaixa: ativo,
      limiteQuantidadeBaixa: limite,
    }));
  }

  /**
   * Alterna a direção da ordenação.
   */
  toggleOrdemFilter(): void {
    this._filters.update((current) => ({
      ...current,
      ordem: current.ordem === "asc" ? "desc" : "asc",
    }));
  }

  // ========================================
  // MÉTODOS DE AÇÃO - FOTO
  // ========================================

  /**
   * Faz upload de foto para um medicamento.
   *
   * @param id - ID do medicamento
   * @param file - Arquivo de imagem
   * @returns Medicamento atualizado ou null
   */
  async uploadFoto(id: string, file: File): Promise<Medicamento | null> {
    this._setItemLoading(id, true);
    this._error.set(null);

    try {
      const medicamento = await firstValueFrom(this.api.uploadFoto(id, file));

      // Atualiza na lista local
      this._updateItemInList(medicamento);

      // Atualiza selected se for o mesmo
      if (this._selected()?.id === id) {
        this._selected.set(medicamento);
      }

      return medicamento;
    } catch (error) {
      this._handleError(error, "uploadFoto");
      return null;
    } finally {
      this._setItemLoading(id, false);
    }
  }

  /**
   * Remove a foto de um medicamento.
   *
   * @param id - ID do medicamento
   * @returns Medicamento atualizado ou null
   */
  async removeFoto(id: string): Promise<Medicamento | null> {
    this._setItemLoading(id, true);
    this._error.set(null);

    try {
      const medicamento = await firstValueFrom(this.api.removeFoto(id));

      // Atualiza na lista local
      this._updateItemInList(medicamento);

      // Atualiza selected se for o mesmo
      if (this._selected()?.id === id) {
        this._selected.set(medicamento);
      }

      return medicamento;
    } catch (error) {
      this._handleError(error, "removeFoto");
      return null;
    } finally {
      this._setItemLoading(id, false);
    }
  }

  // ========================================
  // MÉTODOS DE AÇÃO - SELEÇÃO
  // ========================================

  /**
   * Define o medicamento selecionado.
   *
   * @param medicamento - Medicamento a selecionar
   */
  setSelected(medicamento: Medicamento | null): void {
    this._selected.set(medicamento);
  }

  /**
   * Limpa a seleção.
   */
  clearSelected(): void {
    this._selected.set(null);
  }

  // ========================================
  // MÉTODOS DE AÇÃO - ERRO
  // ========================================

  /**
   * Limpa o erro atual.
   */
  clearError(): void {
    this._error.set(null);
  }

  // ========================================
  // MÉTODOS AUXILIARES - LOADING POR ITEM
  // ========================================

  /**
   * Verifica se um item específico está em loading.
   *
   * @param id - ID do medicamento
   * @returns true se está em loading
   */
  isItemLoading(id: string): boolean {
    return this._itemLoading().has(id);
  }

  /**
   * Computed para verificar loading de um item específico.
   *
   * @param id - ID do medicamento
   * @returns Signal com estado de loading
   */
  getItemLoadingSignal(id: string) {
    return computed(() => this._itemLoading().has(id));
  }

  // ========================================
  // MÉTODOS PRIVADOS
  // ========================================

  /**
   * Define o estado de loading para um item específico.
   */
  private _setItemLoading(id: string, loading: boolean): void {
    this._itemLoading.update((set) => {
      const newSet = new Set(set);
      if (loading) {
        newSet.add(id);
      } else {
        newSet.delete(id);
      }
      return newSet;
    });
  }

  /**
   * Atualiza um item na lista local.
   */
  private _updateItemInList(medicamento: Medicamento): void {
    this._items.update((items) =>
      items.map((m) => (m.id === medicamento.id ? medicamento : m))
    );
  }

  /**
   * Atualiza apenas a quantidade de um item na lista local.
   * Usado para atualização otimista.
   */
  private _updateQuantidadeLocal(id: string, quantidade: number): void {
    this._items.update((items) =>
      items.map((m) =>
        m.id === id
          ? {
              ...m,
              quantidadeAtual: quantidade,
              atualizadoEm: new Date().toISOString(),
            }
          : m
      )
    );

    // Atualiza selected se for o mesmo
    if (this._selected()?.id === id) {
      this._selected.update((med) =>
        med
          ? {
              ...med,
              quantidadeAtual: quantidade,
              atualizadoEm: new Date().toISOString(),
            }
          : null
      );
    }
  }

  /**
   * Trata erros e define o estado de erro.
   */
  private _handleError(error: unknown, action: string): void {
    const apiError = error as ApiError;

    this._error.set({
      message: apiError?.message || "Erro desconhecido. Tente novamente.",
      code: apiError?.code,
      action,
    });

    console.error(`[MedicamentosStore] Erro em ${action}:`, error);
  }
}
