/**
 * Interface que define a estrutura de configuração do ambiente.
 * Garante tipagem forte para todas as propriedades de configuração.
 */
export interface Environment {
  /**
   * Indica se a aplicação está em modo de produção.
   */
  production: boolean;

  /**
   * URL base da API Node.js.
   * Exemplo: 'http://localhost:3000/api' (dev) ou 'https://api.exemplo.com/api' (prod)
   */
  apiBaseUrl: string;

  /**
   * Configurações do Firebase.
   * Contém todas as chaves públicas necessárias para inicializar o Firebase no cliente.
   */
  firebase: {
    /**
     * API Key do Firebase (chave pública, segura para uso no cliente).
     */
    apiKey: string;

    /**
     * Domínio de autenticação do Firebase.
     * Exemplo: 'meus-medicamentos.firebaseapp.com'
     */
    authDomain: string;

    /**
     * ID do projeto Firebase.
     */
    projectId: string;

    /**
     * Bucket do Firebase Storage para upload de imagens.
     * Exemplo: 'meus-medicamentos.appspot.com'
     */
    storageBucket: string;

    /**
     * ID do app de mensagens (Messaging).
     * Opcional, usado para push notifications futuras.
     */
    messagingSenderId?: string;

    /**
     * ID do app Firebase.
     */
    appId: string;

    /**
     * ID de medição (Analytics).
     * Opcional, usado para Google Analytics.
     */
    measurementId?: string;
  };

  /**
   * Configurações adicionais da aplicação.
   */
  app: {
    /**
     * Nome da aplicação.
     */
    name: string;

    /**
     * Versão da aplicação.
     */
    version: string;

    /**
     * URL base da aplicação (para redirecionamentos).
     */
    baseUrl: string;
  };

  /**
   * Configurações de features (flags de funcionalidades).
   */
  features?: {
    /**
     * Habilita/desabilita funcionalidades experimentais.
     */
    experimental?: boolean;

    /**
     * Habilita/desabilita modo de manutenção.
     */
    maintenance?: boolean;
  };
}

