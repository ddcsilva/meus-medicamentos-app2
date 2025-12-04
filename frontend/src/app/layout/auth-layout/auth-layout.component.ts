import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { IconComponent } from '../../shared/ui/icon/icon.component';
import { ThemeToggleComponent } from '../../shared/ui/theme-toggle/theme-toggle.component';
import { ThemeService } from '../../core/services/theme.service';

/**
 * Layout para páginas de autenticação (login, registro).
 * Design moderno com split-screen: ilustração animada + formulário.
 */
@Component({
  selector: 'app-auth-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, IconComponent, ThemeToggleComponent],
  templateUrl: './auth-layout.component.html',
  styleUrls: ['./auth-layout.component.scss'],
})
export class AuthLayoutComponent {
  readonly themeService = inject(ThemeService);
}
