import { computed, Injectable, OnDestroy, signal } from '@angular/core';
import { Notification, NotificationOptions, NotificationType } from './notification/models';

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
export class NotificationService implements OnDestroy {
  private readonly _notifications = signal<Notification[]>([]);
  private readonly _timers = new Map<string, ReturnType<typeof setTimeout>>();
  private readonly MAX_NOTIFICATIONS = 5;
  private _idCounter = 0;

  readonly notifications = this._notifications.asReadonly();
  readonly hasNotifications = computed(() => this._notifications().length > 0);
  readonly notificationCount = computed(() => this._notifications().length);

  ngOnDestroy(): void {
    this._timers.forEach((timer) => clearTimeout(timer));
    this._timers.clear();
  }

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
   * Remove uma notificação pelo ID e cancela seu timer.
   */
  dismiss(id: string): void {
    const timer = this._timers.get(id);
    if (timer) {
      clearTimeout(timer);
      this._timers.delete(id);
    }

    this._notifications.update((notifications) => notifications.filter((n) => n.id !== id));
  }

  /**
   * Remove todas as notificações e cancela todos os timers.
   */
  dismissAll(): void {
    this._timers.forEach((timer) => clearTimeout(timer));
    this._timers.clear();
    this._notifications.set([]);
  }

  /**
   * Remove notificações por tipo e cancela seus timers.
   */
  dismissByType(type: NotificationType): void {
    const toRemove = this._notifications().filter((n) => n.type === type);
    toRemove.forEach((n) => {
      const timer = this._timers.get(n.id);
      if (timer) {
        clearTimeout(timer);
        this._timers.delete(n.id);
      }
    });

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
      const timer = setTimeout(() => {
        this._timers.delete(id);
        this.dismiss(id);
      }, duration);
      this._timers.set(id, timer);
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
