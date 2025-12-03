import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export type BadgeVariant = 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info';
export type BadgeSize = 'sm' | 'md' | 'lg';

/**
 * Componente de badge para exibir status, contadores ou labels.
 * 
 * @example
 * <app-badge variant="success">Válido</app-badge>
 * <app-badge variant="warning">Prestes a vencer</app-badge>
 * <app-badge variant="danger">Vencido</app-badge>
 */
@Component({
  selector: 'app-badge',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span [class]="badgeClasses">
      <span *ngIf="dot" class="badge-dot"></span>
      <ng-content></ng-content>
    </span>
  `,
  styles: [`
    :host {
      display: inline-flex;
    }
    
    span.badge {
      display: inline-flex;
      align-items: center;
      gap: var(--spacing-xs);
      font-weight: var(--font-weight-medium);
      border-radius: var(--border-radius-full);
      white-space: nowrap;
    }
    
    /* Tamanhos */
    .badge-sm {
      padding: 2px var(--spacing-sm);
      font-size: var(--font-size-xs);
    }
    
    .badge-md {
      padding: var(--spacing-xs) var(--spacing-sm);
      font-size: var(--font-size-sm);
    }
    
    .badge-lg {
      padding: var(--spacing-xs) var(--spacing-md);
      font-size: var(--font-size-base);
    }
    
    /* Variantes */
    .badge-default {
      background-color: var(--color-background);
      color: var(--color-text-secondary);
    }
    
    .badge-primary {
      background-color: var(--color-info-bg);
      color: var(--color-info-dark);
    }
    
    .badge-success {
      background-color: var(--color-success-bg);
      color: var(--color-valido-text);
    }
    
    .badge-warning {
      background-color: var(--color-warning-bg);
      color: var(--color-prestes-text);
    }
    
    .badge-danger {
      background-color: var(--color-danger-bg);
      color: var(--color-vencido-text);
    }
    
    .badge-info {
      background-color: var(--color-info-bg);
      color: var(--color-info-dark);
    }
    
    /* Dot indicator */
    .badge-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background-color: currentColor;
    }
    
    /* Pill (mais arredondado) */
    .badge-pill {
      border-radius: var(--border-radius-full);
    }
  `]
})
export class BadgeComponent {
  @Input() variant: BadgeVariant = 'default';
  @Input() size: BadgeSize = 'md';
  @Input() dot = false;
  @Input() pill = true;
  
  get badgeClasses(): string {
    const classes = [
      'badge',
      `badge-${this.variant}`,
      `badge-${this.size}`
    ];
    
    if (this.pill) {
      classes.push('badge-pill');
    }
    
    return classes.join(' ');
  }
}

