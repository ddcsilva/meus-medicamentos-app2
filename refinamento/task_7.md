## Task 7 – Setup do Firebase SDK no frontend

### Nome da Task
Inicializar Firebase (Auth, Firestore, Storage) no Angular

### Objetivo
Configurar o Firebase no frontend utilizando as credenciais dos environments, habilitando autenticação por e-mail/senha, acesso ao Firestore e ao Storage.

### Principais entregas
- **Inicialização do Firebase**: função ou provider que inicializa o app Firebase usando as configs de `environment`.
- **Providers de SDK modular**: configuração dos providers para Auth, Firestore e Storage seguindo o SDK modular v9+.
- **Serviço de abstração**: serviço em `core/services` (por exemplo, `FirebaseClientService`) para encapsular acesso bruto ao SDK.
- **Validação de configuração**: tratamento simples para erro de configuração ausente ou inválida (console/log amigável).

### Critério de pronto
- [ ] O aplicativo Angular inicializa o Firebase sem erros no console.
- [ ] É possível obter instâncias de Auth, Firestore e Storage via serviço centralizado.
- [ ] As configs são lidas de `environment` e não estão duplicadas em vários pontos do código.
- [ ] O código está pronto para ser reutilizado em serviços de Auth e Medicamentos.

### Prompt de execução
Implemente a configuração do Firebase no frontend Angular 18 usando o SDK modular, inicializando Auth, Firestore e Storage com base nas variáveis definidas em `environment`. Crie um serviço em `core/services` ou `core/config` que exponha funções para acessar essas instâncias, garantindo baixo acoplamento e facilitando o uso por outros serviços como autenticação de usuário e CRUD de medicamentos.


