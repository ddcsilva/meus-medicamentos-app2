## Task 10 – Página de Login (feature `auth`)

### Nome da Task
Implementar página de login com Firebase Auth

### Objetivo
Criar a página de login dentro de `features/auth`, conectada ao `AuthService`, com formulário simples de e-mail e senha, validação básica e feedback visual.

### Principais entregas
- **Página de login**: componente standalone em `features/auth/pages/login` com formulário reativo.
- **Integração com `AuthService`**: chamada ao método `login` ao submeter o formulário.
- **Feedback de erro e loading**: exibição de mensagens de erro amigáveis e estado de carregamento no botão.
- **Navegação pós-login**: redirecionamento para `/medicamentos` em caso de sucesso.

### Critério de pronto
- [ ] O usuário consegue fazer login com credenciais válidas e é levado à lista de medicamentos.
- [ ] Erros de autenticação são exibidos de maneira clara (senha errada, usuário inexistente, etc.).
- [ ] Campos possuem validação mínima (e-mail obrigatório e válido, senha obrigatória).
- [ ] A página utiliza componentes de UI base (botão, inputs estilizados, etc.).

### Prompt de execução
Na feature `auth` do Angular, implemente uma página de login standalone com formulário reativo de e-mail e senha, usando o `AuthService` para autenticar via Firebase Auth. A página deve exibir estados de carregamento, mensagens de erro amigáveis e redirecionar para `/medicamentos` após login bem-sucedido, utilizando os componentes de UI compartilhados e mantendo o visual simples e responsivo descrito no PRD.


