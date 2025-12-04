import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { ButtonComponent } from '../../../../shared/ui/button/button.component';

/**
 * Evento emitido ao alterar quantidade.
 */
export interface QuantidadeChangeEvent {
  /** Nova quantidade desejada */
  novaQuantidade: number;
  /** Quantidade anterior */
  quantidadeAnterior: number;
  /** Tipo de operação */
  operacao: 'incrementar' | 'decrementar';
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
  selector: 'app-quantidade-control',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  templateUrl: './quantidade-control.component.html',
  styleUrls: ['./quantidade-control.component.scss'],
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
  @Input() size: 'sm' | 'md' | 'lg' = 'md';

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
  readonly errorMessage = signal<string>('');

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
    return this.disabled || this.loading || this.displayQuantidade <= this.min;
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
      operacao: 'incrementar',
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
      operacao: 'decrementar',
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
      this.errorMessage.set('');
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
