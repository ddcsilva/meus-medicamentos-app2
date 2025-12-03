import { computed, Injectable, signal } from '@angular/core';

/**
 * Tipos de notificação.
 */
export type NotificationType = 'success' | 'error' | 'warning' | 'info';

/**
 * Interface para uma notificação.
 */
export interface Notification {
  id: string;
  type: NotificationType;
  message: string;
  title?: string;
  duration: number;
  dismissible: boolean;
  createdAt: number;
  action?: {
    label: string;
    callback: () => void;
  };
}

/**
 * Opções para criar uma notificação.
 */
export interface NotificationOptions {
  title?: string;
  duration?: number;
  dismissible?: boolean;
  action?: {
    label: string;
    callback: () => void;
  };
}

/**
 * Configuração padrão por tipo de notificação.
 */
const DEFAULT_DURATIONS: Record<NotificationType, number> = {
  success: 4000,
  error: 6000,
  warning: 5000,
  info: 5000,
};

/**
 * Serviço de notificações (toasts/snackbars).
 *
 * Gerencia a exibição de mensagens de feedback ao usuário.
 *
 * @example
 * // Em um componente ou serviço
 * private notification = inject(NotificationService);
 *
 * // Sucesso
 * this.notification.success('Medicamento salvo com sucesso!');
 *
 * // Erro
 * this.notification.error('Falha ao salvar medicamento.');
 *
 * // Com opções
 * this.notification.success('Medicamento excluído!', {
 *   title: 'Sucesso',
 *   action: { label: 'Desfazer', callback: () => this.desfazer() }
 * });
 */
@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private readonly _notifications = signal<Notification[]>([]);
  private readonly MAX_NOTIFICATIONS = 5;
  private _idCounter = 0;

  readonly notifications = this._notifications.asReadonly();
  readonly hasNotifications = computed(() => this._notifications().length > 0);
  readonly notificationCount = computed(() => this._notifications().length);

  /**
   * Exibe uma notificação de sucesso.
   */
  success(message: string, options?: NotificationOptions): string {
    return this._show('success', message, options);
  }

  /**
   * Exibe uma notificação de erro.
   */
  error(message: string, options?: NotificationOptions): string {
    return this._show('error', message, options);
  }

  /**
   * Exibe uma notificação de aviso.
   */
  warning(message: string, options?: NotificationOptions): string {
    return this._show('warning', message, options);
  }

  /**
   * Exibe uma notificação informativa.
   */
  info(message: string, options?: NotificationOptions): string {
    return this._show('info', message, options);
  }

  /**
   * Exibe uma notificação genérica.
   */
  show(type: NotificationType, message: string, options?: NotificationOptions): string {
    return this._show(type, message, options);
  }

  /**
   * Remove uma notificação pelo ID.
   */
  dismiss(id: string): void {
    this._notifications.update((notifications) => notifications.filter((n) => n.id !== id));
  }

  /**
   * Remove todas as notificações.
   */
  dismissAll(): void {
    this._notifications.set([]);
  }

  /**
   * Remove notificações por tipo.
   */
  dismissByType(type: NotificationType): void {
    this._notifications.update((notifications) => notifications.filter((n) => n.type !== type));
  }

  /**
   * Cria e exibe uma notificação.
   */
  private _show(type: NotificationType, message: string, options?: NotificationOptions): string {
    const id = this._generateId();
    const duration = options?.duration ?? DEFAULT_DURATIONS[type];

    const notification: Notification = {
      id,
      type,
      message,
      title: options?.title,
      duration,
      dismissible: options?.dismissible ?? true,
      createdAt: Date.now(),
      action: options?.action,
    };

    this._notifications.update((notifications) => {
      const updated = [...notifications, notification];
      if (updated.length > this.MAX_NOTIFICATIONS) {
        return updated.slice(-this.MAX_NOTIFICATIONS);
      }
      return updated;
    });

    if (duration > 0) {
      setTimeout(() => {
        this.dismiss(id);
      }, duration);
    }

    return id;
  }

  /**
   * Gera um ID único para a notificação.
   */
  private _generateId(): string {
    return `notification-${++this._idCounter}-${Date.now()}`;
  }
}
