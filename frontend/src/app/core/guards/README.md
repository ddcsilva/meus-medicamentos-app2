# 🛡️ Guards de Rota - Meus Medicamentos

Este diretório contém os guards de rota para controle de acesso.

---

## authGuard

Guard para proteger rotas que requerem usuário autenticado.

### Comportamento

- ✅ **Usuário autenticado:** Permite acesso à rota
- ❌ **Usuário não autenticado:** Redireciona para `/auth/login`
- ⏳ **Carregando:** Aguarda o estado de autenticação antes de decidir

### Uso

```typescript
import { authGuard } from "@core/guards/auth.guard";

// Em app.routes.ts
{
  path: "medicamentos",
  canActivate: [authGuard],
  component: MedicamentosComponent
}
```

### Rotas Protegidas

- `/medicamentos` - Lista de medicamentos
- `/medicamentos/novo` - Cadastro de novo medicamento
- `/medicamentos/:id` - Detalhes/edição de medicamento
- `/404` - Página não encontrada

---

## guestGuard

Guard inverso para impedir que usuários autenticados acessem rotas públicas.

### Comportamento

- ✅ **Usuário não autenticado:** Permite acesso à rota
- ❌ **Usuário autenticado:** Redireciona para `/medicamentos`
- ⏳ **Carregando:** Aguarda o estado de autenticação antes de decidir

### Uso

```typescript
import { guestGuard } from "@core/guards/auth.guard";

// Em app.routes.ts
{
  path: "login",
  canActivate: [guestGuard],
  component: LoginComponent
}
```

### Rotas Públicas

- `/auth/login` - Página de login

---

## Fluxo de Navegação

### Usuário Não Autenticado

```
/ → authGuard → ❌ → /auth/login
/medicamentos → authGuard → ❌ → /auth/login
/auth/login → guestGuard → ✅ → Exibe login
```

### Usuário Autenticado

```
/ → authGuard → ✅ → /medicamentos
/medicamentos → authGuard → ✅ → Exibe medicamentos
/auth/login → guestGuard → ❌ → /medicamentos
```

---

## Implementação Técnica

### Aguardando Estado de Autenticação

Os guards aguardam o carregamento inicial do estado de autenticação antes de tomar uma decisão:

```typescript
if (authService.authLoading()) {
  await waitForAuthLoading(authService);
}
```

Isso evita redirecionamentos incorretos durante o carregamento inicial da aplicação.

### Timeout

O tempo máximo de espera é de 5 segundos (configurável). Se o estado não carregar nesse tempo, o guard toma uma decisão baseada no estado atual.

---

## Integração com AuthService

Os guards utilizam os signals do `AuthService`:

- `authLoading()` - Verifica se está carregando
- `isAuthenticated()` - Verifica se há usuário autenticado

---

**Última atualização:** Task 9 - Guards de rota

