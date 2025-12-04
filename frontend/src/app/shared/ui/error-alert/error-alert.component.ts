import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../button/button.component';
import { IconComponent } from '../icon/icon.component';

/**
 * Componente de alerta de erro.
 *
 * Exibe mensagens de erro de forma destacada com opção de retry.
 */
@Component({
  selector: 'app-error-alert',
  standalone: true,
  imports: [CommonModule, ButtonComponent, IconComponent],
  template: `
    @if (message) {
      <div
        class="error-alert"
        role="alert"
        aria-live="assertive"
      >
        <div class="error-content">
          <div class="error-icon-wrapper">
            <app-icon name="alert-triangle" [size]="20" />
          </div>
          <div class="error-text">
            <strong *ngIf="title" class="error-title">{{ title }}</strong>
            <p class="error-message">{{ message }}</p>
          </div>
        </div>

        <div class="error-actions">
          <app-button
            *ngIf="showRetry"
            variant="outline"
            size="sm"
            (clicked)="onRetry()"
            icon="refresh-cw"
          >
            Tentar novamente
          </app-button>
          <app-button
            *ngIf="dismissible"
            variant="ghost"
            size="sm"
            (clicked)="onDismiss()"
            icon="x"
            [iconOnly]="true"
          >
            Fechar
          </app-button>
        </div>
      </div>
    }
  `,
  styles: [
    `
      .error-alert {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: var(--spacing-md);
        padding: var(--spacing-md);
        background-color: var(--color-danger-bg);
        border: 1px solid var(--color-danger-light);
        border-radius: var(--border-radius-lg);
        margin-bottom: var(--spacing-md);
        animation: slideDown 0.3s ease-out;
      }

      @keyframes slideDown {
        from {
          opacity: 0;
          transform: translateY(-8px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      .error-content {
        display: flex;
        align-items: flex-start;
        gap: var(--spacing-sm);
        flex: 1;
      }

      .error-icon-wrapper {
        width: 36px;
        height: 36px;
        border-radius: var(--border-radius-full);
        background: var(--color-danger);
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
      }

      .error-text {
        flex: 1;
        min-width: 0;
        padding-top: 4px;
      }

      .error-title {
        display: block;
        font-size: var(--font-size-sm);
        font-weight: var(--font-weight-semibold);
        color: var(--color-danger-text);
        margin-bottom: 2px;
      }

      .error-message {
        font-size: var(--font-size-sm);
        color: var(--color-danger-text);
        margin: 0;
        line-height: 1.4;
      }

      .error-actions {
        display: flex;
        gap: var(--spacing-sm);
        flex-shrink: 0;
      }

      @media (max-width: 639px) {
        .error-alert {
          flex-direction: column;
          align-items: stretch;
        }

        .error-actions {
          justify-content: flex-end;
        }
      }
    `,
  ],
})
export class ErrorAlertComponent {
  /** Mensagem de erro */
  @Input() message?: string | null;

  /** Título opcional */
  @Input() title?: string;

  /** Se deve mostrar botão de retry */
  @Input() showRetry: boolean = false;

  /** Se pode ser fechado */
  @Input() dismissible: boolean = true;

  /** Evento emitido ao clicar em retry */
  @Output() retry = new EventEmitter<void>();

  /** Evento emitido ao fechar */
  @Output() dismiss = new EventEmitter<void>();

  onRetry(): void {
    this.retry.emit();
  }

  onDismiss(): void {
    this.dismiss.emit();
  }
}
