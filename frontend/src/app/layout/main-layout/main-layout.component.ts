import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ButtonComponent } from '../../shared/ui/button/button.component';
import { ToastComponent } from '../../shared/ui/toast/toast.component';

/**
 * Layout principal da aplicação para rotas autenticadas.
 * Contém header, sidebar (se necessário) e área de conteúdo.
 */
@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, ToastComponent, ButtonComponent],
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss'],
})
export class MainLayoutComponent {
  readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  async logout(): Promise<void> {
    const result = await this.authService.logout();
    if (result.success) {
      await this.router.navigate(['/auth/login']);
    }
  }
}
