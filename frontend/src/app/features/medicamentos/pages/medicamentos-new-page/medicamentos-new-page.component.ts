import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-medicamentos-new-page',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="medicamentos-new-page">
      <h1>Novo Medicamento</h1>
      <p>Formulário de cadastro será implementado nas próximas tasks.</p>
    </div>
  `,
  styles: [`
    .medicamentos-new-page {
      padding: var(--spacing-lg);
    }
    
    h1 {
      color: var(--color-primary);
      margin-bottom: var(--spacing-md);
    }
  `]
})
export class MedicamentosNewPageComponent {}

