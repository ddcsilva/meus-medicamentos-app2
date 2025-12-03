import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export type CardVariant = 'default' | 'elevated' | 'outlined' | 'flat';

/**
 * Componente de card reutilizável para exibir conteúdo em containers.
 * 
 * @example
 * <app-card>
 *   <ng-container card-header>Título</ng-container>
 *   <p>Conteúdo do card</p>
 *   <ng-container card-footer>
 *     <app-button>Ação</app-button>
 *   </ng-container>
 * </app-card>
 */
@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [class]="cardClasses" [class.clickable]="clickable">
      <div class="card-header" *ngIf="hasHeader">
        <ng-content select="[card-header]"></ng-content>
      </div>
      
      <div class="card-body" [class.no-padding]="noPadding">
        <ng-content></ng-content>
      </div>
      
      <div class="card-footer" *ngIf="hasFooter">
        <ng-content select="[card-footer]"></ng-content>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
    
    .card {
      background-color: var(--color-surface);
      border-radius: var(--border-radius-lg);
      overflow: hidden;
      transition: all var(--transition-fast);
    }
    
    /* Variantes */
    .card-default {
      box-shadow: var(--shadow-sm);
    }
    
    .card-elevated {
      box-shadow: var(--shadow-md);
      
      &:hover {
        box-shadow: var(--shadow-lg);
      }
    }
    
    .card-outlined {
      border: 1px solid var(--color-border);
      box-shadow: none;
    }
    
    .card-flat {
      box-shadow: none;
      background-color: var(--color-surface-variant);
    }
    
    /* Clickable */
    .clickable {
      cursor: pointer;
      
      &:hover {
        transform: translateY(-2px);
      }
      
      &:active {
        transform: translateY(0);
      }
    }
    
    /* Header */
    .card-header {
      padding: var(--spacing-md) var(--spacing-lg);
      border-bottom: 1px solid var(--color-border-light);
      font-weight: var(--font-weight-semibold);
      font-size: var(--font-size-lg);
      color: var(--color-text-primary);
    }
    
    /* Body */
    .card-body {
      padding: var(--spacing-lg);
      
      &.no-padding {
        padding: 0;
      }
    }
    
    /* Footer */
    .card-footer {
      padding: var(--spacing-md) var(--spacing-lg);
      border-top: 1px solid var(--color-border-light);
      background-color: var(--color-surface-variant);
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: var(--spacing-sm);
    }
    
    /* Responsividade */
    @media (max-width: 639px) {
      .card-header,
      .card-footer {
        padding: var(--spacing-sm) var(--spacing-md);
      }
      
      .card-body {
        padding: var(--spacing-md);
      }
    }
  `]
})
export class CardComponent {
  @Input() variant: CardVariant = 'default';
  @Input() clickable = false;
  @Input() noPadding = false;
  @Input() hasHeader = false;
  @Input() hasFooter = false;
  
  get cardClasses(): string {
    return `card card-${this.variant}`;
  }
}

