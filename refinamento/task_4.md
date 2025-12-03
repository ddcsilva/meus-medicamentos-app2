## Task 4 – Configuração de roteamento principal e layouts

### Nome da Task
Definir rotas principais e aplicação de layouts autenticado e público

### Objetivo
Configurar o arquivo de rotas principal para aplicar `AuthLayout` no fluxo de login e `MainLayout` nas rotas protegidas de medicamentos, usando roteamento moderno do Angular 18.

### Principais entregas
- **Arquivo de rotas principal**: `app.routes.ts` com definição clara de rotas públicas e protegidas.
- **Rotas de autenticação**: rota `/login` usando `AuthLayout` com página de login como filho.
- **Rotas de medicamentos**: rotas `/medicamentos`, `/medicamentos/novo`, `/medicamentos/:id` usando `MainLayout`.
- **Lazy loading**: configuração para carregar `features/auth` e `features/medicamentos` de forma lazy com `loadComponent`/`loadChildren`.

### Critério de pronto
- [ ] As rotas `/login` e `/medicamentos` funcionam e exibem os layouts corretos.
- [ ] As rotas de medicamentos estão configuradas para serem protegidas (mesmo que o guard venha em outra task).
- [ ] O roteamento utiliza `provideRouter` e a configuração recomendada para Angular 18.
- [ ] Não há conflitos ou loops de navegação ao acessar rotas inexistentes (rota 404 básica opcional).

### Prompt de execução
Configure o roteamento principal do projeto Angular 18 usando `provideRouter` em `main.ts` e um `app.routes.ts` que defina rotas públicas para `/login` com `AuthLayout` e rotas autenticadas para `/medicamentos`, `/medicamentos/novo` e `/medicamentos/:id` com `MainLayout`. Utilize lazy loading para carregar as páginas de `features/auth` e `features/medicamentos`, garantindo organização limpa e preparação para inclusão de guards nas próximas tasks.


