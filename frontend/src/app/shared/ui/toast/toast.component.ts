import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { NotificationService } from '../../../core/services/notification.service';
import { Notification, NotificationType } from '../../../core/services/notification/models';

/**
 * Componente de Toast/Snackbar.
 *
 * Exibe notificações empilhadas no canto inferior direito da tela.
 *
 * @example
 * // No app.component.ts ou layout principal
 * <app-toast />
 */
@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="toast-container" role="region" aria-label="Notificações">
      @for (notification of notificationService.notifications(); track notification.id) {
      <div
        class="toast"
        [class]="'toast--' + notification.type"
        role="alert"
        [attr.aria-live]="notification.type === 'error' ? 'assertive' : 'polite'"
      >
        <!-- Ícone -->
        <span class="toast-icon" aria-hidden="true">
          {{ getIcon(notification.type) }}
        </span>

        <!-- Conteúdo -->
        <div class="toast-content">
          <strong *ngIf="notification.title" class="toast-title">
            {{ notification.title }}
          </strong>
          <p class="toast-message">{{ notification.message }}</p>
        </div>

        <!-- Ações -->
        <div class="toast-actions">
          <button *ngIf="notification.action" type="button" class="toast-action-btn" (click)="onAction(notification)">
            {{ notification.action.label }}
          </button>
          <button
            *ngIf="notification.dismissible"
            type="button"
            class="toast-close-btn"
            (click)="dismiss(notification.id)"
            aria-label="Fechar notificação"
          >
            ✕
          </button>
        </div>

        <!-- Barra de progresso -->
        <div
          *ngIf="notification.duration > 0"
          class="toast-progress"
          [style.animation-duration.ms]="notification.duration"
        ></div>
      </div>
      }
    </div>
  `,
  styles: [
    `
      .toast-container {
        position: fixed;
        bottom: var(--spacing-lg);
        right: var(--spacing-lg);
        z-index: 9999;
        display: flex;
        flex-direction: column;
        gap: var(--spacing-sm);
        max-width: 400px;
        width: 100%;
        pointer-events: none;
      }

      .toast {
        display: flex;
        align-items: flex-start;
        gap: var(--spacing-sm);
        padding: var(--spacing-md);
        background: var(--color-surface);
        border-radius: var(--border-radius-lg);
        box-shadow: var(--shadow-lg);
        border-left: 4px solid;
        pointer-events: auto;
        animation: toast-enter 0.3s ease-out;
        position: relative;
        overflow: hidden;
      }

      @keyframes toast-enter {
        from {
          opacity: 0;
          transform: translateX(100%);
        }
        to {
          opacity: 1;
          transform: translateX(0);
        }
      }

      /* Tipos */
      .toast--success {
        border-left-color: var(--color-success);
      }

      .toast--error {
        border-left-color: var(--color-danger);
      }

      .toast--warning {
        border-left-color: var(--color-prestes);
      }

      .toast--info {
        border-left-color: var(--color-primary);
      }

      /* Ícone */
      .toast-icon {
        font-size: 1.25rem;
        flex-shrink: 0;
        margin-top: 2px;
      }

      .toast--success .toast-icon {
        color: var(--color-success);
      }

      .toast--error .toast-icon {
        color: var(--color-danger);
      }

      .toast--warning .toast-icon {
        color: var(--color-prestes);
      }

      .toast--info .toast-icon {
        color: var(--color-primary);
      }

      /* Conteúdo */
      .toast-content {
        flex: 1;
        min-width: 0;
      }

      .toast-title {
        display: block;
        font-size: var(--font-size-sm);
        font-weight: var(--font-weight-semibold);
        color: var(--color-text-primary);
        margin-bottom: 2px;
      }

      .toast-message {
        font-size: var(--font-size-sm);
        color: var(--color-text-secondary);
        margin: 0;
        line-height: 1.4;
      }

      /* Ações */
      .toast-actions {
        display: flex;
        align-items: center;
        gap: var(--spacing-xs);
        flex-shrink: 0;
      }

      .toast-action-btn {
        background: none;
        border: none;
        color: var(--color-primary);
        font-size: var(--font-size-sm);
        font-weight: var(--font-weight-medium);
        cursor: pointer;
        padding: var(--spacing-xs) var(--spacing-sm);
        border-radius: var(--border-radius-sm);
        transition: background-color var(--transition-fast);

        &:hover {
          background-color: rgba(25, 118, 210, 0.1);
        }
      }

      .toast-close-btn {
        background: none;
        border: none;
        color: var(--color-text-hint);
        font-size: var(--font-size-sm);
        cursor: pointer;
        padding: var(--spacing-xs);
        border-radius: var(--border-radius-sm);
        line-height: 1;
        transition: all var(--transition-fast);

        &:hover {
          color: var(--color-text-secondary);
          background-color: var(--color-background);
        }
      }

      /* Barra de progresso */
      .toast-progress {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        height: 3px;
        background: currentColor;
        opacity: 0.3;
        animation: progress-shrink linear forwards;
        transform-origin: left;
      }

      @keyframes progress-shrink {
        from {
          transform: scaleX(1);
        }
        to {
          transform: scaleX(0);
        }
      }

      /* Responsividade */
      @media (max-width: 639px) {
        .toast-container {
          left: var(--spacing-md);
          right: var(--spacing-md);
          bottom: var(--spacing-md);
          max-width: none;
        }
      }
    `,
  ],
})
export class ToastComponent {
  readonly notificationService = inject(NotificationService);

  /**
   * Retorna o ícone para o tipo de notificação.
   */
  getIcon(type: NotificationType): string {
    const icons: Record<NotificationType, string> = {
      success: '✓',
      error: '✕',
      warning: '⚠',
      info: 'ℹ',
    };
    return icons[type];
  }

  /**
   * Remove uma notificação.
   */
  dismiss(id: string): void {
    this.notificationService.dismiss(id);
  }

  /**
   * Executa a ação da notificação.
   */
  onAction(notification: Notification): void {
    if (notification.action) {
      notification.action.callback();
      this.dismiss(notification.id);
    }
  }
}
