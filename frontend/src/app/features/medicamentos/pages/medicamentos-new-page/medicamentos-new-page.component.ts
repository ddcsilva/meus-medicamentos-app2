import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { NotificationService } from '../../../../core/services/notification.service';
import { ButtonComponent } from '../../../../shared/ui/button/button.component';
import { CardComponent } from '../../../../shared/ui/card/card.component';
import { IconComponent } from '../../../../shared/ui/icon/icon.component';
import { LoadingComponent } from '../../../../shared/ui/loading/loading.component';
import { ImageUploadComponent } from '../../../../shared/ui/image-upload/image-upload.component';
import { MedicamentosStore } from '../../services/medicamentos.store';
import { CreateMedicamentoDto, TipoMedicamento } from '../../models';

/**
 * Página de cadastro de novo medicamento.
 */
@Component({
  selector: 'app-medicamentos-new-page',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    ButtonComponent,
    CardComponent,
    LoadingComponent,
    IconComponent,
    ImageUploadComponent,
  ],
  template: `
    <div class="medicamentos-new-page">
      <!-- Header -->
      <div class="page-header">
        <div class="header-nav">
          <a routerLink="/medicamentos" class="back-link">
            <app-icon name="arrow-left" [size]="16" />
            Voltar para lista
          </a>
        </div>
        <h1>
          <app-icon name="plus-circle" [size]="28" class="header-icon" />
          Novo Medicamento
        </h1>
        <p class="subtitle">Preencha os dados do medicamento</p>
      </div>

      <!-- Erro -->
      @if (store.hasError()) {
        <div class="error-alert">
          <app-icon name="alert-circle" [size]="20" />
          <span>{{ store.error()?.message }}</span>
          <app-button variant="ghost" size="sm" (clicked)="store.clearError()" icon="x" [iconOnly]="true">
            Fechar
          </app-button>
        </div>
      }

      <!-- Formulário -->
      <app-card variant="elevated">
        <form [formGroup]="form" (ngSubmit)="onSubmit()" class="form-container">
          <!-- Seção: Identificação -->
          <div class="form-section">
            <h3 class="section-title">
              <app-icon name="pill" [size]="18" />
              Identificação
            </h3>

            <div class="form-row">
              <div class="form-field">
                <label for="nome" class="form-label">
                  Nome do Medicamento <span class="required">*</span>
                </label>
                <input
                  id="nome"
                  type="text"
                  formControlName="nome"
                  class="form-input"
                  [class.has-error]="isFieldInvalid('nome')"
                  placeholder="Ex: Dipirona 500mg"
                />
                @if (isFieldInvalid('nome')) {
                  <span class="field-error">{{ getFieldError('nome') }}</span>
                }
              </div>
            </div>

            <div class="form-row two-cols">
              <div class="form-field">
                <label for="droga" class="form-label">
                  Princípio Ativo / Droga <span class="required">*</span>
                </label>
                <input
                  id="droga"
                  type="text"
                  formControlName="droga"
                  class="form-input"
                  [class.has-error]="isFieldInvalid('droga')"
                  placeholder="Ex: Dipirona Sódica"
                />
                @if (isFieldInvalid('droga')) {
                  <span class="field-error">{{ getFieldError('droga') }}</span>
                }
              </div>

              <div class="form-field">
                <label class="form-label">É Genérico?</label>
                <div class="checkbox-wrapper">
                  <input
                    id="generico"
                    type="checkbox"
                    formControlName="generico"
                    class="form-checkbox"
                  />
                  <label for="generico" class="checkbox-label">
                    Sim, é medicamento genérico
                  </label>
                </div>
              </div>
            </div>
          </div>

          <!-- Seção: Detalhes -->
          <div class="form-section">
            <h3 class="section-title">
              <app-icon name="info" [size]="18" />
              Detalhes
            </h3>

            <div class="form-row two-cols">
              <div class="form-field">
                <label for="tipo" class="form-label">
                  Tipo <span class="required">*</span>
                </label>
                <select
                  id="tipo"
                  formControlName="tipo"
                  class="form-select"
                  [class.has-error]="isFieldInvalid('tipo')"
                >
                  <option value="">Selecione...</option>
                  @for (tipo of tiposMedicamento; track tipo) {
                    <option [value]="tipo">{{ formatarTipo(tipo) }}</option>
                  }
                </select>
                @if (isFieldInvalid('tipo')) {
                  <span class="field-error">{{ getFieldError('tipo') }}</span>
                }
              </div>

              <div class="form-field">
                <label for="dosagem" class="form-label">
                  Dosagem (opcional)
                </label>
                <input
                  id="dosagem"
                  type="text"
                  formControlName="dosagem"
                  class="form-input"
                  placeholder="Ex: 500mg"
                />
                <span class="field-hint">
                  Concentração ou dose do medicamento
                </span>
              </div>
            </div>

            <div class="form-row two-cols">
              <div class="form-field">
                <label for="validade" class="form-label">
                  Data de Validade <span class="required">*</span>
                </label>
                <input
                  id="validade"
                  type="date"
                  formControlName="validade"
                  class="form-input"
                  [class.has-error]="isFieldInvalid('validade')"
                />
                @if (isFieldInvalid('validade')) {
                  <span class="field-error">{{ getFieldError('validade') }}</span>
                }
              </div>

              <div class="form-field">
                <label for="marca" class="form-label">
                  Marca (opcional)
                </label>
                <input
                  id="marca"
                  type="text"
                  formControlName="marca"
                  class="form-input"
                  placeholder="Ex: Medley"
                />
                <span class="field-hint">
                  Nome da marca do fabricante
                </span>
              </div>
            </div>

            <div class="form-row">
              <div class="form-field">
                <app-image-upload
                  label="Foto do Medicamento (opcional)"
                  hint="Tire uma foto da caixa para facilitar a identificação"
                  (fileSelected)="onImageSelected($event)"
                  (fileRemoved)="onImageRemoved()"
                />
              </div>
            </div>
          </div>

          <!-- Seção: Quantidade -->
          <div class="form-section">
            <h3 class="section-title">
              <app-icon name="hash" [size]="18" />
              Quantidade
            </h3>

            <div class="form-row two-cols">
              <div class="form-field">
                <label for="quantidadeTotal" class="form-label">
                  Quantidade Total <span class="required">*</span>
                </label>
                <input
                  id="quantidadeTotal"
                  type="number"
                  formControlName="quantidadeTotal"
                  class="form-input"
                  [class.has-error]="isFieldInvalid('quantidadeTotal')"
                  min="1"
                  placeholder="Ex: 20"
                />
                <span class="field-hint">
                  Quantidade total na embalagem/caixa
                </span>
                @if (isFieldInvalid('quantidadeTotal')) {
                  <span class="field-error">{{ getFieldError('quantidadeTotal') }}</span>
                }
              </div>

              <div class="form-field">
                <label for="quantidadeAtual" class="form-label">
                  Quantidade Atual <span class="required">*</span>
                </label>
                <input
                  id="quantidadeAtual"
                  type="number"
                  formControlName="quantidadeAtual"
                  class="form-input"
                  [class.has-error]="isFieldInvalid('quantidadeAtual')"
                  min="0"
                  placeholder="Ex: 20"
                />
                <span class="field-hint">
                  Quantidade disponível no momento
                </span>
                @if (isFieldInvalid('quantidadeAtual')) {
                  <span class="field-error">{{ getFieldError('quantidadeAtual') }}</span>
                }
              </div>
            </div>
          </div>

          <!-- Seção: Observações -->
          <div class="form-section">
            <h3 class="section-title">
              <app-icon name="file-text" [size]="18" />
              Observações
            </h3>

            <div class="form-row">
              <div class="form-field">
                <label for="observacoes" class="form-label">
                  Observações (opcional)
                </label>
                <textarea
                  id="observacoes"
                  formControlName="observacoes"
                  class="form-textarea"
                  rows="3"
                  placeholder="Ex: Tomar após as refeições, armazenar em local fresco..."
                ></textarea>
              </div>
            </div>
          </div>

          <!-- Ações -->
          <div class="form-actions">
            <app-button
              type="button"
              variant="ghost"
              routerLink="/medicamentos"
              icon="x"
            >
              Cancelar
            </app-button>
            <app-button
              type="submit"
              variant="primary"
              [loading]="store.loading()"
              [disabled]="form.invalid || store.loading()"
              icon="check"
            >
              {{ store.loading() ? 'Salvando...' : 'Salvar Medicamento' }}
            </app-button>
          </div>
        </form>
      </app-card>
    </div>
  `,
  styles: [
    `
      .medicamentos-new-page {
        padding: var(--spacing-md) 0;
        max-width: 800px;
        margin: 0 auto;
      }

      /* Header */
      .page-header {
        margin-bottom: var(--spacing-xl);
      }

      .header-nav {
        margin-bottom: var(--spacing-md);
      }

      .back-link {
        display: inline-flex;
        align-items: center;
        gap: var(--spacing-xs);
        color: var(--color-primary);
        text-decoration: none;
        font-size: var(--font-size-sm);
        font-weight: var(--font-weight-medium);
        transition: color var(--transition-fast);

        &:hover {
          color: var(--color-primary-dark);
        }
      }

      h1 {
        display: flex;
        align-items: center;
        gap: var(--spacing-sm);
        color: var(--color-text-primary);
        margin-bottom: var(--spacing-xs);
        font-size: var(--font-size-2xl);
      }

      .header-icon {
        color: var(--color-primary);
      }

      .subtitle {
        color: var(--color-text-secondary);
        margin: 0;
      }

      /* Erro */
      .error-alert {
        display: flex;
        align-items: center;
        gap: var(--spacing-sm);
        padding: var(--spacing-md);
        background-color: var(--color-danger-bg);
        border: 1px solid var(--color-danger-light);
        border-radius: var(--border-radius-lg);
        margin-bottom: var(--spacing-lg);
        color: var(--color-danger-text);
        font-size: var(--font-size-sm);

        app-icon {
          color: var(--color-danger);
          flex-shrink: 0;
        }

        span {
          flex: 1;
        }
      }

      /* Formulário */
      .form-container {
        display: flex;
        flex-direction: column;
        gap: var(--spacing-xl);
      }

      .form-section {
        display: flex;
        flex-direction: column;
        gap: var(--spacing-md);
      }

      .section-title {
        display: flex;
        align-items: center;
        gap: var(--spacing-sm);
        font-size: var(--font-size-base);
        font-weight: var(--font-weight-semibold);
        color: var(--color-text-primary);
        margin: 0;
        padding-bottom: var(--spacing-sm);
        border-bottom: 1px solid var(--color-border-light);

        app-icon {
          color: var(--color-primary);
        }
      }

      .form-row {
        display: flex;
        flex-direction: column;
        gap: var(--spacing-md);
      }

      .form-row.two-cols {
        flex-direction: row;
        gap: var(--spacing-lg);
      }

      .form-row.two-cols .form-field {
        flex: 1;
      }

      .form-field {
        display: flex;
        flex-direction: column;
        gap: var(--spacing-xs);
      }

      .form-label {
        font-size: var(--font-size-sm);
        font-weight: var(--font-weight-medium);
        color: var(--color-text-primary);
      }

      .required {
        color: var(--color-danger);
      }

      .form-input,
      .form-select,
      .form-textarea {
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

        &.has-error {
          border-color: var(--color-danger);

          &:focus {
            box-shadow: 0 0 0 4px var(--color-danger-bg);
          }
        }
      }

      .form-select {
        cursor: pointer;
      }

      .form-textarea {
        resize: vertical;
        min-height: 100px;
      }

      .checkbox-wrapper {
        display: flex;
        align-items: center;
        gap: var(--spacing-sm);
        padding: var(--spacing-md) 0;
      }

      .form-checkbox {
        width: 20px;
        height: 20px;
        cursor: pointer;
        accent-color: var(--color-primary);
      }

      .checkbox-label {
        font-size: var(--font-size-sm);
        color: var(--color-text-secondary);
        cursor: pointer;
      }

      .field-hint {
        font-size: var(--font-size-xs);
        color: var(--color-text-hint);
      }

      .field-error {
        font-size: var(--font-size-xs);
        color: var(--color-danger);
      }

      /* Ações */
      .form-actions {
        display: flex;
        justify-content: flex-end;
        gap: var(--spacing-md);
        padding-top: var(--spacing-lg);
        border-top: 1px solid var(--color-border);
      }

      /* Responsividade */
      @media (max-width: 639px) {
        .form-row.two-cols {
          flex-direction: column;
          gap: var(--spacing-md);
        }

        .form-actions {
          flex-direction: column-reverse;
        }

        .form-actions app-button {
          width: 100%;
        }
      }
    `,
  ],
})
export class MedicamentosNewPageComponent {
  readonly store = inject(MedicamentosStore);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);
  private readonly notification = inject(NotificationService);

  /** Arquivo de imagem selecionado */
  readonly selectedImage = signal<File | null>(null);

  readonly tiposMedicamento: TipoMedicamento[] = [
    'comprimido', 'capsula', 'liquido', 'spray', 'creme',
    'pomada', 'gel', 'gotas', 'injetavel', 'outro',
  ];

  readonly form: FormGroup = this.fb.group({
    nome: ['', [Validators.required, Validators.minLength(3)]],
    droga: ['', [Validators.required, Validators.minLength(3)]],
    generico: [false],
    marca: [''],
    dosagem: [''],
    tipo: ['', [Validators.required]],
    validade: ['', [Validators.required]],
    quantidadeTotal: [null, [Validators.required, Validators.min(1)]],
    quantidadeAtual: [null, [Validators.required, Validators.min(0)]],
    observacoes: [''],
  });

  /**
   * Handler para seleção de imagem.
   */
  onImageSelected(file: File): void {
    this.selectedImage.set(file);
  }

  /**
   * Handler para remoção de imagem.
   */
  onImageRemoved(): void {
    this.selectedImage.set(null);
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.form.get(fieldName);
    return field ? field.invalid && (field.dirty || field.touched) : false;
  }

  getFieldError(fieldName: string): string {
    const field = this.form.get(fieldName);
    if (!field || !field.errors) return '';
    if (field.errors['required']) return 'Campo obrigatório.';
    if (field.errors['minlength']) {
      return `Mínimo de ${field.errors['minlength'].requiredLength} caracteres.`;
    }
    if (field.errors['min']) {
      return `Valor mínimo: ${field.errors['min'].min}.`;
    }
    return 'Campo inválido.';
  }

  formatarTipo(tipo: string): string {
    const formatMap: Record<string, string> = {
      comprimido: 'Comprimido', capsula: 'Cápsula', liquido: 'Líquido',
      spray: 'Spray', creme: 'Creme', pomada: 'Pomada', gel: 'Gel',
      gotas: 'Gotas', injetavel: 'Injetável', outro: 'Outro',
    };
    return formatMap[tipo] || tipo;
  }

  async onSubmit(): Promise<void> {
    this.form.markAllAsTouched();
    if (this.form.invalid) return;

    const dto: CreateMedicamentoDto = {
      nome: this.form.value.nome,
      droga: this.form.value.droga,
      generico: this.form.value.generico || false,
      marca: this.form.value.marca || undefined,
      dosagem: this.form.value.dosagem || undefined,
      tipo: this.form.value.tipo,
      validade: this.form.value.validade,
      quantidadeTotal: this.form.value.quantidadeTotal,
      quantidadeAtual: this.form.value.quantidadeAtual,
      observacoes: this.form.value.observacoes || undefined,
    };

    // Criar medicamento
    const medicamento = await this.store.create(dto);

    if (medicamento) {
      // Se houver imagem selecionada, fazer upload
      if (this.selectedImage()) {
        await this.store.uploadFoto(medicamento.id, this.selectedImage()!);
      }

      this.notification.success('Medicamento cadastrado com sucesso!', { title: 'Sucesso' });
      this.router.navigate(['/medicamentos']);
    } else if (this.store.error()) {
      this.notification.error(this.store.error()!.message);
    }
  }
}
