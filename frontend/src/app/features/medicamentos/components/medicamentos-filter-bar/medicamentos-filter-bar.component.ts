import { Component, EventEmitter, Input, Output } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { ButtonComponent } from "../../../../shared/ui/button/button.component";
import {
  MedicamentosFiltros,
  ORDENACAO_OPCOES,
  StatusValidade,
  TipoMedicamento,
} from "../../models";

/**
 * Barra de filtros e busca para medicamentos.
 *
 * Permite:
 * - Busca por nome, droga, marca ou laboratório
 * - Filtro por status de validade
 * - Filtro por tipo de medicamento
 * - Filtro por genérico/referência
 * - Filtro por laboratório
 * - Filtro por quantidade baixa
 * - Ordenação por diferentes campos
 *
 * @example
 * <app-medicamentos-filter-bar
 *   [filters]="currentFilters"
 *   [totalItems]="totalCount"
 *   [filteredCount]="filteredCount"
 *   [laboratorios]="laboratoriosDisponiveis"
 *   [tipos]="tiposDisponiveis"
 *   (filtersChange)="onFiltersChange($event)"
 *   (limparFiltros)="onLimparFiltros()"
 * />
 */
@Component({
  selector: "app-medicamentos-filter-bar",
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonComponent],
  template: `
    <div class="filter-bar">
      <!-- Busca -->
      <div class="search-section">
        <div class="search-box">
          <span class="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Buscar por nome, droga, marca..."
            [ngModel]="filters.busca || ''"
            (ngModelChange)="onBuscaChange($event)"
            class="search-input"
          />
          <button
            *ngIf="filters.busca"
            type="button"
            class="clear-search"
            (click)="onBuscaChange('')"
          >
            ✕
          </button>
        </div>
      </div>

      <!-- Filtros de status -->
      <div class="filter-section">
        <span class="filter-label">Status:</span>
        <div class="filter-buttons">
          <app-button
            variant="ghost"
            size="sm"
            [class.active]="!filters.status"
            (click)="onStatusChange(null)"
          >
            Todos
          </app-button>
          <app-button
            variant="ghost"
            size="sm"
            [class.active]="filters.status === 'valido'"
            (click)="onStatusChange('valido')"
          >
            <span class="status-dot valido"></span>
            Válidos
          </app-button>
          <app-button
            variant="ghost"
            size="sm"
            [class.active]="filters.status === 'prestes'"
            (click)="onStatusChange('prestes')"
          >
            <span class="status-dot prestes"></span>
            Prestes
          </app-button>
          <app-button
            variant="ghost"
            size="sm"
            [class.active]="filters.status === 'vencido'"
            (click)="onStatusChange('vencido')"
          >
            <span class="status-dot vencido"></span>
            Vencidos
          </app-button>
        </div>
      </div>

      <!-- Filtros avançados (expansível) -->
      <div class="advanced-filters" [class.expanded]="showAdvanced">
        <button
          type="button"
          class="toggle-advanced"
          (click)="showAdvanced = !showAdvanced"
        >
          {{ showAdvanced ? "▲ Menos filtros" : "▼ Mais filtros" }}
        </button>

        <div *ngIf="showAdvanced" class="advanced-content">
          <!-- Tipo -->
          <div class="filter-group">
            <label class="filter-label">Tipo:</label>
            <select
              class="filter-select"
              [ngModel]="filters.tipo || ''"
              (ngModelChange)="onTipoChange($event)"
            >
              <option value="">Todos</option>
              <option *ngFor="let tipo of tiposMedicamento" [value]="tipo">
                {{ formatarTipo(tipo) }}
              </option>
            </select>
          </div>

          <!-- Genérico -->
          <div class="filter-group">
            <label class="filter-label">Genérico:</label>
            <div class="filter-buttons">
              <app-button
                variant="ghost"
                size="sm"
                [class.active]="filters.generico === null || filters.generico === undefined"
                (click)="onGenericoChange(null)"
              >
                Todos
              </app-button>
              <app-button
                variant="ghost"
                size="sm"
                [class.active]="filters.generico === true"
                (click)="onGenericoChange(true)"
              >
                Genérico
              </app-button>
              <app-button
                variant="ghost"
                size="sm"
                [class.active]="filters.generico === false"
                (click)="onGenericoChange(false)"
              >
                Referência
              </app-button>
            </div>
          </div>

          <!-- Laboratório -->
          <div *ngIf="laboratorios.length > 0" class="filter-group">
            <label class="filter-label">Laboratório:</label>
            <select
              class="filter-select"
              [ngModel]="filters.laboratorio || ''"
              (ngModelChange)="onLaboratorioChange($event)"
            >
              <option value="">Todos</option>
              <option *ngFor="let lab of laboratorios" [value]="lab">
                {{ lab }}
              </option>
            </select>
          </div>

          <!-- Quantidade baixa -->
          <div class="filter-group">
            <label class="checkbox-wrapper">
              <input
                type="checkbox"
                [ngModel]="filters.quantidadeBaixa"
                (ngModelChange)="onQuantidadeBaixaChange($event)"
              />
              <span class="checkbox-label">Apenas estoque baixo (&lt; 5 un)</span>
            </label>
          </div>
        </div>
      </div>

      <!-- Ordenação -->
      <div class="sort-section">
        <label class="filter-label">Ordenar por:</label>
        <select
          class="filter-select"
          [ngModel]="filters.ordenarPor || ''"
          (ngModelChange)="onOrdenarPorChange($event)"
        >
          <option value="">Padrão</option>
          <option *ngFor="let opcao of ordenacaoOpcoes" [value]="opcao.valor">
            {{ opcao.label }}
          </option>
        </select>
        <app-button
          *ngIf="filters.ordenarPor"
          variant="ghost"
          size="sm"
          (click)="toggleOrdem()"
          class="sort-order-btn"
          [title]="filters.ordem === 'asc' ? 'Crescente' : 'Decrescente'"
        >
          {{ filters.ordem === "asc" ? "↑" : "↓" }}
        </app-button>
      </div>

      <!-- Contagem e limpar -->
      <div class="filter-actions">
        <span class="filter-count">
          {{ filteredCount }} de {{ totalItems }} medicamentos
        </span>
        <app-button
          *ngIf="hasActiveFilters"
          variant="ghost"
          size="sm"
          (click)="onLimparFiltros()"
        >
          Limpar filtros
        </app-button>
      </div>
    </div>
  `,
  styles: [
    `
      .filter-bar {
        display: flex;
        flex-direction: column;
        gap: var(--spacing-md);
        padding: var(--spacing-md);
        background: var(--color-surface);
        border-radius: var(--border-radius-lg);
        border: 1px solid var(--color-border);
      }

      /* Busca */
      .search-section {
        width: 100%;
      }

      .search-box {
        position: relative;
        display: flex;
        align-items: center;
      }

      .search-icon {
        position: absolute;
        left: var(--spacing-md);
        font-size: var(--font-size-base);
        opacity: 0.5;
      }

      .search-input {
        width: 100%;
        padding: var(--spacing-sm) var(--spacing-md);
        padding-left: calc(var(--spacing-md) * 2 + 1em);
        padding-right: calc(var(--spacing-md) * 2);
        font-family: inherit;
        font-size: var(--font-size-base);
        color: var(--color-text-primary);
        background-color: var(--color-background);
        border: 1px solid var(--color-border);
        border-radius: var(--border-radius-md);
        transition: all var(--transition-fast);

        &::placeholder {
          color: var(--color-text-hint);
        }

        &:focus {
          outline: none;
          border-color: var(--color-primary);
          box-shadow: 0 0 0 3px rgba(25, 118, 210, 0.1);
        }
      }

      .clear-search {
        position: absolute;
        right: var(--spacing-md);
        background: none;
        border: none;
        color: var(--color-text-hint);
        cursor: pointer;
        padding: 4px;
        font-size: var(--font-size-sm);
        line-height: 1;

        &:hover {
          color: var(--color-text-secondary);
        }
      }

      /* Filtros */
      .filter-section,
      .filter-group {
        display: flex;
        align-items: center;
        gap: var(--spacing-sm);
        flex-wrap: wrap;
      }

      .filter-label {
        font-size: var(--font-size-sm);
        color: var(--color-text-secondary);
        white-space: nowrap;
        min-width: 80px;
      }

      .filter-buttons {
        display: flex;
        gap: var(--spacing-xs);
        flex-wrap: wrap;
      }

      .filter-buttons app-button.active ::ng-deep button {
        background-color: var(--color-primary);
        color: white;
      }

      .filter-select {
        padding: var(--spacing-xs) var(--spacing-sm);
        font-family: inherit;
        font-size: var(--font-size-sm);
        color: var(--color-text-primary);
        background-color: var(--color-background);
        border: 1px solid var(--color-border);
        border-radius: var(--border-radius-md);
        cursor: pointer;
        min-width: 120px;

        &:focus {
          outline: none;
          border-color: var(--color-primary);
        }
      }

      .status-dot {
        display: inline-block;
        width: 8px;
        height: 8px;
        border-radius: 50%;
        margin-right: var(--spacing-xs);
      }

      .status-dot.valido {
        background-color: var(--color-valido);
      }

      .status-dot.prestes {
        background-color: var(--color-prestes);
      }

      .status-dot.vencido {
        background-color: var(--color-vencido);
      }

      /* Filtros avançados */
      .advanced-filters {
        border-top: 1px solid var(--color-border-light);
        padding-top: var(--spacing-sm);
      }

      .toggle-advanced {
        background: none;
        border: none;
        color: var(--color-primary);
        font-size: var(--font-size-sm);
        cursor: pointer;
        padding: var(--spacing-xs) 0;

        &:hover {
          text-decoration: underline;
        }
      }

      .advanced-content {
        display: flex;
        flex-direction: column;
        gap: var(--spacing-md);
        padding-top: var(--spacing-md);
      }

      .checkbox-wrapper {
        display: flex;
        align-items: center;
        gap: var(--spacing-sm);
        cursor: pointer;
      }

      .checkbox-wrapper input[type="checkbox"] {
        width: 16px;
        height: 16px;
        cursor: pointer;
      }

      .checkbox-label {
        font-size: var(--font-size-sm);
        color: var(--color-text-secondary);
      }

      /* Ordenação */
      .sort-section {
        display: flex;
        align-items: center;
        gap: var(--spacing-sm);
        padding-top: var(--spacing-sm);
        border-top: 1px solid var(--color-border-light);
      }

      .sort-order-btn {
        min-width: 32px;
      }

      /* Ações */
      .filter-actions {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-top: var(--spacing-sm);
        border-top: 1px solid var(--color-border-light);
      }

      .filter-count {
        font-size: var(--font-size-sm);
        color: var(--color-text-secondary);
      }

      /* Responsividade */
      @media (max-width: 639px) {
        .filter-section,
        .filter-group {
          flex-direction: column;
          align-items: flex-start;
        }

        .filter-label {
          min-width: auto;
        }

        .sort-section {
          flex-wrap: wrap;
        }

        .filter-actions {
          flex-direction: column;
          gap: var(--spacing-sm);
          align-items: flex-start;
        }
      }
    `,
  ],
})
export class MedicamentosFilterBarComponent {
  /** Estado atual dos filtros */
  @Input() filters: MedicamentosFiltros = {};

