# 🔥 Guia de Configuração do Firebase

Este guia explica **exatamente o que você precisa fazer no Firebase Console** para que a aplicação funcione corretamente.

---

## 📋 O que você precisa fazer

### 1. ✅ Frontend (Angular) - JÁ CONFIGURADO

O frontend já está configurado com as credenciais do Firebase em `frontend/src/environments/environment.development.ts`.

**Projeto ID:** `meus-medicamentos-94500`

---

### 2. ⚠️ Backend (API Node.js) - PRECISA CONFIGURAR

O backend precisa das **credenciais do Firebase Admin SDK** para:
- Validar tokens de autenticação
- Acessar o Firestore
- Fazer upload de imagens no Storage

---

## 🚀 Passo a Passo no Firebase Console

### Passo 1: Acessar o Firebase Console

1. Acesse: https://console.firebase.google.com/
2. Faça login com sua conta Google
3. Selecione o projeto: **meus-medicamentos-94500**

---

### Passo 2: Habilitar Authentication (Email/Password)

1. No menu lateral, clique em **"Authentication"** (Autenticação)
2. Clique na aba **"Sign-in method"** (Métodos de login)
3. Clique em **"Email/Password"**
4. Ative o toggle **"Enable"** (Habilitar)
5. Clique em **"Save"** (Salvar)

**Por que?** O frontend precisa que os usuários façam login com email e senha.

---

### Passo 3: Criar Service Account (Para o Backend)

1. No menu lateral, clique no **ícone de engrenagem** ⚙️ ao lado de "Project Overview"
2. Clique em **"Project settings"** (Configurações do projeto)
3. Vá para a aba **"Service accounts"** (Contas de serviço)
4. Clique em **"Generate new private key"** (Gerar nova chave privada)
5. Uma janela de confirmação aparecerá - clique em **"Generate key"**
6. Um arquivo JSON será baixado automaticamente

**⚠️ IMPORTANTE:** Este arquivo contém credenciais sensíveis. **NUNCA** commite no Git!

---

### Passo 4: Salvar o Arquivo de Credenciais

1. O arquivo baixado terá um nome como: `meus-medicamentos-94500-xxxxx.json`
2. **Renomeie** o arquivo para: `firebase-service-account.json`
3. **Mova** o arquivo para a pasta `api/` do seu projeto:

```
D:\Projetos\meus-medicamentos-app2\
└── api\
    └── firebase-service-account.json  ← Coloque aqui
```

---

### Passo 5: Verificar o arquivo .env

O arquivo `api/.env` já está configurado com:

```env
FIREBASE_SERVICE_ACCOUNT_PATH=./firebase-service-account.json
```

Se você colocou o arquivo na pasta `api/`, está correto! ✅

---

### Passo 6: Habilitar Firestore Database

1. No menu lateral, clique em **"Firestore Database"**
2. Se aparecer um botão **"Create database"** (Criar banco de dados):
   - Clique nele
   - Escolha **"Start in test mode"** (Iniciar em modo de teste)
   - Selecione uma localização (ex: `southamerica-east1` para Brasil)
   - Clique em **"Enable"** (Habilitar)

**Por que?** O backend precisa do Firestore para armazenar os medicamentos.

---

### Passo 7: Habilitar Storage

1. No menu lateral, clique em **"Storage"**
2. Se aparecer um botão **"Get started"** (Começar):
   - Clique nele
   - Aceite os termos
   - Escolha **"Start in test mode"** (Iniciar em modo de teste)
   - Clique em **"Next"** (Próximo)
   - Escolha uma localização (ex: `southamerica-east1`)
   - Clique em **"Done"** (Concluído)

**Por que?** O backend precisa do Storage para fazer upload de fotos dos medicamentos.

---

### Passo 8: Configurar Regras de Segurança (Opcional, mas Recomendado)

#### Firestore Rules

1. Vá em **"Firestore Database"** > **"Rules"**
2. Substitua as regras por:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Medicamentos: apenas o dono pode ler/escrever
    match /medicamentos/{medicamentoId} {
      allow read, write: if request.auth != null && 
        resource.data.criadoPor == request.auth.uid;
      allow create: if request.auth != null;
    }
    
    // Usuários: apenas o próprio usuário pode ler/escrever
    match /usuarios/{userId} {
      allow read, write: if request.auth != null && 
        request.auth.uid == userId;
    }
  }
}
```

3. Clique em **"Publish"** (Publicar)

#### Storage Rules

1. Vá em **"Storage"** > **"Rules"**
2. Substitua as regras por:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Fotos de medicamentos: apenas autenticados podem ler/escrever
    match /medicamentos/{userId}/{medicamentoId}/{allPaths=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

3. Clique em **"Publish"** (Publicar)

---

## ✅ Verificação Final

Após seguir todos os passos, verifique:

1. ✅ Arquivo `api/firebase-service-account.json` existe
2. ✅ Authentication está habilitado (Email/Password)
3. ✅ Firestore Database está criado
4. ✅ Storage está habilitado
5. ✅ Regras de segurança configuradas (opcional)

---

## 🧪 Testar a Configuração

### 1. Instalar dependências da API

```bash
cd api
npm install
```

### 2. Iniciar a API

```bash
npm run dev
```

Você deve ver no console:

```
[Firebase] Carregando credenciais do arquivo: D:\Projetos\...\firebase-service-account.json
[Firebase] Admin SDK inicializado com sucesso
🚀 Meus Medicamentos API
📍 Servidor rodando em: http://localhost:3000
```

Se aparecer **"Admin SDK inicializado com sucesso"**, está funcionando! ✅

### 3. Criar um usuário de teste

1. Acesse: http://localhost:4200/auth/login
2. Clique em **"Criar conta"** (se houver) ou use o Firebase Console:
   - Vá em **Authentication** > **Users**
   - Clique em **"Add user"**
   - Digite um email e senha
   - Clique em **"Add user"**

### 4. Fazer login

1. Acesse: http://localhost:4200/auth/login
2. Digite o email e senha criados
3. Clique em **"Entrar"**

Se o login funcionar, a autenticação está configurada! ✅

---

## 🔒 Segurança

### ⚠️ IMPORTANTE: NUNCA commite no Git:

- ❌ `api/firebase-service-account.json`
- ❌ `api/.env` (com credenciais reais)

### ✅ Já está no .gitignore:

- ✅ `api/firebase-service-account.json`
- ✅ `api/.env`

---

## 📚 Recursos Adicionais

- [Documentação Firebase Admin SDK](https://firebase.google.com/docs/admin/setup)
- [Firebase Console](https://console.firebase.google.com/)
- [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/get-started)
- [Storage Security Rules](https://firebase.google.com/docs/storage/security)

---

## ❓ Problemas Comuns

### Erro: "Arquivo de credenciais não encontrado"

**Solução:** Verifique se o arquivo `firebase-service-account.json` está na pasta `api/` e se o caminho no `.env` está correto.

### Erro: "Permission denied"

**Solução:** Verifique as regras de segurança do Firestore e Storage. Certifique-se de que o usuário está autenticado.

### Erro: "Token de autenticação não fornecido"

**Solução:** Verifique se o interceptor de autenticação está funcionando. Faça login no frontend primeiro.

---

## 🎉 Pronto!

Após seguir todos os passos, sua aplicação estará totalmente configurada e pronta para uso!


