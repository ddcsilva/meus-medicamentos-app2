import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonComponent } from '../../../../shared/ui/button/button.component';
import { MedicamentosFiltros, ORDENACAO_OPCOES, StatusValidade, TipoMedicamento } from '../../models';

/**
 * Barra de filtros e busca para medicamentos.
 *
 * Permite:
 * - Busca por nome, droga, marca ou laboratório
 * - Filtro por status de validade
 * - Filtro por tipo de medicamento
 * - Filtro por genérico/referência
 * - Filtro por laboratório
 * - Filtro por quantidade baixa
 * - Ordenação por diferentes campos
 *
 * @example
 * <app-medicamentos-filter-bar
 *   [filters]="currentFilters"
 *   [totalItems]="totalCount"
 *   [filteredCount]="filteredCount"
 *   [laboratorios]="laboratoriosDisponiveis"
 *   [tipos]="tiposDisponiveis"
 *   (filtersChange)="onFiltersChange($event)"
 *   (limparFiltros)="onLimparFiltros()"
 * />
 */
@Component({
  selector: 'app-medicamentos-filter-bar',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonComponent],
  templateUrl: './medicamentos-filter-bar.component.html',
  styleUrls: ['./medicamentos-filter-bar.component.scss'],
})
export class MedicamentosFilterBarComponent {
  /** Estado atual dos filtros */
  @Input() filters: MedicamentosFiltros = {};

  /** Total de itens (sem filtros) */
  @Input() totalItems: number = 0;

  /** Contagem de itens filtrados */
  @Input() filteredCount: number = 0;

  /** Lista de laboratórios disponíveis (para dropdown) */
  @Input() laboratorios: string[] = [];

  /** Lista de tipos disponíveis (para dropdown) */
  @Input() tipos: string[] = [];

  /** Evento emitido quando os filtros mudam */
  @Output() filtersChange = new EventEmitter<Partial<MedicamentosFiltros>>();

  /** Evento emitido ao limpar filtros */
  @Output() limparFiltros = new EventEmitter<void>();

  /** Se os filtros avançados estão visíveis */
  showAdvanced: boolean = false;

  /** Opções de ordenação */
  readonly ordenacaoOpcoes = ORDENACAO_OPCOES;

  /** Tipos de medicamento disponíveis */
  readonly tiposMedicamento: TipoMedicamento[] = [
    'comprimido',
    'capsula',
    'liquido',
    'spray',
    'creme',
    'pomada',
    'gel',
    'gotas',
    'injetavel',
    'outro',
  ];

  /**
   * Verifica se há filtros ativos.
   */
  get hasActiveFilters(): boolean {
    return !!(
      this.filters.busca ||
      this.filters.status ||
      this.filters.tipo ||
      (this.filters.generico !== null && this.filters.generico !== undefined) ||
      this.filters.laboratorio ||
      this.filters.quantidadeBaixa ||
      this.filters.ordenarPor
    );
  }

  onBuscaChange(busca: string): void {
    this.filtersChange.emit({ busca: busca || undefined });
  }

  onStatusChange(status: StatusValidade | null): void {
    this.filtersChange.emit({ status });
  }

  onTipoChange(tipo: string): void {
    this.filtersChange.emit({ tipo: tipo || null });
  }

  onGenericoChange(generico: boolean | null): void {
    this.filtersChange.emit({ generico });
  }

  onLaboratorioChange(laboratorio: string): void {
    this.filtersChange.emit({ laboratorio: laboratorio || null });
  }

  onQuantidadeBaixaChange(quantidadeBaixa: boolean): void {
    this.filtersChange.emit({ quantidadeBaixa });
  }

  onOrdenarPorChange(ordenarPor: string): void {
    this.filtersChange.emit({
      ordenarPor: (ordenarPor || null) as MedicamentosFiltros['ordenarPor'],
    });
  }

  toggleOrdem(): void {
    const novaOrdem = this.filters.ordem === 'asc' ? 'desc' : 'asc';
    this.filtersChange.emit({ ordem: novaOrdem });
  }

  onLimparFiltros(): void {
    this.limparFiltros.emit();
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
}
