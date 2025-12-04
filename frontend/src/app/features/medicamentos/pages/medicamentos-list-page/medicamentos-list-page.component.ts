import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { NotificationService } from '../../../../core/services/notification.service';
import { BadgeComponent } from '../../../../shared/ui/badge/badge.component';
import { ButtonComponent } from '../../../../shared/ui/button/button.component';
import { CardComponent } from '../../../../shared/ui/card/card.component';
import { EmptyStateComponent } from '../../../../shared/ui/empty-state/empty-state.component';
import { ErrorAlertComponent } from '../../../../shared/ui/error-alert/error-alert.component';
import { IconComponent } from '../../../../shared/ui/icon/icon.component';
import { InputComponent } from '../../../../shared/ui/input/input.component';
import { LoadingComponent } from '../../../../shared/ui/loading/loading.component';
import { PageLoadingComponent } from '../../../../shared/ui/page-loading/page-loading.component';
import { StatusBadgeComponent } from '../../../../shared/ui/status-badge/status-badge.component';
import { QuantidadeControlComponent } from '../../components/quantidade-control/quantidade-control.component';
import { Medicamento, StatusValidade } from '../../models';
import { MedicamentosStore } from '../../services/medicamentos.store';

/**
 * Página de listagem de medicamentos.
 */
