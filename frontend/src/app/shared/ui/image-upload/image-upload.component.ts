import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../icon/icon.component';
import { ButtonComponent } from '../button/button.component';

/**
 * Componente de upload de imagem com preview inline.
 *
 * Suporta:
 * - Seleção de arquivo via input ou drag & drop
 * - Preview da imagem antes do envio
 * - Exibição de imagem existente (para edição)
 * - Remoção de imagem selecionada
 * - Limite de tamanho configurável
 *
 * @example
 * <app-image-upload
 *   label="Foto do Medicamento"
 *   [existingUrl]="medicamento.fotoUrl"
 *   (fileSelected)="onFileSelected($event)"
 *   (fileRemoved)="onFileRemoved()"
 * />
 */
@Component({
  selector: 'app-image-upload',
  standalone: true,
  imports: [CommonModule, IconComponent, ButtonComponent],
  template: `
    <div class="image-upload-wrapper">
      <label *ngIf="label" class="upload-label">
        {{ label }}
        <span *ngIf="required" class="required-mark">*</span>
      </label>

      <div
        class="upload-container"
        [class.has-image]="hasImage()"
        [class.is-dragging]="isDragging()"
        [class.has-error]="error"
        (dragover)="onDragOver($event)"
        (dragleave)="onDragLeave($event)"
        (drop)="onDrop($event)"
      >
        <!-- Preview da imagem -->
        @if (hasImage()) {
          <div class="image-preview">
            <img [src]="previewUrl()" [alt]="label || 'Preview da imagem'" />
            <div class="image-overlay">
              <button
                type="button"
                class="remove-btn"
                (click)="removeImage()"
                aria-label="Remover imagem"
              >
                <app-icon name="x" [size]="20" />
              </button>
            </div>
          </div>
        } @else {
          <!-- Área de upload -->
          <div class="upload-placeholder" (click)="triggerFileInput()">
            <app-icon name="image-plus" [size]="48" class="upload-icon" />
            <span class="upload-text">
              {{ isDragging() ? 'Solte a imagem aqui' : 'Clique ou arraste uma imagem' }}
            </span>
            <span class="upload-hint">
              JPG, PNG ou WebP (máx. {{ formatFileSize(maxSizeBytes) }})
            </span>
          </div>
        }

        <!-- Input file oculto -->
        <input
          #fileInput
          type="file"
          [accept]="acceptTypes"
          (change)="onFileChange($event)"
          class="file-input"
          [attr.aria-label]="label || 'Upload de imagem'"
        />
      </div>

      <!-- Erro -->
      <span *ngIf="error" class="upload-error">
        {{ error }}
      </span>

      <!-- Dica -->
      <span *ngIf="hint && !error" class="upload-hint-text">
        {{ hint }}
      </span>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }

    .image-upload-wrapper {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-xs);
    }

    .upload-label {
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-medium);
      color: var(--color-text-primary);
    }

    .required-mark {
      color: var(--color-danger);
      margin-left: 2px;
    }

    .upload-container {
      position: relative;
      border: 2px dashed var(--color-border);
      border-radius: var(--border-radius-lg);
      background-color: var(--color-surface);
      transition: all var(--transition-fast);
      overflow: hidden;
      min-height: 180px;

      &:hover:not(.has-image) {
        border-color: var(--color-primary-light);
        background-color: var(--color-primary-subtle);
      }

      &.is-dragging {
        border-color: var(--color-primary);
        background-color: var(--color-primary-subtle);
        transform: scale(1.01);
      }

      &.has-image {
        border-style: solid;
        border-color: var(--color-border);
      }

      &.has-error {
        border-color: var(--color-danger);

        &:hover {
          background-color: var(--color-danger-bg);
        }
      }
    }

    .upload-placeholder {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: var(--spacing-sm);
      padding: var(--spacing-xl);
      cursor: pointer;
      min-height: 180px;
    }

    .upload-icon {
      color: var(--color-text-hint);
      transition: color var(--transition-fast);
    }

    .upload-container:hover .upload-icon,
    .upload-container.is-dragging .upload-icon {
      color: var(--color-primary);
    }

    .upload-text {
      font-size: var(--font-size-base);
      font-weight: var(--font-weight-medium);
      color: var(--color-text-secondary);
      text-align: center;
    }

    .upload-hint {
      font-size: var(--font-size-xs);
      color: var(--color-text-hint);
      text-align: center;
    }

    .file-input {
      position: absolute;
      opacity: 0;
      width: 0;
      height: 0;
      pointer-events: none;
    }

    .image-preview {
      position: relative;
      width: 100%;
      min-height: 180px;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: var(--color-background);

      img {
        max-width: 100%;
        max-height: 300px;
        object-fit: contain;
        border-radius: var(--border-radius-md);
      }
    }

    .image-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.4);
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      transition: opacity var(--transition-fast);

      &:hover {
        opacity: 1;
      }
    }

    .remove-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 48px;
      height: 48px;
      background-color: var(--color-danger);
      color: white;
      border: none;
      border-radius: var(--border-radius-full);
      cursor: pointer;
      transition: all var(--transition-fast);

      &:hover {
        background-color: var(--color-danger-dark);
        transform: scale(1.1);
      }

      &:focus {
        outline: none;
        box-shadow: 0 0 0 3px var(--color-danger-bg);
      }
    }

    .upload-error {
      font-size: var(--font-size-xs);
      color: var(--color-danger);
    }

    .upload-hint-text {
      font-size: var(--font-size-xs);
      color: var(--color-text-hint);
    }

    /* Responsividade */
    @media (max-width: 639px) {
      .upload-placeholder {
        padding: var(--spacing-lg);
        min-height: 150px;
      }

      .image-preview {
        min-height: 150px;

        img {
          max-height: 200px;
        }
      }
    }
  `]
})
export class ImageUploadComponent {
  /** Label do campo */
  @Input() label = '';

