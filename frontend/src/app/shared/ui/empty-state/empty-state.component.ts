import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../button/button.component';
import { IconComponent } from '../icon/icon.component';

/**
 * Variantes de estado vazio.
 */
export type EmptyStateVariant =
  | 'default'
  | 'search'
  | 'error'
  | 'no-data'
  | 'offline';

/**
 * Componente de estado vazio.
 *
 * Exibe uma mensagem amigável quando não há dados para mostrar.
 */
@Component({
  selector: 'app-empty-state',
  standalone: true,
  imports: [CommonModule, ButtonComponent, IconComponent],
  template: `
    <div class="empty-state" [class]="'empty-state--' + variant">
      <!-- Ícone -->
      <div class="empty-icon-wrapper" aria-hidden="true">
        <app-icon [name]="iconName || getDefaultIcon()" [size]="48" />
      </div>

      <!-- Título -->
      <h3 class="empty-title">{{ title || getDefaultTitle() }}</h3>

      <!-- Descrição -->
      <p *ngIf="description" class="empty-description">
        {{ description }}
      </p>

      <!-- Ações -->
      <div class="empty-actions" *ngIf="actionLabel || secondaryActionLabel">
        <app-button
          *ngIf="actionLabel"
          [variant]="variant === 'error' ? 'outline' : 'primary'"
          (clicked)="onAction()"
          [icon]="actionIcon || ''"
        >
          {{ actionLabel }}
        </app-button>

        <app-button
          *ngIf="secondaryActionLabel"
          variant="ghost"
          (clicked)="onSecondaryAction()"
        >
          {{ secondaryActionLabel }}
        </app-button>
      </div>
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
        animation: fadeIn 0.4s ease-out;
      }

      @keyframes fadeIn {
        from {
          opacity: 0;
          transform: translateY(10px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      .empty-icon-wrapper {
        width: 96px;
        height: 96px;
        border-radius: var(--border-radius-full);
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: var(--spacing-lg);
        background: var(--color-surface-variant);
        color: var(--color-text-hint);
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
        line-height: var(--line-height-relaxed);
      }

      .empty-actions {
        display: flex;
        flex-direction: column;
        gap: var(--spacing-sm);
        align-items: center;
      }

      /* Variantes */
      .empty-state--error .empty-icon-wrapper {
        background: var(--color-danger-bg);
        color: var(--color-danger);
      }

      .empty-state--search .empty-icon-wrapper {
        background: var(--color-info-bg);
        color: var(--color-info);
      }

      .empty-state--offline .empty-icon-wrapper {
        background: var(--color-warning-bg);
        color: var(--color-warning);
      }

      .empty-state--default .empty-icon-wrapper {
        background: var(--color-primary-subtle);
        color: var(--color-primary);
      }
    `,
  ],
})
export class EmptyStateComponent {
  /** Variante do estado vazio */
  @Input() variant: EmptyStateVariant = 'default';

  /** Nome do ícone Lucide */
  @Input() iconName?: string;

  /** Título */
  @Input() title?: string;

  /** Descrição */
  @Input() description?: string;

  /** Label do botão de ação principal */
  @Input() actionLabel?: string;

  /** Ícone do botão de ação principal */
  @Input() actionIcon?: string;

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
      default: 'inbox',
      search: 'search',
      error: 'alert-triangle',
      'no-data': 'file-text',
      offline: 'wifi-off',
    };
    return icons[this.variant];
  }

  /**
   * Retorna o título padrão para a variante.
   */
  getDefaultTitle(): string {
    const titles: Record<EmptyStateVariant, string> = {
      default: 'Nada por aqui',
      search: 'Nenhum resultado encontrado',
      error: 'Algo deu errado',
      'no-data': 'Sem dados',
      offline: 'Você está offline',
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
