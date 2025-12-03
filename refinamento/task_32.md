## Task 32 – Organização de scripts e ambientes (.env) para frontend e backend

### Nome da Task
Padronizar scripts de execução e variáveis de ambiente

### Objetivo
Organizar scripts NPM e arquivos de ambiente (`.env`) para frontend, backend e functions, garantindo forma consistente de configurar URLs, chaves e portas, facilitando desenvolvimento e deploy.

### Principais entregas
- **Scripts no `package.json` raiz**: comandos para instalar, rodar e buildar frontend e API.
- **Arquivos `.env`**: templates como `.env.example` em `frontend/`, `api/` e `functions/` com variáveis necessárias.
- **Leitura de env na API**: módulo de configuração centralizado (`config/env.ts`) consumindo `process.env`.
- **Documentação rápida**: seção no `README` explicando como configurar os ambientes.

### Critério de pronto
- [ ] É possível iniciar frontend e backend com comandos simples documentados.
- [ ] Todas as variáveis sensíveis são lidas de `.env` (não hard-coded).
- [ ] Existem exemplos de `.env` com descrições básicas dos valores esperados.
- [ ] A organização está alinhada com a necessidade de rodar localmente e em produção.

### Prompt de execução
Padronize os scripts NPM no `package.json` raiz e nos projetos `frontend/`, `api/` e `functions/`, adicionando também arquivos `.env.example` que sirvam de modelo para configuração local e futura produção. Implemente um módulo de configuração na API que leia e valide as variáveis de ambiente necessárias (como porta, credenciais Firebase Admin, URLs), e documente no `README` os passos para configurar e rodar cada parte do sistema.


