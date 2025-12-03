## Task 11 – Modelo `Medicamento` e tipos compartilhados no frontend

### Nome da Task
Definir interface `Medicamento` e tipos auxiliares no Angular

### Objetivo
Criar o modelo tipado de `Medicamento` e tipos auxiliares (status de validade, tipos de filtro, DTOs básicos) no frontend, alinhados ao PRD e ao refinamento técnico.

### Principais entregas
- **Interface `Medicamento`**: criada em `shared/models/medicamento.model.ts` ou `features/medicamentos/models`.
- **Tipos de status de validade**: union type `'valido' | 'prestes' | 'vencido'`.
- **DTOs básicos**: tipos para criação e atualização (`CreateMedicamentoDto`, `UpdateMedicamentoDto`, `UpdateQuantidadeDto`).
- **Funções utilitárias**: helpers para converter entre DTOs e modelo, se necessário.

### Critério de pronto
- [ ] A interface `Medicamento` reflete todos os campos definidos em `historia.md` e `refinamento.md`.
- [ ] Os DTOs separam campos obrigatórios e opcionais de forma coerente para criação/edição.
- [ ] Nenhum componente ou serviço usa `any` onde o modelo de `Medicamento` poderia ser aplicado.
- [ ] Os tipos estão centralizados em um local claro e reutilizável.

### Prompt de execução
No frontend Angular, crie a interface `Medicamento` e tipos auxiliares (status de validade, DTOs de criação/atualização e atualização de quantidade) em um arquivo de modelos compartilhados, alinhando os campos com os definidos no PRD e refinamento (`nome`, `droga`, `generico`, `marca`, `laboratorio`, `tipo`, `validade`, `statusValidade`, `quantidadeTotal`, `quantidadeAtual`, `fotoUrl`, `observacoes`, metadados de criação/atualização). Garanta que esses tipos sejam exportados e utilizados por serviços e stores nas próximas tasks.


