import { Component, Input, Output, EventEmitter, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';

export type InputType = 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search' | 'date';

/**
 * Componente de input reutilizável com suporte a formulários reativos.
 * 
 * @example
 * <app-input 
 *   label="E-mail" 
 *   type="email" 
 *   placeholder="Digite seu e-mail"
 *   [(ngModel)]="email"
 * ></app-input>
 */
@Component({
  selector: 'app-input',
  standalone: true,
  imports: [CommonModule, FormsModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true
    }
  ],
  template: `
    <div class="input-wrapper" [class.has-error]="error" [class.disabled]="disabled">
      <label *ngIf="label" [for]="inputId" class="input-label">
        {{ label }}
        <span *ngIf="required" class="required-mark">*</span>
      </label>
      
      <div class="input-container">
        <span *ngIf="prefixIcon" class="input-prefix">
          {{ prefixIcon }}
        </span>
        
        <input
          [id]="inputId"
          [type]="type"
          [placeholder]="placeholder"
          [disabled]="disabled"
          [readonly]="readonly"
          [required]="required"
          [value]="value"
          (input)="onInput($event)"
          (blur)="onBlur()"
          class="input-field"
          [class.has-prefix]="prefixIcon"
          [class.has-suffix]="suffixIcon"
        />
        
        <span *ngIf="suffixIcon" class="input-suffix">
          {{ suffixIcon }}
        </span>
      </div>
      
      <span *ngIf="error" class="input-error">
        {{ error }}
      </span>
      
      <span *ngIf="hint && !error" class="input-hint">
        {{ hint }}
      </span>
    </div>
  `,
  styles: [`
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
      
      &:disabled {
        background-color: var(--color-background);
        cursor: not-allowed;
        opacity: 0.7;
      }
      
      &.has-prefix {
        padding-left: calc(var(--spacing-md) + 24px);
      }
      
      &.has-suffix {
        padding-right: calc(var(--spacing-md) + 24px);
      }
    }
    
    .input-prefix,
    .input-suffix {
      position: absolute;
      color: var(--color-text-secondary);
      font-size: var(--font-size-lg);
    }
    
    .input-prefix {
      left: var(--spacing-md);
    }
    
    .input-suffix {
      right: var(--spacing-md);
    }
    
    .input-error {
      font-size: var(--font-size-sm);
      color: var(--color-danger);
    }
    
    .input-hint {
      font-size: var(--font-size-sm);
      color: var(--color-text-secondary);
    }
    
    /* Estado de erro */
    .has-error {
      .input-field {
        border-color: var(--color-danger);
        
        &:focus {
          box-shadow: 0 0 0 3px rgba(244, 67, 54, 0.1);
        }
      }
      
      .input-label {
        color: var(--color-danger);
      }
    }
    
    /* Estado desabilitado */
    .disabled {
      .input-label {
        color: var(--color-text-disabled);
      }
    }
  `]
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
  
  @Output() valueChange = new EventEmitter<string>();
  
  value = '';
  inputId = `input-${Math.random().toString(36).substr(2, 9)}`;
  
  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};
  
  onInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.value = target.value;
    this.onChange(this.value);
    this.valueChange.emit(this.value);
  }
  
  onBlur(): void {
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

