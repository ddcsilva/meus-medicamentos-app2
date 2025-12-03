# 💊 Meus Medicamentos

**Sistema de Controle de Estoque Familiar de Medicamentos**

MVP Frontend + API Node + Firebase

---

## 📋 Visão Geral

O **Meus Medicamentos** é um sistema que permite controlar de forma fácil, rápida e organizada o estoque doméstico de medicamentos de uma família.

### Principais Funcionalidades (MVP)

- ✅ Cadastro completo de medicamentos (nome, droga, validade, quantidade, foto opcional)
- ✅ Consulta rápida com busca e filtros
- ✅ Controle de validade com alertas visuais
- ✅ Atualização de quantidade com um clique
- ✅ Notificações de vencimento e baixo estoque
- ✅ Compartilhamento de estoque entre usuários da família

---

## 🏗️ Arquitetura

| Camada           | Tecnologia              | Responsabilidade                                               |
| ---------------- | ----------------------- | -------------------------------------------------------------- |
| **Frontend**     | Angular 18              | UI/UX, cadastro, consulta, filtros, atualização de quantidade  |
| **Backend**      | Node.js + Express + TS  | Regras server-side, sanitização, integração com Firebase Admin |
| **Auth**         | Firebase Authentication | Login seguro via e-mail/senha                                  |
| **Database**     | Firestore               | Armazenamento de medicamentos                                  |
| **Storage**      | Firebase Storage        | Fotos opcionais dos medicamentos                               |
| **Functions**    | Cloud Functions         | Notificações automáticas de validade e estoque                 |

---

## 📁 Estrutura do Projeto

```
meus-medicamentos/
├── frontend/          # Aplicação Angular 18
│   └── src/
│       └── app/
│           ├── core/           # Serviços globais, guards, interceptors
│           ├── shared/         # Componentes reutilizáveis, pipes, directives
│           ├── features/       # Módulos de funcionalidades (auth, medicamentos)
│           └── layout/         # Layouts da aplicação
│
├── api/               # API Node.js + Express + TypeScript
│   └── src/
│       ├── controllers/        # Controladores de rotas
│       ├── services/           # Lógica de negócio
│       ├── repositories/       # Acesso a dados (Firestore)
│       ├── middlewares/        # Autenticação, validação, erros
│       ├── routes/             # Definição de rotas
│       ├── config/             # Configurações
│       └── firebase/           # Inicialização Firebase Admin
│
├── functions/         # Firebase Cloud Functions
│   └── src/
│       └── ...                 # Funções de notificação (futuro)
│
├── refinamento/       # Documentação do projeto
│   ├── historia.md             # PRD - Product Requirements Document
│   ├── refinamento.md          # Refinamento técnico detalhado
│   └── task_*.md               # Tasks de desenvolvimento
│
├── package.json       # Scripts de orquestração do monorepo
├── .gitignore         # Arquivos ignorados pelo Git
└── README.md          # Este arquivo
```

---

## 🚀 Como Executar

### Pré-requisitos

- Node.js 18+
- npm ou yarn
- Conta Firebase configurada

### Instalação

```bash
# Instalar dependências de todos os projetos
npm run install:all

# Ou instalar individualmente
npm run install:frontend
npm run install:api
npm run install:functions
```

### Desenvolvimento

```bash
# Rodar frontend e API simultaneamente
npm run dev

# Ou rodar separadamente
npm run dev:frontend   # Angular em http://localhost:4200
npm run dev:api        # API em http://localhost:3000
```

### Build

```bash
npm run build:frontend
npm run build:api
npm run build:functions
```

---

## 📖 Documentação

- **PRD (Product Requirements Document):** [`refinamento/historia.md`](./refinamento/historia.md)
- **Refinamento Técnico:** [`refinamento/refinamento.md`](./refinamento/refinamento.md)
- **Tasks de Desenvolvimento:** `refinamento/task_*.md`

---

## 🛠️ Tecnologias

### Frontend
- Angular 18 (Standalone Components, Signals)
- Angular Material (opcional)
- RxJS
- TypeScript

### Backend
- Node.js
- Express
- TypeScript
- Firebase Admin SDK

### Firebase
- Authentication (e-mail/senha)
- Firestore (banco de dados)
- Storage (imagens)
- Cloud Functions (notificações)

---

## 📊 Endpoints da API

| Método | Endpoint                        | Descrição                        |
| ------ | ------------------------------- | -------------------------------- |
| POST   | `/auth/login`                   | Autenticação de usuário          |
| GET    | `/medicamentos`                 | Listar medicamentos              |
| POST   | `/medicamentos`                 | Criar medicamento                |
| GET    | `/medicamentos/:id`             | Buscar medicamento por ID        |
| PUT    | `/medicamentos/:id`             | Atualizar medicamento            |
| PATCH  | `/medicamentos/:id/quantidade`  | Atualizar quantidade (+/-)       |
| DELETE | `/medicamentos/:id`             | Remover medicamento              |

---

## 🔒 Segurança

- Autenticação obrigatória via Firebase Auth
- Validação de token em todas as requisições da API
- Regras de segurança do Firestore por família
- Variáveis sensíveis em arquivos `.env` (não versionados)

---

## 📅 Roadmap

### V1 (MVP) ✅
- Login, CRUD de medicamentos, filtros, notificações básicas

### V2 (Futuro)
- Histórico de alterações, lotes múltiplos, gráficos

### V3 (Futuro)
- PWA, push notifications, categorias, QR code

### V4 (Futuro)
- App nativo, OCR de bula, integrações farmacêuticas

---

## 📝 Licença

MIT License - Projeto pessoal para controle familiar de medicamentos.