  /** Total de itens (sem filtros) */
  @Input() totalItems: number = 0;

  /** Contagem de itens filtrados */
  @Input() filteredCount: number = 0;

  /** Lista de laboratórios disponíveis (para dropdown) */
  @Input() laboratorios: string[] = [];

  /** Lista de tipos disponíveis (para dropdown) */
  @Input() tipos: string[] = [];

  /** Evento emitido quando os filtros mudam */
  @Output() filtersChange = new EventEmitter<Partial<MedicamentosFiltros>>();

  /** Evento emitido ao limpar filtros */
  @Output() limparFiltros = new EventEmitter<void>();

  /** Se os filtros avançados estão visíveis */
  showAdvanced: boolean = false;

  /** Opções de ordenação */
  readonly ordenacaoOpcoes = ORDENACAO_OPCOES;

  /** Tipos de medicamento disponíveis */
  readonly tiposMedicamento: TipoMedicamento[] = [
    "comprimido",
    "capsula",
    "liquido",
    "spray",
    "creme",
    "pomada",
    "gel",
    "gotas",
    "injetavel",
    "outro",
  ];

  /**
   * Verifica se há filtros ativos.
   */
  get hasActiveFilters(): boolean {
    return !!(
      this.filters.busca ||
      this.filters.status ||
      this.filters.tipo ||
      this.filters.generico !== null && this.filters.generico !== undefined ||
      this.filters.laboratorio ||
      this.filters.quantidadeBaixa ||
      this.filters.ordenarPor
    );
  }

