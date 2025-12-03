## Task 31 – Preparação estrutural para Cloud Functions

### Nome da Task
Configurar estrutura base de Cloud Functions para notificações futuras

### Objetivo
Criar a pasta e configuração inicial de Cloud Functions do Firebase, preparando o ambiente para implementar no futuro as notificações de validade, baixo estoque e revisão mensal, sem ainda codificar a lógica de negócios.

### Principais entregas
- **Projeto Functions**: pasta `functions/` inicializada com Firebase Functions (TypeScript preferencial).
- **Configuração básica**: `firebase.json`, `functions/package.json`, `tsconfig.json` configurados.
- **Placeholders de funções**: stubs comentados ou funções vazias para jobs diários e verificações de estoque/validade.
- **Integração de ambiente**: leitura de variáveis de ambiente para projetar acesso a Firestore e envio de e-mails.

### Critério de pronto
- [ ] O projeto de Functions é inicializável e compila, mesmo sem lógica de notificação implementada.
- [ ] Existem locais claros (stubs) para implementar as tasks de notificações da V1.
- [ ] As configurações não entram em conflito com o frontend/API já configurados.
- [ ] Não há credenciais sensíveis expostas nos arquivos de configuração versionados.

### Prompt de execução
Inicialize um projeto de Firebase Cloud Functions dentro da pasta `functions/`, configurando TypeScript, `firebase.json` e os scripts necessários para deploy futuro. Crie stubs de funções (por exemplo, agendadas diariamente) relacionadas a notificações de validade, baixo estoque e revisão mensal, apenas como placeholders comentados, garantindo que o código compile e esteja pronto para receber a lógica de negócios em uma fase posterior.


