import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  forwardRef,
  Input,
  Output,
  signal,
} from '@angular/core';
import {
  ControlValueAccessor,
  FormsModule,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';
import { IconComponent } from '../icon/icon.component';

export type InputType =
  | 'text'
  | 'email'
  | 'password'
  | 'number'
  | 'tel'
  | 'url'
  | 'search'
  | 'date';

/**
 * Componente de input reutilizável com suporte a formulários reativos.
 * 
 * Features:
 * - Toggle de visibilidade para senha
 * - Ícones prefix/suffix com Lucide
 * - Estados: focus, error, disabled
 * - Visual Soft Modern
 * - Totalmente acessível
 *
 * @example
 * <app-input
 *   label="E-mail"
 *   type="email"
 *   placeholder="Digite seu e-mail"
 *   prefixIcon="mail"
 *   [(ngModel)]="email"
 * />
 * 
 * <app-input
 *   label="Senha"
 *   type="password"
 *   [(ngModel)]="password"
 *   [error]="senhaInvalida ? 'Senha inválida' : ''"
 * />
 */
@Component({
  selector: 'app-input',
  standalone: true,
  imports: [CommonModule, FormsModule, IconComponent],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true,
    },
  ],
  template: `
    <div
      class="input-wrapper"
      [class.has-error]="error"
      [class.disabled]="disabled"
      [class.focused]="isFocused()"
    >
      <label *ngIf="label" [for]="inputId" class="input-label">
        {{ label }}
        <span *ngIf="required" class="required-mark">*</span>
      </label>

      <div class="input-container">
        <!-- Prefix Icon -->
        <span *ngIf="prefixIcon" class="input-prefix">
          <app-icon [name]="prefixIcon" [size]="18" />
        </span>

        <!-- Input Field -->
        <input
          [id]="inputId"
          [type]="computedType()"
          [placeholder]="placeholder"
          [disabled]="disabled"
          [readonly]="readonly"
          [required]="required"
          [autocomplete]="autocomplete"
          [value]="value"
          (input)="onInput($event)"
          (focus)="onFocus()"
          (blur)="onBlur()"
          class="input-field"
          [class.has-prefix]="prefixIcon"
          [class.has-suffix]="suffixIcon || type === 'password'"
        />

        <!-- Password Toggle -->
        <button
          *ngIf="type === 'password'"
          type="button"
          class="password-toggle"
          (click)="togglePasswordVisibility()"
          [attr.aria-label]="showPassword() ? 'Ocultar senha' : 'Mostrar senha'"
          tabindex="-1"
        >
          <app-icon [name]="showPassword() ? 'eye-off' : 'eye'" [size]="18" />
        </button>

        <!-- Suffix Icon (quando não é password) -->
        <span *ngIf="suffixIcon && type !== 'password'" class="input-suffix">
          <app-icon [name]="suffixIcon" [size]="18" />
        </span>
      </div>

      <!-- Error Message -->
      <span *ngIf="error" class="input-error" role="alert">
        <app-icon name="alert-circle" [size]="14" />
        {{ error }}
      </span>

      <!-- Hint -->
      <span *ngIf="hint && !error" class="input-hint">
        {{ hint }}
      </span>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
      }

      .input-wrapper {
        display: flex;
        flex-direction: column;
        gap: var(--spacing-xs);
      }

      .input-label {
        font-size: var(--font-size-sm);
        font-weight: var(--font-weight-medium);
        color: var(--color-text-primary);
        transition: color var(--transition-fast);
      }

      .required-mark {
        color: var(--color-danger);
        margin-left: 2px;
      }

      .input-container {
        position: relative;
        display: flex;
        align-items: center;
      }

      .input-field {
        width: 100%;
        padding: 12px var(--spacing-md);
        font-family: inherit;
        font-size: var(--font-size-base);
        color: var(--color-text-primary);
        background-color: var(--color-surface);
        border: 2px solid var(--color-border);
        border-radius: var(--border-radius-lg);
        transition: all var(--transition-fast);

        &::placeholder {
          color: var(--color-text-hint);
        }

        &:focus {
          outline: none;
          border-color: var(--color-primary);
          box-shadow: 0 0 0 4px var(--color-primary-subtle);
        }

        &:disabled {
          background-color: var(--color-surface-variant);
          cursor: not-allowed;
          opacity: 0.7;
        }

        &.has-prefix {
          padding-left: calc(var(--spacing-md) + 28px);
        }

        &.has-suffix {
          padding-right: calc(var(--spacing-md) + 36px);
        }
      }

      .input-prefix,
      .input-suffix {
        position: absolute;
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--color-text-hint);
        transition: color var(--transition-fast);
        pointer-events: none;
      }

      .input-prefix {
        left: var(--spacing-md);
      }

      .input-suffix {
        right: var(--spacing-md);
      }

      /* Focus state - icon color change */
      .focused {
        .input-prefix,
        .input-suffix {
          color: var(--color-primary);
        }
      }

      /* Password Toggle Button */
      .password-toggle {
        position: absolute;
        right: var(--spacing-sm);
        top: 50%;
        transform: translateY(-50%);
        display: flex;
        align-items: center;
        justify-content: center;
        width: 32px;
        height: 32px;
        padding: 0;
        background: transparent;
        border: none;
        border-radius: var(--border-radius-md);
        color: var(--color-text-hint);
        cursor: pointer;
        transition: all var(--transition-fast);

        &:hover {
          color: var(--color-text-secondary);
          background: var(--color-surface-variant);
        }

        &:focus-visible {
          outline: 2px solid var(--color-primary);
          outline-offset: 2px;
        }
      }

      /* Error message */
      .input-error {
        display: flex;
        align-items: center;
        gap: var(--spacing-xs);
        font-size: var(--font-size-xs);
        color: var(--color-danger);
        animation: slideDown 0.2s ease-out;
      }

      @keyframes slideDown {
        from {
          opacity: 0;
          transform: translateY(-4px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      .input-hint {
        font-size: var(--font-size-xs);
        color: var(--color-text-hint);
      }

      /* Error state */
      .has-error {
        .input-field {
          border-color: var(--color-danger);

          &:focus {
            box-shadow: 0 0 0 4px var(--color-danger-bg);
          }
        }

        .input-label {
          color: var(--color-danger);
        }

        .input-prefix,
        .input-suffix {
          color: var(--color-danger);
        }
      }

      /* Disabled state */
      .disabled {
        .input-label {
          color: var(--color-text-disabled);
        }

        .input-prefix,
        .input-suffix {
          color: var(--color-text-disabled);
        }
      }
    `,
  ],
})
export class InputComponent implements ControlValueAccessor {
  @Input() label = '';
  @Input() type: InputType = 'text';
  @Input() placeholder = '';
  @Input() disabled = false;
  @Input() readonly = false;
  @Input() required = false;
  @Input() error = '';
  @Input() hint = '';
  @Input() prefixIcon = '';
  @Input() suffixIcon = '';
  @Input() autocomplete = '';

  @Output() valueChange = new EventEmitter<string>();

  value = '';
  inputId = `input-${Math.random().toString(36).slice(2, 11)}`;

  /** Estado de visibilidade da senha */
  readonly showPassword = signal(false);
  
  /** Estado de foco */
  readonly isFocused = signal(false);

  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};

  /**
   * Retorna o tipo de input computado (para toggle de senha).
   */
  computedType(): InputType {
    if (this.type === 'password' && this.showPassword()) {
      return 'text';
    }
    return this.type;
  }

  /**
   * Alterna visibilidade da senha.
   */
  togglePasswordVisibility(): void {
    this.showPassword.update(v => !v);
  }

  onInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.value = target.value;
    this.onChange(this.value);
    this.valueChange.emit(this.value);
  }

  onFocus(): void {
    this.isFocused.set(true);
  }

  onBlur(): void {
    this.isFocused.set(false);
    this.onTouched();
  }

  // ControlValueAccessor
  writeValue(value: string): void {
    this.value = value || '';
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}
