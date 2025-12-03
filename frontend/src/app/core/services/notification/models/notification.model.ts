import { NotificationType } from './notification-type.model';

/**
 * Interface para uma notificação.
 *
 * Representa uma notificação completa com todas as suas propriedades,
 * incluindo conteúdo, tipo, duração e ações disponíveis.
 *
 * @example
 * const notification: Notification = {
 *   id: 'notif-123',
 *   type: 'success',
 *   message: 'Operação realizada com sucesso!',
 *   title: 'Sucesso',
 *   duration: 4000,
 *   dismissible: true,
 *   createdAt: Date.now()
 * };
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
