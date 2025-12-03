import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

/**
 * Layout principal da aplicação para rotas autenticadas.
 * Contém header, sidebar (se necessário) e área de conteúdo.
 */
@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  template: `
    <div class="main-layout">
      <header class="main-header">
        <div class="container">
          <h1 class="logo">💊 Meus Medicamentos</h1>
          <nav class="main-nav">
            <!-- Navegação será implementada nas próximas tasks -->
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
      /* Navegação será implementada nas próximas tasks */
    }
  `]
})
export class MainLayoutComponent {}

