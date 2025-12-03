# 🎨 Componentes de UI - Meus Medicamentos

Biblioteca de componentes de UI reutilizáveis para o sistema Meus Medicamentos.

## 📦 Componentes Disponíveis

### ButtonComponent

Botão reutilizável com variantes e tamanhos.

```typescript
import { ButtonComponent } from '@shared/ui';

// Template
<app-button variant="primary" size="md" (clicked)="onSave()">
  Salvar
</app-button>

<app-button variant="danger" [loading]="isLoading">
  Excluir
</app-button>

<app-button variant="outline" [block]="true">
  Botão Full Width
</app-button>
```

#### Inputs
| Input | Tipo | Default | Descrição |
|-------|------|---------|-----------|
| variant | `'primary' \| 'secondary' \| 'success' \| 'warning' \| 'danger' \| 'outline' \| 'ghost'` | `'primary'` | Estilo visual |
| size | `'sm' \| 'md' \| 'lg'` | `'md'` | Tamanho |
| type | `'button' \| 'submit' \| 'reset'` | `'button'` | Tipo HTML |
| disabled | `boolean` | `false` | Desabilitado |
| loading | `boolean` | `false` | Estado de carregamento |
| block | `boolean` | `false` | Largura 100% |

#### Outputs
| Output | Tipo | Descrição |
|--------|------|-----------|
| clicked | `EventEmitter<MouseEvent>` | Evento de clique |

---

### CardComponent

Container para exibir conteúdo agrupado.

```typescript
import { CardComponent } from '@shared/ui';

// Template
<app-card variant="elevated" [hasHeader]="true" [hasFooter]="true">
  <ng-container card-header>Título do Card</ng-container>
  
  <p>Conteúdo do card aqui...</p>
  
  <ng-container card-footer>
    <app-button>Ação</app-button>
  </ng-container>
</app-card>
```

#### Inputs
| Input | Tipo | Default | Descrição |
|-------|------|---------|-----------|
| variant | `'default' \| 'elevated' \| 'outlined' \| 'flat'` | `'default'` | Estilo visual |
| clickable | `boolean` | `false` | Efeito hover de clique |
| noPadding | `boolean` | `false` | Remove padding do body |
| hasHeader | `boolean` | `false` | Exibe slot de header |
| hasFooter | `boolean` | `false` | Exibe slot de footer |

---

### BadgeComponent

Badge para exibir status, contadores ou labels.

```typescript
import { BadgeComponent } from '@shared/ui';

// Template
<app-badge variant="success">Ativo</app-badge>
<app-badge variant="warning" [dot]="true">Pendente</app-badge>
<app-badge variant="danger" size="lg">Erro</app-badge>
```

#### Inputs
| Input | Tipo | Default | Descrição |
|-------|------|---------|-----------|
| variant | `'default' \| 'primary' \| 'success' \| 'warning' \| 'danger' \| 'info'` | `'default'` | Cor do badge |
| size | `'sm' \| 'md' \| 'lg'` | `'md'` | Tamanho |
| dot | `boolean` | `false` | Exibe indicador circular |
| pill | `boolean` | `true` | Bordas arredondadas |

---

### StatusBadgeComponent

Badge específico para status de validade de medicamentos.

```typescript
import { StatusBadgeComponent } from '@shared/ui';

// Template
<app-status-badge status="valido"></app-status-badge>
<app-status-badge status="prestes"></app-status-badge>
<app-status-badge status="vencido"></app-status-badge>
```

#### Inputs
| Input | Tipo | Default | Descrição |
|-------|------|---------|-----------|
| status | `'valido' \| 'prestes' \| 'vencido'` | `'valido'` | Status de validade |
| size | `'sm' \| 'md' \| 'lg'` | `'md'` | Tamanho |
| showDot | `boolean` | `true` | Exibe indicador circular |

#### Mapeamento de Status
| Status | Cor | Label |
|--------|-----|-------|
| `valido` | Verde | "Válido" |
| `prestes` | Amarelo | "Prestes a vencer" |
| `vencido` | Vermelho | "Vencido" |

