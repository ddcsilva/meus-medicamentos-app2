import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, inject, signal, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NotificationService } from '../../../../core/services/notification.service';
import { ButtonComponent } from '../../../../shared/ui/button/button.component';
import { CardComponent } from '../../../../shared/ui/card/card.component';
import { IconComponent } from '../../../../shared/ui/icon/icon.component';
import { LoadingComponent } from '../../../../shared/ui/loading/loading.component';
import { StatusBadgeComponent } from '../../../../shared/ui/status-badge/status-badge.component';
import { ConfirmModalComponent, ConfirmModalConfig } from '../../../../shared/ui/confirm-modal/confirm-modal.component';
import { ImageUploadComponent } from '../../../../shared/ui/image-upload/image-upload.component';
import { QuantidadeControlComponent } from '../../components/quantidade-control/quantidade-control.component';
import {
  Medicamento,
  TipoMedicamento,
  UpdateMedicamentoDto,
} from '../../models';
import { MedicamentosStore } from '../../services/medicamentos.store';

/**
 * Página de detalhes e edição de medicamento.
 */
@Component({
  selector: 'app-medicamentos-detail-page',
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
    IconComponent,
    ConfirmModalComponent,
    ImageUploadComponent,
  ],
  template: `
    <div class="medicamentos-detail-page">
      <!-- Header -->
      <div class="page-header">
        <div class="header-nav">
          <a routerLink="/medicamentos" class="back-link">
            <app-icon name="arrow-left" [size]="16" />
            Voltar para lista
          </a>
        </div>
        <div class="header-content">
          <h1>
            <app-icon [name]="isEditMode() ? 'edit-2' : 'pill'" [size]="28" class="header-icon" />
            {{ isEditMode() ? 'Editar Medicamento' : 'Detalhes do Medicamento' }}
          </h1>
        </div>
      </div>

      <!-- Loading -->
      @if (store.loading() && !medicamento()) {
        <div class="loading-container">
          <app-loading
            size="lg"
            text="Carregando medicamento..."
            [vertical]="true"
          />
        </div>
      }

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

      <!-- Conteúdo -->
      @if (medicamento()) {
        <div class="content">
          <!-- Modo Visualização -->
          @if (!isEditMode()) {
            <app-card variant="elevated">
              <div class="detail-content">
                <!-- Imagem do medicamento (se existir) -->
                @if (medicamento()!.fotoUrl) {
                  <div class="med-image-container">
                    <img [src]="medicamento()!.fotoUrl" [alt]="medicamento()!.nome" class="med-image" />
                  </div>
                }

                <!-- Header do medicamento -->
                <div class="detail-header">
                  <div class="header-info">
                    <h2 class="med-nome">{{ medicamento()!.nome }}</h2>
                    <p class="med-droga">{{ medicamento()!.droga }}</p>
                    @if (medicamento()!.generico) {
                      <span class="med-generico">
                        <app-icon name="badge-check" [size]="12" />
                        Genérico
                      </span>
                    }
                  </div>
                  <app-status-badge [status]="medicamento()!.statusValidade" size="lg" />
                </div>

                <!-- Informações principais -->
                <div class="info-grid">
                  @if (medicamento()!.marca) {
                    <div class="info-card">
                      <app-icon name="box" [size]="18" class="info-icon" />
                      <div>
                        <span class="info-label">Marca</span>
                        <span class="info-value">{{ medicamento()!.marca }}</span>
                      </div>
                    </div>
                  }
                  <div class="info-card">
                    <app-icon name="pill" [size]="18" class="info-icon" />
                    <div>
                      <span class="info-label">Tipo</span>
                      <span class="info-value">
                        {{ formatarTipo(medicamento()!.tipo) }}
                        @if (medicamento()!.dosagem) {
                          <span class="dosagem-separator">·</span> {{ medicamento()!.dosagem }}
                        }
                      </span>
                    </div>
                  </div>
                  <div class="info-card">
                    <app-icon name="calendar" [size]="18" class="info-icon" />
                    <div>
                      <span class="info-label">Validade</span>
                      <span class="info-value" [class.vencido]="medicamento()!.statusValidade === 'vencido'">
                        {{ formatarData(medicamento()!.validade) }}
                      </span>
                    </div>
                  </div>
                </div>

                <!-- Quantidade -->
                <div class="quantity-section">
                  <h3>
                    <app-icon name="hash" [size]="16" />
                    Quantidade em Estoque
                  </h3>
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
                @if (medicamento()!.observacoes) {
                  <div class="observacoes-section">
                    <h3>
                      <app-icon name="file-text" [size]="16" />
                      Observações
                    </h3>
                    <p>{{ medicamento()!.observacoes }}</p>
                  </div>
                }

                <!-- Metadados -->
                <div class="metadata-section">
                  <span class="metadata-item">
                    <app-icon name="clock" [size]="12" />
                    Cadastrado em: {{ formatarData(medicamento()!.criadoEm) }}
                  </span>
                  <span class="metadata-item">
                    <app-icon name="refresh-cw" [size]="12" />
                    Última atualização: {{ formatarData(medicamento()!.atualizadoEm) }}
                  </span>
                </div>

                <!-- Ações -->
                <div class="detail-actions">
                  <app-button variant="outline" (clicked)="ativarModoEdicao()" icon="edit-2">
                    Editar
                  </app-button>
                  <app-button
                    variant="danger"
                    [loading]="excluindo()"
                    (clicked)="abrirModalExclusao()"
                    icon="trash-2"
                  >
                    Excluir
                  </app-button>
                </div>
              </div>
            </app-card>
          }

          <!-- Modo Edição -->
          @if (isEditMode()) {
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
                        [existingUrl]="medicamento()!.fotoUrl || null"
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
                      />
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
                      />
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
                      ></textarea>
                    </div>
                  </div>
                </div>

                <!-- Ações -->
                <div class="form-actions">
                  <app-button
                    type="button"
                    variant="ghost"
                    (clicked)="cancelarEdicao()"
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
                    {{ store.loading() ? 'Salvando...' : 'Salvar Alterações' }}
                  </app-button>
                </div>
              </form>
            </app-card>
          }
        </div>
      }

      <!-- Medicamento não encontrado -->
      @if (!store.loading() && !medicamento() && !store.hasError()) {
        <div class="not-found">
          <div class="not-found-icon">
            <app-icon name="search-x" [size]="48" />
          </div>
          <h2>Medicamento não encontrado</h2>
          <p>O medicamento que você está procurando não existe ou foi removido.</p>
          <app-button variant="primary" routerLink="/medicamentos" icon="arrow-left">
            Voltar para lista
          </app-button>
        </div>
      }

      <!-- Modal de Confirmação de Exclusão -->
      <app-confirm-modal
        #confirmModal
        [config]="deleteModalConfig"
        (confirmed)="confirmarExclusao()"
        (cancelled)="confirmModal.close()"
      />
    </div>
  `,
  styles: [
    `
      .medicamentos-detail-page {
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

      .header-content h1 {
        display: flex;
        align-items: center;
        gap: var(--spacing-sm);
        color: var(--color-text-primary);
        margin: 0;
        font-size: var(--font-size-2xl);
      }

      .header-icon {
        color: var(--color-primary);
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

      /* Detalhes */
      .detail-content {
        display: flex;
        flex-direction: column;
        gap: var(--spacing-xl);
      }

      /* Imagem do medicamento */
      .med-image-container {
        display: flex;
        justify-content: center;
        padding: var(--spacing-md);
        background: var(--color-surface-variant);
        border-radius: var(--border-radius-lg);
      }

      .med-image {
        max-width: 100%;
        max-height: 250px;
        object-fit: contain;
        border-radius: var(--border-radius-md);
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
        display: inline-flex;
        align-items: center;
        gap: 4px;
        width: fit-content;
        font-size: var(--font-size-xs);
        color: var(--color-primary);
        background: var(--color-primary-subtle);
        padding: 4px 10px;
        border-radius: var(--border-radius-full);
        font-weight: var(--font-weight-medium);
      }

      .info-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: var(--spacing-md);
      }

      .info-card {
        display: flex;
        align-items: flex-start;
        gap: var(--spacing-sm);
        padding: var(--spacing-md);
        background: var(--color-surface-variant);
        border-radius: var(--border-radius-lg);
      }

      .info-icon {
        color: var(--color-text-hint);
        margin-top: 2px;
        flex-shrink: 0;
      }

      .info-card > div {
        display: flex;
        flex-direction: column;
        gap: 2px;
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
        color: var(--color-danger);
      }

      .dosagem-separator {
        color: var(--color-text-hint);
        margin: 0 4px;
      }

      /* Quantidade */
      .quantity-section {
        text-align: center;
        padding: var(--spacing-xl);
        background: var(--color-surface-variant);
        border-radius: var(--border-radius-xl);
      }

      .quantity-section h3 {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: var(--spacing-xs);
        font-size: var(--font-size-sm);
        color: var(--color-text-secondary);
        margin: 0 0 var(--spacing-lg) 0;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }

      .quantity-display-large {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: var(--spacing-md);
      }

      .quantity-label {
        font-size: var(--font-size-sm);
        color: var(--color-text-secondary);
      }

      /* Observações */
      .observacoes-section {
        padding: var(--spacing-lg);
        background: var(--color-surface-variant);
        border-radius: var(--border-radius-lg);
      }

      .observacoes-section h3 {
        display: flex;
        align-items: center;
        gap: var(--spacing-xs);
        font-size: var(--font-size-sm);
        color: var(--color-text-secondary);
        margin: 0 0 var(--spacing-md) 0;
        text-transform: uppercase;
      }

      .observacoes-section p {
        margin: 0;
        color: var(--color-text-primary);
        white-space: pre-wrap;
        line-height: var(--line-height-relaxed);
      }

      /* Metadados */
      .metadata-section {
        display: flex;
        flex-wrap: wrap;
        gap: var(--spacing-lg);
        padding-top: var(--spacing-lg);
        border-top: 1px solid var(--color-border-light);
      }

      .metadata-item {
        display: flex;
        align-items: center;
        gap: var(--spacing-xs);
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
        display: flex;
        align-items: center;
        gap: var(--spacing-xs);
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
        width: 96px;
        height: 96px;
        border-radius: var(--border-radius-full);
        background: var(--color-surface-variant);
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: var(--spacing-lg);
        color: var(--color-text-hint);
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
      }
    `,
  ],
})
export class MedicamentosDetailPageComponent implements OnInit {
  @ViewChild('confirmModal') confirmModal!: ConfirmModalComponent;

