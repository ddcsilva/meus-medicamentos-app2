## Task 30 – Integração frontend ↔ backend para CRUD de Medicamentos

### Nome da Task
Conectar frontend Angular à API Node para operações de medicamentos

### Objetivo
Garantir que todas as operações de CRUD e atualização de quantidade de medicamentos no frontend estejam efetivamente usando a API Node com autenticação, validando o fluxo ponta a ponta.

### Principais entregas
- **Configuração de base URL**: `ApiService` apontando para a URL correta da API.
- **Interceptador de Auth**: interceptor HTTP adicionando token Firebase no header `Authorization`.
- **Integração de páginas**: páginas de lista, novo, edição, detalhes usando `MedicamentosStore` conectado à API real.
- **Verificação manual de fluxo**: testes manuais básicos de criação, edição, deleção, atualização de quantidade e leitura.

### Critério de pronto
- [ ] Login no frontend gera token usado automaticamente nas chamadas à API.
- [ ] A lista de medicamentos reflete os dados do Firestore (via API).
- [ ] Criação, edição, exclusão e atualização de quantidade funcionam ponta a ponta.
- [ ] Erros do backend são refletidos corretamente no frontend (toasts/mensagens).

### Prompt de execução
Conecte o frontend Angular 18 à API Node.js configurando o `ApiService` com a URL correta, implementando um interceptor HTTP que injete o token JWT do Firebase Auth no header `Authorization` e ajustando o `MedicamentosStore` e as páginas de medicamentos para utilizarem os métodos do `MedicamentosApi`. Realize testes manuais para confirmar que o fluxo completo de CRUD e atualização de quantidade funciona entre frontend, backend e Firestore, com autenticação aplicada.


