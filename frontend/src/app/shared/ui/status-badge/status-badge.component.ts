import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BadgeComponent, BadgeSize } from '../badge/badge.component';

export type StatusValidade = 'valido' | 'prestes' | 'vencido';

/**
 * Componente específico para exibir status de validade de medicamentos.
 * Mapeia automaticamente o status para a variante correta do badge.
 * 
 * @example
 * <app-status-badge status="valido"></app-status-badge>
 * <app-status-badge status="prestes"></app-status-badge>
 * <app-status-badge status="vencido"></app-status-badge>
 */
@Component({
  selector: 'app-status-badge',
  standalone: true,
  imports: [CommonModule, BadgeComponent],
  template: `
    <app-badge 
      [variant]="badgeVariant" 
      [size]="size"
      [dot]="showDot"
    >
      {{ statusLabel }}
    </app-badge>
  `,
  styles: [`
    :host {
      display: inline-flex;
    }
  `]
})
export class StatusBadgeComponent {
  @Input() status: StatusValidade = 'valido';
  @Input() size: BadgeSize = 'md';
  @Input() showDot = true;
  
  private readonly statusConfig: Record<StatusValidade, { variant: 'success' | 'warning' | 'danger'; label: string }> = {
    valido: { variant: 'success', label: 'Válido' },
    prestes: { variant: 'warning', label: 'Vencendo' },
    vencido: { variant: 'danger', label: 'Vencido' }
  };
  
  get badgeVariant(): 'success' | 'warning' | 'danger' {
    return this.statusConfig[this.status]?.variant || 'success';
  }
  
  get statusLabel(): string {
    return this.statusConfig[this.status]?.label || 'Válido';
  }
}

