import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';
import { routes } from './app/app.routes';
import { suppressFirebaseDebugLogs } from './app/core/utils/console-suppressor';

// Suprime mensagens de debug do Firebase Auth antes de inicializar a aplicação
suppressFirebaseDebugLogs();

bootstrapApplication(AppComponent, {
  ...appConfig,
  providers: [
    ...appConfig.providers,
    provideRouter(routes),
    provideAnimations()
  ]
}).catch(err => console.error(err));

