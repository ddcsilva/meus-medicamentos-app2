## Task 19 – Feedbacks de UX (loading, toasts e estados vazios)

### Nome da Task
Implementar feedback visual consistente para ações do usuário

### Objetivo
Criar mecanismos de feedback de UX como indicadores de carregamento, mensagens de sucesso/erro e estados vazios para listas e páginas, garantindo experiência fluida e clara.

### Principais entregas
- **Serviço de notificação**: `NotificationService` em `core/services` para toasts/snackbars.
- **Componentes de feedback**: spinner de carregamento, mensagens de erro, estados vazios reutilizáveis.
- **Integração com store**: uso de `loading` e `error` do `MedicamentosStore` e `AuthService` para controlar feedback.
- **Tratamento de estados vazios**: mensagens amigáveis quando não há medicamentos cadastrados ou buscas sem resultado.

### Critério de pronto
- [ ] Ações de login, CRUD e atualização de quantidade exibem feedback de sucesso/erro.
- [ ] Listas e formulários exibem estados de carregamento claros.
- [ ] Estados vazios são tratados de forma explícita, sem telas “brancas”.
- [ ] Os componentes e serviços de feedback são reutilizáveis em todo o app.

### Prompt de execução
Implemente um `NotificationService` no Angular para exibir toasts/snackbars de sucesso e erro, além de componentes de loading e estado vazio reutilizáveis, integrando-os com os estados `loading` e `error` dos stores e serviços principais. Atualize páginas de login e medicamentos para utilizar esses recursos, garantindo que o usuário sempre tenha feedback visual claro sobre o que está acontecendo.


