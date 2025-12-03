import { Component, inject, signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { Router, RouterLink } from "@angular/router";
import { NotificationService } from "../../../../core/services/notification.service";
import { ButtonComponent } from "../../../../shared/ui/button/button.component";
import { CardComponent } from "../../../../shared/ui/card/card.component";
import { LoadingComponent } from "../../../../shared/ui/loading/loading.component";
import { MedicamentosStore } from "../../services/medicamentos.store";
import { CreateMedicamentoDto, TipoMedicamento } from "../../models";

/**
 * Página de cadastro de novo medicamento.
 *
 * Formulário com todos os campos do PRD:
 * - Nome, droga, genérico
 * - Marca, laboratório
 * - Tipo, validade
 * - Quantidades
 * - Observações
 */
@Component({
  selector: "app-medicamentos-new-page",
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    ButtonComponent,
    CardComponent,
    LoadingComponent,
  ],
  template: `
    <div class="medicamentos-new-page">
      <!-- Header -->
      <div class="page-header">
        <div class="header-nav">
          <a routerLink="/medicamentos" class="back-link">
            ← Voltar para lista
          </a>
        </div>
        <h1>Novo Medicamento</h1>
        <p class="subtitle">Preencha os dados do medicamento</p>
      </div>

      <!-- Erro -->
      <div *ngIf="store.hasError()" class="error-alert">
        <span class="error-icon">⚠️</span>
        <span>{{ store.error()?.message }}</span>
        <app-button variant="ghost" size="sm" (click)="store.clearError()">
          Fechar
        </app-button>
      </div>

      <!-- Formulário -->
      <app-card variant="elevated">
        <form [formGroup]="form" (ngSubmit)="onSubmit()" class="form-container">
          <!-- Seção: Identificação -->
          <div class="form-section">
            <h3 class="section-title">Identificação</h3>

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
                <span *ngIf="isFieldInvalid('nome')" class="field-error">
                  {{ getFieldError("nome") }}
                </span>
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
                <span *ngIf="isFieldInvalid('droga')" class="field-error">
                  {{ getFieldError("droga") }}
                </span>
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

          <!-- Seção: Fabricante -->
          <div class="form-section">
            <h3 class="section-title">Fabricante</h3>

            <div class="form-row two-cols">
              <div class="form-field">
                <label for="marca" class="form-label">
                  Marca <span class="required">*</span>
                </label>
                <input
                  id="marca"
                  type="text"
                  formControlName="marca"
                  class="form-input"
                  [class.has-error]="isFieldInvalid('marca')"
                  placeholder="Ex: Medley"
                />
                <span *ngIf="isFieldInvalid('marca')" class="field-error">
                  {{ getFieldError("marca") }}
                </span>
              </div>

              <div class="form-field">
                <label for="laboratorio" class="form-label">
                  Laboratório <span class="required">*</span>
                </label>
                <input
                  id="laboratorio"
                  type="text"
                  formControlName="laboratorio"
                  class="form-input"
                  [class.has-error]="isFieldInvalid('laboratorio')"
                  placeholder="Ex: Sanofi"
                />
                <span *ngIf="isFieldInvalid('laboratorio')" class="field-error">
                  {{ getFieldError("laboratorio") }}
                </span>
              </div>
            </div>
          </div>

          <!-- Seção: Detalhes -->
          <div class="form-section">
            <h3 class="section-title">Detalhes</h3>

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
                  <option *ngFor="let tipo of tiposMedicamento" [value]="tipo">
                    {{ formatarTipo(tipo) }}
                  </option>
                </select>
                <span *ngIf="isFieldInvalid('tipo')" class="field-error">
                  {{ getFieldError("tipo") }}
                </span>
              </div>

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
                <span *ngIf="isFieldInvalid('validade')" class="field-error">
                  {{ getFieldError("validade") }}
                </span>
              </div>
            </div>
          </div>

          <!-- Seção: Quantidade -->
          <div class="form-section">
            <h3 class="section-title">Quantidade</h3>

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
                <span
                  *ngIf="isFieldInvalid('quantidadeTotal')"
                  class="field-error"
                >
                  {{ getFieldError("quantidadeTotal") }}
                </span>
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
                <span
                  *ngIf="isFieldInvalid('quantidadeAtual')"
                  class="field-error"
                >
                  {{ getFieldError("quantidadeAtual") }}
                </span>
              </div>
            </div>
          </div>

          <!-- Seção: Observações -->
          <div class="form-section">
            <h3 class="section-title">Observações</h3>

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
              variant="outline"
              routerLink="/medicamentos"
            >
              Cancelar
            </app-button>
            <app-button
              type="submit"
              variant="primary"
              [loading]="store.loading()"
              [disabled]="form.invalid || store.loading()"
            >
              {{ store.loading() ? "Salvando..." : "Salvar Medicamento" }}
            </app-button>
          </div>
        </form>
      </app-card>
    </div>
  `,
  styles: [
    `
      .medicamentos-new-page {
        padding: var(--spacing-lg) 0;
        max-width: 800px;
        margin: 0 auto;
      }

      /* Header */
      .page-header {
        margin-bottom: var(--spacing-lg);
      }

      .header-nav {
        margin-bottom: var(--spacing-md);
      }

      .back-link {
        color: var(--color-primary);
        text-decoration: none;
        font-size: var(--font-size-sm);
        display: inline-flex;
        align-items: center;
        gap: var(--spacing-xs);

        &:hover {
          text-decoration: underline;
        }
      }

      h1 {
        color: var(--color-text-primary);
        margin-bottom: var(--spacing-xs);
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
        border-radius: var(--border-radius-md);
        margin-bottom: var(--spacing-lg);
        color: var(--color-vencido-text);
        font-size: var(--font-size-sm);
      }

      .error-icon {
        font-size: var(--font-size-lg);
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
        font-size: var(--font-size-base);
        font-weight: var(--font-weight-semibold);
        color: var(--color-text-primary);
        margin: 0;
        padding-bottom: var(--spacing-sm);
        border-bottom: 1px solid var(--color-border-light);
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

      .form-select {
        cursor: pointer;
      }

      .form-textarea {
        resize: vertical;
        min-height: 80px;
      }

      .checkbox-wrapper {
        display: flex;
        align-items: center;
        gap: var(--spacing-sm);
        padding: var(--spacing-sm) 0;
      }

      .form-checkbox {
        width: 18px;
        height: 18px;
        cursor: pointer;
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

  /** Tipos de medicamento disponíveis */
  readonly tiposMedicamento: TipoMedicamento[] = [
    "comprimido",
    "capsula",
    "liquido",
    "spray",
    "creme",
    "pomada",
    "gel",
    "gotas",
    "injetavel",
    "outro",
  ];

  /** Formulário reativo */
  readonly form: FormGroup = this.fb.group({
    nome: ["", [Validators.required, Validators.minLength(3)]],
    droga: ["", [Validators.required, Validators.minLength(3)]],
    generico: [false],
    marca: ["", [Validators.required]],
    laboratorio: ["", [Validators.required]],
    tipo: ["", [Validators.required]],
    validade: ["", [Validators.required]],
    quantidadeTotal: [null, [Validators.required, Validators.min(1)]],
    quantidadeAtual: [null, [Validators.required, Validators.min(0)]],
    observacoes: [""],
  });

  /**
   * Verifica se um campo está inválido.
   */
  isFieldInvalid(fieldName: string): boolean {
    const field = this.form.get(fieldName);
    return field ? field.invalid && (field.dirty || field.touched) : false;
  }

  /**
   * Obtém mensagem de erro de um campo.
   */
  getFieldError(fieldName: string): string {
    const field = this.form.get(fieldName);
    if (!field || !field.errors) return "";

    if (field.errors["required"]) return "Campo obrigatório.";
    if (field.errors["minlength"]) {
      return `Mínimo de ${field.errors["minlength"].requiredLength} caracteres.`;
    }
    if (field.errors["min"]) {
      return `Valor mínimo: ${field.errors["min"].min}.`;
    }

    return "Campo inválido.";
  }

  /**
   * Formata o tipo de medicamento para exibição.
   */
  formatarTipo(tipo: string): string {
    const formatMap: Record<string, string> = {
      comprimido: "Comprimido",
      capsula: "Cápsula",
      liquido: "Líquido",
      spray: "Spray",
      creme: "Creme",
      pomada: "Pomada",
      gel: "Gel",
      gotas: "Gotas",
      injetavel: "Injetável",
      outro: "Outro",
    };
    return formatMap[tipo] || tipo;
  }

  /**
   * Submete o formulário.
   */
  async onSubmit(): Promise<void> {
    this.form.markAllAsTouched();

    if (this.form.invalid) {
      return;
    }

    const dto: CreateMedicamentoDto = {
      nome: this.form.value.nome,
      droga: this.form.value.droga,
      generico: this.form.value.generico || false,
      marca: this.form.value.marca,
      laboratorio: this.form.value.laboratorio,
      tipo: this.form.value.tipo,
      validade: this.form.value.validade,
      quantidadeTotal: this.form.value.quantidadeTotal,
      quantidadeAtual: this.form.value.quantidadeAtual,
      observacoes: this.form.value.observacoes || undefined,
    };

    const medicamento = await this.store.create(dto);

    if (medicamento) {
      this.notification.success("Medicamento cadastrado com sucesso!", {
        title: "Sucesso",
      });
      this.router.navigate(["/medicamentos"]);
    } else if (this.store.error()) {
      this.notification.error(this.store.error()!.message);
    }
  }
}
