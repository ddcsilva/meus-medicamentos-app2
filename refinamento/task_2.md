## Task 2 – Inicializar projeto Angular 18 com roteamento

### Nome da Task
Bootstrap do frontend Angular 18 com roteamento e estilos base

### Objetivo
Criar o projeto Angular 18 dentro de `frontend/`, com suporte a roteamento, uso de standalone components e configuração inicial de estilos globais.

### Principais entregas
- **Projeto Angular criado**: aplicação inicial em `frontend/` usando Angular 18.
- **Roteamento configurado**: `app.routes.ts` com rotas vazias principais (`/login`, `/medicamentos`), utilizando `provideRouter`.
- **Configuração de bootstrap**: `main.ts` utilizando `bootstrapApplication` com `provideRouter` e demais providers base.
- **Estilos globais**: configuração de `styles.scss` (ou equivalente) com reset básico e variáveis de cor iniciais.

### Critério de pronto
- [ ] O projeto Angular 18 é criado e roda com `npm start`/`ng serve` dentro de `frontend/`.
- [ ] O roteamento está ativo e as rotas `/login` e `/medicamentos` retornam componentes placeholder.
- [ ] O bootstrap utiliza standalone components (sem módulos de app tradicionais).
- [ ] Os estilos globais carregam sem erros e a aplicação abre sem warnings críticos no console.

### Prompt de execução
Dentro da pasta `frontend/`, inicialize um projeto Angular 18 com roteamento habilitado, usando standalone components e `bootstrapApplication` em `main.ts`. Configure `app.routes.ts` com rotas base (`/login` e `/medicamentos`) apontando para componentes placeholder standalone, adicione estilos globais mínimos em `styles.scss` (cores neutras e tipografia simples) e garanta que o comando de desenvolvimento execute sem erros.


