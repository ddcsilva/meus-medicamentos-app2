/**
 * Tipos de notificação disponíveis.
 *
 * Define as variantes visuais e semânticas das notificações.
 *
 * @example
 * const type: NotificationType = 'success';
 * notificationService.show(type, 'Operação concluída!');
 */
export type NotificationType = 'success' | 'error' | 'warning' | 'info';
