## Task 29 – Configuração de CORS, logging e error handler global na API

### Nome da Task
Configurar middlewares transversais da API (CORS, logs, erros)

### Objetivo
Adicionar middlewares globais na API para tratar CORS, logging básico de requisições e tratamento centralizado de erros, melhorando observabilidade e robustez.

### Principais entregas
- **Configuração de CORS**: uso de middleware para permitir o domínio do frontend e métodos/headers necessários.
- **Middleware de logging**: log simples de requisição (método, rota, status, tempo) para desenvolvimento.
- **Error handler global**: middleware de tratamento de erros convertendo exceções em respostas JSON padronizadas.
- **Integração no app**: registro dos middlewares na configuração principal do Express.

### Critério de pronto
- [ ] O frontend consegue chamar a API sem problemas de CORS.
- [ ] Cada requisição é logada em modo dev de forma legível.
- [ ] Erros lançados em controllers/serviços são capturados pelo error handler global.
- [ ] As respostas de erro têm formato consistente (ex.: `{ message, code, details }`).

### Prompt de execução
Na API Node.js, configure middlewares globais para CORS (permitindo o domínio do frontend e cabeçalhos de autenticação), logging de requisições e tratamento centralizado de erros, registrando-os na inicialização do app Express. Garanta que todas as exceções geradas em controllers e serviços sejam encaminhadas para o error handler global, que deve responder com JSON padronizado e códigos HTTP apropriados, facilitando o consumo no frontend.


