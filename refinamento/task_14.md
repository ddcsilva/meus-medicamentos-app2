## Task 14 – Store de Medicamentos com Signals

### Nome da Task
Criar `MedicamentosStore` para gerenciar estado no frontend

### Objetivo
Implementar um store baseado em Angular Signals para gerenciar o estado de lista de medicamentos, item selecionado, loading, filtros e erros, centralizando a lógica de carregamento e atualização.

### Principais entregas
- **Classe `MedicamentosStore`**: criada em `features/medicamentos/services/medicamentos.store.ts`.
- **Signals de estado**: `items`, `selected`, `loading`, `error`, `filters`.
- **Métodos de ações**: `loadAll`, `loadById`, `create`, `update`, `delete`, `updateQuantidade`, orquestrando chamadas ao `MedicamentosApi`.
- **Computed helpers**: computeds para derivar contagens, status agregados e listas filtradas.

### Critério de pronto
- [ ] O store encapsula toda a lógica de comunicação com `MedicamentosApi` relacionada a estado.
- [ ] Os componentes consomem sinais do store ao invés de chamar diretamente os serviços HTTP.
- [ ] A manipulação de loading/erro está centralizada e consistente.
- [ ] O design do store facilita testes de unidade futuros (métodos bem definidos e side effects previsíveis).

### Prompt de execução
Implemente um `MedicamentosStore` no Angular 18 usando `signal` e `computed` para gerenciar o estado de medicamentos (lista, item selecionado, filtros, loading e erro), localizado em `features/medicamentos/services`. O store deve encapsular chamadas ao `MedicamentosApi` para CRUD e atualização de quantidade, expondo sinais e métodos de ação que possam ser consumidos pelas páginas e componentes, conforme o padrão sugerido no refinamento técnico.


