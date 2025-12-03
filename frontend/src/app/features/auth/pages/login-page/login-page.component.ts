import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="login-page">
      <div class="login-container">
        <h1>Login</h1>
        <p>Página de login será implementada nas próximas tasks.</p>
      </div>
    </div>
  `,
  styles: [`
    .login-page {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background-color: var(--color-background);
    }
    
    .login-container {
      background: var(--color-surface);
      padding: var(--spacing-xl);
      border-radius: var(--border-radius-lg);
      box-shadow: var(--shadow-md);
      max-width: 400px;
      width: 100%;
      text-align: center;
    }
    
    h1 {
      color: var(--color-primary);
      margin-bottom: var(--spacing-md);
    }
  `]
})
export class LoginPageComponent {}

