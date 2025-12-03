import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-medicamentos-list-page',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="medicamentos-page">
      <div class="container">
        <h1>Meus Medicamentos</h1>
        <p>Lista de medicamentos será implementada nas próximas tasks.</p>
      </div>
    </div>
  `,
  styles: [`
    .medicamentos-page {
      min-height: 100vh;
      background-color: var(--color-background);
      padding: var(--spacing-lg) 0;
    }
    
    h1 {
      color: var(--color-primary);
      margin-bottom: var(--spacing-md);
    }
  `]
})
export class MedicamentosListPageComponent {}

