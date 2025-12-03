## Task 12 – Serviço HTTP genérico (`ApiService`) no frontend

### Nome da Task
Criar serviço HTTP base desacoplado da API de domínio

### Objetivo
Implementar um serviço HTTP genérico que encapsule `HttpClient`, use `apiBaseUrl` dos environments e forneça métodos helper para GET/POST/PUT/PATCH/DELETE, servindo de base para serviços específicos como `MedicamentosApi`.

### Principais entregas
- **Serviço `ApiService`**: criado em `core/api/api.service.ts` ou similar.
- **Métodos genéricos**: `get<T>`, `post<T>`, `put<T>`, `patch<T>`, `delete<T>`.
- **Uso de `apiBaseUrl`**: concatenação consistente da URL base de API com caminhos relativos.
- **Tratamento básico de erros**: conversão simples de erros HTTP em exceções ou objetos amigáveis.

### Critério de pronto
- [ ] Todos os serviços de domínio (como `MedicamentosApi`) utilizam `ApiService` ao invés de `HttpClient` direto.
- [ ] O `ApiService` lê `apiBaseUrl` do `environment` de forma centralizada.
- [ ] O tratamento de erros é consistente e pronto para ser integrado ao `ErrorService`/toasts.
- [ ] O código está organizado para facilitar testes futuros (injeção de dependências clara).

### Prompt de execução
Implemente um `ApiService` no Angular 18 que encapsule `HttpClient` e use `environment.apiBaseUrl` para construir URLs completas, expondo métodos genéricos tipados para operações HTTP comuns. Garanta que esse serviço fique em `core/api` (ou pasta equivalente), seja facilmente mockável em testes e sirva como base para serviços específicos de domínio, mantendo o frontend desacoplado de detalhes da API.


