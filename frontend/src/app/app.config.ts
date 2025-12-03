import { ApplicationConfig } from '@angular/core';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { provideStorage, getStorage } from '@angular/fire/storage';
import { firebaseConfig, validateFirebaseConfig } from './core/config/firebase.config';

/**
 * Configuração da aplicação Angular.
 * 
 * Inclui providers para:
 * - HTTP Client
 * - Firebase (App, Auth, Firestore, Storage)
 */
export const appConfig: ApplicationConfig = {
  providers: [
    // HTTP Client
    provideHttpClient(withInterceptorsFromDi()),
    
    // Firebase App
    provideFirebaseApp(() => {
      // Valida configuração antes de inicializar
      if (!validateFirebaseConfig()) {
        throw new Error('Firebase configuration is invalid. Please check your environment files.');
      }
      
      return initializeApp(firebaseConfig);
    }),
    
    // Firebase Auth
    provideAuth(() => getAuth()),
    
    // Firebase Firestore
    provideFirestore(() => getFirestore()),
    
    // Firebase Storage
    provideStorage(() => getStorage())
  ]
};

