## Task 1 – Estrutura inicial do repositório fullstack

### Nome da Task
Configurar estrutura raiz do projeto (frontend, API e funções)

### Objetivo
Definir a organização básica do repositório para suportar o frontend Angular, a API Node.js e a futura pasta de Cloud Functions, alinhado ao PRD e ao refinamento técnico.

### Principais entregas
- **Pastas raiz criadas**: `frontend/`, `api/`, `functions/` (opcional para futuro), `docs/` ou `refinamento/` já existente.
- **Arquivos de configuração de workspace**: `package.json` raiz com scripts agregadores (por exemplo, `dev:frontend`, `dev:api`).
- **README inicial**: visão geral rápida do projeto, tecnologias e estrutura de pastas.
- **Arquivo de configuração de versionamento**: `.gitignore` cobrindo Node, Angular, Firebase Functions.

### Critério de pronto
- [ ] As pastas `frontend/`, `api/` e `functions/` estão criadas e versionadas.
- [ ] O `package.json` raiz contém ao menos scripts para instalar e rodar frontend e backend.
- [ ] O `.gitignore` cobre `node_modules`, artefatos de build e arquivos sensíveis.
- [ ] O `README` descreve a estrutura geral e referencia o PRD (`historia.md`) e o refinamento técnico (`refinamento.md`).

### Prompt de execução
Crie a estrutura raiz de um monorepositório para o sistema **Meus Medicamentos – Sistema de Controle de Estoque Familiar de Medicamentos**, com as pastas `frontend/` (Angular 18), `api/` (Node.js + Express, preferencialmente em TypeScript) e `functions/` (Cloud Functions do Firebase, apenas estrutura inicial), além de um `package.json` na raiz que orquestra scripts de instalação e execução. Adicione um `.gitignore` adequado para projetos Node/Angular/Firebase e um `README.md` resumindo arquitetura, relacionando com os documentos `refinamento/historia.md` e `refinamento/refinamento.md`, preparado para evolução futura.


