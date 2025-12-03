# API - Meus Medicamentos

API RESTful Node.js + Express + TypeScript para o sistema de controle de estoque familiar de medicamentos.

## Tecnologias

- Node.js 18+
- Express
- TypeScript
- Firebase Admin SDK

## Estrutura (a ser criada)

```
src/
  controllers/    # Controladores de rotas
  services/       # Lógica de negócio
  repositories/   # Acesso a dados (Firestore)
  middlewares/    # Autenticação, validação, tratamento de erros
  routes/         # Definição de rotas
  config/         # Configurações da aplicação
  firebase/       # Inicialização do Firebase Admin
  models/         # Interfaces e tipos
```

## Endpoints

| Método | Endpoint                        | Descrição                  |
| ------ | ------------------------------- | -------------------------- |
| POST   | `/auth/login`                   | Autenticação               |
| GET    | `/medicamentos`                 | Listar medicamentos        |
| POST   | `/medicamentos`                 | Criar medicamento          |
| GET    | `/medicamentos/:id`             | Buscar por ID              |
| PUT    | `/medicamentos/:id`             | Atualizar medicamento      |
| PATCH  | `/medicamentos/:id/quantidade`  | Atualizar quantidade       |
| DELETE | `/medicamentos/:id`             | Remover medicamento        |

## Scripts

```bash
npm run dev     # Servidor de desenvolvimento com hot reload
npm run build   # Compilar TypeScript
npm start       # Executar build de produção
npm run lint    # Verificação de código
```

## Configuração

Criar arquivo `.env` na raiz da pasta `api/`:

```env
PORT=3000
NODE_ENV=development
FIREBASE_PROJECT_ID=seu-projeto
FIREBASE_PRIVATE_KEY=sua-chave
FIREBASE_CLIENT_EMAIL=seu-email
```

**IMPORTANTE:** Nunca versionar o arquivo `.env` ou credenciais do Firebase.

