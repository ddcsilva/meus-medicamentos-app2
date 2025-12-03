## Task 24 – Serviço de domínio de Medicamentos e lógica de validade

### Nome da Task
Implementar serviço de domínio com regras de negócio de validade e status

### Objetivo
Criar a camada de serviço de domínio para medicamentos, orquestrando repositório, aplicando regras de negócio (cálculo de `statusValidade`, preenchimento de metadados) e preparando dados para os controllers.

### Principais entregas
- **Serviço de domínio**: classe `MedicamentosService` em `services/medicamentos.service.ts`.
- **Regras de validade**: funções para determinar `statusValidade` (`valido`, `prestes`, `vencido`) com base na data de validade e data atual.
- **Preenchimento de metadados**: definição de `criadoEm`, `atualizadoEm`, `criadoPor` com base no usuário autenticação.
- **Orquestração de CRUD**: métodos de alto nível chamando o repositório e aplicando regras de negócio antes/depois da persistência.

### Critério de pronto
- [ ] Toda lógica de status de validade está concentrada em funções de domínio (não em controllers).
- [ ] O serviço define e atualiza corretamente metadados de criação/atualização.
- [ ] O serviço expõe métodos para listar, buscar, criar, atualizar, atualizar quantidade e remover medicamentos.
- [ ] O código está desacoplado o suficiente para ser facilmente testado com repositório mockado.

### Prompt de execução
Implemente um `MedicamentosService` na API Node.js que use o repositório de medicamentos para realizar operações CRUD e aplicar regras de negócio, incluindo o cálculo do `statusValidade` com base em datas (vencido, prestes, válido) e o preenchimento de campos de metadados (`criadoPor`, `criadoEm`, `atualizadoEm`). Mantenha a lógica de negócio isolada de controllers e repositórios, preparando o serviço para ser consumido pelas rotas da API.


