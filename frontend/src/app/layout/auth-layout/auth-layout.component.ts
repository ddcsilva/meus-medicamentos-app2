import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

/**
 * Layout para páginas de autenticação (login, registro).
 * Layout limpo e centrado, sem header/footer complexos.
 */
@Component({
  selector: 'app-auth-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  template: `
    <div class="auth-layout">
      <div class="auth-container">
        <div class="auth-header">
          <h1 class="auth-logo">💊 Meus Medicamentos</h1>
          <p class="auth-subtitle">Controle de Estoque Familiar</p>
        </div>
        
        <div class="auth-content">
          <router-outlet></router-outlet>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .auth-layout {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%);
      padding: var(--spacing-md);
    }
    
    .auth-container {
      width: 100%;
      max-width: 450px;
      background: var(--color-surface);
      border-radius: var(--border-radius-lg);
      box-shadow: var(--shadow-lg);
      overflow: hidden;
    }
    
    .auth-header {
      background: var(--color-primary);
      color: white;
      padding: var(--spacing-xl);
      text-align: center;
    }
    
    .auth-logo {
      font-size: 2rem;
      font-weight: 600;
      margin: 0 0 var(--spacing-sm) 0;
      color: white;
    }
    
    .auth-subtitle {
      margin: 0;
      font-size: 0.9rem;
      opacity: 0.9;
      color: white;
    }
    
    .auth-content {
      padding: var(--spacing-xl);
    }
  `]
})
export class AuthLayoutComponent {}