@Component({
  selector: 'app-medicamentos-list-page',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ButtonComponent,
    CardComponent,
    StatusBadgeComponent,
    BadgeComponent,
    LoadingComponent,
    PageLoadingComponent,
    EmptyStateComponent,
    ErrorAlertComponent,
    QuantidadeControlComponent,
    IconComponent,
    InputComponent,
  ],
  template: `
    <div class="medicamentos-page">
      <!-- Header da página -->
      <div class="page-header">
        <div class="header-content">
          <h1>
            <app-icon name="pill" [size]="32" class="header-icon" />
            Meus Medicamentos
          </h1>
          <p class="subtitle">
            Gerencie o estoque de medicamentos da sua família
          </p>
        </div>
        <app-button variant="primary" routerLink="/medicamentos/novo" icon="plus">
          Novo Medicamento
        </app-button>
      </div>

      <!-- Estatísticas -->
      <div class="stats-bar">
        <div class="stat-item">
          <app-icon name="package" [size]="20" class="stat-icon" />
          <span class="stat-value">{{ store.totalItems() }}</span>
          <span class="stat-label">Total</span>
        </div>
        <div class="stat-item stat-valido">
          <app-icon name="check-circle" [size]="20" class="stat-icon" />
          <span class="stat-value">{{ store.validosCount() }}</span>
          <span class="stat-label">Válidos</span>
        </div>
        <div class="stat-item stat-vencendo">
          <app-icon name="alert-circle" [size]="20" class="stat-icon" />
          <span class="stat-value">{{ store.prestesCount() }}</span>
          <span class="stat-label">Vencendo</span>
        </div>
        <div class="stat-item stat-vencido">
          <app-icon name="x-circle" [size]="20" class="stat-icon" />
          <span class="stat-value">{{ store.vencidosCount() }}</span>
          <span class="stat-label">Vencidos</span>
        </div>
        <div class="stat-item stat-sem-estoque">
          <app-icon name="package" [size]="20" class="stat-icon" />
          <span class="stat-value">{{ store.semEstoqueCount() }}</span>
          <span class="stat-label">Sem Estoque</span>
        </div>
      </div>

      <!-- Barra de busca e filtros -->
      <div class="search-filter-bar">
        <div class="search-box">
          <app-icon name="search" [size]="18" class="search-icon" />
          <input
            type="text"
            placeholder="Buscar por nome ou droga..."
            [value]="store.filters().busca || ''"
            (input)="onBusca($event)"
            class="search-input"
          />
        </div>

        <div class="filters-bar">
          <button
            type="button"
            class="filter-chip"
            [class.active]="!store.filters().status && !filtroSemEstoque()"
            (click)="limparFiltrosStatus()"
          >
            Todos
          </button>
          <button
            type="button"
            class="filter-chip filter-valido"
            [class.active]="store.filters().status === 'valido'"
            (click)="filtrarPorStatus('valido')"
          >
            <app-icon name="check" [size]="14" />
            Válidos
          </button>
          <button
            type="button"
            class="filter-chip filter-vencendo"
            [class.active]="store.filters().status === 'prestes'"
            (click)="filtrarPorStatus('prestes')"
          >
            <app-icon name="clock" [size]="14" />
            Vencendo
          </button>
          <button
            type="button"
            class="filter-chip filter-vencido"
            [class.active]="store.filters().status === 'vencido'"
            (click)="filtrarPorStatus('vencido')"
          >
            <app-icon name="x" [size]="14" />
            Vencidos
          </button>
          <button
            type="button"
            class="filter-chip filter-sem-estoque"
            [class.active]="filtroSemEstoque()"
            (click)="toggleFiltroSemEstoque()"
          >
            <app-icon name="package" [size]="14" />
            Sem Estoque
          </button>
        </div>
      </div>

      <!-- Erro -->
      <app-error-alert
        [message]="store.error()?.message"
        [showRetry]="true"
        (retry)="store.loadAll()"
        (dismiss)="store.clearError()"
      />

      <!-- Loading -->
      <app-page-loading
        [show]="store.loading() && store.items().length === 0"
        text="Carregando medicamentos..."
      />

      <!-- Lista de medicamentos -->
      @if (!store.loading()) {
        <div class="medicamentos-grid">
          @for (med of getFilteredItems(); track med.id) {
            <app-card
              variant="elevated"
              [clickable]="true"
              class="medicamento-card"
              (click)="verDetalhes(med)"
            >
              <div class="card-content">
                <div class="card-header-row">
                  <div class="med-title-group">
                    <h3 class="med-nome">{{ med.nome }}</h3>
                    <p class="med-droga">{{ med.droga }}</p>
                  </div>
                  <div class="badges-container">
                    <app-status-badge [status]="med.statusValidade" />
                    @if (med.quantidadeAtual === 0) {
                      <app-badge variant="danger" [dot]="true">Sem estoque</app-badge>
                    }
                  </div>
                </div>

                @if (med.generico) {
                  <span class="med-generico-badge">
                    <app-icon name="badge-check" [size]="12" />
                    Genérico
                  </span>
                }

                <div class="med-info">
                  <div class="info-item">
                    <app-icon name="box" [size]="16" class="info-icon" />
                    <div>
                      <span class="info-label">Tipo</span>
                      <span class="info-value">
                        {{ formatarTipo(med.tipo) }}
                        @if (med.dosagem) {
                          <span class="dosagem-separator">·</span> {{ med.dosagem }}
                        }
                      </span>
                    </div>
                  </div>
                  <div class="info-item">
                    <app-icon name="hash" [size]="16" class="info-icon" />
                    <div>
                      <span class="info-label">Quantidade</span>
                      <span
                        class="info-value"
                        [class.low-stock]="med.quantidadeAtual < 5 && med.quantidadeAtual > 0"
                        [class.no-stock]="med.quantidadeAtual === 0"
                      >
                        {{ med.quantidadeAtual }} / {{ med.quantidadeTotal }}
                      </span>
                    </div>
                  </div>
                  <div class="info-item">
                    <app-icon name="calendar" [size]="16" class="info-icon" />
                    <div>
                      <span class="info-label">Validade</span>
                      <span class="info-value">{{ formatarData(med.validade) }}</span>
                    </div>
                  </div>
                </div>

                <div class="card-actions" (click)="$event.stopPropagation()">
                  <app-button
                    variant="ghost"
                    size="sm"
                    (clicked)="editarMedicamento(med)"
                    icon="edit-2"
                  >
                    Editar
                  </app-button>
                  <app-quantidade-control
                    [quantidade]="med.quantidadeAtual"
                    [quantidadeTotal]="med.quantidadeTotal"
                    [loading]="store.isItemLoading(med.id)"
                    [min]="0"
                    size="sm"
                    [showTotal]="false"
                    (incrementar)="incrementarRapido(med.id)"
                    (decrementar)="decrementarRapido(med.id)"
                  />
                </div>
              </div>
            </app-card>
          }
        </div>
      }

      <!-- Estado vazio - Busca sem resultados -->
      @if (!store.loading() && getFilteredItems().length === 0 && (store.hasActiveFilters() || filtroSemEstoque())) {
        <app-empty-state
          variant="search"
          iconName="search-x"
          title="Nenhum medicamento encontrado"
          description="Tente alterar os termos de busca ou remover alguns filtros."
          actionLabel="Limpar Filtros"
          actionIcon="x"
          (action)="limparFiltros()"
        />
      }

      <!-- Estado vazio - Sem medicamentos -->
      @if (!store.loading() && store.items().length === 0 && !store.hasActiveFilters() && !filtroSemEstoque()) {
        <app-empty-state
          iconName="pill"
          title="Nenhum medicamento cadastrado"
          description="Comece adicionando seu primeiro medicamento ao estoque familiar."
          actionLabel="Adicionar Medicamento"
          actionIcon="plus"
          (action)="navegarParaNovo()"
        />
      }
    </div>
  `,
  styles: [
    `
      .medicamentos-page {
        padding: var(--spacing-md) 0;
      }

      /* Header */
      .page-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: var(--spacing-xl);
        flex-wrap: wrap;
        gap: var(--spacing-md);
      }

      .header-content h1 {
        display: flex;
        align-items: center;
        gap: var(--spacing-sm);
        color: var(--color-text-primary);
        margin-bottom: var(--spacing-xs);
        font-size: var(--font-size-2xl);
      }

      .header-icon {
        color: var(--color-primary);
      }

      .subtitle {
        color: var(--color-text-secondary);
        margin: 0;
      }

      /* Estatísticas */
      .stats-bar {
        display: grid;
        grid-template-columns: repeat(5, 1fr);
        gap: var(--spacing-md);
        margin-bottom: var(--spacing-xl);
      }

      .stat-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: var(--spacing-xs);
        padding: var(--spacing-lg);
        background: var(--color-surface);
        border-radius: var(--border-radius-xl);
        border: 1px solid var(--color-border-light);
        transition: all var(--transition-fast);

        &:hover {
          box-shadow: var(--shadow-md);
        }
      }

      .stat-icon {
        color: var(--color-text-hint);
      }

      .stat-value {
        font-size: var(--font-size-2xl);
        font-weight: var(--font-weight-bold);
        color: var(--color-text-primary);
        font-variant-numeric: tabular-nums;
      }

      .stat-label {
        font-size: var(--font-size-xs);
        color: var(--color-text-secondary);
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }

      .stat-valido {
        .stat-icon, .stat-value { color: var(--color-success); }
      }
      .stat-vencendo {
        .stat-icon, .stat-value { color: var(--color-warning); }
      }
      .stat-vencido {
        .stat-icon, .stat-value { color: var(--color-danger); }
      }
      .stat-sem-estoque {
        .stat-icon, .stat-value { color: var(--color-danger); }
      }

      /* Busca e Filtros */
      .search-filter-bar {
        display: flex;
        flex-direction: column;
        gap: var(--spacing-md);
        margin-bottom: var(--spacing-xl);
      }

      .search-box {
        position: relative;
        width: 100%;
        max-width: 400px;
      }

      .search-icon {
        position: absolute;
        left: var(--spacing-md);
        top: 50%;
        transform: translateY(-50%);
        color: var(--color-text-hint);
        pointer-events: none;
      }

      .search-input {
        width: 100%;
        padding: 12px var(--spacing-md) 12px calc(var(--spacing-md) + 28px);
        font-family: inherit;
        font-size: var(--font-size-base);
        color: var(--color-text-primary);
        background-color: var(--color-surface);
        border: 2px solid var(--color-border);
        border-radius: var(--border-radius-lg);
        transition: all var(--transition-fast);

        &::placeholder {
          color: var(--color-text-hint);
        }

        &:focus {
          outline: none;
          border-color: var(--color-primary);
          box-shadow: 0 0 0 4px var(--color-primary-subtle);
        }
      }

      .filters-bar {
        display: flex;
        gap: var(--spacing-sm);
        flex-wrap: wrap;
      }

      .filter-chip {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 8px 16px;
        font-size: var(--font-size-sm);
        font-weight: var(--font-weight-medium);
        color: var(--color-text-secondary);
        background: var(--color-surface);
        border: 1px solid var(--color-border);
        border-radius: var(--border-radius-full);
        cursor: pointer;
        transition: all var(--transition-fast);

        &:hover {
          background: var(--color-surface-variant);
        }

        &.active {
          background: var(--color-primary);
          color: white;
          border-color: var(--color-primary);
        }
      }

      .filter-valido.active {
        background: var(--color-success);
        border-color: var(--color-success);
      }

      .filter-vencendo.active {
        background: var(--color-warning);
        border-color: var(--color-warning);
      }

      .filter-vencido.active {
        background: var(--color-danger);
        border-color: var(--color-danger);
      }

      .filter-sem-estoque.active {
        background: var(--color-danger);
        border-color: var(--color-danger);
      }

      /* Grid de medicamentos */
      .medicamentos-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
        gap: var(--spacing-lg);
      }

      .medicamento-card {
        transition: all var(--transition-fast);
        cursor: pointer;

        &:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-lg);
        }
      }

      .card-content {
        display: flex;
        flex-direction: column;
        gap: var(--spacing-md);
      }

      .card-header-row {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        gap: var(--spacing-sm);
      }

      .med-title-group {
        flex: 1;
        min-width: 0;
      }

      .badges-container {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        gap: var(--spacing-xs);
        flex-shrink: 0;
      }

      .med-nome {
        font-size: var(--font-size-lg);
        font-weight: var(--font-weight-semibold);
        color: var(--color-text-primary);
        margin: 0;
        line-height: 1.3;
      }

      .med-droga {
        font-size: var(--font-size-sm);
        color: var(--color-text-secondary);
        margin: 0;
      }

      .med-generico-badge {
        display: inline-flex;
        align-items: center;
        gap: 4px;
        width: fit-content;
        padding: 4px 10px;
        font-size: var(--font-size-xs);
        font-weight: var(--font-weight-medium);
        color: var(--color-primary);
        background: var(--color-primary-subtle);
        border-radius: var(--border-radius-full);
      }

      .med-info {
        display: flex;
        flex-direction: column;
        gap: var(--spacing-sm);
        padding: var(--spacing-md);
        background-color: var(--color-surface-variant);
        border-radius: var(--border-radius-lg);
      }

      .info-item {
        display: flex;
        align-items: center;
        gap: var(--spacing-sm);
      }

      .info-icon {
        color: var(--color-text-hint);
        flex-shrink: 0;
      }

      .info-item > div {
        display: flex;
        flex-direction: column;
      }

      .info-label {
        font-size: var(--font-size-xs);
        color: var(--color-text-hint);
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }

      .info-value {
        font-size: var(--font-size-sm);
        font-weight: var(--font-weight-medium);
        color: var(--color-text-primary);
      }

      .info-value.low-stock {
        color: var(--color-warning);
      }

      .info-value.no-stock {
        color: var(--color-danger);
        font-weight: var(--font-weight-bold);
      }

      .dosagem-separator {
        color: var(--color-text-hint);
        margin: 0 4px;
      }

      .card-actions {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-top: var(--spacing-md);
        border-top: 1px solid var(--color-border-light);
      }

      /* Responsividade */
      @media (max-width: 1023px) {
        .stats-bar {
          grid-template-columns: repeat(3, 1fr);
        }
      }

      @media (max-width: 767px) {
        .page-header {
          flex-direction: column;
          align-items: stretch;
        }

        .stats-bar {
          grid-template-columns: repeat(2, 1fr);
        }

        .stat-item {
          padding: var(--spacing-md);
        }

        .stat-value {
          font-size: var(--font-size-xl);
        }

        .medicamentos-grid {
          grid-template-columns: 1fr;
        }

        .badges-container {
          flex-direction: row;
          flex-wrap: wrap;
          gap: var(--spacing-xs);
        }
      }

      @media (max-width: 479px) {
        .stats-bar {
          grid-template-columns: repeat(2, 1fr);
          gap: var(--spacing-sm);
        }

        .filter-chip {
          padding: 6px 12px;
          font-size: var(--font-size-xs);
        }

        .card-header-row {
          flex-direction: column;
          gap: var(--spacing-sm);
        }

        .badges-container {
          flex-direction: row;
          align-items: flex-start;
        }
      }
    `,
  ],
})
export class MedicamentosListPageComponent implements OnInit {
  readonly store = inject(MedicamentosStore);
  private readonly router = inject(Router);
  private readonly notification = inject(NotificationService);

