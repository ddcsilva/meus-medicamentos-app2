import { CommonModule } from "@angular/common";
import { Component, OnInit, inject } from "@angular/core";
import { Router, RouterLink } from "@angular/router";
import { NotificationService } from "../../../../core/services/notification.service";
import { ButtonComponent } from "../../../../shared/ui/button/button.component";
import { CardComponent } from "../../../../shared/ui/card/card.component";
import { EmptyStateComponent } from "../../../../shared/ui/empty-state/empty-state.component";
import { ErrorAlertComponent } from "../../../../shared/ui/error-alert/error-alert.component";
import { LoadingComponent } from "../../../../shared/ui/loading/loading.component";
import { PageLoadingComponent } from "../../../../shared/ui/page-loading/page-loading.component";
import { StatusBadgeComponent } from "../../../../shared/ui/status-badge/status-badge.component";
import { QuantidadeControlComponent } from "../../components/quantidade-control/quantidade-control.component";
import { Medicamento, StatusValidade } from "../../models";
import { MedicamentosStore } from "../../services/medicamentos.store";

/**
 * Página de listagem de medicamentos.
 *
 * Exibe cartões de medicamentos com:
 * - Nome, droga, tipo
 * - Status de validade (badge colorido)
 * - Quantidade atual
 * - Controles de incremento/decremento
 * - Filtros por status
 * - Busca por nome/droga
 */
