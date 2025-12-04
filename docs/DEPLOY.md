# Guia de Deploy - Firebase

Este guia explica como fazer deploy do aplicativo Angular e da API Node.js no Firebase.

## 📋 Pré-requisitos

1. **Firebase CLI instalado globalmente:**
   ```bash
   npm install -g firebase-tools
   ```

2. **Login no Firebase:**
   ```bash
   firebase login
   ```

3. **Inicializar projeto Firebase (se ainda não fez):**
   ```bash
   firebase init
   ```
   - Selecione: Hosting, Functions, Firestore, Storage
   - Escolha o projeto Firebase existente ou crie um novo

## 🚀 Opções de Deploy

### Opção 1: Deploy Completo (Recomendado)

Deploy do frontend Angular no Firebase Hosting e da API como Firebase Function.

#### 1.1. Configurar API como Firebase Function

Primeiro, precisamos adaptar a API para funcionar como uma Firebase Function:

**Criar `functions/src/api.ts`:**

```typescript
import * as functions from 'firebase-functions';
import * as express from 'express';
import * as cors from 'cors';
// Importar todas as rotas da sua API
import { medicamentosRoutes } from '../../api/src/routes/medicamentos.routes';
import { healthRoutes } from '../../api/src/routes/health.routes';

const app = express();

// Middlewares
app.use(cors({ origin: true }));
app.use(express.json());

// Rotas
app.use('/health', healthRoutes);
app.use('/medicamentos', medicamentosRoutes);

// Exportar como Cloud Function
export const api = functions.https.onRequest(app);
```

#### 1.2. Deploy

```bash
# Deploy de tudo (Hosting + Functions + Rules)
firebase deploy

# Ou deploy específico:
firebase deploy --only hosting      # Apenas frontend
firebase deploy --only functions    # Apenas API
firebase deploy --only firestore:rules    # Apenas regras do Firestore
firebase deploy --only storage:rules      # Apenas regras do Storage
```

### Opção 2: Frontend no Firebase Hosting + API no Cloud Run

Esta opção mantém a API como um serviço Express independente no Google Cloud Run.

#### 2.1. Preparar API para Cloud Run

**Criar `api/Dockerfile`:**

```dockerfile
FROM node:18-alpine

WORKDIR /app

# Copiar arquivos de dependências
COPY package*.json ./
RUN npm ci --only=production

# Copiar código fonte
COPY . .

# Build
RUN npm run build

# Expor porta
EXPOSE 8080

# Variável de ambiente para Cloud Run
ENV PORT=8080

# Comando de start
CMD ["node", "dist/index.js"]
```

**Criar `api/.dockerignore`:**

```
node_modules
dist
.env
*.log
.git
```

#### 2.2. Deploy no Cloud Run

```bash
# 1. Build da imagem Docker
cd api
gcloud builds submit --tag gcr.io/[PROJECT-ID]/meus-medicamentos-api

# 2. Deploy no Cloud Run
gcloud run deploy meus-medicamentos-api \
  --image gcr.io/[PROJECT-ID]/meus-medicamentos-api \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars NODE_ENV=production
```

#### 2.3. Atualizar variáveis de ambiente do frontend

No arquivo `frontend/src/environments/environment.production.ts`, atualize a URL da API:

```typescript
export const environment = {
  production: true,
  apiBaseUrl: 'https://meus-medicamentos-api-[hash]-uc.a.run.app'
};
```

#### 2.4. Deploy do Frontend

```bash
firebase deploy --only hosting
```

### Opção 3: Frontend no Firebase Hosting + API em servidor próprio

Se você tem um servidor próprio (VPS, Heroku, Railway, etc.), pode fazer deploy apenas do frontend:

```bash
firebase deploy --only hosting
```

E configurar a API no seu servidor normalmente.

## 🔧 Configurações Importantes

### Variáveis de Ambiente

#### Frontend (Angular)

Criar `frontend/src/environments/environment.production.ts`:

```typescript
export const environment = {
  production: true,
  firebase: {
    apiKey: "sua-api-key",
    authDomain: "seu-projeto.firebaseapp.com",
    projectId: "seu-projeto-id",
    storageBucket: "seu-projeto.appspot.com",
    messagingSenderId: "123456789",
    appId: "seu-app-id"
  },
  apiBaseUrl: "https://sua-api-url.com" // URL da API em produção
};
```

#### API (Node.js)

Se usando Cloud Run ou servidor próprio, configure as variáveis de ambiente:

```bash
# Cloud Run
gcloud run services update meus-medicamentos-api \
  --set-env-vars FIREBASE_PROJECT_ID=seu-projeto-id

# Ou via arquivo .env (servidor próprio)
FIREBASE_PROJECT_ID=seu-projeto-id
NODE_ENV=production
PORT=8080
```

### Regras de Segurança

#### Firestore Rules (`firestore.rules`)

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /medicamentos/{medicamentoId} {
      allow read, write: if request.auth != null 
        && request.auth.uid == resource.data.criadoPor;
      allow create: if request.auth != null 
        && request.auth.uid == request.resource.data.criadoPor;
    }
  }
}
```

#### Storage Rules (`storage.rules`)

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /medicamentos/{userId}/{medicamentoId}/{allPaths=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## 📝 Scripts de Deploy

Adicione ao `package.json` na raiz:

```json
{
  "scripts": {
    "deploy": "firebase deploy",
    "deploy:hosting": "firebase deploy --only hosting",
    "deploy:functions": "firebase deploy --only functions",
    "deploy:rules": "firebase deploy --only firestore:rules,storage:rules",
    "build:prod": "npm run build:frontend:prod",
    "build:frontend:prod": "cd frontend && npm run build -- --configuration production"
  }
}
```

## ✅ Checklist de Deploy

- [ ] Firebase CLI instalado e logado
- [ ] Projeto Firebase criado/configurado
- [ ] Variáveis de ambiente configuradas
- [ ] Build de produção do frontend testado localmente
- [ ] Regras de Firestore e Storage configuradas
- [ ] API configurada (Functions ou Cloud Run)
- [ ] URLs da API atualizadas no frontend
- [ ] Testes realizados em ambiente de produção

## 🐛 Troubleshooting

### Erro: "Hosting setup has not been initialized"

```bash
firebase init hosting
```

### Erro: "Functions directory does not exist"

```bash
firebase init functions
```

### Build do Angular falha

Verifique se todas as dependências estão instaladas:

```bash
cd frontend
npm install
npm run build -- --configuration production
```

### API não responde após deploy

- Verifique os logs: `firebase functions:log` ou `gcloud run services logs read`
- Confirme que as variáveis de ambiente estão configuradas
- Verifique se o CORS está configurado corretamente

## 🔗 URLs Após Deploy

- **Frontend:** `https://seu-projeto.web.app` ou `https://seu-projeto.firebaseapp.com`
- **API (Functions):** `https://us-central1-seu-projeto.cloudfunctions.net/api`
- **API (Cloud Run):** `https://meus-medicamentos-api-[hash]-uc.a.run.app`

## 📚 Recursos Adicionais

- [Firebase Hosting Docs](https://firebase.google.com/docs/hosting)
- [Firebase Functions Docs](https://firebase.google.com/docs/functions)
- [Cloud Run Docs](https://cloud.google.com/run/docs)
- [Angular Deployment Guide](https://angular.io/guide/deployment)

