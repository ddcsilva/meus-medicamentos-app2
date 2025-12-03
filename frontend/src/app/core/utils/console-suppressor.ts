/**
 * Utilitário para suprimir mensagens de debug do Firebase no console.
 * 
 * Essas mensagens são geradas internamente pelo Firebase Auth SDK
 * e podem poluir o console durante o desenvolvimento.
 */

/**
 * Suprime mensagens de debug do Firebase Auth no console.
 * 
 * Filtra mensagens como:
 * - 📤 Sending <NmLockState> message to native core
 * - 📥 Received message <NmLockState> from native core
 */
export function suppressFirebaseDebugLogs(): void {
  if (typeof window === 'undefined') {
    return;
  }

  const originalConsoleLog = console.log;
  const originalConsoleWarn = console.warn;
  const originalConsoleInfo = console.info;

  /**
   * Verifica se a mensagem deve ser suprimida.
   */
  const shouldSuppress = (message: string): boolean => {
    return (
      message.includes('📤 Sending') ||
      message.includes('📥 Received message') ||
      message.includes('NmLockState') ||
      message.includes('native core') ||
      message.includes('message to native core') ||
      message.includes('message from native core')
    );
  };

  /**
   * Intercepta console.log
   */
  console.log = (...args: any[]): void => {
    const message = args[0]?.toString() || '';
    if (shouldSuppress(message)) {
      return;
    }
    originalConsoleLog.apply(console, args);
  };

  /**
   * Intercepta console.warn
   */
  console.warn = (...args: any[]): void => {
    const message = args[0]?.toString() || '';
    if (shouldSuppress(message)) {
      return;
    }
    originalConsoleWarn.apply(console, args);
  };

  /**
   * Intercepta console.info
   */
  console.info = (...args: any[]): void => {
    const message = args[0]?.toString() || '';
    if (shouldSuppress(message)) {
      return;
    }
    originalConsoleInfo.apply(console, args);
  };
}

