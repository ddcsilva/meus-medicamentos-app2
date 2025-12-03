import { Component, EventEmitter, Input, Output } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ButtonComponent } from "../button/button.component";

/**
 * Variantes de estado vazio.
 */
export type EmptyStateVariant =
  | "default"
  | "search"
  | "error"
  | "no-data"
  | "offline";

/**
 * Componente de estado vazio.
 *
 * Exibe uma mensagem amigável quando não há dados para mostrar.
 *
 * @example
 * // Estado vazio padrão
 * <app-empty-state
 *   icon="💊"
 *   title="Nenhum medicamento cadastrado"
 *   description="Comece adicionando seu primeiro medicamento."
 *   actionLabel="Adicionar Medicamento"
 *   (action)="adicionarMedicamento()"
 * />
 *
 * // Estado de busca sem resultados
 * <app-empty-state
 *   variant="search"
 *   title="Nenhum resultado encontrado"
 *   description="Tente alterar os termos de busca."
 *   actionLabel="Limpar Busca"
 *   (action)="limparBusca()"
 * />
 */
@Component({
  selector: "app-empty-state",
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  template: `
    <div class="empty-state" [class]="'empty-state--' + variant">
      <!-- Ícone -->
      <div class="empty-icon" aria-hidden="true">
        {{ icon || getDefaultIcon() }}
      </div>

      <!-- Título -->
      <h3 class="empty-title">{{ title || getDefaultTitle() }}</h3>

      <!-- Descrição -->
      <p *ngIf="description" class="empty-description">
        {{ description }}
      </p>

      <!-- Ação principal -->
      <app-button
        *ngIf="actionLabel"
        [variant]="variant === 'error' ? 'outline' : 'primary'"
        (click)="onAction()"
      >
        {{ actionLabel }}
      </app-button>

      <!-- Ação secundária -->
      <app-button
        *ngIf="secondaryActionLabel"
        variant="ghost"
        (click)="onSecondaryAction()"
      >
        {{ secondaryActionLabel }}
      </app-button>
    </div>
  `,
  styles: [
    `
      .empty-state {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: var(--spacing-3xl) var(--spacing-lg);
        text-align: center;
        min-height: 300px;
      }

      .empty-icon {
        font-size: 4rem;
        margin-bottom: var(--spacing-lg);
        opacity: 0.8;
      }

      .empty-title {
        font-size: var(--font-size-xl);
        font-weight: var(--font-weight-semibold);
        color: var(--color-text-primary);
        margin: 0 0 var(--spacing-sm) 0;
      }

      .empty-description {
        font-size: var(--font-size-base);
        color: var(--color-text-secondary);
        margin: 0 0 var(--spacing-lg) 0;
        max-width: 400px;
      }

      .empty-state app-button + app-button {
        margin-top: var(--spacing-sm);
      }

      /* Variantes */
      .empty-state--error .empty-icon {
        color: var(--color-danger);
      }

      .empty-state--search .empty-icon {
        opacity: 0.5;
      }

      .empty-state--offline .empty-icon {
        color: var(--color-text-hint);
      }
    `,
  ],
})
export class EmptyStateComponent {
  /** Variante do estado vazio */
  @Input() variant: EmptyStateVariant = "default";

  /** Ícone (emoji ou texto) */
  @Input() icon?: string;

  /** Título */
  @Input() title?: string;

  /** Descrição */
  @Input() description?: string;

  /** Label do botão de ação principal */
  @Input() actionLabel?: string;

  /** Label do botão de ação secundária */
  @Input() secondaryActionLabel?: string;

  /** Evento emitido ao clicar na ação principal */
  @Output() action = new EventEmitter<void>();

  /** Evento emitido ao clicar na ação secundária */
  @Output() secondaryAction = new EventEmitter<void>();

  /**
   * Retorna o ícone padrão para a variante.
   */
  getDefaultIcon(): string {
    const icons: Record<EmptyStateVariant, string> = {
      default: "📭",
      search: "🔍",
      error: "⚠️",
      "no-data": "📋",
      offline: "📡",
    };
    return icons[this.variant];
  }

  /**
   * Retorna o título padrão para a variante.
   */
  getDefaultTitle(): string {
    const titles: Record<EmptyStateVariant, string> = {
      default: "Nada por aqui",
      search: "Nenhum resultado encontrado",
      error: "Algo deu errado",
      "no-data": "Sem dados",
      offline: "Você está offline",
    };
    return titles[this.variant];
  }

  onAction(): void {
    this.action.emit();
  }

  onSecondaryAction(): void {
    this.secondaryAction.emit();
  }
}

