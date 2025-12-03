## Task 21 – Configuração do Firebase Admin na API

### Nome da Task
Inicializar Firebase Admin SDK no backend

### Objetivo
Configurar o Firebase Admin SDK na API Node.js para acesso ao Firestore, Authentication e Storage, isolando a inicialização em módulo dedicado.

### Principais entregas
- **Módulo Firebase**: arquivo(s) em `api/src/firebase` para inicializar `admin.initializeApp`.
- **Carregamento de credenciais**: uso de variáveis de ambiente ou arquivo de serviço (service account) referenciado de forma segura.
- **Instâncias exportadas**: funções/helpers para obter `firestore`, `auth` e `storage` do Admin SDK.
- **Integração com config**: leitura de variáveis de ambiente centralizada em `config`.

### Critério de pronto
- [ ] O Firebase Admin é inicializado uma única vez, em local centralizado.
- [ ] Credenciais sensíveis não são commitadas no repositório.
- [ ] É possível obter instâncias de Firestore/Storage/Auth a partir do módulo Firebase.
- [ ] A API sobe corretamente mesmo se o módulo Firebase não for usado em todos os endpoints.

### Prompt de execução
Na API Node.js, configure o Firebase Admin SDK em um módulo dedicado dentro de `src/firebase`, inicializando o app com credenciais carregadas de variáveis de ambiente e exportando helpers para acessar Firestore, Auth e Storage. Integre esse módulo com o sistema de configuração (`config`) da API, garantindo que nenhuma credencial sensível seja versionada e preparando o backend para operar sobre a coleção `medicamentos`.


