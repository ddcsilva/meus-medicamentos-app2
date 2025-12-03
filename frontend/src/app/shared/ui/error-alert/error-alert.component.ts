import { Component, EventEmitter, Input, Output } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ButtonComponent } from "../button/button.component";

/**
 * Componente de alerta de erro.
 *
 * Exibe mensagens de erro de forma destacada com opção de retry.
 *
 * @example
 * <app-error-alert
 *   [message]="store.error()?.message"
 *   [showRetry]="true"
 *   (retry)="store.loadAll()"
 *   (dismiss)="store.clearError()"
 * />
 */
@Component({
  selector: "app-error-alert",
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  template: `
    <div
      *ngIf="message"
      class="error-alert"
      role="alert"
      aria-live="assertive"
    >
      <div class="error-content">
        <span class="error-icon" aria-hidden="true">⚠️</span>
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
          (click)="onRetry()"
        >
          Tentar novamente
        </app-button>
        <app-button
          *ngIf="dismissible"
          variant="ghost"
          size="sm"
          (click)="onDismiss()"
        >
          Fechar
        </app-button>
      </div>
    </div>
  `,
  styles: [
    `
      .error-alert {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: var(--spacing-md);
        padding: var(--spacing-md);
        background-color: rgba(244, 67, 54, 0.1);
        border: 1px solid var(--color-danger);
        border-radius: var(--border-radius-md);
        margin-bottom: var(--spacing-md);
      }

      .error-content {
        display: flex;
        align-items: flex-start;
        gap: var(--spacing-sm);
        flex: 1;
      }

      .error-icon {
        font-size: 1.25rem;
        flex-shrink: 0;
      }

      .error-text {
        flex: 1;
        min-width: 0;
      }

      .error-title {
        display: block;
        font-size: var(--font-size-sm);
        font-weight: var(--font-weight-semibold);
        color: var(--color-danger);
        margin-bottom: 2px;
      }

      .error-message {
        font-size: var(--font-size-sm);
        color: var(--color-text-primary);
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

