import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../icon/icon.component';

export type ButtonVariant = 
  | 'primary' 
  | 'secondary' 
  | 'success' 
  | 'warning' 
  | 'danger' 
  | 'outline' 
  | 'ghost'
  | 'ghost-light'  // Para uso em headers/backgrounds escuros
  | 'link';

export type ButtonSize = 'sm' | 'md' | 'lg';

/**
 * Componente de botão reutilizável com variantes, tamanhos e suporte a ícones.
 * 
 * @example
 * // Botão simples
 * <app-button variant="primary" (clicked)="onSave()">
 *   Salvar
 * </app-button>
 * 
 * // Com ícone
 * <app-button variant="primary" icon="plus">
 *   Adicionar
 * </app-button>
 * 
 * // Apenas ícone
 * <app-button variant="ghost" icon="settings" [iconOnly]="true" />
 * 
 * // Loading state
 * <app-button variant="danger" [loading]="isLoading">
 *   Excluir
 * </app-button>
 */
@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule, IconComponent],
  template: `
    <button
      [type]="type"
      [disabled]="disabled || loading"
      [class]="buttonClasses"
      [class.icon-only]="iconOnly"
      (click)="onClick($event)"
    >
      <!-- Loading Spinner -->
      <span *ngIf="loading" class="button-spinner">
        <app-icon name="loader-2" [size]="spinnerSize" class="animate-spin" />
      </span>
      
      <!-- Icon (left) -->
      <app-icon 
        *ngIf="icon && !loading && iconPosition === 'left'" 
        [name]="icon" 
        [size]="iconSize"
        class="button-icon"
      />
      
      <!-- Content -->
      <span class="button-content" [class.loading]="loading" [class.sr-only]="iconOnly">
        <ng-content></ng-content>
      </span>
      
      <!-- Icon (right) -->
      <app-icon 
        *ngIf="icon && !loading && iconPosition === 'right'" 
        [name]="icon" 
        [size]="iconSize"
        class="button-icon"
      />
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
      font-weight: var(--font-weight-semibold);
      border: none;
      border-radius: var(--border-radius-lg);
      cursor: pointer;
      transition: all var(--transition-fast);
      white-space: nowrap;
      position: relative;
      overflow: hidden;
      
      &:focus-visible {
        outline: 2px solid var(--color-primary);
        outline-offset: 2px;
      }
      
      &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
      
      &:not(:disabled):active {
        transform: scale(0.98);
      }
    }
    
    /* ===== Tamanhos ===== */
    .btn-sm {
      padding: 8px 14px;
      font-size: var(--font-size-sm);
      min-height: 34px;
      gap: 6px;
      
      &.icon-only {
        padding: 8px;
        min-width: 34px;
      }
    }
    
    .btn-md {
      padding: 10px 18px;
      font-size: var(--font-size-base);
      min-height: 42px;
      
      &.icon-only {
        padding: 10px;
        min-width: 42px;
      }
    }
    
    .btn-lg {
      padding: 14px 24px;
      font-size: var(--font-size-lg);
      min-height: 50px;
      
      &.icon-only {
        padding: 14px;
        min-width: 50px;
      }
    }
    
    /* ===== Variantes ===== */
    .btn-primary {
      background: var(--bg-gradient-primary);
      color: var(--color-primary-contrast);
      box-shadow: var(--shadow-sm), inset 0 1px 0 rgba(255, 255, 255, 0.1);
      
      &:hover:not(:disabled) {
        box-shadow: var(--shadow-primary), inset 0 1px 0 rgba(255, 255, 255, 0.1);
        filter: brightness(1.05);
      }
    }
    
    .btn-secondary {
      background: linear-gradient(135deg, var(--color-secondary) 0%, var(--color-secondary-dark) 100%);
      color: white;
      
      &:hover:not(:disabled) {
        filter: brightness(1.05);
      }
    }
    
    .btn-success {
      background: linear-gradient(135deg, var(--color-success) 0%, var(--color-success-dark) 100%);
      color: white;
      
      &:hover:not(:disabled) {
        box-shadow: var(--shadow-success);
      }
    }
    
    .btn-warning {
      background: linear-gradient(135deg, var(--color-warning) 0%, var(--color-warning-dark) 100%);
      color: white;
      
      &:hover:not(:disabled) {
        filter: brightness(1.05);
      }
    }
    
    .btn-danger {
      background: linear-gradient(135deg, var(--color-danger) 0%, var(--color-danger-dark) 100%);
      color: white;
      
      &:hover:not(:disabled) {
        box-shadow: var(--shadow-danger);
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
        background-color: var(--color-surface-variant);
      }
    }
    
    /* Ghost Light - para uso em headers escuros */
    .btn-ghost-light {
      background-color: transparent;
      color: rgba(255, 255, 255, 0.9);
      
      &:hover:not(:disabled) {
        background-color: rgba(255, 255, 255, 0.1);
        color: white;
      }
      
      &:focus-visible {
        outline-color: rgba(255, 255, 255, 0.5);
      }
    }
    
    .btn-link {
      background-color: transparent;
      color: var(--color-primary);
      padding: 0;
      min-height: auto;
      font-weight: var(--font-weight-medium);
      
      &:hover:not(:disabled) {
        text-decoration: underline;
      }
    }
    
    /* ===== Full width ===== */
    .btn-block {
      width: 100%;
    }
    
    /* ===== Loading ===== */
    .button-spinner {
      display: inline-flex;
      
      .animate-spin {
        animation: spin 0.8s linear infinite;
      }
    }
    
    .button-content.loading {
      opacity: 0.7;
    }
    
    /* ===== Icon Only ===== */
    .icon-only {
      .button-content {
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        white-space: nowrap;
        border: 0;
      }
    }
    
    /* Screen reader only class */
    .sr-only {
      position: absolute;
      width: 1px;
      height: 1px;
      padding: 0;
      margin: -1px;
      overflow: hidden;
      clip: rect(0, 0, 0, 0);
      white-space: nowrap;
      border: 0;
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
  @Input() icon = '';
  @Input() iconPosition: 'left' | 'right' = 'left';
  @Input() iconOnly = false;
  
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
  
  get iconSize(): number {
    const sizes: Record<ButtonSize, number> = {
      sm: 16,
      md: 18,
      lg: 20
    };
    return sizes[this.size];
  }
  
  get spinnerSize(): number {
    const sizes: Record<ButtonSize, number> = {
      sm: 14,
      md: 16,
      lg: 18
    };
    return sizes[this.size];
  }
  
  onClick(event: MouseEvent): void {
    if (!this.disabled && !this.loading) {
      this.clicked.emit(event);
    }
  }
}
