import { Component, inject, signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { Router } from "@angular/router";
import { AuthService } from "../../../../core/services/auth.service";
import { NotificationService } from "../../../../core/services/notification.service";
import { ButtonComponent } from "../../../../shared/ui/button/button.component";
import { InputComponent } from "../../../../shared/ui/input/input.component";
import { ToastComponent } from "../../../../shared/ui/toast/toast.component";

/**
 * Página de login com formulário reativo.
 *
 * Funcionalidades:
 * - Formulário de e-mail e senha com validação
 * - Integração com AuthService para autenticação Firebase
 * - Feedback visual de loading e erros
 * - Redirecionamento para /medicamentos após login bem-sucedido
 */
@Component({
  selector: "app-login-page",
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonComponent,
    InputComponent,
    ToastComponent,
  ],
  template: `
    <div class="login-form-container">
      <h2>Entrar na sua conta</h2>
      <p class="login-subtitle">
        Digite suas credenciais para acessar o sistema
      </p>

      <!-- Mensagem de erro -->
      <div *ngIf="errorMessage()" class="error-alert">
        <span class="error-icon">⚠️</span>
        <span>{{ errorMessage() }}</span>
      </div>

      <!-- Formulário de login -->
      <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="login-form">
        <!-- Campo de e-mail -->
        <div class="form-field">
          <label for="email" class="form-label">
            E-mail
            <span class="required">*</span>
          </label>
          <input
            id="email"
            type="email"
            formControlName="email"
            class="form-input"
            [class.has-error]="isFieldInvalid('email')"
            placeholder="seu@email.com"
            autocomplete="email"
          />
          <span *ngIf="isFieldInvalid('email')" class="field-error">
            {{ getFieldError("email") }}
          </span>
        </div>

        <!-- Campo de senha -->
        <div class="form-field">
          <label for="password" class="form-label">
            Senha
            <span class="required">*</span>
          </label>
          <input
            id="password"
            [type]="showPassword() ? 'text' : 'password'"
            formControlName="password"
            class="form-input"
            [class.has-error]="isFieldInvalid('password')"
            placeholder="Digite sua senha"
            autocomplete="current-password"
          />
          <button
            type="button"
            class="toggle-password"
            (click)="togglePasswordVisibility()"
            tabindex="-1"
          >
            {{ showPassword() ? "🙈" : "👁️" }}
          </button>
          <span *ngIf="isFieldInvalid('password')" class="field-error">
            {{ getFieldError("password") }}
          </span>
        </div>

        <!-- Botão de submit -->
        <app-button
          type="submit"
          variant="primary"
          [block]="true"
          [loading]="isLoading()"
          [disabled]="loginForm.invalid || isLoading()"
        >
          {{ isLoading() ? "Entrando..." : "Entrar" }}
        </app-button>
      </form>

      <!-- Informações adicionais -->
      <div class="login-footer">
        <p class="help-text">
          Esqueceu a senha? Entre em contato com o administrador.
        </p>
      </div>
    </div>

    <!-- Toast Container para notificações -->
    <app-toast />
  `,
  styles: [
    `
      :host {
        display: block;
      }

      .login-form-container {
        width: 100%;
      }

      h2 {
        font-size: var(--font-size-xl);
        font-weight: var(--font-weight-semibold);
        color: var(--color-text-primary);
        margin: 0 0 var(--spacing-xs) 0;
        text-align: center;
      }

      .login-subtitle {
        font-size: var(--font-size-sm);
        color: var(--color-text-secondary);
        text-align: center;
        margin: 0 0 var(--spacing-lg) 0;
      }

      /* Alerta de erro */
      .error-alert {
        display: flex;
        align-items: center;
        gap: var(--spacing-sm);
        padding: var(--spacing-md);
        background-color: var(--color-danger-bg);
        border: 1px solid var(--color-danger-light);
        border-radius: var(--border-radius-md);
        margin-bottom: var(--spacing-lg);
        color: var(--color-vencido-text);
        font-size: var(--font-size-sm);
      }

      .error-icon {
        font-size: var(--font-size-lg);
      }

      /* Formulário */
      .login-form {
        display: flex;
        flex-direction: column;
        gap: var(--spacing-md);
      }

      .form-field {
        display: flex;
        flex-direction: column;
        gap: var(--spacing-xs);
        position: relative;
      }

      .form-label {
        font-size: var(--font-size-sm);
        font-weight: var(--font-weight-medium);
        color: var(--color-text-primary);
      }

      .required {
        color: var(--color-danger);
        margin-left: 2px;
      }

      .form-input {
        width: 100%;
        padding: var(--spacing-sm) var(--spacing-md);
        font-family: inherit;
        font-size: var(--font-size-base);
        color: var(--color-text-primary);
        background-color: var(--color-surface);
        border: 1px solid var(--color-border);
        border-radius: var(--border-radius-md);
        transition: all var(--transition-fast);

        &::placeholder {
          color: var(--color-text-hint);
        }

        &:focus {
          outline: none;
          border-color: var(--color-primary);
          box-shadow: 0 0 0 3px rgba(25, 118, 210, 0.1);
        }

        &.has-error {
          border-color: var(--color-danger);

          &:focus {
            box-shadow: 0 0 0 3px rgba(244, 67, 54, 0.1);
          }
        }
      }

      .toggle-password {
        position: absolute;
        right: var(--spacing-md);
        top: 50%;
        transform: translateY(25%);
        background: none;
        border: none;
        cursor: pointer;
        font-size: var(--font-size-base);
        padding: 0;
        opacity: 0.6;
        transition: opacity var(--transition-fast);

        &:hover {
          opacity: 1;
        }
      }

      .field-error {
        font-size: var(--font-size-xs);
        color: var(--color-danger);
      }

      /* Footer */
      .login-footer {
        margin-top: var(--spacing-lg);
        text-align: center;
      }

      .help-text {
        font-size: var(--font-size-sm);
        color: var(--color-text-secondary);
        margin: 0;
      }

      /* Responsividade */
      @media (max-width: 639px) {
        h2 {
          font-size: var(--font-size-lg);
        }
      }
    `,
  ],
})
export class LoginPageComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);
  private readonly notification = inject(NotificationService);

  // Signals para estado local
  readonly isLoading = signal(false);
  readonly errorMessage = signal<string | null>(null);
  readonly showPassword = signal(false);

  // Formulário reativo
  readonly loginForm: FormGroup = this.fb.group({
    email: ["", [Validators.required, Validators.email]],
    password: ["", [Validators.required, Validators.minLength(6)]],
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
      return "";
    }

    if (field.errors["required"]) {
      return fieldName === "email"
        ? "E-mail é obrigatório."
        : "Senha é obrigatória.";
    }

    if (field.errors["email"]) {
      return "Digite um e-mail válido.";
    }

    if (field.errors["minlength"]) {
      return `Mínimo de ${field.errors["minlength"].requiredLength} caracteres.`;
    }

    return "Campo inválido.";
  }

  /**
   * Submete o formulário de login.
   */
  async onSubmit(): Promise<void> {
    // Marca todos os campos como tocados para exibir erros
    this.loginForm.markAllAsTouched();

    if (this.loginForm.invalid) {
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);

    const { email, password } = this.loginForm.value;

    try {
      const result = await this.authService.login({ email, password });

      if (result.success) {
        // Login bem-sucedido - notifica e redireciona
        this.notification.success("Login realizado com sucesso!", {
          title: "Bem-vindo!",
          duration: 3000,
        });
        await this.router.navigate(["/medicamentos"]);
      } else {
        // Exibe mensagem de erro
        const errorMsg = result.error?.message || "Erro ao fazer login. Tente novamente.";
        this.errorMessage.set(errorMsg);
        this.notification.error(errorMsg);
      }
    } catch (error) {
      console.error("Erro inesperado no login:", error);
      const errorMsg = "Erro inesperado. Tente novamente.";
      this.errorMessage.set(errorMsg);
      this.notification.error(errorMsg);
    } finally {
      this.isLoading.set(false);
    }
  }
}
