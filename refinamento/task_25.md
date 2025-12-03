## Task 25 – Middleware de autenticação na API (Firebase token)

### Nome da Task
Criar middleware para validar tokens Firebase em requisições

### Objetivo
Implementar um middleware Express que valide o token JWT do Firebase enviado pelo frontend, garantindo que apenas usuários autenticados acessem os endpoints de medicamentos.

### Principais entregas
- **Middleware de auth**: arquivo em `middlewares/auth.middleware.ts` que verifica o header `Authorization`.
- **Integração com Firebase Admin**: uso de `admin.auth().verifyIdToken` para validar o token.
- **Injeção de usuário no request**: inclusão das informações básicas do usuário (`uid`, e possíveis claims) no objeto `req`.
- **Aplicação nas rotas**: uso do middleware em todas as rotas `/medicamentos`.

### Critério de pronto
- [ ] Requisições sem token ou com token inválido recebem erro 401/403 adequado.
- [ ] Requisições com token válido conseguem acessar os endpoints protegidos.
- [ ] As informações do usuário ficam disponíveis para o serviço de domínio (`criadoPor` etc.).
- [ ] O middleware é reutilizável e não polui os controllers com lógica de validação de token.

### Prompt de execução
Na API Node.js, implemente um middleware de autenticação que leia o token JWT do Firebase do header `Authorization`, valide-o usando o Firebase Admin SDK e, em caso de sucesso, anexe as informações do usuário (`uid` e claims relevantes) ao objeto `req`. Aplique esse middleware às rotas de medicamentos para garantir que apenas usuários autenticados utilizem o CRUD, devolvendo respostas 401/403 apropriadas quando necessário.


