import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ButtonComponent } from '../../../../shared/ui/button/button.component';
import { CardComponent } from '../../../../shared/ui/card/card.component';
import { StatusBadgeComponent } from '../../../../shared/ui/status-badge/status-badge.component';
import { LoadingComponent } from '../../../../shared/ui/loading/loading.component';

// Dados de exemplo para demonstração dos componentes
interface MedicamentoDemo {
  id: string;
  nome: string;
  droga: string;
  tipo: string;
  quantidadeAtual: number;
  validade: string;
  statusValidade: 'valido' | 'prestes' | 'vencido';
}

@Component({
  selector: 'app-medicamentos-list-page',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ButtonComponent,
    CardComponent,
    StatusBadgeComponent,
    LoadingComponent
  ],
  template: `
    <div class="medicamentos-page">
      <!-- Header da página -->
      <div class="page-header">
        <div class="header-content">
          <h1>Meus Medicamentos</h1>
          <p class="subtitle">Gerencie o estoque de medicamentos da sua família</p>
        </div>
        <app-button variant="primary" routerLink="/medicamentos/novo">
          + Novo Medicamento
        </app-button>
      </div>
      
      <!-- Filtros rápidos (placeholder) -->
      <div class="filters-bar">
        <app-button variant="ghost" size="sm" [class.active]="true">
          Todos
        </app-button>
        <app-button variant="ghost" size="sm">
          Válidos
        </app-button>
        <app-button variant="ghost" size="sm">
          Prestes a vencer
        </app-button>
        <app-button variant="ghost" size="sm">
          Vencidos
        </app-button>
      </div>
      
      <!-- Loading (exemplo) -->
      <div *ngIf="loading" class="loading-container">
        <app-loading size="lg" text="Carregando medicamentos..." [vertical]="true"></app-loading>
      </div>
      
      <!-- Lista de medicamentos -->
      <div *ngIf="!loading" class="medicamentos-grid">
        <app-card 
          *ngFor="let med of medicamentosDemo" 
          variant="elevated" 
          [clickable]="true"
          class="medicamento-card"
        >
          <div class="card-content">
            <div class="card-header-row">
              <h3 class="med-nome">{{ med.nome }}</h3>
              <app-status-badge [status]="med.statusValidade"></app-status-badge>
            </div>
            
            <p class="med-droga">{{ med.droga }}</p>
            
            <div class="med-info">
              <div class="info-item">
                <span class="info-label">Tipo</span>
                <span class="info-value">{{ med.tipo }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Quantidade</span>
                <span class="info-value" [class.low-stock]="med.quantidadeAtual < 5">
                  {{ med.quantidadeAtual }} un
                </span>
              </div>
              <div class="info-item">
                <span class="info-label">Validade</span>
                <span class="info-value">{{ med.validade }}</span>
              </div>
            </div>
            
            <div class="card-actions">
              <app-button variant="ghost" size="sm">
                Editar
              </app-button>
              <div class="quantity-controls">
                <app-button variant="outline" size="sm">−</app-button>
                <span class="quantity-display">{{ med.quantidadeAtual }}</span>
                <app-button variant="outline" size="sm">+</app-button>
              </div>
            </div>
          </div>
        </app-card>
      </div>
      
      <!-- Estado vazio (exemplo) -->
      <div *ngIf="!loading && medicamentosDemo.length === 0" class="empty-state">
        <div class="empty-icon">💊</div>
        <h3>Nenhum medicamento cadastrado</h3>
        <p>Comece adicionando seu primeiro medicamento ao estoque.</p>
        <app-button variant="primary" routerLink="/medicamentos/novo">
          + Adicionar Medicamento
        </app-button>
      </div>
    </div>
  `,
  styles: [`
    .medicamentos-page {
      padding: var(--spacing-lg) 0;
    }
    
    /* Header */
    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: var(--spacing-lg);
      flex-wrap: wrap;
      gap: var(--spacing-md);
    }
    
    .header-content h1 {
      color: var(--color-text-primary);
      margin-bottom: var(--spacing-xs);
    }
    
    .subtitle {
      color: var(--color-text-secondary);
      margin: 0;
    }
    
    /* Filtros */
    .filters-bar {
      display: flex;
      gap: var(--spacing-sm);
      margin-bottom: var(--spacing-lg);
      flex-wrap: wrap;
      padding-bottom: var(--spacing-md);
      border-bottom: 1px solid var(--color-border);
    }
    
    .filters-bar app-button.active ::ng-deep button {
      background-color: var(--color-primary);
      color: white;
    }
    
    /* Loading */
    .loading-container {
      display: flex;
      justify-content: center;
      padding: var(--spacing-3xl) 0;
    }
    
    /* Grid de medicamentos */
    .medicamentos-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: var(--spacing-lg);
    }
    
    .medicamento-card {
      transition: transform var(--transition-fast);
    }
    
    .card-content {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-md);
    }
    
    .card-header-row {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: var(--spacing-sm);
    }
    
    .med-nome {
      font-size: var(--font-size-lg);
      font-weight: var(--font-weight-semibold);
      color: var(--color-text-primary);
      margin: 0;
    }
    
    .med-droga {
      font-size: var(--font-size-sm);
      color: var(--color-text-secondary);
      margin: 0;
    }
    
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
      color: var(--color-danger);
    }
    
    .card-actions {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: var(--spacing-sm);
      border-top: 1px solid var(--color-border-light);
    }
    
    .quantity-controls {
      display: flex;
      align-items: center;
      gap: var(--spacing-sm);
    }
    
    .quantity-display {
      min-width: 32px;
      text-align: center;
      font-weight: var(--font-weight-semibold);
    }
    
    /* Estado vazio */
    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: var(--spacing-3xl);
      text-align: center;
    }
    
    .empty-icon {
      font-size: 4rem;
      margin-bottom: var(--spacing-lg);
    }
    
    .empty-state h3 {
      color: var(--color-text-primary);
      margin-bottom: var(--spacing-sm);
    }
    
    .empty-state p {
      color: var(--color-text-secondary);
      margin-bottom: var(--spacing-lg);
    }
    
    /* Responsividade */
    @media (max-width: 639px) {
      .page-header {
        flex-direction: column;
        align-items: stretch;
      }
      
      .page-header app-button {
        width: 100%;
      }
      
      .medicamentos-grid {
        grid-template-columns: 1fr;
      }
      
      .med-info {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class MedicamentosListPageComponent {
  loading = false;
  
  // Dados de demonstração para mostrar os componentes funcionando
  medicamentosDemo: MedicamentoDemo[] = [
    {
      id: '1',
      nome: 'Dipirona 500mg',
      droga: 'Dipirona Sódica',
      tipo: 'Comprimido',
      quantidadeAtual: 20,
      validade: '15/12/2025',
      statusValidade: 'valido'
    },
    {
      id: '2',
      nome: 'Omeprazol 20mg',
      droga: 'Omeprazol',
      tipo: 'Cápsula',
      quantidadeAtual: 8,
      validade: '20/01/2025',
      statusValidade: 'prestes'
    },
    {
      id: '3',
      nome: 'Paracetamol 750mg',
      droga: 'Paracetamol',
      tipo: 'Comprimido',
      quantidadeAtual: 3,
      validade: '10/11/2024',
      statusValidade: 'vencido'
    },
    {
      id: '4',
      nome: 'Loratadina 10mg',
      droga: 'Loratadina',
      tipo: 'Comprimido',
      quantidadeAtual: 15,
      validade: '30/06/2026',
      statusValidade: 'valido'
    }
  ];
}

