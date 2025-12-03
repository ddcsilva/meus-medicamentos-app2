## Task 13 – Serviço de API de Medicamentos no frontend

### Nome da Task
Implementar `MedicamentosApi` integrando com a API Node

### Objetivo
Criar um serviço específico para consumo da API de medicamentos no backend, encapsulando rotas e DTOs para CRUD completo e atualização de quantidade.

### Principais entregas
- **Serviço `MedicamentosApi`**: criado em `features/medicamentos/services/medicamentos-api.service.ts`.
- **Métodos de CRUD**: `getAll`, `getById`, `create`, `update`, `delete`.
- **Método de quantidade**: `updateQuantidade` para PATCH específico de quantidade.
- **Uso de modelos e DTOs**: integração entre tipos `Medicamento`, DTOs de criação/atualização e tipos de resposta da API.

### Critério de pronto
- [ ] O serviço chama os endpoints esperados da API (`/medicamentos`, `/medicamentos/:id`, `/medicamentos/:id/quantidade`).
- [ ] Todos os métodos são tipados com as interfaces/DTOs definidos previamente.
- [ ] O serviço não contém lógica de apresentação, apenas orquestra requisições HTTP.
- [ ] O código trata erros HTTP de maneira previsível (propagando para camadas superiores).

### Prompt de execução
No frontend Angular, crie o serviço `MedicamentosApi` dentro de `features/medicamentos/services`, usando o `ApiService` para se comunicar com a API Node e expondo métodos tipados para o CRUD de medicamentos e para atualização de quantidade (`PATCH /medicamentos/:id/quantidade`). Utilize os modelos e DTOs definidos anteriormente, mantendo o serviço focado apenas em comunicação HTTP e pronto para ser consumido pelos stores e componentes.


