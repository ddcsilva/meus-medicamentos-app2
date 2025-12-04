import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';

/**
 * Componente wrapper para ícones Lucide.
 * 
 * Fornece uma interface consistente para usar ícones em todo o app.
 * 
 * @example
 * <app-icon name="pill" />
 * <app-icon name="eye" [size]="24" />
 * <app-icon name="check" [size]="16" [strokeWidth]="2.5" class="text-success" />
 */
@Component({
  selector: 'app-icon',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <lucide-angular
      [name]="name"
      [size]="size"
      [strokeWidth]="strokeWidth"
      [absoluteStrokeWidth]="absoluteStrokeWidth"
      [class]="className"
    />
  `,
  styles: [`
    :host {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      line-height: 0;
    }
    
    lucide-angular {
      display: inline-flex;
    }
  `]
})
export class IconComponent {
  /** Nome do ícone Lucide (ex: 'pill', 'eye', 'check') */
  @Input({ required: true }) name!: string;
  
  /** Tamanho do ícone em pixels */
  @Input() size: number = 20;
  
  /** Espessura do traço */
  @Input() strokeWidth: number = 2;
  
  /** Se true, mantém strokeWidth absoluto independente do size */
  @Input() absoluteStrokeWidth: boolean = false;
  
  /** Classes CSS adicionais */
  @Input() className: string = '';
}

