import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../../core/services/theme.service';
import { IconComponent } from '../icon/icon.component';

/**
 * Componente de toggle para alternar entre temas light e dark.
 * 
 * Exibe ícone de sol/lua com animação suave de transição.
 * 
 * @example
 * <app-theme-toggle />
 */
@Component({
  selector: 'app-theme-toggle',
  standalone: true,
  imports: [CommonModule, IconComponent],
  template: `
    <button
      type="button"
      class="theme-toggle"
      [class.dark]="themeService.isDark()"
      (click)="themeService.toggle()"
      [attr.aria-label]="themeService.isDark() ? 'Ativar modo claro' : 'Ativar modo escuro'"
      [attr.title]="themeService.isDark() ? 'Modo claro' : 'Modo escuro'"
    >
      <span class="toggle-track">
        <span class="toggle-icons">
          <app-icon name="sun" [size]="14" class="icon-sun" />
          <app-icon name="moon" [size]="14" class="icon-moon" />
        </span>
        <span class="toggle-thumb"></span>
      </span>
    </button>
  `,
  styles: [`
    .theme-toggle {
      position: relative;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 0;
      background: transparent;
      border: none;
      cursor: pointer;
      border-radius: var(--border-radius-full);
      transition: transform var(--transition-fast);
      
      &:hover {
        transform: scale(1.05);
      }
      
      &:active {
        transform: scale(0.95);
      }
      
      &:focus-visible {
        outline: 2px solid var(--color-primary);
        outline-offset: 2px;
      }
    }
    
    .toggle-track {
      position: relative;
      width: 52px;
      height: 28px;
      background: var(--color-surface-variant);
      border-radius: var(--border-radius-full);
      padding: 3px;
      transition: background-color var(--transition-normal);
      border: 1px solid var(--color-border);
    }
    
    .dark .toggle-track {
      background: var(--color-surface-variant);
      border-color: var(--color-border);
    }
    
    .toggle-icons {
      position: absolute;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 7px;
      pointer-events: none;
    }
    
    .icon-sun {
      color: var(--color-warning);
      opacity: 1;
      transition: opacity var(--transition-fast);
    }
    
    .icon-moon {
      color: var(--color-secondary);
      opacity: 0.4;
      transition: opacity var(--transition-fast);
    }
    
    .dark .icon-sun {
      opacity: 0.4;
    }
    
    .dark .icon-moon {
      opacity: 1;
    }
    
    .toggle-thumb {
      position: absolute;
      top: 3px;
      left: 3px;
      width: 22px;
      height: 22px;
      background: var(--color-surface);
      border-radius: var(--border-radius-full);
      box-shadow: var(--shadow-sm);
      transition: transform var(--transition-normal) cubic-bezier(0.68, -0.55, 0.265, 1.55);
    }
    
    .dark .toggle-thumb {
      transform: translateX(24px);
      background: var(--color-text-primary);
    }
  `]
})
export class ThemeToggleComponent {
  readonly themeService = inject(ThemeService);
}

