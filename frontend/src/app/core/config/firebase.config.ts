/**
 * Configuração e inicialização do Firebase.
 * 
 * Este arquivo demonstra como usar as configurações de environment
 * para inicializar o Firebase (Auth, Firestore, Storage).
 * 
 * IMPORTANTE: Este arquivo será usado nas próximas tasks quando
 * implementarmos a integração completa com Firebase.
 * 
 * @example
 * import { initializeFirebase } from './core/config/firebase.config';
 * 
 * // No app.config.ts ou main.ts
 * initializeFirebase();
 */

import { environment } from '../../../environments/environment';

/**
 * Configuração do Firebase extraída do environment.
 * 
 * Esta configuração será usada para inicializar o Firebase
 * quando a biblioteca for instalada nas próximas tasks.
 */
export const firebaseConfig = {
  apiKey: environment.firebase.apiKey,
  authDomain: environment.firebase.authDomain,
  projectId: environment.firebase.projectId,
  storageBucket: environment.firebase.storageBucket,
  messagingSenderId: environment.firebase.messagingSenderId,
  appId: environment.firebase.appId,
  ...(environment.firebase.measurementId && {
    measurementId: environment.firebase.measurementId
  })
};

/**
 * Valida se as configurações do Firebase estão presentes.
 * 
 * @returns true se todas as configurações obrigatórias estão presentes
 */
export function validateFirebaseConfig(): boolean {
  const required = [
    'apiKey',
    'authDomain',
    'projectId',
    'storageBucket',
    'appId'
  ];

  const config = environment.firebase;
  
  for (const key of required) {
    if (!config[key as keyof typeof config] || config[key as keyof typeof config] === `YOUR_${key.toUpperCase()}`) {
      console.error(`Firebase configuration error: ${key} is missing or not configured`);
      return false;
    }
  }

  return true;
}

/**
 * Inicializa o Firebase (será implementado nas próximas tasks).
 * 
 * TODO: Implementar quando instalar @angular/fire
 * 
 * @example
 * import { initializeApp } from 'firebase/app';
 * import { firebaseConfig } from './firebase.config';
 * 
 * export function initializeFirebase() {
 *   if (validateFirebaseConfig()) {
 *     return initializeApp(firebaseConfig);
 *   }
 *   throw new Error('Firebase configuration is invalid');
 * }
 */
export function initializeFirebase(): void {
  // Será implementado na Task 7+ quando instalar Firebase
  if (!validateFirebaseConfig()) {
    console.warn('Firebase não está configurado corretamente. Verifique environment.ts');
  }
}

