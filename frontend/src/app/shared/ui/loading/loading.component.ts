import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export type LoadingSize = 'sm' | 'md' | 'lg';

/**
 * Componente de loading spinner.
 * 
 * @example
 * <app-loading></app-loading>
 * <app-loading size="lg" text="Carregando medicamentos..."></app-loading>
 */
@Component({
  selector: 'app-loading',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="loading-container" [class]="containerClasses">
      <div class="spinner" [class]="spinnerClasses"></div>
      <span *ngIf="text" class="loading-text">{{ text }}</span>
    </div>
  `,
  styles: [`
    :host {
      display: inline-flex;
    }
    
    .loading-container {
      display: flex;
      align-items: center;
      gap: var(--spacing-sm);
    }
    
    .loading-vertical {
      flex-direction: column;
    }
    
    .spinner {
      border-radius: 50%;
      border-style: solid;
      border-color: var(--color-border);
      border-top-color: var(--color-primary);
      animation: spin 0.8s linear infinite;
    }
    
    /* Tamanhos */
    .spinner-sm {
      width: 16px;
      height: 16px;
      border-width: 2px;
    }
    
    .spinner-md {
      width: 24px;
      height: 24px;
      border-width: 3px;
    }
    
    .spinner-lg {
      width: 40px;
      height: 40px;
      border-width: 4px;
    }
    
    .loading-text {
      color: var(--color-text-secondary);
      font-size: var(--font-size-sm);
    }
    
    @keyframes spin {
      to {
        transform: rotate(360deg);
      }
    }
  `]
})
export class LoadingComponent {
  @Input() size: LoadingSize = 'md';
  @Input() text = '';
  @Input() vertical = false;
  
  get containerClasses(): string {
    return this.vertical ? 'loading-vertical' : '';
  }
  
  get spinnerClasses(): string {
    return `spinner-${this.size}`;
  }
}