@Component({
  selector: "app-medicamentos-list-page",
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ButtonComponent,
    CardComponent,
    StatusBadgeComponent,
    LoadingComponent,
    PageLoadingComponent,
    EmptyStateComponent,
    ErrorAlertComponent,
    QuantidadeControlComponent,
  ],
  template: `
    <div class="medicamentos-page">
      <!-- Header da página -->
      <div class="page-header">
        <div class="header-content">
          <h1>Meus Medicamentos</h1>
          <p class="subtitle">
            Gerencie o estoque de medicamentos da sua família
          </p>
        </div>
        <app-button variant="primary" routerLink="/medicamentos/novo">
          + Novo Medicamento
        </app-button>
      </div>

      <!-- Estatísticas -->
      <div class="stats-bar">
        <div class="stat-item">
          <span class="stat-value">{{ store.totalItems() }}</span>
          <span class="stat-label">Total</span>
        </div>
        <div class="stat-item stat-valido">
          <span class="stat-value">{{ store.validosCount() }}</span>
          <span class="stat-label">Válidos</span>
        </div>
        <div class="stat-item stat-prestes">
          <span class="stat-value">{{ store.prestesCount() }}</span>
          <span class="stat-label">Prestes</span>
        </div>
        <div class="stat-item stat-vencido">
          <span class="stat-value">{{ store.vencidosCount() }}</span>
          <span class="stat-label">Vencidos</span>
        </div>
      </div>

      <!-- Barra de busca e filtros -->
      <div class="search-filter-bar">
        <div class="search-box">
          <input
            type="text"
            placeholder="Buscar por nome ou droga..."
            [value]="store.filters().busca || ''"
            (input)="onBusca($event)"
            class="search-input"
          />
        </div>

        <div class="filters-bar">
          <app-button
            variant="ghost"
            size="sm"
            [class.active]="!store.filters().status"
            (click)="filtrarPorStatus(null)"
          >
            Todos
          </app-button>
          <app-button
            variant="ghost"
            size="sm"
            [class.active]="store.filters().status === 'valido'"
            (click)="filtrarPorStatus('valido')"
          >
            Válidos
          </app-button>
          <app-button
            variant="ghost"
            size="sm"
            [class.active]="store.filters().status === 'prestes'"
            (click)="filtrarPorStatus('prestes')"
          >
            Prestes a vencer
          </app-button>
          <app-button
            variant="ghost"
            size="sm"
            [class.active]="store.filters().status === 'vencido'"
            (click)="filtrarPorStatus('vencido')"
          >
            Vencidos
          </app-button>
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
      <div *ngIf="!store.loading()" class="medicamentos-grid">
        <app-card
          *ngFor="let med of store.filteredItems()"
          variant="elevated"
          [clickable]="true"
          class="medicamento-card"
          (click)="verDetalhes(med)"
        >
          <div class="card-content">
            <div class="card-header-row">
              <h3 class="med-nome">{{ med.nome }}</h3>
              <app-status-badge
                [status]="med.statusValidade"
              ></app-status-badge>
            </div>

            <p class="med-droga">{{ med.droga }}</p>
            <p *ngIf="med.generico" class="med-generico">Genérico</p>

            <div class="med-info">
              <div class="info-item">
                <span class="info-label">Tipo</span>
                <span class="info-value">{{ med.tipo }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Quantidade</span>
                <span
                  class="info-value"
                  [class.low-stock]="med.quantidadeAtual < 5"
                  [class.no-stock]="med.quantidadeAtual === 0"
                >
                  {{ med.quantidadeAtual }} / {{ med.quantidadeTotal }} un
                </span>
              </div>
              <div class="info-item">
                <span class="info-label">Validade</span>
                <span class="info-value">{{ formatarData(med.validade) }}</span>
              </div>
            </div>

            <div class="card-actions" (click)="$event.stopPropagation()">
              <app-button
                variant="ghost"
                size="sm"
                (click)="editarMedicamento(med)"
              >
                Editar
              </app-button>
              <app-quantidade-control
                [quantidade]="med.quantidadeAtual"
                [quantidadeTotal]="med.quantidadeTotal"
                [loading]="store.isItemLoading(med.id)"
                [min]="0"
                size="sm"
                [showTotal]="true"
                (incrementar)="incrementarRapido(med.id)"
                (decrementar)="decrementarRapido(med.id)"
              />
            </div>
          </div>
        </app-card>
      </div>

      <!-- Estado vazio - Busca sem resultados -->
      <app-empty-state
        *ngIf="!store.loading() && store.filteredItems().length === 0 && store.hasActiveFilters()"
        variant="search"
        icon="🔍"
        title="Nenhum medicamento encontrado"
        description="Tente alterar os termos de busca ou remover alguns filtros."
        actionLabel="Limpar Filtros"
        (action)="limparFiltros()"
      />

      <!-- Estado vazio - Sem medicamentos -->
      <app-empty-state
        *ngIf="!store.loading() && store.items().length === 0 && !store.hasActiveFilters()"
        icon="💊"
        title="Nenhum medicamento cadastrado"
        description="Comece adicionando seu primeiro medicamento ao estoque familiar."
        actionLabel="+ Adicionar Medicamento"
        (action)="navegarParaNovo()"
      />
    </div>
  `,
  styles: [
    `
      .medicamentos-page {
        padding: var(--spacing-lg) 0;
      }

      /* Header */
      .page-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: var(--spacing-lg);
        flex-wrap: wrap;
        gap: var(--spacing-md);
      }

      .header-content h1 {
        color: var(--color-text-primary);
        margin-bottom: var(--spacing-xs);
      }

      .subtitle {
        color: var(--color-text-secondary);
        margin: 0;
      }

      /* Estatísticas */
      .stats-bar {
        display: flex;
        gap: var(--spacing-md);
        margin-bottom: var(--spacing-lg);
        flex-wrap: wrap;
      }

      .stat-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: var(--spacing-md) var(--spacing-lg);
        background: var(--color-surface);
        border-radius: var(--border-radius-md);
        border: 1px solid var(--color-border);
        min-width: 80px;
      }

      .stat-value {
        font-size: var(--font-size-xl);
        font-weight: var(--font-weight-bold);
        color: var(--color-text-primary);
      }

      .stat-label {
        font-size: var(--font-size-xs);
        color: var(--color-text-secondary);
        text-transform: uppercase;
      }

      .stat-valido .stat-value {
        color: var(--color-valido);
      }
      .stat-prestes .stat-value {
        color: var(--color-prestes);
      }
      .stat-vencido .stat-value {
        color: var(--color-vencido);
      }

      /* Busca e Filtros */
      .search-filter-bar {
        display: flex;
        flex-direction: column;
        gap: var(--spacing-md);
        margin-bottom: var(--spacing-lg);
        padding-bottom: var(--spacing-md);
        border-bottom: 1px solid var(--color-border);
      }

      .search-box {
        width: 100%;
        max-width: 400px;
      }

      .search-input {
        width: 100%;
        padding: var(--spacing-sm) var(--spacing-md);
        font-family: inherit;
        font-size: var(--font-size-base);
        color: var(--color-text-primary);
        background-color: var(--color-surface);
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

      .filters-bar {
        display: flex;
        gap: var(--spacing-sm);
        flex-wrap: wrap;
      }

      .filters-bar app-button.active ::ng-deep button {
        background-color: var(--color-primary);
        color: white;
      }

      /* Erro */
      .error-alert {
        display: flex;
        align-items: center;
        gap: var(--spacing-sm);
        padding: var(--spacing-md);
        background-color: var(--color-danger-bg);
        border: 1px solid var(--color-danger-light);
        border-radius: var(--border-radius-md);
        margin-bottom: var(--spacing-lg);
        color: var(--color-vencido-text);
        font-size: var(--font-size-sm);
      }

      .error-icon {
        font-size: var(--font-size-lg);
      }

      /* Loading */
      .loading-container {
        display: flex;
        justify-content: center;
        padding: var(--spacing-3xl) 0;
      }

      /* Grid de medicamentos */
      .medicamentos-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
        gap: var(--spacing-lg);
      }

      .medicamento-card {
        transition: transform var(--transition-fast);
        cursor: pointer;
      }

      .medicamento-card:hover {
        transform: translateY(-2px);
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

      .med-nome {
        font-size: var(--font-size-lg);
        font-weight: var(--font-weight-semibold);
        color: var(--color-text-primary);
        margin: 0;
      }

      .med-droga {
        font-size: var(--font-size-sm);
        color: var(--color-text-secondary);
        margin: 0;
      }

      .med-generico {
        font-size: var(--font-size-xs);
        color: var(--color-primary);
        margin: 0;
        font-weight: var(--font-weight-medium);
      }

      .med-info {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: var(--spacing-sm);
        padding: var(--spacing-md);
        background-color: var(--color-background);
        border-radius: var(--border-radius-md);
      }

      .info-item {
        display: flex;
        flex-direction: column;
        gap: 2px;
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
        color: var(--color-prestes);
      }

      .info-value.no-stock {
        color: var(--color-danger);
      }

      .card-actions {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-top: var(--spacing-sm);
        border-top: 1px solid var(--color-border-light);
      }

      .quantity-controls {
        display: flex;
        align-items: center;
        gap: var(--spacing-sm);
      }

      .quantity-display {
        min-width: 32px;
        text-align: center;
        font-weight: var(--font-weight-semibold);
      }

      /* Estado vazio */
      .empty-state {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: var(--spacing-3xl);
        text-align: center;
      }

      .empty-icon {
        font-size: 4rem;
        margin-bottom: var(--spacing-lg);
      }

      .empty-state h3 {
        color: var(--color-text-primary);
        margin-bottom: var(--spacing-sm);
      }

      .empty-state p {
        color: var(--color-text-secondary);
        margin-bottom: var(--spacing-lg);
      }

      /* Responsividade */
      @media (max-width: 639px) {
        .page-header {
          flex-direction: column;
          align-items: stretch;
        }

        .page-header app-button {
          width: 100%;
        }

        .stats-bar {
          justify-content: space-between;
        }

        .stat-item {
          flex: 1;
          min-width: 70px;
          padding: var(--spacing-sm) var(--spacing-md);
        }

        .medicamentos-grid {
          grid-template-columns: 1fr;
        }

        .med-info {
          grid-template-columns: 1fr;
        }
      }
    `,
  ],
})
export class MedicamentosListPageComponent implements OnInit {
  readonly store = inject(MedicamentosStore);
  private readonly router = inject(Router);
  private readonly notification = inject(NotificationService);

