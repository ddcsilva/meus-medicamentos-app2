# 🔧 Solução para os Erros

## ❌ Erro 500: Índice do Firestore

**Mensagem:** `The query requires an index`

### ✅ Solução Rápida (Recomendada)

**Clique neste link para criar o índice automaticamente:**

🔗 **https://console.firebase.google.com/v1/r/project/meus-medicamentos-94500/firestore/indexes?create_composite=Clxwcm9qZWN0cy9tZXVzLW1lZGljYW1lbnRvcy05NDUwMC9kYXRhYmFzZXMvKGRlZmF1bHQpL2NvbGxlY3Rpb25Hcm91cHMvbWVkaWNhbWVudG9zL2luZGV4ZXMvXxABGg0KCWNyaWFkb1BvchABGgwKCGNyaWFkb0VtEAIaDAoIX19uYW1lX18QAg**

Isso criará o índice necessário automaticamente.

### ⏳ Aguarde

O índice leva alguns minutos para ser criado. Você receberá um email quando estiver pronto.

### ✅ Código Ajustado

O código foi ajustado para fazer ordenação em memória quando necessário, mas o índice ainda é recomendado para melhor performance.

---

## ❌ Erro 401: Token de Autenticação Não Fornecido

**Mensagem:** `Token de autenticação não fornecido`

### ✅ Soluções

#### 1. Verificar se está logado

1. Acesse: `http://localhost:4200/auth/login`
2. Faça login com um usuário válido do Firebase
3. Verifique se você é redirecionado para `/medicamentos`

#### 2. Verificar Console do Navegador

Abra o DevTools (F12) e verifique:

- Se aparece: `[AuthInterceptor] Token obtido com sucesso` ✅
- Se aparece: `[AuthInterceptor] Usuário não autenticado` ❌

#### 3. Criar Usuário no Firebase

Se você não tem um usuário:

1. Acesse: https://console.firebase.google.com/
2. Vá em **Authentication** → **Users**
3. Clique em **"Add user"**
4. Digite email e senha
5. Clique em **"Add user"**

#### 4. Verificar se a API está rodando

```bash
curl http://localhost:3000/health
```

Deve retornar: `{"status":"ok",...}`

---

## 🔍 Debug

### Verificar Logs do Interceptor

No console do navegador, você deve ver:

```
[AuthInterceptor] Verificando autenticação... { hasCurrentUser: true, url: "..." }
[AuthInterceptor] Token obtido com sucesso
```

Se não aparecer, o usuário não está autenticado.

### Verificar se o Guard está funcionando

O guard deve redirecionar para `/auth/login` se você não estiver autenticado.

---

## ✅ Checklist

- [ ] Índice do Firestore criado (ou aguardando criação)
- [ ] Usuário criado no Firebase Authentication
- [ ] Login realizado no frontend
- [ ] API rodando em `http://localhost:3000`
- [ ] Frontend rodando em `http://localhost:4200`
- [ ] Token sendo enviado (verificar no DevTools → Network → Headers)

---

## 🚀 Teste Completo

1. **Acesse:** `http://localhost:4200`
2. **Faça login** com email e senha
3. **Aguarde** ser redirecionado para `/medicamentos`
4. **Verifique** se a lista de medicamentos carrega

Se ainda houver erro, envie:
- Mensagem de erro completa
- Screenshot do console do navegador
- Logs da API (terminal onde está rodando)