  onBuscaChange(busca: string): void {
    this.filtersChange.emit({ busca: busca || undefined });
  }

  onStatusChange(status: StatusValidade | null): void {
    this.filtersChange.emit({ status });
  }

  onTipoChange(tipo: string): void {
    this.filtersChange.emit({ tipo: tipo || null });
  }

  onGenericoChange(generico: boolean | null): void {
    this.filtersChange.emit({ generico });
  }

  onLaboratorioChange(laboratorio: string): void {
    this.filtersChange.emit({ laboratorio: laboratorio || null });
  }

  onQuantidadeBaixaChange(quantidadeBaixa: boolean): void {
    this.filtersChange.emit({ quantidadeBaixa });
  }

  onOrdenarPorChange(ordenarPor: string): void {
    this.filtersChange.emit({
      ordenarPor: (ordenarPor || null) as MedicamentosFiltros["ordenarPor"],
    });
  }

  toggleOrdem(): void {
    const novaOrdem = this.filters.ordem === "asc" ? "desc" : "asc";
    this.filtersChange.emit({ ordem: novaOrdem });
  }

  onLimparFiltros(): void {
    this.limparFiltros.emit();
  }

  /**
   * Formata o tipo de medicamento para exibição.
   */
  formatarTipo(tipo: string): string {
    const formatMap: Record<string, string> = {
      comprimido: "Comprimido",
      capsula: "Cápsula",
      liquido: "Líquido",
      spray: "Spray",
      creme: "Creme",
      pomada: "Pomada",
      gel: "Gel",
      gotas: "Gotas",
      injetavel: "Injetável",
      outro: "Outro",
    };
    return formatMap[tipo] || tipo;
  }
}