  ngOnInit(): void {
    this.store.loadAll();
  }

  /**
   * Navega para a página de novo medicamento.
   */
  navegarParaNovo(): void {
    this.router.navigate(["/medicamentos/novo"]);
  }

  /**
   * Filtra medicamentos por status de validade.
   */
  filtrarPorStatus(status: StatusValidade | null): void {
    this.store.setStatusFilter(status);
  }

  /**
   * Atualiza a busca textual.
   */
  onBusca(event: Event): void {
    const busca = (event.target as HTMLInputElement).value;
    this.store.setBusca(busca);
  }

  /**
   * Limpa todos os filtros.
   */
  limparFiltros(): void {
    this.store.clearFilters();
  }

  /**
   * Incrementa a quantidade de um medicamento de forma rápida.
   */
  async incrementarRapido(id: string): Promise<void> {
    const result = await this.store.incrementarRapido(id);
    if (!result.success && result.error) {
      this.notification.error(result.error.message);
    }
  }

  /**
   * Decrementa a quantidade de um medicamento de forma rápida.
   */
  async decrementarRapido(id: string): Promise<void> {
    const result = await this.store.decrementarRapido(id);
    if (!result.success && result.error) {
      this.notification.error(result.error.message);
    }
  }

  /**
   * Navega para a página de detalhes.
   */
  verDetalhes(med: Medicamento): void {
    this.router.navigate(["/medicamentos", med.id]);
  }

  /**
   * Navega para a página de edição.
   */
  editarMedicamento(med: Medicamento): void {
    this.router.navigate(["/medicamentos", med.id], {
      queryParams: { editar: true },
    });
  }

  /**
   * Formata data ISO para exibição.
   */
  formatarData(dataISO: string): string {
    const data = new Date(dataISO);
    return data.toLocaleDateString("pt-BR");
  }
}
