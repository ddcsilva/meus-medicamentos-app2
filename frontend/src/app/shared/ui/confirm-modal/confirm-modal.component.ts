import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../button/button.component';
import { IconComponent } from '../icon/icon.component';

export type ConfirmModalVariant = 'danger' | 'warning' | 'info';

export interface ConfirmModalConfig {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: ConfirmModalVariant;
  icon?: string;
}

/**
 * Componente de modal de confirmação.
 * 
 * Substitui o confirm() nativo do browser com visual customizado.
 * 
 * @example
 * // No template
 * <app-confirm-modal
 *   #confirmModal
 *   [config]="{ 
 *     title: 'Excluir Medicamento', 
 *     message: 'Tem certeza?',
 *     variant: 'danger'
 *   }"
 *   (confirmed)="onConfirm()"
 *   (cancelled)="onCancel()"
 * />
 * 
 * // No componente
 * @ViewChild('confirmModal') modal!: ConfirmModalComponent;
 * 
 * excluir() {
 *   this.modal.open();
 * }
 */
@Component({
  selector: 'app-confirm-modal',
  standalone: true,
  imports: [CommonModule, ButtonComponent, IconComponent],
  template: `
    @if (isOpen()) {
      <div 
        class="modal-backdrop"
        [class.visible]="isVisible()"
        (click)="onBackdropClick($event)"
        role="dialog"
        aria-modal="true"
        [attr.aria-labelledby]="'modal-title-' + id"
      >
        <div 
          class="modal-content" 
          [class.visible]="isVisible()" 
          [class]="'modal--' + config.variant"
        >
          <!-- Ícone -->
          <div class="modal-icon">
            <app-icon [name]="config.icon || getDefaultIcon()" [size]="28" />
          </div>
          
          <!-- Header -->
          <h2 [id]="'modal-title-' + id" class="modal-title">{{ config.title }}</h2>
          <p class="modal-message">{{ config.message }}</p>
          
          <!-- Actions -->
          <div class="modal-actions">
            <app-button 
              variant="ghost" 
              (clicked)="onCancel()"
              [disabled]="loading()"
            >
              {{ config.cancelText || 'Cancelar' }}
            </app-button>
            <app-button 
              [variant]="config.variant === 'danger' ? 'danger' : 'primary'"
              (clicked)="onConfirm()"
              [loading]="loading()"
            >
              {{ config.confirmText || 'Confirmar' }}
            </app-button>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    .modal-backdrop {
      position: fixed;
      inset: 0;
      background: var(--color-overlay);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: var(--spacing-md);
      z-index: var(--z-modal);
      opacity: 0;
      transition: opacity var(--transition-normal);
      
      &.visible {
        opacity: 1;
      }
    }
    
    .modal-content {
      background: var(--color-surface);
      border-radius: var(--border-radius-xl);
      padding: var(--spacing-xl);
      max-width: 400px;
      width: 100%;
      text-align: center;
      transform: scale(0.95) translateY(10px);
      opacity: 0;
      transition: all var(--transition-normal) cubic-bezier(0.4, 0, 0.2, 1);
      box-shadow: var(--shadow-2xl);
      
      &.visible {
        transform: scale(1) translateY(0);
        opacity: 1;
      }
    }
    
    .modal-icon {
      width: 56px;
      height: 56px;
      border-radius: var(--border-radius-full);
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto var(--spacing-md);
      
      .modal--danger & {
        background: var(--color-danger-bg);
        color: var(--color-danger);
      }
      
      .modal--warning & {
        background: var(--color-warning-bg);
        color: var(--color-warning);
      }
      
      .modal--info & {
        background: var(--color-info-bg);
        color: var(--color-info);
      }
    }
    
    .modal-title {
      font-size: var(--font-size-lg);
      font-weight: var(--font-weight-semibold);
      color: var(--color-text-primary);
      margin: 0 0 var(--spacing-xs);
    }
    
    .modal-message {
      font-size: var(--font-size-sm);
      color: var(--color-text-secondary);
      margin: 0 0 var(--spacing-lg);
      line-height: var(--line-height-relaxed);
    }
    
    .modal-actions {
      display: flex;
      gap: var(--spacing-sm);
      justify-content: center;
      
      app-button {
        flex: 1;
      }
    }
    
    @media (max-width: 639px) {
      .modal-content {
        padding: var(--spacing-lg);
      }
      
      .modal-actions {
        flex-direction: column-reverse;
      }
    }
  `]
})
export class ConfirmModalComponent {
  @Input() config: ConfirmModalConfig = { title: '', message: '' };
  @Output() confirmed = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();
  
  readonly id = Math.random().toString(36).slice(2);
  readonly isOpen = signal(false);
  readonly isVisible = signal(false);
  readonly loading = signal(false);
  
  /**
   * Abre o modal com animação.
   */
  open(): void {
    this.isOpen.set(true);
    // Pequeno delay para animação
    requestAnimationFrame(() => {
      this.isVisible.set(true);
    });
  }
  
  /**
   * Fecha o modal com animação.
   */
  close(): void {
    this.isVisible.set(false);
    this.loading.set(false);
    // Aguarda animação antes de remover do DOM
    setTimeout(() => {
      this.isOpen.set(false);
    }, 250);
  }
  
  /**
   * Handler para confirmação.
   */
  onConfirm(): void {
    this.loading.set(true);
    this.confirmed.emit();
  }
  
  /**
   * Handler para cancelamento.
   */
  onCancel(): void {
    this.close();
    this.cancelled.emit();
  }
  
  /**
   * Handler para clique no backdrop.
   */
  onBackdropClick(event: MouseEvent): void {
    if (event.target === event.currentTarget && !this.loading()) {
      this.onCancel();
    }
  }
  
  /**
   * Retorna o ícone padrão para a variante.
   */
  getDefaultIcon(): string {
    const icons: Record<ConfirmModalVariant, string> = {
      danger: 'alert-triangle',
      warning: 'alert-circle',
      info: 'info'
    };
    return icons[this.config.variant || 'info'];
  }
}

