import { Injectable, inject, signal, computed } from "@angular/core";
import { firstValueFrom } from "rxjs";
import {
  MedicamentosApiService,
  MedicamentosFilter,
} from "./medicamentos-api.service";
import {
  Medicamento,
  CreateMedicamentoDto,
  UpdateMedicamentoDto,
  StatusValidade,
} from "../models";
import { ApiError } from "../../../core/api/api.service";

/**
 * Interface para o estado de erro.
 */
export interface StoreError {
  message: string;
  code?: string;
  action?: string;
}

/**
 * Interface para os filtros do store.
 */
export interface MedicamentosStoreFilters {
  status?: StatusValidade | null;
  busca?: string;
  ordenarPor?: "nome" | "validade" | "quantidadeAtual" | "criadoEm";
  ordem?: "asc" | "desc";
}

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

  /** Lista filtrada de medicamentos */
  readonly filteredItems = computed(() => {
    const items = this._items();
    const filters = this._filters();

    let result = [...items];

    // Filtro por status
    if (filters.status) {
      result = result.filter((m) => m.statusValidade === filters.status);
    }

    // Filtro por busca (nome ou droga)
    if (filters.busca && filters.busca.trim()) {
      const busca = filters.busca.toLowerCase().trim();
      result = result.filter(
        (m) =>
          m.nome.toLowerCase().includes(busca) ||
          m.droga.toLowerCase().includes(busca) ||
          m.marca.toLowerCase().includes(busca)
      );
    }

    // Ordenação
    if (filters.ordenarPor) {
      const ordem = filters.ordem === "desc" ? -1 : 1;

      result.sort((a, b) => {
        switch (filters.ordenarPor) {
          case "nome":
            return a.nome.localeCompare(b.nome) * ordem;
          case "validade":
            return (
              (new Date(a.validade).getTime() -
                new Date(b.validade).getTime()) *
              ordem
            );
          case "quantidadeAtual":
            return (a.quantidadeAtual - b.quantidadeAtual) * ordem;
          case "criadoEm":
            return (
              (new Date(a.criadoEm).getTime() -
                new Date(b.criadoEm).getTime()) *
              ordem
            );
          default:
            return 0;
        }
      });
    }

    return result;
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
   * @param id - ID do medicamento
   * @param quantidade - Nova quantidade
   * @returns Medicamento atualizado ou null
   */
  async updateQuantidade(
    id: string,
    quantidade: number
  ): Promise<Medicamento | null> {
    // Validação: não permitir quantidade negativa
    if (quantidade < 0) {
      this._error.set({
        message: "Quantidade não pode ser negativa.",
        code: "VALIDATION_ERROR",
        action: "updateQuantidade",
      });
      return null;
    }

    this._setItemLoading(id, true);
    this._error.set(null);

    try {
      const medicamento = await firstValueFrom(
        this.api.updateQuantidade(id, quantidade)
      );

      // Atualiza na lista local
      this._updateItemInList(medicamento);

      // Atualiza selected se for o mesmo
      if (this._selected()?.id === id) {
        this._selected.set(medicamento);
      }

      return medicamento;
    } catch (error) {
      this._handleError(error, "updateQuantidade");
      return null;
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
   * @returns Medicamento atualizado ou null
   */
  async incrementarQuantidade(
    id: string,
    quantidadeAtual: number,
    incremento: number = 1
  ): Promise<Medicamento | null> {
    const novaQuantidade = quantidadeAtual + incremento;
    return this.updateQuantidade(id, novaQuantidade);
  }

  /**
   * Decrementa a quantidade de um medicamento.
   *
   * @param id - ID do medicamento
   * @param quantidadeAtual - Quantidade atual
   * @param decremento - Valor a decrementar (padrão: 1)
   * @returns Medicamento atualizado ou null
   */
  async decrementarQuantidade(
    id: string,
    quantidadeAtual: number,
    decremento: number = 1
  ): Promise<Medicamento | null> {
    const novaQuantidade = Math.max(0, quantidadeAtual - decremento);
    return this.updateQuantidade(id, novaQuantidade);
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
    ordenarPor: "nome" | "validade" | "quantidadeAtual" | "criadoEm",
    ordem: "asc" | "desc" = "asc"
  ): void {
    this._filters.update((current) => ({ ...current, ordenarPor, ordem }));
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