  readonly store = inject(MedicamentosStore);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);
  private readonly notification = inject(NotificationService);

  private medicamentoId: string | null = null;
  readonly isEditMode = signal(false);
  readonly excluindo = signal(false);
  readonly medicamento = computed(() => this.store.selected());

  /** Arquivo de imagem selecionado */
  readonly selectedImage = signal<File | null>(null);

  /** Flag para indicar que a imagem existente foi removida */
  readonly imageRemoved = signal(false);

  readonly deleteModalConfig: ConfirmModalConfig = {
    title: 'Excluir Medicamento',
    message: 'Tem certeza que deseja excluir este medicamento? Esta ação não pode ser desfeita.',
    confirmText: 'Excluir',
    cancelText: 'Cancelar',
    variant: 'danger',
    icon: 'trash-2'
  };

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

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.medicamentoId = params.get('id');
      if (this.medicamentoId) {
        this.carregarMedicamento();
      }
    });

    this.route.queryParamMap.subscribe((params) => {
      if (params.get('editar') === 'true') {
        this.isEditMode.set(true);
      }
    });
  }

  private async carregarMedicamento(): Promise<void> {
    if (!this.medicamentoId) return;
    const medicamento = await this.store.loadById(this.medicamentoId);
    if (medicamento) {
      this.preencherFormulario(medicamento);
      this.deleteModalConfig.message = `Tem certeza que deseja excluir "${medicamento.nome}"? Esta ação não pode ser desfeita.`;
    }
  }

  private preencherFormulario(medicamento: Medicamento): void {
    this.form.patchValue({
      nome: medicamento.nome,
      droga: medicamento.droga,
      generico: medicamento.generico,
      marca: medicamento.marca || '',
      dosagem: medicamento.dosagem || '',
      tipo: medicamento.tipo,
      validade: medicamento.validade,
      quantidadeTotal: medicamento.quantidadeTotal,
      quantidadeAtual: medicamento.quantidadeAtual,
      observacoes: medicamento.observacoes || '',
    });
  }

  /**
   * Handler para seleção de imagem.
   */
  onImageSelected(file: File): void {
    this.selectedImage.set(file);
    this.imageRemoved.set(false);
  }

  /**
   * Handler para remoção de imagem.
   */
  onImageRemoved(): void {
    this.selectedImage.set(null);
    this.imageRemoved.set(true);
  }

  ativarModoEdicao(): void {
    this.isEditMode.set(true);
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { editar: true },
      queryParamsHandling: 'merge',
    });
  }

  cancelarEdicao(): void {
    this.isEditMode.set(false);
    this.selectedImage.set(null);
    this.imageRemoved.set(false);
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { editar: null },
      queryParamsHandling: 'merge',
    });
    const med = this.medicamento();
    if (med) {
      this.preencherFormulario(med);
    }
  }

  async incrementarRapido(): Promise<void> {
    const med = this.medicamento();
    if (!med) return;
    const result = await this.store.incrementarRapido(med.id);
    if (!result.success && result.error) {
      this.notification.error(result.error.message);
    }
  }

  async decrementarRapido(): Promise<void> {
    const med = this.medicamento();
    if (!med) return;
    const result = await this.store.decrementarRapido(med.id);
    if (!result.success && result.error) {
      this.notification.error(result.error.message);
    }
  }

  abrirModalExclusao(): void {
    this.confirmModal.open();
  }

  async confirmarExclusao(): Promise<void> {
    const med = this.medicamento();
    if (!med) return;

    this.excluindo.set(true);
    const sucesso = await this.store.delete(med.id);
    this.excluindo.set(false);
    this.confirmModal.close();

    if (sucesso) {
      this.notification.success('Medicamento excluído com sucesso!');
      this.router.navigate(['/medicamentos']);
    } else if (this.store.error()) {
      this.notification.error(this.store.error()!.message);
    }
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

  formatarData(dataISO: string): string {
    const data = new Date(dataISO);
    return data.toLocaleDateString('pt-BR');
  }

  async onSubmit(): Promise<void> {
    this.form.markAllAsTouched();
    if (this.form.invalid || !this.medicamentoId) return;

    const dto: UpdateMedicamentoDto = {
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

    // Atualizar dados do medicamento
    const medicamento = await this.store.update(this.medicamentoId, dto);

    if (medicamento) {
      // Se houver nova imagem selecionada, fazer upload
      if (this.selectedImage()) {
        await this.store.uploadFoto(this.medicamentoId, this.selectedImage()!);
      }
      // Se a imagem foi removida (e não foi adicionada nova), remover do servidor
      else if (this.imageRemoved() && medicamento.fotoUrl) {
        await this.store.removeFoto(this.medicamentoId);
      }

      this.notification.success('Medicamento atualizado com sucesso!', { title: 'Sucesso' });
      this.isEditMode.set(false);
      this.selectedImage.set(null);
      this.imageRemoved.set(false);
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: { editar: null },
        queryParamsHandling: 'merge',
      });
    } else if (this.store.error()) {
      this.notification.error(this.store.error()!.message);
    }
  }
}
