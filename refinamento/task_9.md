## Task 9 – Guarda de rota e redirecionamento baseado em Auth

### Nome da Task
Criar guardas de rota para proteger áreas autenticadas

### Objetivo
Implementar guards de rota e possivelmente resolvers necessários para garantir que somente usuários autenticados acessem as rotas de medicamentos, redirecionando não autenticados para `/login`.

### Principais entregas
- **Guard de autenticação**: `AuthGuard` em `core/guards/auth.guard.ts` usando o `AuthService`.
- **Guard de rota inverso**: opcionalmente, um guard para impedir que usuários logados acessem `/login`.
- **Configuração nas rotas**: aplicação dos guards nas rotas de `/medicamentos` e filhos.
- **Tratamento de navegação**: redirecionamento imediato para `/login` quando usuário não autenticado acessa rota protegida.

### Critério de pronto
- [ ] Usuários não autenticados são bloqueados de acessar `/medicamentos` e redirecionados para `/login`.
- [ ] Usuários autenticados são redirecionados de `/login` para `/medicamentos` (se guard inverso existir).
- [ ] O guard utiliza o estado de autenticação do `AuthService` de forma reativa.
- [ ] Não há loops de navegação ou erros no console ao alternar entre login e rotas protegidas.

### Prompt de execução
Crie um `AuthGuard` no Angular 18 que use o `AuthService` para verificar se o usuário está autenticado antes de permitir acesso às rotas de medicamentos, redirecionando para `/login` quando necessário. Aplique esse guard nas rotas configuradas em `app.routes.ts` e, opcionalmente, implemente um guard inverso para impedir que usuários autenticados vejam a tela de login, garantindo fluxo de navegação limpo e previsível.


