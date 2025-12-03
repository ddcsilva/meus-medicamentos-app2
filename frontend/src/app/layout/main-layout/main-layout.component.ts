import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink } from '@angular/router';
import { ToastComponent } from '../../shared/ui/toast/toast.component';
import { AuthService } from '../../core/services/auth.service';
import { ButtonComponent } from '../../shared/ui/button/button.component';

/**
 * Layout principal da aplicação para rotas autenticadas.
 * Contém header, sidebar (se necessário) e área de conteúdo.
 */
@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, ToastComponent, ButtonComponent],
  template: `
    <div class="main-layout">
      <header class="main-header">
        <div class="container">
          <a routerLink="/medicamentos" class="logo">💊 Meus Medicamentos</a>
          <nav class="main-nav">
            <span class="user-email">{{ authService.userEmail() }}</span>
            <app-button
              variant="ghost"
              size="sm"
              class="logout-btn"
              (click)="logout()"
            >
              Sair
            </app-button>
          </nav>
        </div>
      </header>
      
      <main class="main-content">
        <div class="container">
          <router-outlet></router-outlet>
        </div>
      </main>
      
      <footer class="main-footer">
        <div class="container">
          <p>&copy; 2024 Meus Medicamentos - Controle de Estoque Familiar</p>
        </div>
      </footer>

      <!-- Toast Container para notificações -->
      <app-toast />
    </div>
  `,
  styles: [`
    .main-layout {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
    }
    
    .main-header {
      background-color: var(--color-primary);
      color: white;
      padding: var(--spacing-md) 0;
      box-shadow: var(--shadow-sm);
    }
    
    .main-header .container {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .logo {
      font-size: 1.5rem;
      font-weight: 600;
      margin: 0;
      color: white;
    }
    
    .main-content {
      flex: 1;
      padding: var(--spacing-lg) 0;
      background-color: var(--color-background);
    }
    
    .main-footer {
      background-color: var(--color-surface);
      border-top: 1px solid var(--color-border);
      padding: var(--spacing-md) 0;
      text-align: center;
      color: var(--color-text-secondary);
      font-size: 0.875rem;
    }
    
    .main-nav {
      display: flex;
      align-items: center;
      gap: var(--spacing-md);
    }
    
    .user-email {
      font-size: var(--font-size-sm);
      opacity: 0.9;
    }
    
    .logout-btn ::ng-deep button {
      color: white;
      opacity: 0.9;
    }
    
    .logout-btn ::ng-deep button:hover {
      opacity: 1;
      background-color: rgba(255, 255, 255, 0.1);
    }
  `]
})
export class MainLayoutComponent {
  readonly authService = inject(AuthService);

  async logout(): Promise<void> {
    await this.authService.logout();
  }
}

