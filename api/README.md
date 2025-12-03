# 🔥 Meus Medicamentos API

API REST para o sistema de controle de estoque familiar de medicamentos.

## 📋 Tecnologias

- **Node.js** >= 18
- **TypeScript** 5.x
- **Express** 4.x
- **Firebase Admin SDK** 12.x

## 📁 Estrutura de Pastas

```
api/
├── src/
│   ├── config/           # Configurações (env, constantes)
│   ├── controllers/      # Controllers (entrada HTTP)
│   ├── services/         # Services (lógica de negócio)
│   ├── repositories/     # Repositories (acesso a dados)
│   ├── middlewares/      # Middlewares Express
│   ├── routes/           # Definição de rotas
│   ├── firebase/         # Configuração Firebase Admin
│   ├── models/           # Interfaces e tipos
│   ├── utils/            # Funções utilitárias
│   ├── app.ts            # Configuração do Express
│   └── index.ts          # Entrypoint
├── dist/                 # Código compilado (gerado)
├── package.json
├── tsconfig.json
└── .eslintrc.json
```

## 🚀 Começando

### Pré-requisitos

- Node.js >= 18
- npm ou yarn

### Instalação

```bash
# Na pasta api/
npm install
```

### Configuração

1. Copie o arquivo de exemplo de ambiente:

```bash
cp env.example .env
```

2. Edite o arquivo `.env` com suas configurações:

```env
PORT=3000
NODE_ENV=development
CORS_ORIGIN=http://localhost:4200
```

### Executando

```bash
# Desenvolvimento (com hot-reload)
npm run dev

# Build para produção
npm run build

# Executar build de produção
npm start
```

## 📡 Endpoints

### Health Check

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/health` | Status de saúde da API |
| GET | `/health/details` | Detalhes (apenas em dev) |

#### Exemplo de resposta

```json
{
  "status": "ok",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "uptime": 3600,
  "environment": "development",
  "version": "1.0.0"
}
```

### Medicamentos (a implementar)

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/api/medicamentos` | Lista todos |
| GET | `/api/medicamentos/:id` | Busca por ID |
| POST | `/api/medicamentos` | Cria novo |
| PUT | `/api/medicamentos/:id` | Atualiza |
| PATCH | `/api/medicamentos/:id/quantidade` | Atualiza quantidade |
| DELETE | `/api/medicamentos/:id` | Remove |

## 🏗️ Arquitetura

A API segue uma arquitetura em camadas:

```
Request → Routes → Controllers → Services → Repositories → Firebase
                                    ↓
                              Middlewares
```

### Camadas

1. **Routes**: Define os endpoints e conecta com controllers
2. **Controllers**: Recebe requisições HTTP e retorna respostas
3. **Services**: Contém a lógica de negócio
4. **Repositories**: Abstrai o acesso ao Firestore
5. **Middlewares**: Intercepta requisições (auth, validação, erros)

## 🔒 Segurança

- **Helmet**: Headers de segurança HTTP
- **CORS**: Configurado para aceitar apenas origens permitidas
- **Firebase Auth**: Verificação de tokens JWT (a implementar)

## 📝 Scripts NPM

| Script | Descrição |
|--------|-----------|
| `npm run dev` | Inicia em modo desenvolvimento |
| `npm run build` | Compila TypeScript |
| `npm start` | Executa build de produção |
| `npm run lint` | Verifica código com ESLint |
| `npm run lint:fix` | Corrige problemas de lint |
| `npm run clean` | Remove pasta dist/ |

## 🧪 Testes

```bash
# Testes (a implementar)
npm test
```

---

**Última atualização:** Task 20 - Setup da API
