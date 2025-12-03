# 💊 Serviços de Medicamentos

Este diretório contém os serviços relacionados ao domínio de Medicamentos.

---

## MedicamentosApiService

Serviço de API para operações CRUD de medicamentos.

### Uso Básico

```typescript
import { MedicamentosApiService } from "@features/medicamentos/services";

@Component({...})
export class MeuComponente {
  private medicamentosApi = inject(MedicamentosApiService);

  carregarMedicamentos() {
    this.medicamentosApi.getAll().subscribe(medicamentos => {
      console.log(medicamentos);
    });
  }
}
```

---

## Métodos Disponíveis

### `getAll(filtros?): Observable<Medicamento[]>`

Busca todos os medicamentos, com filtros opcionais.

```typescript
// Todos os medicamentos
this.medicamentosApi.getAll();

// Com filtros
this.medicamentosApi.getAll({
  status: "valido",
  busca: "paracetamol",
  ordenarPor: "nome",
  ordem: "asc",
  limite: 10,
});
```

**Filtros disponíveis:**

| Parâmetro   | Tipo                                             | Descrição                |
| ----------- | ------------------------------------------------ | ------------------------ |
| `status`    | `'valido' \| 'prestes' \| 'vencido'`             | Filtrar por status       |
| `busca`     | `string`                                         | Busca por nome ou droga  |
| `ordenarPor`| `'nome' \| 'validade' \| 'quantidadeAtual' \| 'criadoEm'` | Campo de ordenação |
| `ordem`     | `'asc' \| 'desc'`                                | Direção da ordenação     |
| `limite`    | `number`                                         | Limite de resultados     |

### `getById(id): Observable<Medicamento>`

Busca um medicamento pelo ID.

```typescript
this.medicamentosApi.getById("abc123").subscribe((medicamento) => {
  console.log(medicamento.nome);
});
```

### `create(dto): Observable<Medicamento>`

Cria um novo medicamento.

```typescript
const novoMedicamento: CreateMedicamentoDto = {
  nome: "Paracetamol",
  droga: "Paracetamol",
  generico: true,
  marca: "Genérico",
  laboratorio: "Lab XYZ",
  tipo: "comprimido",
  validade: "2024-12-31",
  quantidadeTotal: 20,
  quantidadeAtual: 20,
};

this.medicamentosApi.create(novoMedicamento).subscribe((medicamento) => {
  console.log("Criado:", medicamento.id);
});
```

### `update(id, dto): Observable<Medicamento>`

Atualiza um medicamento existente.

```typescript
this.medicamentosApi
  .update("abc123", {
    nome: "Novo Nome",
    observacoes: "Atualizado",
  })
  .subscribe((medicamento) => {
    console.log("Atualizado:", medicamento);
  });
```

### `updateQuantidade(id, quantidade): Observable<Medicamento>`

Atualiza apenas a quantidade de um medicamento.

```typescript
this.medicamentosApi.updateQuantidade("abc123", 5).subscribe((medicamento) => {
  console.log("Nova quantidade:", medicamento.quantidadeAtual);
});
```

### `incrementarQuantidade(id, incremento, quantidadeAtual): Observable<Medicamento>`

Incrementa a quantidade de um medicamento.

```typescript
// Incrementar em 5 unidades (quantidade atual: 10)
this.medicamentosApi
  .incrementarQuantidade("abc123", 5, 10)
  .subscribe((medicamento) => {
    console.log("Nova quantidade:", medicamento.quantidadeAtual); // 15
  });
```

### `decrementarQuantidade(id, decremento, quantidadeAtual): Observable<Medicamento>`

Decrementa a quantidade de um medicamento (não permite negativo).

```typescript
// Decrementar em 3 unidades (quantidade atual: 10)
this.medicamentosApi
  .decrementarQuantidade("abc123", 3, 10)
  .subscribe((medicamento) => {
    console.log("Nova quantidade:", medicamento.quantidadeAtual); // 7
  });
```

### `delete(id): Observable<void>`

Exclui um medicamento.

```typescript
this.medicamentosApi.delete("abc123").subscribe(() => {
  console.log("Medicamento excluído");
});
```

### `uploadFoto(id, file): Observable<{ fotoUrl: string }>`

Faz upload de foto para um medicamento.

```typescript
this.medicamentosApi.uploadFoto("abc123", file).subscribe((response) => {
  console.log("URL da foto:", response.fotoUrl);
});
```

---

## Endpoints da API

O serviço consome os seguintes endpoints:

| Método   | Endpoint                          | Descrição                      |
| -------- | --------------------------------- | ------------------------------ |
| `GET`    | `/medicamentos`                   | Listar todos os medicamentos   |
| `GET`    | `/medicamentos/:id`               | Buscar medicamento por ID      |
| `POST`   | `/medicamentos`                   | Criar novo medicamento         |
| `PUT`    | `/medicamentos/:id`               | Atualizar medicamento          |
| `PATCH`  | `/medicamentos/:id/quantidade`    | Atualizar apenas quantidade    |
| `DELETE` | `/medicamentos/:id`               | Excluir medicamento            |
| `POST`   | `/medicamentos/:id/foto`          | Upload de foto                 |

---

## Tratamento de Erros

O serviço propaga erros do `ApiService` para as camadas superiores:

```typescript
import { ApiError } from "@core/api/api.service";

this.medicamentosApi.getAll().subscribe({
  next: (medicamentos) => {
    // Sucesso
  },
  error: (error: ApiError) => {
    console.error(`Erro ${error.code}: ${error.message}`);

    // Tratamento específico
    switch (error.code) {
      case "NOT_FOUND":
        console.log("Medicamento não encontrado");
        break;
      case "UNAUTHORIZED":
        this.router.navigate(["/login"]);
        break;
      default:
        this.toastService.error(error.message);
    }
  },
});
```

