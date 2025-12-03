import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

/**
 * Serviço centralizado para acessar configurações de ambiente.
 * 
 * Este serviço fornece acesso tipado a todas as configurações
 * definidas nos arquivos de environment.
 * 
 * @example
 * constructor(private env: EnvironmentService) {
 *   const apiUrl = this.env.apiBaseUrl;
 *   const firebaseConfig = this.env.firebase;
 * }
 */
@Injectable({
  providedIn: 'root'
})
export class EnvironmentService {
  /**
   * Objeto de configuração do ambiente atual.
   */
  readonly config = environment;

  /**
   * Indica se a aplicação está em modo de produção.
   */
  get isProduction(): boolean {
    return this.config.production;
  }

  /**
   * Indica se a aplicação está em modo de desenvolvimento.
   */
  get isDevelopment(): boolean {
    return !this.config.production;
  }

  /**
   * URL base da API Node.js.
   */
  get apiBaseUrl(): string {
    return this.config.apiBaseUrl;
  }

  /**
   * Configurações do Firebase.
   */
  get firebase() {
    return this.config.firebase;
  }

  /**
   * Configurações da aplicação.
   */
  get app() {
    return this.config.app;
  }

  /**
   * Features flags.
   */
  get features() {
    return this.config.features || {};
  }

  /**
   * Verifica se uma feature está habilitada.
   */
  isFeatureEnabled(feature: keyof NonNullable<typeof environment.features>): boolean {
    return this.features[feature] === true;
  }
}

