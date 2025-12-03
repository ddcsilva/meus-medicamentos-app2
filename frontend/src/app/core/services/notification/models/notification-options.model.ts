/**
 * Opções para criar uma notificação.
 *
 * Permite customizar título, duração, dismissibilidade e ações
 * ao criar uma notificação.
 *
 * @example
 * const options: NotificationOptions = {
 *   title: 'Atenção',
 *   duration: 6000,
 *   dismissible: true,
 *   action: {
 *     label: 'Desfazer',
 *     callback: () => console.log('Ação desfeita')
 *   }
 * };
 * notificationService.warning('Alterações não salvas', options);
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
