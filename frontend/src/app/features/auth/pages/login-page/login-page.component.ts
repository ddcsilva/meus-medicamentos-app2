import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { ButtonComponent } from '../../../../shared/ui/button/button.component';
import { ToastComponent } from '../../../../shared/ui/toast/toast.component';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ButtonComponent, ToastComponent],
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss'],
})
export class LoginPageComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);
  private readonly notification = inject(NotificationService);

  readonly isLoading = signal(false);
  readonly showPassword = signal(false);

  readonly errorMessage = computed(() => this.authService.authError()?.message ?? null);

  readonly loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  /**
   * Alterna a visibilidade da senha.
   */
  togglePasswordVisibility(): void {
    this.showPassword.update((value) => !value);
  }

  /**
   * Verifica se um campo está inválido e foi tocado.
   */
  isFieldInvalid(fieldName: string): boolean {
    const field = this.loginForm.get(fieldName);
    return field ? field.invalid && (field.dirty || field.touched) : false;
  }

  /**
   * Obtém a mensagem de erro de um campo.
   */
  getFieldError(fieldName: string): string {
    const field = this.loginForm.get(fieldName);

    if (!field || !field.errors) {
      return '';
    }

    if (field.errors['required']) {
      return fieldName === 'email' ? 'E-mail é obrigatório.' : 'Senha é obrigatória.';
    }

    if (field.errors['email']) {
      return 'Digite um e-mail válido.';
    }

    if (field.errors['minlength']) {
      return `Mínimo de ${field.errors['minlength'].requiredLength} caracteres.`;
    }

    return 'Campo inválido.';
  }

  /**
   * Submete o formulário de login.
   * O erro é gerenciado automaticamente pelo AuthService.
   */
  async onSubmit(): Promise<void> {
    this.loginForm.markAllAsTouched();

    if (this.loginForm.invalid) {
      return;
    }

    this.isLoading.set(true);
    this.authService.clearError();

    const { email, password } = this.loginForm.value;
    const result = await this.authService.login({ email, password });

    this.isLoading.set(false);

    if (result.success) {
      this.notification.success('Login realizado com sucesso!', {
        title: 'Bem-vindo!',
        duration: 3000,
      });
      await this.router.navigate(['/medicamentos']);
    }
  }
}
