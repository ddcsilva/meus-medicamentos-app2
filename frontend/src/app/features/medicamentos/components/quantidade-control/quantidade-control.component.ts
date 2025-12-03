import { Component, EventEmitter, Input, Output } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ButtonComponent } from "../../../../shared/ui/button/button.component";

/**
 * Componente de controle de quantidade (+/-).
 *
 * Permite incrementar/decrementar a quantidade de um medicamento
 * com feedback visual de loading.
 *
 * @example
 * <app-quantidade-control
 *   [quantidade]="medicamento.quantidadeAtual"
 *   [quantidadeTotal]="medicamento.quantidadeTotal"
 *   [loading]="isLoading"
 *   [disabled]="false"
 *   (incrementar)="onIncrementar()"
 *   (decrementar)="onDecrementar()"
 * />
 */
@Component({
  selector: "app-quantidade-control",
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  template: `
    <div class="quantidade-control" [class.compact]="size === 'sm'">
      <app-button
        variant="outline"
        [size]="size"
        [disabled]="disabled || loading || quantidade === 0"
        (click)="onDecrementar()"
        class="btn-minus"
      >
        −
      </app-button>

      <div class="quantidade-display" [class.loading]="loading">
        <span *ngIf="!loading" class="quantidade-value">
          {{ quantidade }}
        </span>
        <span *ngIf="loading" class="quantidade-loading">...</span>
        <span *ngIf="showTotal && quantidadeTotal" class="quantidade-total">
          / {{ quantidadeTotal }}
        </span>
      </div>

      <app-button
        variant="outline"
        [size]="size"
        [disabled]="disabled || loading"
        (click)="onIncrementar()"
        class="btn-plus"
      >
        +
      </app-button>
    </div>
  `,
  styles: [
    `
      .quantidade-control {
        display: inline-flex;
        align-items: center;
        gap: var(--spacing-sm);
      }

      .quantidade-control.compact {
        gap: var(--spacing-xs);
      }

      .quantidade-display {
        display: flex;
        align-items: baseline;
        justify-content: center;
        min-width: 48px;
        text-align: center;
        transition: opacity var(--transition-fast);
      }

      .quantidade-control.compact .quantidade-display {
        min-width: 32px;
      }

      .quantidade-display.loading {
        opacity: 0.6;
      }

      .quantidade-value {
        font-size: var(--font-size-lg);
        font-weight: var(--font-weight-bold);
        color: var(--color-text-primary);
      }

      .quantidade-control.compact .quantidade-value {
        font-size: var(--font-size-base);
      }

      .quantidade-loading {
        font-size: var(--font-size-base);
        color: var(--color-text-hint);
      }

      .quantidade-total {
        font-size: var(--font-size-sm);
        color: var(--color-text-secondary);
        margin-left: 2px;
      }

      .quantidade-control.compact .quantidade-total {
        font-size: var(--font-size-xs);
      }
    `,
  ],
})
export class QuantidadeControlComponent {
  /** Quantidade atual */
  @Input() quantidade: number = 0;

  /** Quantidade total (para exibição opcional) */
  @Input() quantidadeTotal?: number;

  /** Se está em loading */
  @Input() loading: boolean = false;

  /** Se está desabilitado */
  @Input() disabled: boolean = false;

  /** Tamanho do componente */
  @Input() size: "sm" | "md" | "lg" = "md";

  /** Se deve mostrar o total */
  @Input() showTotal: boolean = false;

  /** Evento emitido ao incrementar */
  @Output() incrementar = new EventEmitter<void>();

  /** Evento emitido ao decrementar */
  @Output() decrementar = new EventEmitter<void>();

  onIncrementar(): void {
    if (!this.disabled && !this.loading) {
      this.incrementar.emit();
    }
  }

  onDecrementar(): void {
    if (!this.disabled && !this.loading && this.quantidade > 0) {
      this.decrementar.emit();
    }
  }
}

