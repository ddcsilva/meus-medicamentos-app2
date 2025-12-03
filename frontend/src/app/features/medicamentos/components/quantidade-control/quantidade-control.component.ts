import {
  Component,
  EventEmitter,
  Input,
  Output,
  signal,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import { ButtonComponent } from "../../../../shared/ui/button/button.component";

/**
 * Evento emitido ao alterar quantidade.
 */
export interface QuantidadeChangeEvent {
  /** Nova quantidade desejada */
  novaQuantidade: number;
  /** Quantidade anterior */
  quantidadeAnterior: number;
  /** Tipo de operação */
  operacao: "incrementar" | "decrementar";
}

/**
 * Componente de controle de quantidade (+/-).
 *
 * Permite incrementar/decrementar a quantidade de um medicamento
 * com feedback visual de loading e validação de limites.
 *
 * Características:
 * - Atualização otimista (mostra novo valor imediatamente)
 * - Feedback visual de loading
 * - Validação de limites (min: 0, max: configurável)
 * - Animação de sucesso/erro
 * - Acessibilidade (aria-labels)
 *
 * @example
 * <app-quantidade-control
 *   [quantidade]="medicamento.quantidadeAtual"
 *   [quantidadeTotal]="medicamento.quantidadeTotal"
 *   [loading]="isLoading"
 *   [min]="0"
 *   [max]="100"
 *   (quantidadeChange)="onQuantidadeChange($event)"
 *   (incrementar)="onIncrementar()"
 *   (decrementar)="onDecrementar()"
 * />
 */
@Component({
  selector: "app-quantidade-control",
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  template: `
    <div
      class="quantidade-control"
      [class.compact]="size === 'sm'"
      [class.loading]="loading"
      [class.success]="showSuccess()"
      [class.error]="showError()"
      role="group"
      [attr.aria-label]="'Controle de quantidade: ' + quantidade + ' unidades'"
    >
      <!-- Botão Decrementar -->
      <app-button
        variant="outline"
        [size]="size"
        [disabled]="isDecrementDisabled"
        (click)="onDecrementar()"
        class="btn-minus"
        aria-label="Diminuir quantidade"
      >
        <span class="btn-icon">−</span>
      </app-button>

      <!-- Display de Quantidade -->
      <div
        class="quantidade-display"
        [class.updating]="loading"
        [attr.aria-live]="loading ? 'polite' : 'off'"
      >
        <!-- Valor atual -->
        <span class="quantidade-value" [class.animating]="isAnimating()">
          {{ displayQuantidade }}
        </span>

        <!-- Total (opcional) -->
        <span *ngIf="showTotal && quantidadeTotal" class="quantidade-total">
          / {{ quantidadeTotal }}
        </span>

        <!-- Indicador de loading -->
        <span *ngIf="loading" class="loading-indicator" aria-hidden="true">
          <span class="loading-dot"></span>
          <span class="loading-dot"></span>
          <span class="loading-dot"></span>
        </span>
      </div>

      <!-- Botão Incrementar -->
      <app-button
        variant="outline"
        [size]="size"
        [disabled]="isIncrementDisabled"
        (click)="onIncrementar()"
        class="btn-plus"
        aria-label="Aumentar quantidade"
      >
        <span class="btn-icon">+</span>
      </app-button>
    </div>

    <!-- Mensagem de erro -->
    <div *ngIf="errorMessage()" class="error-message" role="alert">
      {{ errorMessage() }}
    </div>
  `,
  styles: [
    `
      :host {
        display: inline-block;
      }

      .quantidade-control {
        display: inline-flex;
        align-items: center;
        gap: var(--spacing-sm);
        transition: all var(--transition-fast);
      }

      .quantidade-control.compact {
        gap: var(--spacing-xs);
      }

      /* Estados visuais */
      .quantidade-control.loading {
        opacity: 0.85;
      }

      .quantidade-control.success {
        animation: pulse-success 0.3s ease-out;
      }

      .quantidade-control.error {
        animation: shake 0.3s ease-out;
      }

      @keyframes pulse-success {
        0% {
          transform: scale(1);
        }
        50% {
          transform: scale(1.02);
        }
        100% {
          transform: scale(1);
        }
      }

      @keyframes shake {
        0%,
        100% {
          transform: translateX(0);
        }
        25% {
          transform: translateX(-4px);
        }
        75% {
          transform: translateX(4px);
        }
      }

      /* Botões */
      .btn-icon {
        font-size: 1.2em;
        font-weight: var(--font-weight-bold);
        line-height: 1;
      }

      /* Display de quantidade */
      .quantidade-display {
        display: flex;
        align-items: baseline;
        justify-content: center;
        min-width: 56px;
        text-align: center;
        position: relative;
        transition: opacity var(--transition-fast);
      }

      .quantidade-control.compact .quantidade-display {
        min-width: 40px;
      }

      .quantidade-display.updating {
        opacity: 0.7;
      }

      .quantidade-value {
        font-size: var(--font-size-xl);
        font-weight: var(--font-weight-bold);
        color: var(--color-text-primary);
        transition: all var(--transition-fast);
      }

      .quantidade-value.animating {
        animation: value-change 0.2s ease-out;
      }

      @keyframes value-change {
        0% {
          transform: scale(1.1);
          color: var(--color-primary);
        }
        100% {
          transform: scale(1);
        }
      }

      .quantidade-control.compact .quantidade-value {
        font-size: var(--font-size-base);
      }

      .quantidade-total {
        font-size: var(--font-size-sm);
        color: var(--color-text-secondary);
        margin-left: 2px;
      }

      .quantidade-control.compact .quantidade-total {
        font-size: var(--font-size-xs);
      }

      /* Loading indicator */
      .loading-indicator {
        position: absolute;
        bottom: -8px;
        left: 50%;
        transform: translateX(-50%);
        display: flex;
        gap: 3px;
      }

      .loading-dot {
        width: 4px;
        height: 4px;
        border-radius: 50%;
        background-color: var(--color-primary);
        animation: loading-bounce 0.6s ease-in-out infinite;
      }

      .loading-dot:nth-child(2) {
        animation-delay: 0.1s;
      }

      .loading-dot:nth-child(3) {
        animation-delay: 0.2s;
      }

      @keyframes loading-bounce {
        0%,
        100% {
          opacity: 0.3;
          transform: scale(0.8);
        }
        50% {
          opacity: 1;
          transform: scale(1);
        }
      }

      /* Mensagem de erro */
      .error-message {
        font-size: var(--font-size-xs);
        color: var(--color-danger);
        margin-top: var(--spacing-xs);
        text-align: center;
        animation: fade-in 0.2s ease-out;
      }

      @keyframes fade-in {
        from {
          opacity: 0;
          transform: translateY(-4px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
    `,
  ],
})
export class QuantidadeControlComponent {
  // ========================================
  // INPUTS
  // ========================================

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

  /** Valor mínimo permitido */
  @Input() min: number = 0;

  /** Valor máximo permitido (null = sem limite) */
  @Input() max: number | null = null;

  /** Passo de incremento/decremento */
  @Input() step: number = 1;

  /** Se deve usar atualização otimista (mostra novo valor antes da confirmação) */
  @Input() optimistic: boolean = true;

  // ========================================
  // OUTPUTS
  // ========================================

  /** Evento emitido ao incrementar */
  @Output() incrementar = new EventEmitter<void>();

  /** Evento emitido ao decrementar */
  @Output() decrementar = new EventEmitter<void>();

  /** Evento emitido com detalhes da mudança */
  @Output() quantidadeChange = new EventEmitter<QuantidadeChangeEvent>();

  // ========================================
  // SIGNALS INTERNOS
  // ========================================

  /** Valor otimista (antes da confirmação da API) */
  private readonly _optimisticValue = signal<number | null>(null);

  /** Se está animando a mudança de valor */
  readonly isAnimating = signal<boolean>(false);

  /** Mensagem de erro temporária */
  readonly errorMessage = signal<string>("");

  /** Feedback visual de sucesso */
  readonly showSuccess = signal<boolean>(false);

  /** Feedback visual de erro */
  readonly showError = signal<boolean>(false);

  // ========================================
  // COMPUTED
  // ========================================

  /**
   * Valor a ser exibido (otimista ou real).
   */
  get displayQuantidade(): number {
    if (this.optimistic && this._optimisticValue() !== null) {
      return this._optimisticValue()!;
    }
    return this.quantidade;
  }

  /**
   * Verifica se o botão de decremento está desabilitado.
   */
  get isDecrementDisabled(): boolean {
    return (
      this.disabled ||
      this.loading ||
      this.displayQuantidade <= this.min
    );
  }

  /**
   * Verifica se o botão de incremento está desabilitado.
   */
  get isIncrementDisabled(): boolean {
    if (this.disabled || this.loading) {
      return true;
    }
    if (this.max !== null && this.displayQuantidade >= this.max) {
      return true;
    }
    return false;
  }

  // ========================================
  // MÉTODOS PÚBLICOS
  // ========================================

  /**
   * Executa o incremento.
   */
  onIncrementar(): void {
    if (this.isIncrementDisabled) {
      return;
    }

    const novaQuantidade = this.displayQuantidade + this.step;

    // Validar limite máximo
    if (this.max !== null && novaQuantidade > this.max) {
      this.mostrarErro(`Quantidade máxima: ${this.max}`);
      return;
    }

    // Atualização otimista
    if (this.optimistic) {
      this._optimisticValue.set(novaQuantidade);
      this.animarMudanca();
    }

    // Emitir eventos
    this.incrementar.emit();
    this.quantidadeChange.emit({
      novaQuantidade,
      quantidadeAnterior: this.quantidade,
      operacao: "incrementar",
    });
  }

  /**
   * Executa o decremento.
   */
  onDecrementar(): void {
    if (this.isDecrementDisabled) {
      return;
    }

    const novaQuantidade = Math.max(this.min, this.displayQuantidade - this.step);

    // Validar limite mínimo
    if (novaQuantidade < this.min) {
      this.mostrarErro(`Quantidade mínima: ${this.min}`);
      return;
    }

    // Atualização otimista
    if (this.optimistic) {
      this._optimisticValue.set(novaQuantidade);
      this.animarMudanca();
    }

    // Emitir eventos
    this.decrementar.emit();
    this.quantidadeChange.emit({
      novaQuantidade,
      quantidadeAnterior: this.quantidade,
      operacao: "decrementar",
    });
  }

  /**
   * Confirma a atualização (limpa valor otimista).
   * Chamado quando a API confirma a operação.
   */
  confirmarAtualizacao(): void {
    this._optimisticValue.set(null);
    this.mostrarSucesso();
  }

  /**
   * Reverte a atualização otimista.
   * Chamado quando a API retorna erro.
   */
  reverterAtualizacao(mensagemErro?: string): void {
    this._optimisticValue.set(null);
    this.mostrarErroVisual();
    if (mensagemErro) {
      this.mostrarErro(mensagemErro);
    }
  }

  // ========================================
  // MÉTODOS PRIVADOS
  // ========================================

  /**
   * Anima a mudança de valor.
   */
  private animarMudanca(): void {
    this.isAnimating.set(true);
    setTimeout(() => {
      this.isAnimating.set(false);
    }, 200);
  }

  /**
   * Mostra mensagem de erro temporária.
   */
  private mostrarErro(mensagem: string): void {
    this.errorMessage.set(mensagem);
    this.mostrarErroVisual();
    setTimeout(() => {
      this.errorMessage.set("");
    }, 3000);
  }

  /**
   * Mostra feedback visual de sucesso.
   */
  private mostrarSucesso(): void {
    this.showSuccess.set(true);
    setTimeout(() => {
      this.showSuccess.set(false);
    }, 300);
  }

  /**
   * Mostra feedback visual de erro.
   */
  private mostrarErroVisual(): void {
    this.showError.set(true);
    setTimeout(() => {
      this.showError.set(false);
    }, 300);
  }
}
