import { Component, EventEmitter, Input, Output } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { ButtonComponent } from "../../../../shared/ui/button/button.component";
import { StatusValidade } from "../../models";

/**
 * Interface para os filtros de medicamentos.
 */
export interface MedicamentosFilterState {
  busca: string;
  status: StatusValidade | null;
  ordenarPor: "nome" | "validade" | "quantidadeAtual" | "criadoEm" | null;
  ordem: "asc" | "desc";
}

/**
 * Barra de filtros e busca para medicamentos.
 *
 * Permite:
 * - Busca por nome ou droga
 * - Filtro por status de validade
 * - Ordenação por diferentes campos
 *
 * @example
 * <app-medicamentos-filter-bar
 *   [filters]="currentFilters"
 *   [totalItems]="totalCount"
 *   [filteredCount]="filteredCount"
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
            placeholder="Buscar por nome ou droga..."
            [ngModel]="filters.busca"
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
      <div class="status-filters">
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

      <!-- Ordenação -->
      <div class="sort-section">
        <label class="sort-label">Ordenar por:</label>
        <select
          class="sort-select"
          [ngModel]="filters.ordenarPor || ''"
          (ngModelChange)="onOrdenarPorChange($event)"
        >
          <option value="">Padrão</option>
          <option value="nome">Nome</option>
          <option value="validade">Validade</option>
          <option value="quantidadeAtual">Quantidade</option>
          <option value="criadoEm">Data de cadastro</option>
        </select>
        <app-button
          *ngIf="filters.ordenarPor"
          variant="ghost"
          size="sm"
          (click)="toggleOrdem()"
          class="sort-order-btn"
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

      /* Filtros de status */
      .status-filters {
        display: flex;
        gap: var(--spacing-sm);
        flex-wrap: wrap;
      }

      .status-filters app-button.active ::ng-deep button {
        background-color: var(--color-primary);
        color: white;
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

      /* Ordenação */
      .sort-section {
        display: flex;
        align-items: center;
        gap: var(--spacing-sm);
      }

      .sort-label {
        font-size: var(--font-size-sm);
        color: var(--color-text-secondary);
        white-space: nowrap;
      }

      .sort-select {
        padding: var(--spacing-xs) var(--spacing-sm);
        font-family: inherit;
        font-size: var(--font-size-sm);
        color: var(--color-text-primary);
        background-color: var(--color-background);
        border: 1px solid var(--color-border);
        border-radius: var(--border-radius-md);
        cursor: pointer;

        &:focus {
          outline: none;
          border-color: var(--color-primary);
        }
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
  @Input() filters: MedicamentosFilterState = {
    busca: "",
    status: null,
    ordenarPor: null,
    ordem: "asc",
  };

  /** Total de itens */
  @Input() totalItems: number = 0;

  /** Contagem de itens filtrados */
  @Input() filteredCount: number = 0;

  /** Evento emitido quando os filtros mudam */
  @Output() filtersChange = new EventEmitter<Partial<MedicamentosFilterState>>();

  /** Evento emitido ao limpar filtros */
  @Output() limparFiltros = new EventEmitter<void>();

  /**
   * Verifica se há filtros ativos.
   */
  get hasActiveFilters(): boolean {
    return !!(
      this.filters.busca ||
      this.filters.status ||
      this.filters.ordenarPor
    );
  }

  onBuscaChange(busca: string): void {
    this.filtersChange.emit({ busca });
  }

  onStatusChange(status: StatusValidade | null): void {
    this.filtersChange.emit({ status });
  }

  onOrdenarPorChange(ordenarPor: string): void {
    const valor = ordenarPor || null;
    this.filtersChange.emit({
      ordenarPor: valor as MedicamentosFilterState["ordenarPor"],
    });
  }

  toggleOrdem(): void {
    const novaOrdem = this.filters.ordem === "asc" ? "desc" : "asc";
    this.filtersChange.emit({ ordem: novaOrdem });
  }

  onLimparFiltros(): void {
    this.limparFiltros.emit();
  }
}

