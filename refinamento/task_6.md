## Task 6 – Organização de `environment` no Angular

### Nome da Task
Configurar arquivos de ambiente do frontend (environment.ts)

### Objetivo
Definir os arquivos de configuração de ambientes (`environment.ts`, `environment.development.ts`, etc.) com chaves para Firebase, URL da API e demais parâmetros necessários ao frontend.

### Principais entregas
- **Arquivos de ambiente**: criação e/ou ajuste de `src/environments/environment.development.ts` e `src/environments/environment.ts`.
- **Configuração de Firebase**: chaves públicas do Firebase (apiKey, authDomain, projectId, storageBucket, etc.).
- **Configuração de API**: `apiBaseUrl` apontando para a futura API Node.js.
- **Interface tipada**: interface `Environment` com tipagem para as propriedades de configuração.

### Critério de pronto
- [ ] Os arquivos de environment existem e estão corretos para dev e produção.
- [ ] As credenciais sensíveis não estão hard-coded de forma insegura fora dos arquivos adequados.
- [ ] O código do app usa o objeto `environment` para acessar `apiBaseUrl` e configurações do Firebase.
- [ ] A build de produção e o serve de desenvolvimento funcionam com as variáveis definidas.

### Prompt de execução
No projeto Angular, crie ou ajuste os arquivos de ambiente (`environment.development.ts` e `environment.ts`) para incluir uma interface `Environment` tipada, além das configurações de Firebase (Auth/Firestore/Storage) e `apiBaseUrl` para a API Node.js. Atualize o código de bootstrap e quaisquer serviços que dependam dessas configurações para ler os valores a partir de `environment`, garantindo separação clara entre desenvolvimento e produção.


