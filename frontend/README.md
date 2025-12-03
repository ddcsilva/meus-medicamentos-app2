# Frontend - Meus Medicamentos

Aplicação Angular 18 para o sistema de controle de estoque familiar de medicamentos.

## Tecnologias

- Angular 18
- Standalone Components
- Angular Signals
- TypeScript
- SCSS

## Estrutura

```
src/
  app/
    app.component.ts      # Componente raiz
    app.config.ts         # Configuração da aplicação
    app.routes.ts         # Rotas principais
    features/             # Módulos de funcionalidades
      auth/               # Autenticação
        pages/
          login-page/     # Página de login
      medicamentos/       # CRUD de medicamentos
        pages/
          medicamentos-list-page/  # Lista de medicamentos
    core/                 # Serviços globais, guards, interceptors, API (Task 3)
    shared/               # Componentes reutilizáveis, pipes, directives (Task 3)
    layout/               # Layouts (main, auth) (Task 3)
```

## Primeiros Passos

```bash
# Instalar dependências
npm install

# Executar servidor de desenvolvimento
npm start

# A aplicação estará disponível em http://localhost:4200
```

## Scripts

```bash
npm start       # Servidor de desenvolvimento
npm run build   # Build de produção
npm run lint    # Verificação de código
npm run test    # Testes unitários
```

## Configuração

Configurar variáveis de ambiente em:
- `src/environments/environment.ts` (desenvolvimento)
- `src/environments/environment.prod.ts` (produção)

