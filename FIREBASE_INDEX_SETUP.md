# 🔥 Criar Índice no Firestore (Solução Rápida)

## ⚡ Solução Rápida (1 clique)

O erro forneceu um link direto para criar o índice. **Clique no link abaixo:**

🔗 **https://console.firebase.google.com/v1/r/project/meus-medicamentos-94500/firestore/indexes?create_composite=Clxwcm9qZWN0cy9tZXVzLW1lZGljYW1lbnRvcy05NDUwMC9kYXRhYmFzZXMvKGRlZmF1bHQpL2NvbGxlY3Rpb25Hcm91cHMvbWVkaWNhbWVudG9zL2luZGV4ZXMvXxABGg0KCWNyaWFkb1BvchABGgwKCGNyaWFkb0VtEAIaDAoIX19uYW1lX18QAg**

Isso criará automaticamente o índice necessário.

---

## 📋 Solução Manual (se o link não funcionar)

1. Acesse: https://console.firebase.google.com/
2. Selecione o projeto: **meus-medicamentos-94500**
3. Vá em **Firestore Database** → **Indexes** (Índices)
4. Clique em **"Create Index"** (Criar índice)
5. Configure:
   - **Collection ID**: `medicamentos`
   - **Fields to index**:
     - `criadoPor` - Ascending
     - `criadoEm` - Descending
   - **Query scope**: Collection
6. Clique em **"Create"** (Criar)

O índice levará alguns minutos para ser criado. Você receberá um email quando estiver pronto.

---

## ✅ Verificação

Após criar o índice, aguarde alguns minutos e teste novamente. O erro 500 deve desaparecer.

---

## 💡 Nota

O código foi ajustado para fazer ordenação em memória quando necessário, evitando a necessidade de índices compostos na maioria dos casos. Mas o índice ainda é recomendado para melhor performance.

