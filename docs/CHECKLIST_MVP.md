# ✅ Checklist de Validação do MVP

Este documento contém o roteiro de validação do fluxo principal do sistema Meus Medicamentos.

---

## 🔐 1. Autenticação

### Login

- [ ] Acessar `http://localhost:4200`
- [ ] Ser redirecionado para `/auth/login` (se não autenticado)
- [ ] Visualizar formulário de login
- [ ] Tentar login com credenciais inválidas → ver mensagem de erro
- [ ] Fazer login com credenciais válidas
- [ ] Ser redirecionado para `/medicamentos`

### Logout

- [ ] Clicar no botão de logout (no header)
- [ ] Ser redirecionado para `/auth/login`
- [ ] Tentar acessar `/medicamentos` → ser redirecionado para login

### Guard de Rotas

- [ ] Usuário não autenticado não consegue acessar `/medicamentos`
- [ ] Usuário autenticado não é redirecionado para login ao acessar `/medicamentos`

---

## 📋 2. Listagem de Medicamentos

### Visualização

- [ ] Ver lista de medicamentos do usuário
- [ ] Ver estatísticas no topo (Total, Válidos, Prestes, Vencidos)
- [ ] Ver cards com informações básicas de cada medicamento
- [ ] Ver badge de status de validade em cada card
- [ ] Ver estado vazio se não houver medicamentos

### Busca

- [ ] Digitar termo na barra de busca
- [ ] Ver lista filtrada em tempo real
- [ ] Limpar busca e ver todos os medicamentos

### Filtros

- [ ] Clicar em "Todos" → ver todos
- [ ] Clicar em "Válidos" → ver apenas válidos
- [ ] Clicar em "Prestes a vencer" → ver apenas prestes
- [ ] Clicar em "Vencidos" → ver apenas vencidos
- [ ] Combinar filtro com busca

### Ordenação

- [ ] Medicamentos ordenados por data de criação (padrão)

---

## ➕ 3. Cadastro de Medicamento

### Formulário

- [ ] Clicar em "+ Novo Medicamento"
- [ ] Ver formulário de cadastro
- [ ] Preencher campos obrigatórios:
  - [ ] Nome
  - [ ] Droga
  - [ ] Tipo (selecionar)
  - [ ] Quantidade Total
  - [ ] Quantidade Atual
  - [ ] Validade (data)
- [ ] Preencher campos opcionais:
  - [ ] Marca
  - [ ] Laboratório
  - [ ] Quantidade Mínima
  - [ ] Observações
  - [ ] Foto (upload)

### Validação

- [ ] Tentar salvar sem preencher campos obrigatórios → ver erros
- [ ] Preencher todos os campos obrigatórios
- [ ] Clicar em "Salvar"
- [ ] Ver toast de sucesso
- [ ] Ser redirecionado para listagem
- [ ] Ver novo medicamento na lista

---

## ✏️ 4. Edição de Medicamento

### Acesso

- [ ] Clicar em um card de medicamento
- [ ] Ser direcionado para página de detalhes
- [ ] Ver informações completas do medicamento
- [ ] Clicar em "Editar"

### Edição

- [ ] Ver formulário preenchido com dados atuais
- [ ] Alterar alguns campos
- [ ] Clicar em "Salvar"
- [ ] Ver toast de sucesso
- [ ] Voltar para detalhes e ver alterações

---

## 🔢 5. Atualização de Quantidade

### Na Listagem

- [ ] Ver controles de quantidade em cada card
- [ ] Clicar em "+" para incrementar
- [ ] Ver quantidade atualizada imediatamente (otimista)
- [ ] Clicar em "-" para decrementar
- [ ] Ver quantidade atualizada
- [ ] Tentar decrementar abaixo de 0 → não permitir

### Na Página de Detalhes

- [ ] Ver controle de quantidade maior
- [ ] Incrementar e decrementar
- [ ] Ver atualizações refletidas

---

## 🗑️ 6. Exclusão de Medicamento

- [ ] Acessar página de detalhes de um medicamento
- [ ] Clicar em "Excluir"
- [ ] Ver confirmação (se implementado)
- [ ] Confirmar exclusão
- [ ] Ver toast de sucesso
- [ ] Ser redirecionado para listagem
- [ ] Não ver mais o medicamento na lista

---

## 📷 7. Upload de Foto

### Upload

- [ ] No formulário de cadastro/edição
- [ ] Clicar no campo de foto
- [ ] Selecionar imagem do dispositivo
- [ ] Ver preview da imagem
- [ ] Salvar medicamento
- [ ] Ver foto no card e detalhes

### Remoção

- [ ] Na edição, clicar para remover foto
- [ ] Salvar
- [ ] Não ver mais a foto

---

## 🎨 8. UX e Feedback

### Loading

- [ ] Ver indicador de loading ao carregar lista
- [ ] Ver loading no botão ao salvar
- [ ] Ver loading nos controles de quantidade

### Erros

- [ ] Ver mensagem de erro se API falhar
- [ ] Ver botão de "Tentar novamente"
- [ ] Clicar e ver nova tentativa

### Toast/Notificações

- [ ] Ver toast de sucesso ao criar
- [ ] Ver toast de sucesso ao editar
- [ ] Ver toast de sucesso ao excluir
- [ ] Ver toast de erro em caso de falha

### Responsividade

- [ ] Testar em desktop (1920px)
- [ ] Testar em tablet (768px)
- [ ] Testar em mobile (375px)
- [ ] Layout se adapta corretamente

---

## 🔧 9. API (Backend)

### Health Check

```bash
curl http://localhost:3000/health
# Deve retornar: {"status":"ok",...}
```

### Endpoints Protegidos

```bash
# Sem token - deve retornar 401
curl http://localhost:3000/api/medicamentos

# Com token válido - deve retornar lista
curl http://localhost:3000/api/medicamentos \
  -H "Authorization: Bearer <token>"
```

---

## 🔥 10. Firebase

### Authentication

- [ ] Usuário consegue fazer login
- [ ] Token é enviado nas requisições
- [ ] Token é validado no backend

### Firestore

- [ ] Medicamentos são salvos corretamente
- [ ] Índices estão criados (ou criar via link)
- [ ] Queries funcionam sem erro

### Storage

- [ ] Fotos são enviadas
- [ ] URLs são geradas
- [ ] Fotos são exibidas

---

## 📊 Resultado da Validação

| Área | Status | Observações |
|------|--------|-------------|
| Autenticação | ⬜ | |
| Listagem | ⬜ | |
| Cadastro | ⬜ | |
| Edição | ⬜ | |
| Quantidade | ⬜ | |
| Exclusão | ⬜ | |
| Upload Foto | ⬜ | |
| UX/Feedback | ⬜ | |
| API | ⬜ | |
| Firebase | ⬜ | |

**Legenda:**
- ✅ Passou
- ⚠️ Passou com ressalvas
- ❌ Falhou
- ⬜ Não testado

---

## 📝 Notas da Validação

*Adicione aqui observações durante a validação:*

```
Data: ___/___/______
Testador: __________

Observações:
- 
- 
- 
```

---

*Este checklist deve ser executado antes de cada release.*


