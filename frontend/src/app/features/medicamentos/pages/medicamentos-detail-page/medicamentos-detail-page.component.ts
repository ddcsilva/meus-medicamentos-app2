import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-medicamentos-detail-page',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="medicamentos-detail-page">
      <h1>Detalhes do Medicamento</h1>
      <p>ID: {{ medicamentoId }}</p>
      <p>Página de detalhes/edição será implementada nas próximas tasks.</p>
    </div>
  `,
  styles: [`
    .medicamentos-detail-page {
      padding: var(--spacing-lg);
    }
    
    h1 {
      color: var(--color-primary);
      margin-bottom: var(--spacing-md);
    }
  `]
})
export class MedicamentosDetailPageComponent {
  medicamentoId: string | null = null;

  constructor(private route: ActivatedRoute) {
    this.route.paramMap.subscribe(params => {
      this.medicamentoId = params.get('id');
    });
  }
}

