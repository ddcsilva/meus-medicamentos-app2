import { ApplicationConfig } from '@angular/core';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { provideStorage, getStorage } from '@angular/fire/storage';
import { firebaseConfig, validateFirebaseConfig } from './core/config/firebase.config';
import { authInterceptor } from './core/interceptors';

/**
 * Configuração da aplicação Angular.
 * 
 * Inclui providers para:
 * - HTTP Client com interceptors
 * - Firebase (App, Auth, Firestore, Storage)
 */
export const appConfig: ApplicationConfig = {
  providers: [
    // HTTP Client com interceptor de autenticação
    provideHttpClient(
      withInterceptors([authInterceptor])
    ),
    
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