  /** Signal para controlar filtro de sem estoque */
  readonly filtroSemEstoque = signal(false);

  ngOnInit(): void {
    this.store.loadAll();
  }

  navegarParaNovo(): void {
    this.router.navigate(['/medicamentos/novo']);
  }

  filtrarPorStatus(status: StatusValidade | null): void {
    this.filtroSemEstoque.set(false);
    this.store.setStatusFilter(status);
  }

  limparFiltrosStatus(): void {
    this.filtroSemEstoque.set(false);
    this.store.setStatusFilter(null);
  }

  toggleFiltroSemEstoque(): void {
    this.store.setStatusFilter(null);
    this.filtroSemEstoque.update(v => !v);
  }

  /**
   * Retorna os itens filtrados, aplicando filtro de sem estoque se ativo.
   */
  getFilteredItems(): Medicamento[] {
    const items = this.store.filteredItems();
    if (this.filtroSemEstoque()) {
      return items.filter(med => med.quantidadeAtual === 0);
    }
    return items;
  }

  onBusca(event: Event): void {
    const busca = (event.target as HTMLInputElement).value;
    this.store.setBusca(busca);
  }

  limparFiltros(): void {
    this.filtroSemEstoque.set(false);
    this.store.clearFilters();
  }

  async incrementarRapido(id: string): Promise<void> {
    const result = await this.store.incrementarRapido(id);
    if (!result.success && result.error) {
      this.notification.error(result.error.message);
    }
  }

  async decrementarRapido(id: string): Promise<void> {
    const result = await this.store.decrementarRapido(id);
    if (!result.success && result.error) {
      this.notification.error(result.error.message);
    }
  }

  verDetalhes(med: Medicamento): void {
    this.router.navigate(['/medicamentos', med.id]);
  }

  editarMedicamento(med: Medicamento): void {
    this.router.navigate(['/medicamentos', med.id], {
      queryParams: { editar: true },
    });
  }

  formatarData(dataISO: string): string {
    const data = new Date(dataISO);
    return data.toLocaleDateString('pt-BR');
  }

  formatarTipo(tipo: string): string {
    const formatMap: Record<string, string> = {
      comprimido: 'Comprimido',
      capsula: 'Cápsula',
      liquido: 'Líquido',
      spray: 'Spray',
      creme: 'Creme',
      pomada: 'Pomada',
      gel: 'Gel',
      gotas: 'Gotas',
      injetavel: 'Injetável',
      outro: 'Outro',
    };
    return formatMap[tipo] || tipo;
  }
}
