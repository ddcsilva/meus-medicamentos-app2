## Task 26 – Endpoints CRUD de Medicamentos na API

### Nome da Task
Implementar controllers e rotas REST para medicamentos

### Objetivo
Criar os controllers e rotas Express que expõem o CRUD de medicamentos para o frontend, conectando com o `MedicamentosService` e aplicando o middleware de autenticação.

### Principais entregas
- **Controller de medicamentos**: em `controllers/medicamentos.controller.ts` com handlers para cada operação.
- **Arquivo de rotas**: `routes/medicamentos.routes.ts` mapeando `/medicamentos` e `/medicamentos/:id`.
- **Integração com serviço**: chamadas ao `MedicamentosService` em cada handler.
- **Registro das rotas**: inclusão das rotas no app principal (ex.: prefixo `/api`).

### Critério de pronto
- [ ] Os endpoints `GET /medicamentos`, `GET /medicamentos/:id`, `POST /medicamentos`, `PUT /medicamentos/:id` e `DELETE /medicamentos/:id` estão implementados.
- [ ] Todos os endpoints utilizam o middleware de autenticação.
- [ ] Respostas seguem um formato JSON consistente (DTOs de resposta).
- [ ] Erros são mapeados para códigos HTTP apropriados com mensagens úteis.

### Prompt de execução
Na API Node.js, implemente os controllers e rotas REST para o recurso `medicamentos`, conectando cada handler ao `MedicamentosService` para executar as operações de listar, buscar por ID, criar, atualizar e deletar medicamentos. Aplique o middleware de autenticação em todas as rotas, mapeie erros de domínio para códigos HTTP adequados e registre as rotas no app Express principal sob um prefixo como `/api/medicamentos`.


