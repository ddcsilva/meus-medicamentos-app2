## Task 8 – Serviço de autenticação no frontend (Firebase Auth)

### Nome da Task
Implementar `AuthService` Angular usando Firebase Auth

### Objetivo
Criar um serviço de autenticação no frontend que encapsule login por e-mail/senha, logout e observação do usuário autenticado, utilizando signals para estado reativo.

### Principais entregas
- **Serviço `AuthService`**: criado em `core/services/auth.service.ts` com métodos `login`, `logout` e leitura do usuário atual.
- **Estado com signals**: uso de `signal`/`computed` para expor `isAuthenticated`, `currentUser` e `loading`.
- **Integração com Firebase Auth**: uso de `signInWithEmailAndPassword`, `onAuthStateChanged` e `signOut`.
- **Persistência básica**: respeito à persistência padrão do Firebase (web), sem recriar lógica de session storage manual.

### Critério de pronto
- [ ] O serviço consegue realizar login com e-mail/senha válidos no Firebase.
- [ ] O estado de autenticação é refletido reativamente via signals.
- [ ] O método de logout limpa corretamente o estado e encerra a sessão.
- [ ] Erros de autenticação são tratados e fornecem mensagens amigáveis (via retorno ou serviço de notificação).

### Prompt de execução
Implemente um `AuthService` no Angular 18, em `core/services`, que encapsule Firebase Auth para login por e-mail/senha, logout e detecção de usuário autenticado, expondo o estado via signals (`isAuthenticated`, `currentUser`, `authLoading`). Utilize o SDK modular do Firebase, evitando acoplamento direto com componentes, e deixe o serviço pronto para ser consumido por guards, interceptors e a página de login.