  /** Campo obrigatório */
  @Input() required = false;

  /** URL de imagem existente (para edição) */
  @Input() existingUrl: string | null = null;

  /** Tamanho máximo em bytes (padrão: 5MB) */
  @Input() maxSizeBytes = 5 * 1024 * 1024;

  /** Tipos de arquivo aceitos */
  @Input() acceptTypes = 'image/jpeg,image/png,image/webp';

  /** Mensagem de erro */
  @Input() error = '';

  /** Dica de uso */
  @Input() hint = '';

  /** Evento emitido quando um arquivo é selecionado */
  @Output() fileSelected = new EventEmitter<File>();

  /** Evento emitido quando a imagem é removida */
  @Output() fileRemoved = new EventEmitter<void>();

  /** Estado de arrastar */
  readonly isDragging = signal(false);

  /** Arquivo selecionado */
  private selectedFile = signal<File | null>(null);

  /** URL do preview gerado localmente */
  private localPreviewUrl = signal<string | null>(null);

  /**
   * Verifica se há uma imagem para exibir (existente ou selecionada).
   */
  hasImage(): boolean {
    return !!(this.localPreviewUrl() || this.existingUrl);
  }

  /**
   * Retorna a URL do preview (local ou existente).
   */
  previewUrl(): string | null {
    return this.localPreviewUrl() || this.existingUrl;
  }

  /**
   * Abre o seletor de arquivo.
   */
  triggerFileInput(): void {
    const input = document.querySelector('.file-input') as HTMLInputElement;
    input?.click();
  }

  /**
   * Handler para mudança no input de arquivo.
   */
  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file) {
      this.processFile(file);
    }
  }

  /**
   * Handler para drag over.
   */
  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging.set(true);
  }

  /**
   * Handler para drag leave.
   */
  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging.set(false);
  }

  /**
   * Handler para drop.
   */
  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging.set(false);

    const file = event.dataTransfer?.files?.[0];
    if (file) {
      this.processFile(file);
    }
  }

  /**
   * Processa o arquivo selecionado.
   */
  private processFile(file: File): void {
    // Validar tipo
    const validTypes = this.acceptTypes.split(',').map(t => t.trim());
    if (!validTypes.includes(file.type)) {
      this.error = 'Tipo de arquivo não suportado. Use JPG, PNG ou WebP.';
      return;
    }

    // Validar tamanho
    if (file.size > this.maxSizeBytes) {
      this.error = `Arquivo muito grande. Máximo: ${this.formatFileSize(this.maxSizeBytes)}`;
      return;
    }

    // Gerar preview local
    const reader = new FileReader();
    reader.onload = (e) => {
      this.localPreviewUrl.set(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    // Armazenar arquivo e emitir evento
    this.selectedFile.set(file);
    this.fileSelected.emit(file);
    this.error = '';
  }

  /**
   * Remove a imagem selecionada.
   */
  removeImage(): void {
    this.selectedFile.set(null);
    this.localPreviewUrl.set(null);
    this.fileRemoved.emit();

    // Limpar input
    const input = document.querySelector('.file-input') as HTMLInputElement;
    if (input) {
      input.value = '';
    }
  }

  /**
   * Formata tamanho de arquivo para exibição.
   */
  formatFileSize(bytes: number): string {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  }
}

