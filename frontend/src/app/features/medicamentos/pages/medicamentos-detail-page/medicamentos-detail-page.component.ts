import { Component, OnInit, inject, signal, computed } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { ButtonComponent } from "../../../../shared/ui/button/button.component";
import { CardComponent } from "../../../../shared/ui/card/card.component";
import { StatusBadgeComponent } from "../../../../shared/ui/status-badge/status-badge.component";
import { LoadingComponent } from "../../../../shared/ui/loading/loading.component";
import { QuantidadeControlComponent } from "../../components/quantidade-control/quantidade-control.component";
import { MedicamentosStore } from "../../services/medicamentos.store";
import {
  Medicamento,
  UpdateMedicamentoDto,
  TipoMedicamento,
} from "../../models";

/**
 * Página de detalhes e edição de medicamento.
 *
 * Modos:
 * - Visualização: exibe todos os dados do medicamento
 * - Edição: formulário para atualizar dados
 */
@Component({
  selector: "app-medicamentos-detail-page",
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    ButtonComponent,
    CardComponent,
    StatusBadgeComponent,
    LoadingComponent,
    QuantidadeControlComponent,
  ],
  template: `
    <div class="medicamentos-detail-page">
      <!-- Header -->
      <div class="page-header">
        <div class="header-nav">
          <a routerLink="/medicamentos" class="back-link">
            ← Voltar para lista
          </a>
        </div>
        <div class="header-content">
          <h1>{{ isEditMode() ? "Editar Medicamento" : "Detalhes do Medicamento" }}</h1>
        </div>
      </div>

      <!-- Loading -->
      <div *ngIf="store.loading() && !medicamento()" class="loading-container">
        <app-loading
          size="lg"
          text="Carregando medicamento..."
          [vertical]="true"
        ></app-loading>
      </div>

      <!-- Erro -->
      <div *ngIf="store.hasError()" class="error-alert">
        <span class="error-icon">⚠️</span>
        <span>{{ store.error()?.message }}</span>
        <app-button variant="ghost" size="sm" (click)="store.clearError()">
          Fechar
        </app-button>
      </div>

      <!-- Conteúdo -->
      <div *ngIf="medicamento()" class="content">
        <!-- Modo Visualização -->
        <app-card *ngIf="!isEditMode()" variant="elevated">
          <div class="detail-content">
            <!-- Header do medicamento -->
            <div class="detail-header">
              <div class="header-info">
                <h2 class="med-nome">{{ medicamento()!.nome }}</h2>
                <p class="med-droga">{{ medicamento()!.droga }}</p>
                <span *ngIf="medicamento()!.generico" class="med-generico">
                  Genérico
                </span>
              </div>
              <app-status-badge
                [status]="medicamento()!.statusValidade"
                size="lg"
              ></app-status-badge>
            </div>

            <!-- Informações principais -->
            <div class="info-grid">
              <div class="info-card">
                <span class="info-label">Marca</span>
                <span class="info-value">{{ medicamento()!.marca }}</span>
              </div>
              <div class="info-card">
                <span class="info-label">Laboratório</span>
                <span class="info-value">{{ medicamento()!.laboratorio }}</span>
              </div>
              <div class="info-card">
                <span class="info-label">Tipo</span>
                <span class="info-value">{{ formatarTipo(medicamento()!.tipo) }}</span>
              </div>
              <div class="info-card">
                <span class="info-label">Validade</span>
                <span class="info-value" [class.vencido]="medicamento()!.statusValidade === 'vencido'">
                  {{ formatarData(medicamento()!.validade) }}
                </span>
              </div>
            </div>

            <!-- Quantidade -->
            <div class="quantity-section">
              <h3>Quantidade em Estoque</h3>
              <div class="quantity-display-large">
                <app-quantidade-control
                  [quantidade]="medicamento()!.quantidadeAtual"
                  [quantidadeTotal]="medicamento()!.quantidadeTotal"
                  [loading]="store.isItemLoading(medicamento()!.id)"
                  [min]="0"
                  size="lg"
                  [showTotal]="true"
                  (incrementar)="incrementarRapido()"
                  (decrementar)="decrementarRapido()"
                />
                <span class="quantity-label">unidades</span>
              </div>
            </div>

            <!-- Observações -->
            <div *ngIf="medicamento()!.observacoes" class="observacoes-section">
              <h3>Observações</h3>
              <p>{{ medicamento()!.observacoes }}</p>
            </div>

            <!-- Metadados -->
            <div class="metadata-section">
              <span class="metadata-item">
                Cadastrado em: {{ formatarData(medicamento()!.criadoEm) }}
              </span>
              <span class="metadata-item">
                Última atualização: {{ formatarData(medicamento()!.atualizadoEm) }}
              </span>
            </div>

            <!-- Ações -->
            <div class="detail-actions">
              <app-button variant="outline" (click)="ativarModoEdicao()">
                Editar
              </app-button>
              <app-button
                variant="danger"
                [loading]="excluindo()"
                (click)="confirmarExclusao()"
              >
                Excluir
              </app-button>
            </div>
          </div>
        </app-card>

        <!-- Modo Edição -->
        <app-card *ngIf="isEditMode()" variant="elevated">
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
                  />
                  <span *ngIf="isFieldInvalid('quantidadeTotal')" class="field-error">
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
                  />
                  <span *ngIf="isFieldInvalid('quantidadeAtual')" class="field-error">
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
                  ></textarea>
                </div>
              </div>
            </div>

            <!-- Ações -->
            <div class="form-actions">
              <app-button type="button" variant="outline" (click)="cancelarEdicao()">
                Cancelar
              </app-button>
              <app-button
                type="submit"
                variant="primary"
                [loading]="store.loading()"
                [disabled]="form.invalid || store.loading()"
              >
                {{ store.loading() ? "Salvando..." : "Salvar Alterações" }}
              </app-button>
            </div>
          </form>
        </app-card>
      </div>

      <!-- Medicamento não encontrado -->
      <div *ngIf="!store.loading() && !medicamento() && !store.hasError()" class="not-found">
        <div class="not-found-icon">🔍</div>
        <h2>Medicamento não encontrado</h2>
        <p>O medicamento que você está procurando não existe ou foi removido.</p>
        <app-button variant="primary" routerLink="/medicamentos">
          Voltar para lista
        </app-button>
      </div>
    </div>
  `,
  styles: [
    `
      .medicamentos-detail-page {
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

        &:hover {
          text-decoration: underline;
        }
      }

      h1 {
        color: var(--color-text-primary);
        margin: 0;
      }

      /* Loading */
      .loading-container {
        display: flex;
        justify-content: center;
        padding: var(--spacing-3xl) 0;
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

      /* Detalhes */
      .detail-content {
        display: flex;
        flex-direction: column;
        gap: var(--spacing-xl);
      }

      .detail-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        gap: var(--spacing-md);
      }

      .header-info {
        display: flex;
        flex-direction: column;
        gap: var(--spacing-xs);
      }

      .med-nome {
        font-size: var(--font-size-xl);
        font-weight: var(--font-weight-bold);
        color: var(--color-text-primary);
        margin: 0;
      }

      .med-droga {
        font-size: var(--font-size-base);
        color: var(--color-text-secondary);
        margin: 0;
      }

      .med-generico {
        display: inline-block;
        font-size: var(--font-size-xs);
        color: var(--color-primary);
        background: rgba(25, 118, 210, 0.1);
        padding: 2px 8px;
        border-radius: var(--border-radius-sm);
        font-weight: var(--font-weight-medium);
      }

      .info-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: var(--spacing-md);
      }

      .info-card {
        display: flex;
        flex-direction: column;
        gap: var(--spacing-xs);
        padding: var(--spacing-md);
        background: var(--color-background);
        border-radius: var(--border-radius-md);
      }

      .info-label {
        font-size: var(--font-size-xs);
        color: var(--color-text-hint);
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }

      .info-value {
        font-size: var(--font-size-base);
        font-weight: var(--font-weight-medium);
        color: var(--color-text-primary);
      }

      .info-value.vencido {
        color: var(--color-vencido);
      }

      /* Quantidade */
      .quantity-section {
        text-align: center;
        padding: var(--spacing-lg);
        background: var(--color-background);
        border-radius: var(--border-radius-lg);
      }

      .quantity-section h3 {
        font-size: var(--font-size-sm);
        color: var(--color-text-secondary);
        margin: 0 0 var(--spacing-md) 0;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }

      .quantity-display-large {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: var(--spacing-sm);
      }

      .quantity-controls {
        display: flex;
        align-items: center;
        gap: var(--spacing-lg);
      }

      .quantity-value {
        display: flex;
        align-items: baseline;
        gap: var(--spacing-xs);
      }

      .quantity-value .current {
        font-size: 3rem;
        font-weight: var(--font-weight-bold);
        color: var(--color-text-primary);
      }

      .quantity-value .separator {
        font-size: 2rem;
        color: var(--color-text-hint);
      }

      .quantity-value .total {
        font-size: 1.5rem;
        color: var(--color-text-secondary);
      }

      .quantity-label {
        font-size: var(--font-size-sm);
        color: var(--color-text-secondary);
      }

      /* Observações */
      .observacoes-section {
        padding: var(--spacing-md);
        background: var(--color-background);
        border-radius: var(--border-radius-md);
      }

      .observacoes-section h3 {
        font-size: var(--font-size-sm);
        color: var(--color-text-secondary);
        margin: 0 0 var(--spacing-sm) 0;
        text-transform: uppercase;
      }

      .observacoes-section p {
        margin: 0;
        color: var(--color-text-primary);
        white-space: pre-wrap;
      }

      /* Metadados */
      .metadata-section {
        display: flex;
        flex-wrap: wrap;
        gap: var(--spacing-md);
        padding-top: var(--spacing-md);
        border-top: 1px solid var(--color-border-light);
      }

      .metadata-item {
        font-size: var(--font-size-xs);
        color: var(--color-text-hint);
      }

      /* Ações */
      .detail-actions {
        display: flex;
        justify-content: flex-end;
        gap: var(--spacing-md);
        padding-top: var(--spacing-lg);
        border-top: 1px solid var(--color-border);
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

        &:focus {
          outline: none;
          border-color: var(--color-primary);
          box-shadow: 0 0 0 3px rgba(25, 118, 210, 0.1);
        }

        &.has-error {
          border-color: var(--color-danger);
        }
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

      .field-error {
        font-size: var(--font-size-xs);
        color: var(--color-danger);
      }

      .form-actions {
        display: flex;
        justify-content: flex-end;
        gap: var(--spacing-md);
        padding-top: var(--spacing-lg);
        border-top: 1px solid var(--color-border);
      }

      /* Não encontrado */
      .not-found {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: var(--spacing-3xl);
        text-align: center;
      }

      .not-found-icon {
        font-size: 4rem;
        margin-bottom: var(--spacing-lg);
      }

      .not-found h2 {
        color: var(--color-text-primary);
        margin-bottom: var(--spacing-sm);
      }

      .not-found p {
        color: var(--color-text-secondary);
        margin-bottom: var(--spacing-lg);
      }

      /* Responsividade */
      @media (max-width: 639px) {
        .detail-header {
          flex-direction: column;
        }

        .info-grid {
          grid-template-columns: 1fr;
        }

        .form-row.two-cols {
          flex-direction: column;
          gap: var(--spacing-md);
        }

        .detail-actions,
        .form-actions {
          flex-direction: column-reverse;
        }

        .detail-actions app-button,
        .form-actions app-button {
          width: 100%;
        }

        .quantity-value .current {
          font-size: 2.5rem;
        }
      }
    `,
  ],
})
export class MedicamentosDetailPageComponent implements OnInit {
  readonly store = inject(MedicamentosStore);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);

  /** ID do medicamento */
  private medicamentoId: string | null = null;

  /** Modo de edição ativo */
  readonly isEditMode = signal(false);

  /** Estado de exclusão */
  readonly excluindo = signal(false);

  /** Medicamento atual (computed do store) */
  readonly medicamento = computed(() => this.store.selected());

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

  ngOnInit(): void {
    // Obtém o ID da rota
    this.route.paramMap.subscribe((params) => {
      this.medicamentoId = params.get("id");
      if (this.medicamentoId) {
        this.carregarMedicamento();
      }
    });

    // Verifica se deve iniciar em modo de edição
    this.route.queryParamMap.subscribe((params) => {
      if (params.get("editar") === "true") {
        this.isEditMode.set(true);
      }
    });
  }

  /**
   * Carrega o medicamento pelo ID.
   */
  private async carregarMedicamento(): Promise<void> {
    if (!this.medicamentoId) return;

    const medicamento = await this.store.loadById(this.medicamentoId);

    if (medicamento) {
      this.preencherFormulario(medicamento);
    }
  }

  /**
   * Preenche o formulário com os dados do medicamento.
   */
  private preencherFormulario(medicamento: Medicamento): void {
    this.form.patchValue({
      nome: medicamento.nome,
      droga: medicamento.droga,
      generico: medicamento.generico,
      marca: medicamento.marca,
      laboratorio: medicamento.laboratorio,
      tipo: medicamento.tipo,
      validade: medicamento.validade,
      quantidadeTotal: medicamento.quantidadeTotal,
      quantidadeAtual: medicamento.quantidadeAtual,
      observacoes: medicamento.observacoes || "",
    });
  }

  /**
   * Ativa o modo de edição.
   */
  ativarModoEdicao(): void {
    this.isEditMode.set(true);
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { editar: true },
      queryParamsHandling: "merge",
    });
  }

  /**
   * Cancela a edição e volta para visualização.
   */
  cancelarEdicao(): void {
    this.isEditMode.set(false);
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { editar: null },
      queryParamsHandling: "merge",
    });

    // Restaura os valores originais
    const med = this.medicamento();
    if (med) {
      this.preencherFormulario(med);
    }
  }

  /**
   * Incrementa a quantidade de forma rápida.
   */
  async incrementarRapido(): Promise<void> {
    const med = this.medicamento();
    if (!med) return;

    const result = await this.store.incrementarRapido(med.id);
    if (!result.success && result.error) {
      console.error("Erro ao incrementar:", result.error.message);
    }
  }

  /**
   * Decrementa a quantidade de forma rápida.
   */
  async decrementarRapido(): Promise<void> {
    const med = this.medicamento();
    if (!med) return;

    const result = await this.store.decrementarRapido(med.id);
    if (!result.success && result.error) {
      console.error("Erro ao decrementar:", result.error.message);
    }
  }

  /**
   * Confirma e executa a exclusão.
   */
  async confirmarExclusao(): Promise<void> {
    const med = this.medicamento();
    if (!med) return;

    const confirmado = confirm(
      `Tem certeza que deseja excluir "${med.nome}"?\n\nEsta ação não pode ser desfeita.`
    );

    if (confirmado) {
      this.excluindo.set(true);
      const sucesso = await this.store.delete(med.id);
      this.excluindo.set(false);

      if (sucesso) {
        this.router.navigate(["/medicamentos"]);
      }
    }
  }

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
   * Formata o tipo de medicamento.
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
   * Formata data ISO para exibição.
   */
  formatarData(dataISO: string): string {
    const data = new Date(dataISO);
    return data.toLocaleDateString("pt-BR");
  }

  /**
   * Submete o formulário de edição.
   */
  async onSubmit(): Promise<void> {
    this.form.markAllAsTouched();

    if (this.form.invalid || !this.medicamentoId) {
      return;
    }

    const dto: UpdateMedicamentoDto = {
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

    const medicamento = await this.store.update(this.medicamentoId, dto);

    if (medicamento) {
      this.isEditMode.set(false);
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: { editar: null },
        queryParamsHandling: "merge",
      });
    }
  }
}
