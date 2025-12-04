import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ButtonComponent } from '../../../../shared/ui/button/button.component';
import { CardComponent } from '../../../../shared/ui/card/card.component';
import { StatusBadgeComponent } from '../../../../shared/ui/status-badge/status-badge.component';
import { Medicamento } from '../../models';
import { QuantidadeControlComponent } from '../quantidade-control/quantidade-control.component';

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
  selector: 'app-medicamento-card',
  standalone: true,
  imports: [CommonModule, CardComponent, StatusBadgeComponent, ButtonComponent, QuantidadeControlComponent],
  templateUrl: './medicamento-card.component.html',
  styleUrls: ['./medicamento-card.component.scss'],
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
      comprimido: 'Comprimido',
      capsula: 'Cápsula',
      liquido: 'Líquido',
      spray: 'Spray',
      creme: 'Creme',
      pomada: 'Pomada',
      gel: 'Gel',
      gotas: 'Gotas',
      injetavel: 'Injetável',
      outro: 'Outro',
    };
    return formatMap[tipo] || tipo;
  }

  /**
   * Formata data ISO para exibição.
   */
  formatarData(dataISO: string): string {
    const data = new Date(dataISO);
    return data.toLocaleDateString('pt-BR');
  }
}
