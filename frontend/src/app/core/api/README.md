# 🌐 API Service - Meus Medicamentos

Este diretório contém o serviço HTTP genérico para comunicação com a API.

---

## ApiService

Serviço HTTP base que encapsula `HttpClient` e fornece:

- URL base da API centralizada via environment
- Métodos tipados para GET/POST/PUT/PATCH/DELETE
- Tratamento de erros padronizado
- Suporte a headers e query params customizados
- Upload de arquivos

### Uso Básico

```typescript
import { ApiService } from "@core/api/api.service";

@Injectable({ providedIn: "root" })
export class MedicamentosApi {
  private api = inject(ApiService);

  listar(): Observable<Medicamento[]> {
    return this.api.get<Medicamento[]>("/medicamentos");
  }

  buscarPorId(id: string): Observable<Medicamento> {
    return this.api.get<Medicamento>(`/medicamentos/${id}`);
  }

  criar(dto: CreateMedicamentoDto): Observable<Medicamento> {
    return this.api.post<Medicamento>("/medicamentos", dto);
  }

  atualizar(id: string, dto: UpdateMedicamentoDto): Observable<Medicamento> {
    return this.api.put<Medicamento>(`/medicamentos/${id}`, dto);
  }

  atualizarQuantidade(id: string, quantidade: number): Observable<Medicamento> {
    return this.api.patch<Medicamento>(`/medicamentos/${id}/quantidade`, {
      quantidadeAtual: quantidade,
    });
  }

  excluir(id: string): Observable<void> {
    return this.api.delete<void>(`/medicamentos/${id}`);
  }
}
```

---

## Métodos Disponíveis

### `get<T>(endpoint, options?)`

Faz uma requisição GET.

```typescript
// Simples
this.api.get<Medicamento[]>("/medicamentos");

// Com query params
this.api.get<Medicamento[]>("/medicamentos", {
  params: { status: "valido", limit: "10" },
});

// Com headers customizados
this.api.get<Medicamento>("/medicamentos/123", {
  headers: { "X-Custom-Header": "value" },
});
```

### `post<T>(endpoint, body, options?)`

Faz uma requisição POST.

```typescript
this.api.post<Medicamento>("/medicamentos", {
  nome: "Paracetamol",
  droga: "Paracetamol",
  // ...
});
```

### `put<T>(endpoint, body, options?)`

Faz uma requisição PUT (atualização completa).

```typescript
this.api.put<Medicamento>("/medicamentos/123", medicamentoCompleto);
```

### `patch<T>(endpoint, body, options?)`

Faz uma requisição PATCH (atualização parcial).

```typescript
this.api.patch<Medicamento>("/medicamentos/123/quantidade", {
  quantidadeAtual: 5,
});
```

### `delete<T>(endpoint, options?)`

Faz uma requisição DELETE.

```typescript
this.api.delete<void>("/medicamentos/123");
```

### `upload<T>(endpoint, file, fieldName?, additionalData?)`

Faz upload de arquivo via multipart/form-data.

```typescript
this.api.upload<{ url: string }>("/upload", file, "foto", {
  medicamentoId: "123",
});
```

---

## Tratamento de Erros

O serviço converte erros HTTP para um formato padronizado `ApiError`:

```typescript
interface ApiError {
  status: number; // Código HTTP
  message: string; // Mensagem amigável
  code: string; // Código do erro
  details?: Record<string, unknown>; // Detalhes adicionais
  originalError?: HttpErrorResponse; // Erro original
}
```

### Códigos de Erro

| Status | Código               | Mensagem                                       |
| ------ | -------------------- | ---------------------------------------------- |
| 0      | `NETWORK_ERROR`      | Erro de conexão. Verifique sua internet.       |
| 400    | `BAD_REQUEST`        | Requisição inválida. Verifique os dados.       |
| 401    | `UNAUTHORIZED`       | Sessão expirada. Faça login novamente.         |
| 403    | `FORBIDDEN`          | Você não tem permissão para esta ação.         |
| 404    | `NOT_FOUND`          | Recurso não encontrado.                        |
| 409    | `CONFLICT`           | Conflito ao processar a requisição.            |
| 422    | `VALIDATION_ERROR`   | Dados inválidos. Verifique os campos.          |
| 429    | `TOO_MANY_REQUESTS`  | Muitas requisições. Aguarde um momento.        |
| 500    | `INTERNAL_ERROR`     | Erro interno do servidor.                      |
| 502    | `BAD_GATEWAY`        | Servidor indisponível.                         |
| 503    | `SERVICE_UNAVAILABLE`| Serviço temporariamente indisponível.          |
| 504    | `GATEWAY_TIMEOUT`    | Tempo limite excedido.                         |

### Tratando Erros

```typescript
import { ApiError } from "@core/api/api.service";

this.api.get<Medicamento[]>("/medicamentos").subscribe({
  next: (medicamentos) => {
    // Sucesso
  },
  error: (error: ApiError) => {
    console.error(`Erro ${error.code}: ${error.message}`);

    // Tratamento específico
    if (error.code === "UNAUTHORIZED") {
      this.router.navigate(["/login"]);
    }
  },
});
```

---

## Opções de Requisição

```typescript
interface RequestOptions {
  headers?: HttpHeaders | Record<string, string | string[]>;
  params?: HttpParams | Record<string, string | string[]>;
  withCredentials?: boolean;
  responseType?: "json" | "text" | "blob" | "arraybuffer";
}
```

### Exemplos

```typescript
// Headers customizados
this.api.get<T>("/endpoint", {
  headers: {
    Authorization: "Bearer token",
    "X-Custom-Header": "value",
  },
});

// Query params
this.api.get<T>("/endpoint", {
  params: {
    page: "1",
    limit: "10",
    sort: "nome",
  },
});

// Com credenciais
this.api.get<T>("/endpoint", {
  withCredentials: true,
});
```

---

## Configuração

A URL base da API é lida do arquivo de environment:

```typescript
// environment.ts
export const environment = {
  apiBaseUrl: "http://localhost:3000/api",
  // ...
};
```

---

## Testes

O serviço é facilmente mockável em testes:

```typescript
// Em testes
TestBed.configureTestingModule({
  imports: [HttpClientTestingModule],
  providers: [ApiService],
});

const httpMock = TestBed.inject(HttpTestingController);
const service = TestBed.inject(ApiService);

// Testar requisição
service.get<Medicamento[]>("/medicamentos").subscribe((result) => {
  expect(result.length).toBe(2);
});

const req = httpMock.expectOne("http://localhost:3000/api/medicamentos");
expect(req.request.method).toBe("GET");
req.flush([{ id: "1" }, { id: "2" }]);
```

---

**Última atualização:** Task 12 - Serviço HTTP genérico

