import { Component, EventEmitter, Input, Output } from "@angular/core";
import { CommonModule } from "@angular/common";
import { CardComponent } from "../../../../shared/ui/card/card.component";
import { StatusBadgeComponent } from "../../../../shared/ui/status-badge/status-badge.component";
import { ButtonComponent } from "../../../../shared/ui/button/button.component";
import { QuantidadeControlComponent } from "../quantidade-control/quantidade-control.component";
import { Medicamento } from "../../models";

/**
 * Card de medicamento para exibição em lista.
 *
 * Exibe informações resumidas do medicamento:
 * - Nome e droga
 * - Badge de status de validade
 * - Tipo, quantidade e validade
 * - Controles de quantidade (+/-)
 * - Foto opcional
 *
 * @example
 * <app-medicamento-card
 *   [medicamento]="med"
 *   [loading]="isLoading"
 *   (click)="verDetalhes(med)"
 *   (editar)="editarMedicamento(med)"
 *   (incrementar)="incrementar(med)"
 *   (decrementar)="decrementar(med)"
 * />
 */
@Component({
  selector: "app-medicamento-card",
  standalone: true,
  imports: [
    CommonModule,
    CardComponent,
    StatusBadgeComponent,
    ButtonComponent,
    QuantidadeControlComponent,
  ],
  template: `
    <app-card
      variant="elevated"
      [clickable]="true"
      class="medicamento-card"
      (click)="onCardClick($event)"
    >
      <div class="card-content">
        <!-- Header -->
        <div class="card-header">
          <div class="header-info">
            <h3 class="med-nome">{{ medicamento.nome }}</h3>
            <p class="med-droga">{{ medicamento.droga }}</p>
            <span *ngIf="medicamento.generico" class="med-generico">
              Genérico
            </span>
          </div>
          <app-status-badge
            [status]="medicamento.statusValidade"
          ></app-status-badge>
        </div>

        <!-- Foto (se houver) -->
        <div *ngIf="medicamento.fotoUrl && showFoto" class="med-foto">
          <img [src]="medicamento.fotoUrl" [alt]="medicamento.nome" />
        </div>

        <!-- Informações -->
        <div class="med-info">
          <div class="info-item">
            <span class="info-label">Tipo</span>
            <span class="info-value">{{ formatarTipo(medicamento.tipo) }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Quantidade</span>
            <span
              class="info-value"
              [class.low-stock]="medicamento.quantidadeAtual < 5 && medicamento.quantidadeAtual > 0"
              [class.no-stock]="medicamento.quantidadeAtual === 0"
            >
              {{ medicamento.quantidadeAtual }} / {{ medicamento.quantidadeTotal }} un
            </span>
          </div>
          <div class="info-item">
            <span class="info-label">Validade</span>
            <span
              class="info-value"
              [class.vencido]="medicamento.statusValidade === 'vencido'"
            >
              {{ formatarData(medicamento.validade) }}
            </span>
          </div>
        </div>

        <!-- Ações -->
        <div class="card-actions" (click)="$event.stopPropagation()">
          <app-button variant="ghost" size="sm" (click)="onEditar()">
            Editar
          </app-button>

          <app-quantidade-control
            [quantidade]="medicamento.quantidadeAtual"
            [loading]="loading"
            size="sm"
            (incrementar)="onIncrementar()"
            (decrementar)="onDecrementar()"
          />
        </div>
      </div>
    </app-card>
  `,
  styles: [
    `
      :host {
        display: block;
      }

      .medicamento-card {
        transition: transform var(--transition-fast);
        cursor: pointer;
      }

      .medicamento-card:hover {
        transform: translateY(-2px);
      }

      .card-content {
        display: flex;
        flex-direction: column;
        gap: var(--spacing-md);
      }

      /* Header */
      .card-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        gap: var(--spacing-sm);
      }

      .header-info {
        display: flex;
        flex-direction: column;
        gap: 2px;
        flex: 1;
        min-width: 0;
      }

      .med-nome {
        font-size: var(--font-size-lg);
        font-weight: var(--font-weight-semibold);
        color: var(--color-text-primary);
        margin: 0;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .med-droga {
        font-size: var(--font-size-sm);
        color: var(--color-text-secondary);
        margin: 0;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .med-generico {
        display: inline-block;
        font-size: var(--font-size-xs);
        color: var(--color-primary);
        font-weight: var(--font-weight-medium);
      }

      /* Foto */
      .med-foto {
        width: 100%;
        height: 120px;
        border-radius: var(--border-radius-md);
        overflow: hidden;
        background: var(--color-background);
      }

      .med-foto img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      /* Informações */
      .med-info {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: var(--spacing-sm);
        padding: var(--spacing-md);
        background-color: var(--color-background);
        border-radius: var(--border-radius-md);
      }

      .info-item {
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
        font-size: var(--font-size-sm);
        font-weight: var(--font-weight-medium);
        color: var(--color-text-primary);
      }

      .info-value.low-stock {
        color: var(--color-prestes);
      }

      .info-value.no-stock {
        color: var(--color-danger);
      }

      .info-value.vencido {
        color: var(--color-vencido);
      }

      /* Ações */
      .card-actions {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-top: var(--spacing-sm);
        border-top: 1px solid var(--color-border-light);
      }

      /* Responsividade */
      @media (max-width: 639px) {
        .med-info {
          grid-template-columns: 1fr;
        }
      }
    `,
  ],
})
export class MedicamentoCardComponent {
  /** Medicamento a ser exibido */
  @Input({ required: true }) medicamento!: Medicamento;

  /** Se está em loading (para controle de quantidade) */
  @Input() loading: boolean = false;

  /** Se deve exibir a foto */
  @Input() showFoto: boolean = true;

  /** Evento emitido ao clicar no card */
  @Output() cardClick = new EventEmitter<Medicamento>();

  /** Evento emitido ao clicar em editar */
  @Output() editar = new EventEmitter<Medicamento>();

  /** Evento emitido ao incrementar quantidade */
  @Output() incrementar = new EventEmitter<Medicamento>();

  /** Evento emitido ao decrementar quantidade */
  @Output() decrementar = new EventEmitter<Medicamento>();

  onCardClick(event: Event): void {
    this.cardClick.emit(this.medicamento);
  }

  onEditar(): void {
    this.editar.emit(this.medicamento);
  }

  onIncrementar(): void {
    this.incrementar.emit(this.medicamento);
  }

  onDecrementar(): void {
    this.decrementar.emit(this.medicamento);
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
   * Formata data ISO para exibição.
   */
  formatarData(dataISO: string): string {
    const data = new Date(dataISO);
    return data.toLocaleDateString("pt-BR");
  }
}

