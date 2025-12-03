import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

export type ButtonVariant = 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'outline' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

/**
 * Componente de botão reutilizável com variantes e tamanhos.
 * 
 * @example
 * <app-button variant="primary" size="md" (clicked)="onSave()">
 *   Salvar
 * </app-button>
 * 
 * <app-button variant="danger" [loading]="isLoading">
 *   Excluir
 * </app-button>
 */
@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button
      [type]="type"
      [disabled]="disabled || loading"
      [class]="buttonClasses"
      (click)="onClick($event)"
    >
      <span *ngIf="loading" class="button-spinner"></span>
      <span [class.button-content-loading]="loading">
        <ng-content></ng-content>
      </span>
    </button>
  `,
  styles: [`
    :host {
      display: inline-block;
    }
    
    button {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: var(--spacing-sm);
      font-family: inherit;
      font-weight: var(--font-weight-medium);
      border: none;
      border-radius: var(--border-radius-md);
      cursor: pointer;
      transition: all var(--transition-fast);
      white-space: nowrap;
      
      &:focus {
        outline: 2px solid var(--color-primary-light);
        outline-offset: 2px;
      }
      
      &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }
    }
    
    /* Tamanhos */
    .btn-sm {
      padding: var(--spacing-xs) var(--spacing-sm);
      font-size: var(--font-size-sm);
      min-height: 32px;
    }
    
    .btn-md {
      padding: var(--spacing-sm) var(--spacing-md);
      font-size: var(--font-size-base);
      min-height: 40px;
    }
    
    .btn-lg {
      padding: var(--spacing-md) var(--spacing-lg);
      font-size: var(--font-size-lg);
      min-height: 48px;
    }
    
    /* Variantes */
    .btn-primary {
      background-color: var(--color-primary);
      color: var(--color-primary-contrast);
      
      &:hover:not(:disabled) {
        background-color: var(--color-primary-dark);
      }
      
      &:active:not(:disabled) {
        transform: scale(0.98);
      }
    }
    
    .btn-secondary {
      background-color: var(--color-secondary);
      color: white;
      
      &:hover:not(:disabled) {
        background-color: var(--color-secondary-dark);
      }
    }
    
    .btn-success {
      background-color: var(--color-success);
      color: white;
      
      &:hover:not(:disabled) {
        background-color: var(--color-success-dark);
      }
    }
    
    .btn-warning {
      background-color: var(--color-warning);
      color: white;
      
      &:hover:not(:disabled) {
        background-color: var(--color-warning-dark);
      }
    }
    
    .btn-danger {
      background-color: var(--color-danger);
      color: white;
      
      &:hover:not(:disabled) {
        background-color: var(--color-danger-dark);
      }
    }
    
    .btn-outline {
      background-color: transparent;
      color: var(--color-primary);
      border: 2px solid var(--color-primary);
      
      &:hover:not(:disabled) {
        background-color: var(--color-primary);
        color: white;
      }
    }
    
    .btn-ghost {
      background-color: transparent;
      color: var(--color-text-primary);
      
      &:hover:not(:disabled) {
        background-color: var(--color-background);
      }
    }
    
    /* Full width */
    .btn-block {
      width: 100%;
    }
    
    /* Loading */
    .button-spinner {
      width: 16px;
      height: 16px;
      border: 2px solid transparent;
      border-top-color: currentColor;
      border-radius: 50%;
      animation: spin 0.6s linear infinite;
    }
    
    .button-content-loading {
      opacity: 0.7;
    }
    
    @keyframes spin {
      to {
        transform: rotate(360deg);
      }
    }
  `]
})
export class ButtonComponent {
  @Input() variant: ButtonVariant = 'primary';
  @Input() size: ButtonSize = 'md';
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Input() disabled = false;
  @Input() loading = false;
  @Input() block = false;
  
  @Output() clicked = new EventEmitter<MouseEvent>();
  
  get buttonClasses(): string {
    const classes = [
      `btn-${this.variant}`,
      `btn-${this.size}`
    ];
    
    if (this.block) {
      classes.push('btn-block');
    }
    
    return classes.join(' ');
  }
  
  onClick(event: MouseEvent): void {
    if (!this.disabled && !this.loading) {
      this.clicked.emit(event);
    }
  }
}

