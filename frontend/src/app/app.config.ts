import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { ApplicationConfig } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter, withViewTransitions } from '@angular/router';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getStorage, provideStorage } from '@angular/fire/storage';
import { LucideAngularModule } from 'lucide-angular';
import {
  Pill, Eye, EyeOff, Mail, Lock, LogIn, LogOut, HelpCircle,
  AlertCircle, AlertTriangle, CheckCircle, XCircle, X, Info,
  Sun, Moon, Home, PlusCircle, Plus, Minus, ChevronDown, Menu,
  Search, SearchX, Package, Box, Hash, Calendar, Edit2, Trash2,
  ArrowLeft, RefreshCw, LoaderCircle, Inbox, FileText, WifiOff,
  Check, Clock, BadgeCheck, Settings, User, Loader2,
  Camera, Image, Upload, ImagePlus
} from 'lucide-angular';
import {
  firebaseConfig,
  validateFirebaseConfig,
} from './core/config/firebase.config';
import { authInterceptor } from './core/interceptors';
import { routes } from './app.routes';

/**
 * Ícones Lucide usados na aplicação.
 * Registrados globalmente para performance otimizada.
 */
const lucideIcons = {
  Pill, Eye, EyeOff, Mail, Lock, LogIn, LogOut, HelpCircle,
  AlertCircle, AlertTriangle, CheckCircle, XCircle, X, Info,
  Sun, Moon, Home, PlusCircle, Plus, Minus, ChevronDown, Menu,
  Search, SearchX, Package, Box, Hash, Calendar, Edit2, Trash2,
  ArrowLeft, RefreshCw, LoaderCircle, Inbox, FileText, WifiOff,
  Check, Clock, BadgeCheck, Settings, User, Loader2,
  Camera, Image, Upload, ImagePlus
};

/**
 * Configuração da aplicação Angular.
 *
 * Inclui providers para:
 * - Animações
 * - Router com View Transitions
 * - HTTP Client com interceptors
 * - Firebase (App, Auth, Firestore, Storage)
 * - Lucide Icons
 */
export const appConfig: ApplicationConfig = {
  providers: [
    // Animações Angular
    provideAnimationsAsync(),
    
    // Router com View Transitions para transições suaves entre páginas
    provideRouter(routes, withViewTransitions()),
    
    // HTTP Client com interceptor de autenticação
    provideHttpClient(withInterceptors([authInterceptor])),

    // Lucide Icons
    LucideAngularModule.pick(lucideIcons).providers ?? [],

    // Firebase App
    provideFirebaseApp(() => {
      // Valida configuração antes de inicializar
      if (!validateFirebaseConfig()) {
        throw new Error(
          'Firebase configuration is invalid. Please check your environment files.'
        );
      }

      return initializeApp(firebaseConfig);
    }),

    // Firebase Auth
    provideAuth(() => getAuth()),

    // Firebase Firestore
    provideFirestore(() => getFirestore()),

    // Firebase Storage
    provideStorage(() => getStorage()),
  ],
};
