## Task 3 – Organização de pastas Angular (core, shared, features, layout)

### Nome da Task
Estruturar pastas do frontend conforme arquitetura definida

### Objetivo
Criar a estrutura de diretórios do frontend Angular seguindo o refinamento técnico (`core/`, `shared/`, `features/`, `layout/`) e preparar arquivos de índice e configuração necessários.

### Principais entregas
- **Estrutura de pastas criada**: `src/app/core`, `src/app/shared`, `src/app/features`, `src/app/layout`.
- **Subpastas do core**: `services/`, `guards/`, `interceptors/`, `api/`, `config/`.
- **Subpastas do shared**: `components/`, `directives/`, `pipes/`, `ui/`, `models/`.
- **Subpastas de features**: `features/auth`, `features/medicamentos` com `pages/`, `components/`, `services/`, `models/`.
- **Subpastas de layout**: `layout/main-layout`, `layout/auth-layout` com componentes placeholder.

### Critério de pronto
- [ ] Todas as pastas descritas no refinamento estão criadas na árvore `src/app`.
- [ ] Existem componentes standalone placeholder para `MainLayout` e `AuthLayout`.
- [ ] Não há imports quebrados ou erros de compilação devido à criação da nova estrutura.
- [ ] A documentação rápida (comentários ou arquivo `STRUCTURE.md`) descreve a responsabilidade de cada pasta.

### Prompt de execução
No projeto Angular em `frontend/`, crie a estrutura de pastas `core/`, `shared/`, `features/` e `layout/` dentro de `src/app`, com as subpastas e arquivos básicos conforme descrito no refinamento técnico. Adicione componentes standalone simples para `MainLayout` e `AuthLayout`, além de arquivos de índice ou comentários explicando o papel de cada pasta, garantindo que o projeto continue compilando normalmente.


