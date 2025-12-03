## Task 27 – Endpoint de atualização de quantidade na API

### Nome da Task
Implementar endpoint específico para PATCH de quantidade

### Objetivo
Criar um endpoint dedicado para atualização da quantidade atual de um medicamento, otimizado para uso frequente pela UI de incremento/decremento.

### Principais entregas
- **Rota PATCH**: `PATCH /medicamentos/:id/quantidade` definida em `medicamentos.routes.ts`.
- **Handler no controller**: método que recebe o DTO de quantidade e chama o serviço de domínio.
- **Método no serviço**: operação específica em `MedicamentosService` para atualizar apenas a quantidade.
- **Validações**: impedir quantidades negativas ou inconsistentes no backend.

### Critério de pronto
- [ ] O endpoint PATCH funciona e atualiza apenas o campo de quantidade atual do medicamento.
- [ ] O serviço aplica validações mínimas (ex.: não permitir quantidade negativa).
- [ ] O endpoint reutiliza autenticação e metadados de atualização.
- [ ] A resposta retorna o recurso atualizado ou um DTO resumido coerente.

### Prompt de execução
Na API Node.js, adicione um endpoint `PATCH /medicamentos/:id/quantidade` que receba um `UpdateQuantidadeDto`, valide os dados (ex.: quantidade não negativa) e utilize o `MedicamentosService` para atualizar apenas o campo de quantidade atual do medicamento. Certifique-se de que o endpoint está protegido pelo middleware de autenticação e retorna o medicamento atualizado ou um DTO apropriado para o frontend.


