## Task 20 – Setup da API Node.js + Express com TypeScript

### Nome da Task
Inicializar projeto da API em Node.js/Express com estrutura em camadas

### Objetivo
Criar o projeto da API em `api/` usando Node.js, Express e TypeScript, com estrutura de pastas organizada (controllers, services, repositories, config, middlewares) alinhada à arquitetura limpa.

### Principais entregas
- **Projeto Node/TS**: `package.json`, `tsconfig.json`, `src/` com entrypoint (`server.ts` ou `index.ts`).
- **Estrutura de pastas**: `controllers/`, `services/`, `repositories/`, `middlewares/`, `routes/`, `config/`, `firebase/`.
- **Servidor Express básico**: endpoint de health-check (`GET /health`) retornando status simples.
- **Scripts de desenvolvimento**: scripts NPM para build, dev (com `ts-node-dev` ou similar) e lint básico.

### Critério de pronto
- [ ] A API é inicializável via script NPM e responde em uma porta configurável (ex.: 3000).
- [ ] A estrutura de pastas segue o padrão definido no refinamento técnico.
- [ ] O endpoint `/health` responde com JSON simples sem depender de Firebase.
- [ ] O projeto está pronto para receber configuração de Firebase Admin e endpoints de domínio.

### Prompt de execução
Dentro da pasta `api/`, inicialize um projeto Node.js com TypeScript e Express, configurando `tsconfig`, scripts de build/dev e uma estrutura de pastas em camadas (`controllers`, `services`, `repositories`, `middlewares`, `routes`, `config`, `firebase`). Implemente um servidor Express mínimo com um endpoint `GET /health` para teste, preparando o projeto para integração com Firebase Admin nas próximas tasks.


