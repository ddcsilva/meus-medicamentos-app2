import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found-page',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="not-found-page">
      <div class="not-found-content">
        <h1>404</h1>
        <h2>Página não encontrada</h2>
        <p>A página que você está procurando não existe ou foi movida.</p>
        <a routerLink="/medicamentos" class="back-link">
          Voltar para Medicamentos
        </a>
      </div>
    </div>
  `,
  styles: [`
    .not-found-page {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 60vh;
      padding: var(--spacing-lg);
    }
    
    .not-found-content {
      text-align: center;
    }
    
    h1 {
      font-size: 6rem;
      font-weight: 700;
      color: var(--color-primary);
      margin: 0;
      line-height: 1;
    }
    
    h2 {
      font-size: 2rem;
      color: var(--color-text-primary);
      margin: var(--spacing-md) 0;
    }
    
    p {
      color: var(--color-text-secondary);
      margin-bottom: var(--spacing-lg);
    }
    
    .back-link {
      display: inline-block;
      padding: var(--spacing-md) var(--spacing-lg);
      background-color: var(--color-primary);
      color: white;
      border-radius: var(--border-radius-md);
      text-decoration: none;
      transition: background-color 0.2s ease;
      
      &:hover {
        background-color: var(--color-primary-dark);
        text-decoration: none;
      }
    }
  `]
})
export class NotFoundPageComponent {}