---

## Testes

O serviço é facilmente testável com mocks do `ApiService`:

```typescript
const apiServiceSpy = jasmine.createSpyObj("ApiService", [
  "get",
  "post",
  "put",
  "patch",
  "delete",
]);

TestBed.configureTestingModule({
  providers: [
    MedicamentosApiService,
    { provide: ApiService, useValue: apiServiceSpy },
  ],
});
```

---

## MedicamentosStore

Store baseado em Angular Signals para gerenciamento de estado de medicamentos.

### Uso Básico

```typescript
import { MedicamentosStore } from "@features/medicamentos/services";

@Component({...})
export class MeuComponente {
  private store = inject(MedicamentosStore);

  // Consumir signals
  items = this.store.items;
  loading = this.store.loading;
  error = this.store.error;

  // Contagens
  totalItems = this.store.totalItems;
  validosCount = this.store.validosCount;
  vencidosCount = this.store.vencidosCount;

  ngOnInit() {
    this.store.loadAll();
  }

  incrementar(medicamento: Medicamento) {
    this.store.incrementarQuantidade(medicamento.id, medicamento.quantidadeAtual);
  }
}
```

### Signals Disponíveis

| Signal | Tipo | Descrição |
|--------|------|-----------|
| `items` | `Signal<Medicamento[]>` | Lista de medicamentos |
| `selected` | `Signal<Medicamento \| null>` | Medicamento selecionado |
| `loading` | `Signal<boolean>` | Estado de loading global |
| `error` | `Signal<StoreError \| null>` | Erro atual |
| `filters` | `Signal<MedicamentosStoreFilters>` | Filtros ativos |

### Computed Signals

| Signal | Tipo | Descrição |
|--------|------|-----------|
| `totalItems` | `Signal<number>` | Total de medicamentos |
| `validosCount` | `Signal<number>` | Contagem de válidos |
| `prestesCount` | `Signal<number>` | Contagem de prestes a vencer |
| `vencidosCount` | `Signal<number>` | Contagem de vencidos |
| `estoqueBaixoCount` | `Signal<number>` | Contagem com estoque baixo (< 5) |
| `semEstoqueCount` | `Signal<number>` | Contagem sem estoque |
| `filteredItems` | `Signal<Medicamento[]>` | Lista filtrada |
| `hasError` | `Signal<boolean>` | Se há erro |
| `isEmpty` | `Signal<boolean>` | Se a lista está vazia |

### Métodos de Ação - CRUD

| Método | Descrição |
|--------|-----------|
| `loadAll(filters?)` | Carrega todos os medicamentos |
| `loadById(id)` | Carrega e seleciona um medicamento |
| `create(dto)` | Cria um novo medicamento |
| `update(id, dto)` | Atualiza um medicamento |
| `delete(id)` | Exclui um medicamento |

### Métodos de Ação - Quantidade

| Método | Descrição |
|--------|-----------|
| `updateQuantidade(id, quantidade)` | Atualiza quantidade |
| `incrementarQuantidade(id, atual, incremento)` | Incrementa quantidade |
| `decrementarQuantidade(id, atual, decremento)` | Decrementa quantidade |

### Métodos de Ação - Filtros

| Método | Descrição |
|--------|-----------|
| `setFilters(filters)` | Define todos os filtros |
| `updateFilters(filters)` | Atualiza filtros parcialmente |
| `clearFilters()` | Limpa todos os filtros |
| `setBusca(busca)` | Define busca textual |
| `setStatusFilter(status)` | Define filtro de status |
| `setOrdenacao(campo, ordem)` | Define ordenação |

### Métodos de Ação - Seleção

| Método | Descrição |
|--------|-----------|
| `setSelected(medicamento)` | Define medicamento selecionado |
| `clearSelected()` | Limpa seleção |
| `clearError()` | Limpa erro atual |

### Exemplo Completo

```typescript
@Component({
  template: `
    @if (loading()) {
      <app-loading />
    }

    @if (error()) {
      <div class="error">{{ error()?.message }}</div>
    }

    <div class="stats">
      <span>Total: {{ totalItems() }}</span>
      <span>Válidos: {{ validosCount() }}</span>
      <span>Vencidos: {{ vencidosCount() }}</span>
    </div>

    <input (input)="onBusca($event)" placeholder="Buscar..." />

    @for (med of filteredItems(); track med.id) {
      <app-medicamento-card
        [medicamento]="med"
        (incrementar)="incrementar(med)"
        (decrementar)="decrementar(med)"
      />
    }
  `
})
export class MedicamentosListComponent implements OnInit {
  private store = inject(MedicamentosStore);

  items = this.store.items;
  filteredItems = this.store.filteredItems;
  loading = this.store.loading;
  error = this.store.error;
  totalItems = this.store.totalItems;
  validosCount = this.store.validosCount;
  vencidosCount = this.store.vencidosCount;

  ngOnInit() {
    this.store.loadAll();
  }

  onBusca(event: Event) {
    const busca = (event.target as HTMLInputElement).value;
    this.store.setBusca(busca);
  }

  incrementar(med: Medicamento) {
    this.store.incrementarQuantidade(med.id, med.quantidadeAtual);
  }

  decrementar(med: Medicamento) {
    this.store.decrementarQuantidade(med.id, med.quantidadeAtual);
  }
}
```

---

**Última atualização:** Task 14 - Store de Medicamentos com Signals

