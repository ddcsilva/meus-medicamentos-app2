import { Component, Input } from "@angular/core";
import { CommonModule } from "@angular/common";
import { LoadingComponent } from "../loading/loading.component";

/**
 * Componente de loading de página inteira.
 *
 * Exibe um overlay de carregamento sobre o conteúdo.
 *
 * @example
 * <app-page-loading
 *   [show]="store.loading()"
 *   text="Carregando medicamentos..."
 * />
 */
@Component({
  selector: "app-page-loading",
  standalone: true,
  imports: [CommonModule, LoadingComponent],
  template: `
    <div *ngIf="show" class="page-loading" [class.overlay]="overlay">
      <div class="loading-container">
        <app-loading
          [size]="size"
          [text]="text"
          [vertical]="true"
        ></app-loading>
      </div>
    </div>
  `,
  styles: [
    `
      .page-loading {
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 300px;
        padding: var(--spacing-3xl);
      }

      .page-loading.overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(255, 255, 255, 0.9);
        z-index: 1000;
        min-height: 100vh;
      }

      .loading-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: var(--spacing-md);
      }
    `,
  ],
})
export class PageLoadingComponent {
  /** Se deve exibir o loading */
  @Input() show: boolean = false;

  /** Texto de loading */
  @Input() text: string = "Carregando...";

  /** Tamanho do spinner */
  @Input() size: "sm" | "md" | "lg" = "lg";

  /** Se deve exibir como overlay */
  @Input() overlay: boolean = false;
}

