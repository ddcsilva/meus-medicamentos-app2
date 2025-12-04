import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ThemeService } from '../../core/services/theme.service';
import { ButtonComponent } from '../../shared/ui/button/button.component';
import { IconComponent } from '../../shared/ui/icon/icon.component';
import { ThemeToggleComponent } from '../../shared/ui/theme-toggle/theme-toggle.component';
import { ToastComponent } from '../../shared/ui/toast/toast.component';

/**
 * Layout principal da aplicação para rotas autenticadas.
 * Features:
 * - Header com navegação e user dropdown
 * - Theme toggle
 * - Animação de entrada de página
 */
@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    CommonModule, 
    RouterOutlet, 
    RouterLink, 
    RouterLinkActive,
    ToastComponent, 
    ButtonComponent,
    IconComponent,
    ThemeToggleComponent
  ],
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss'],
})
export class MainLayoutComponent {
  readonly authService = inject(AuthService);
  readonly themeService = inject(ThemeService);
  private readonly router = inject(Router);

  /** Estado do menu de usuário */
  readonly userMenuOpen = signal(false);
  
  /** Estado do menu mobile */
  readonly mobileMenuOpen = signal(false);

  /**
   * Obtém as iniciais do usuário para o avatar.
   */
  getUserInitials(): string {
    const email = this.authService.userEmail();
    if (!email) return 'U';
    return email.charAt(0).toUpperCase();
  }

  /**
   * Alterna o menu de usuário.
   */
  toggleUserMenu(): void {
    this.userMenuOpen.update(v => !v);
  }

  /**
   * Fecha o menu de usuário.
   */
  closeUserMenu(): void {
    this.userMenuOpen.set(false);
  }

  /**
   * Alterna o menu mobile.
   */
  toggleMobileMenu(): void {
    this.mobileMenuOpen.update(v => !v);
  }

  /**
   * Realiza o logout.
   */
  async logout(): Promise<void> {
    this.closeUserMenu();
    const result = await this.authService.logout();
    if (result.success) {
      await this.router.navigate(['/auth/login']);
    }
  }
}
