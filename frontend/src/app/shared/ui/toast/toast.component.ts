import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { NotificationService } from '../../../core/services/notification.service';
import { Notification, NotificationType } from '../../../core/services/notification/models';
import { IconComponent } from '../icon/icon.component';

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
  imports: [CommonModule, IconComponent],
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
          <div class="toast-icon-wrapper">
            <app-icon [name]="getIcon(notification.type)" [size]="18" />
          </div>

          <!-- Conteúdo -->
          <div class="toast-content">
            <strong *ngIf="notification.title" class="toast-title">
              {{ notification.title }}
            </strong>
            <p class="toast-message">{{ notification.message }}</p>
          </div>

          <!-- Ações -->
          <div class="toast-actions">
            <button 
              *ngIf="notification.action" 
              type="button" 
              class="toast-action-btn" 
              (click)="onAction(notification)"
            >
              {{ notification.action.label }}
            </button>
            <button
              *ngIf="notification.dismissible"
              type="button"
              class="toast-close-btn"
              (click)="dismiss(notification.id)"
              aria-label="Fechar notificação"
            >
              <app-icon name="x" [size]="16" />
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
        z-index: var(--z-toast);
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
        border-radius: var(--border-radius-xl);
        box-shadow: var(--shadow-xl);
        pointer-events: auto;
        animation: toast-enter 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        position: relative;
        overflow: hidden;
        border: 1px solid var(--color-border-light);
      }

      @keyframes toast-enter {
        from {
          opacity: 0;
          transform: translateX(100%) scale(0.95);
        }
        to {
          opacity: 1;
          transform: translateX(0) scale(1);
        }
      }

      /* Icon Wrapper */
      .toast-icon-wrapper {
        width: 32px;
        height: 32px;
        border-radius: var(--border-radius-full);
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
      }

      /* Tipos */
      .toast--success {
        .toast-icon-wrapper {
          background: var(--color-success-bg);
          color: var(--color-success);
        }
      }

      .toast--error {
        .toast-icon-wrapper {
          background: var(--color-danger-bg);
          color: var(--color-danger);
        }
      }

      .toast--warning {
        .toast-icon-wrapper {
          background: var(--color-warning-bg);
          color: var(--color-warning);
        }
      }

      .toast--info {
        .toast-icon-wrapper {
          background: var(--color-info-bg);
          color: var(--color-info);
        }
      }

      /* Conteúdo */
      .toast-content {
        flex: 1;
        min-width: 0;
        padding-top: 4px;
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
        font-weight: var(--font-weight-semibold);
        cursor: pointer;
        padding: var(--spacing-xs) var(--spacing-sm);
        border-radius: var(--border-radius-md);
        transition: background-color var(--transition-fast);

        &:hover {
          background-color: var(--color-primary-subtle);
        }
      }

      .toast-close-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 28px;
        height: 28px;
        background: none;
        border: none;
        color: var(--color-text-hint);
        cursor: pointer;
        border-radius: var(--border-radius-md);
        transition: all var(--transition-fast);

        &:hover {
          color: var(--color-text-secondary);
          background-color: var(--color-surface-variant);
        }
      }

      /* Barra de progresso */
      .toast-progress {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        height: 3px;
        background: var(--color-primary);
        opacity: 0.3;
        animation: progress-shrink linear forwards;
        transform-origin: left;
        border-radius: 0 0 var(--border-radius-xl) var(--border-radius-xl);
      }

      .toast--success .toast-progress {
        background: var(--color-success);
      }

      .toast--error .toast-progress {
        background: var(--color-danger);
      }

      .toast--warning .toast-progress {
        background: var(--color-warning);
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
   * Retorna o ícone Lucide para o tipo de notificação.
   */
  getIcon(type: NotificationType): string {
    const icons: Record<NotificationType, string> = {
      success: 'check-circle',
      error: 'x-circle',
      warning: 'alert-triangle',
      info: 'info',
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
