/**
 * Arquivo de exemplo para configuração de ambiente.
 * 
 * INSTRUÇÕES:
 * 1. Copie este arquivo para environment.development.ts e environment.ts
 * 2. Substitua os valores placeholder pelas suas credenciais reais
 * 3. NUNCA commite arquivos environment*.ts com credenciais reais
 * 
 * Este arquivo serve como template e documentação.
 */

import { Environment } from './environment.interface';

export const environment: Environment = {
  production: false, // true para produção

  // URL da API Node.js
  apiBaseUrl: 'http://localhost:3000/api', // Produção: 'https://api.exemplo.com/api'

  // Configurações do Firebase
  // Obtenha essas informações no console do Firebase:
  // https://console.firebase.google.com/ → Configurações do Projeto → Seus apps → Web
  firebase: {
    apiKey: 'AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
    authDomain: 'meus-medicamentos.firebaseapp.com',
    projectId: 'meus-medicamentos',
    storageBucket: 'meus-medicamentos.appspot.com',
    messagingSenderId: '123456789012',
    appId: '1:123456789012:web:abcdef123456',
    measurementId: 'G-XXXXXXXXXX' // Opcional - apenas se usar Google Analytics
  },

  // Configurações da aplicação
  app: {
    name: 'Meus Medicamentos',
    version: '1.0.0',
    baseUrl: 'http://localhost:4200' // Produção: 'https://meus-medicamentos.exemplo.com'
  },

  // Features flags (opcional)
  features: {
    experimental: false,
    maintenance: false
  }
};

