import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonComponent } from '../../../../shared/ui/button/button.component';
import { CreateMedicamentoDto, Medicamento, TipoMedicamento, UpdateMedicamentoDto } from '../../models';

/**
 * Formulário reutilizável de medicamento.
 *
 * Pode ser usado tanto para criação quanto para edição.
 *
 * @example
 * // Modo criação
 * <app-medicamento-form
 *   [loading]="isLoading"
 *   (salvar)="onSalvar($event)"
 *   (cancelar)="onCancelar()"
 * />
 *
 * // Modo edição
 * <app-medicamento-form
 *   [medicamento]="medicamentoAtual"
 *   [loading]="isLoading"
 *   (salvar)="onAtualizar($event)"
 *   (cancelar)="onCancelar()"
 * />
 */
@Component({
  selector: 'app-medicamento-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ButtonComponent],
  templateUrl: './medicamento-form.component.html',
  styleUrls: ['./medicamento-form.component.scss'],
})
export class MedicamentoFormComponent implements OnChanges {
  private readonly fb = inject(FormBuilder);

  /** Medicamento para edição (se não fornecido, modo criação) */
  @Input() medicamento?: Medicamento;

  /** Se está em loading */
  @Input() loading: boolean = false;

  /** Label do botão de submit */
  @Input() submitLabel: string = 'Salvar Medicamento';

  /** Evento emitido ao salvar */
  @Output() salvar = new EventEmitter<CreateMedicamentoDto | UpdateMedicamentoDto>();

  /** Evento emitido ao cancelar */
  @Output() cancelar = new EventEmitter<void>();

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

  /** Formulário reativo */
  readonly form: FormGroup = this.fb.group({
    nome: ['', [Validators.required, Validators.minLength(3)]],
    droga: ['', [Validators.required, Validators.minLength(3)]],
    generico: [false],
    marca: ['', [Validators.required]],
    laboratorio: ['', [Validators.required]],
    tipo: ['', [Validators.required]],
    validade: ['', [Validators.required]],
    quantidadeTotal: [null, [Validators.required, Validators.min(1)]],
    quantidadeAtual: [null, [Validators.required, Validators.min(0)]],
    observacoes: [''],
  });

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['medicamento'] && this.medicamento) {
      this.preencherFormulario(this.medicamento);
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
      observacoes: medicamento.observacoes || '',
    });
  }

  /**
   * Reseta o formulário.
   */
  reset(): void {
    this.form.reset({
      generico: false,
      observacoes: '',
    });
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
   * Submete o formulário.
   */
  onSubmit(): void {
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

    this.salvar.emit(dto);
  }

  /**
   * Cancela a edição.
   */
  onCancelar(): void {
    this.cancelar.emit();
  }
}
