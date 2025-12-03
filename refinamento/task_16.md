## Task 16 – Componentes de UI específicos para Medicamentos

### Nome da Task
Criar componentes reutilizáveis de lista, card e formulário de medicamentos

### Objetivo
Construir componentes especializados para a interface de medicamentos (cards, formulário, filtros, controles de quantidade) sobre a base de UI já criada, facilitando reutilização e mantendo a UX consistente.

### Principais entregas
- **Card de medicamento**: componente em `features/medicamentos/components/medicamento-card` com nome, status, validade, quantidade e foto.
- **Formulário de medicamento**: componente em `features/medicamentos/components/medicamento-form` contendo todos os campos do PRD.
- **Controles de quantidade**: componente de incremento/decremento (+/-) para quantidade atual.
- **Barra de filtros/busca**: componente de filtros rápidos por tipo, validade, quantidade baixa, genérico, laboratório.

### Critério de pronto
- [ ] A lista de medicamentos reutiliza `medicamento-card` para cada item.
- [ ] As páginas de novo/edição reutilizam o `medicamento-form`.
- [ ] O componente de quantidade (+/-) dispara eventos claros para o store manipular.
- [ ] A barra de filtros/busca emite alterações de filtro sem conter lógica de dados.

### Prompt de execução
No módulo de `medicamentos` do Angular, crie componentes standalone para card de medicamento, formulário completo de medicamento, controle de quantidade (+/-) e barra de filtros/busca, reutilizando os componentes de UI base. Esses componentes devem ser desacoplados da lógica de dados, comunicando-se com o `MedicamentosStore` via inputs/outputs, e seguir a UX descrita no refinamento (cards com badges de status, botões grandes, filtros sempre acessíveis).


