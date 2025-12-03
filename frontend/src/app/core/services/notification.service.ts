import { Injectable, signal, computed } from "@angular/core";

/**
 * Tipos de notificação.
 */
export type NotificationType = "success" | "error" | "warning" | "info";

/**
 * Interface para uma notificação.
 */
export interface Notification {
  /** ID único */
  id: string;
  /** Tipo da notificação */
  type: NotificationType;
  /** Mensagem principal */
  message: string;
  /** Título opcional */
  title?: string;
  /** Duração em ms (0 = não auto-dismiss) */
  duration: number;
  /** Se pode ser fechada pelo usuário */
  dismissible: boolean;
  /** Timestamp de criação */
  createdAt: number;
  /** Ação opcional */
  action?: {
    label: string;
    callback: () => void;
  };
}

/**
 * Opções para criar uma notificação.
 */
export interface NotificationOptions {
  /** Título opcional */
  title?: string;
  /** Duração em ms (padrão: 5000, 0 = não auto-dismiss) */
  duration?: number;
  /** Se pode ser fechada pelo usuário (padrão: true) */
  dismissible?: boolean;
  /** Ação opcional */
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
  providedIn: "root",
})
export class NotificationService {
  /** Lista de notificações ativas */
  private readonly _notifications = signal<Notification[]>([]);

  /** Máximo de notificações simultâneas */
  private readonly MAX_NOTIFICATIONS = 5;

  /** Contador para IDs únicos */
  private _idCounter = 0;

  // ========================================
  // SIGNALS PÚBLICOS
  // ========================================

  /** Lista de notificações ativas (readonly) */
  readonly notifications = this._notifications.asReadonly();

  /** Indica se há notificações ativas */
  readonly hasNotifications = computed(() => this._notifications().length > 0);

  /** Contagem de notificações */
  readonly notificationCount = computed(() => this._notifications().length);

  // ========================================
  // MÉTODOS PÚBLICOS - CRIAR NOTIFICAÇÕES
  // ========================================

  /**
   * Exibe uma notificação de sucesso.
   */
  success(message: string, options?: NotificationOptions): string {
    return this._show("success", message, options);
  }

  /**
   * Exibe uma notificação de erro.
   */
  error(message: string, options?: NotificationOptions): string {
    return this._show("error", message, options);
  }

  /**
   * Exibe uma notificação de aviso.
   */
  warning(message: string, options?: NotificationOptions): string {
    return this._show("warning", message, options);
  }

  /**
   * Exibe uma notificação informativa.
   */
  info(message: string, options?: NotificationOptions): string {
    return this._show("info", message, options);
  }

  /**
   * Exibe uma notificação genérica.
   */
  show(
    type: NotificationType,
    message: string,
    options?: NotificationOptions
  ): string {
    return this._show(type, message, options);
  }

  // ========================================
  // MÉTODOS PÚBLICOS - GERENCIAR
  // ========================================

  /**
   * Remove uma notificação pelo ID.
   */
  dismiss(id: string): void {
    this._notifications.update((notifications) =>
      notifications.filter((n) => n.id !== id)
    );
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
    this._notifications.update((notifications) =>
      notifications.filter((n) => n.type !== type)
    );
  }

  // ========================================
  // MÉTODOS PRIVADOS
  // ========================================

  /**
   * Cria e exibe uma notificação.
   */
  private _show(
    type: NotificationType,
    message: string,
    options?: NotificationOptions
  ): string {
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

    // Adiciona à lista (limitando ao máximo)
    this._notifications.update((notifications) => {
      const updated = [...notifications, notification];
      // Remove as mais antigas se exceder o limite
      if (updated.length > this.MAX_NOTIFICATIONS) {
        return updated.slice(-this.MAX_NOTIFICATIONS);
      }
      return updated;
    });

    // Auto-dismiss após a duração
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