---

### InputComponent

Campo de entrada com suporte a formulários reativos.

```typescript
import { InputComponent } from '@shared/ui';

// Template
<app-input 
  label="E-mail" 
  type="email" 
  placeholder="Digite seu e-mail"
  [(ngModel)]="email"
  [required]="true"
  [error]="emailError"
></app-input>
```

#### Inputs
| Input | Tipo | Default | Descrição |
|-------|------|---------|-----------|
| label | `string` | `''` | Label do campo |
| type | `'text' \| 'email' \| 'password' \| 'number' \| 'tel' \| 'url' \| 'search' \| 'date'` | `'text'` | Tipo do input |
| placeholder | `string` | `''` | Placeholder |
| disabled | `boolean` | `false` | Desabilitado |
| readonly | `boolean` | `false` | Somente leitura |
| required | `boolean` | `false` | Campo obrigatório |
| error | `string` | `''` | Mensagem de erro |
| hint | `string` | `''` | Texto de ajuda |
| prefixIcon | `string` | `''` | Ícone prefixo |
| suffixIcon | `string` | `''` | Ícone sufixo |

---

### LoadingComponent

Spinner de carregamento.

```typescript
import { LoadingComponent } from '@shared/ui';

// Template
<app-loading></app-loading>
<app-loading size="lg" text="Carregando..."></app-loading>
<app-loading [vertical]="true" text="Aguarde"></app-loading>
```

#### Inputs
| Input | Tipo | Default | Descrição |
|-------|------|---------|-----------|
| size | `'sm' \| 'md' \| 'lg'` | `'md'` | Tamanho do spinner |
| text | `string` | `''` | Texto de carregamento |
| vertical | `boolean` | `false` | Layout vertical |

---

## 🎨 Cores de Status (Validade)

As cores de status seguem o padrão definido no PRD:

| Status | Variável CSS | Cor | Uso |
|--------|--------------|-----|-----|
| Válido | `--color-valido` | Verde (#4caf50) | Medicamentos dentro da validade |
| Prestes a vencer | `--color-prestes` | Amarelo (#ff9800) | Medicamentos próximos do vencimento |
| Vencido | `--color-vencido` | Vermelho (#f44336) | Medicamentos vencidos |

---

## 📱 Responsividade

Todos os componentes são responsivos e funcionam em:
- **Mobile** (< 640px)
- **Tablet** (640px - 1024px)
- **Desktop** (> 1024px)

---

## 🚀 Como Usar

### Importação

```typescript
// Importar componentes individuais
import { ButtonComponent, CardComponent, BadgeComponent } from '@shared/ui';

// Ou importar diretamente do arquivo
import { ButtonComponent } from './shared/ui/button/button.component';
```

### No Componente

```typescript
@Component({
  standalone: true,
  imports: [
    ButtonComponent,
    CardComponent,
    BadgeComponent,
    StatusBadgeComponent
  ],
  // ...
})
export class MeuComponente {}
```

---

## 📚 Variáveis CSS Disponíveis

Os componentes utilizam variáveis CSS globais definidas em `styles.scss`:

```scss
// Cores
--color-primary
--color-success
--color-warning
--color-danger
--color-valido
--color-prestes
--color-vencido

// Espaçamentos
--spacing-xs (4px)
--spacing-sm (8px)
--spacing-md (16px)
--spacing-lg (24px)
--spacing-xl (32px)

// Tipografia
--font-size-sm (14px)
--font-size-base (16px)
--font-size-lg (18px)

// Bordas
--border-radius-sm (4px)
--border-radius-md (8px)
--border-radius-lg (12px)
--border-radius-full (9999px)

// Sombras
--shadow-sm
--shadow-md
--shadow-lg

// Transições
--transition-fast (150ms)
--transition-normal (250ms)
```

---

**Última atualização:** Task 5 - Componentes de UI base

