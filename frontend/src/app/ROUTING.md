# 🧭 Roteamento - Meus Medicamentos

Este documento descreve a estrutura de roteamento da aplicação Angular.

## 📋 Visão Geral

A aplicação utiliza roteamento moderno do Angular 18 com:
- **Standalone Components**
- **Lazy Loading** com `loadComponent`
- **Layouts** aplicados por grupo de rotas
- **Preparação para Guards** de autenticação

---

## 🎯 Estrutura de Rotas

### Rotas Públicas (AuthLayout)

| Rota | Componente | Layout | Descrição |
|------|------------|-------|-----------|
| `/login` | LoginPageComponent | AuthLayout | Página de login |
| `/auth/login` | LoginPageComponent | AuthLayout | Alias para `/login` |

**Características:**
- ✅ Layout limpo e centrado (`AuthLayoutComponent`)
- ✅ Sem autenticação necessária
- ✅ Lazy loaded

### Rotas Protegidas (MainLayout)

| Rota | Componente | Layout | Descrição |
|------|------------|-------|-----------|
| `/medicamentos` | MedicamentosListPageComponent | MainLayout | Lista de medicamentos |
| `/medicamentos/novo` | MedicamentosNewPageComponent | MainLayout | Cadastro de novo medicamento |
| `/medicamentos/:id` | MedicamentosDetailPageComponent | MainLayout | Detalhes/edição de medicamento |

**Características:**
- ✅ Layout completo com header e footer (`MainLayoutComponent`)
- ⚠️ **TODO:** Protegidas por `AuthGuard` (será implementado nas próximas tasks)
- ✅ Lazy loaded

### Rotas Especiais

| Rota | Componente | Layout | Descrição |
|------|------------|-------|-----------|
| `/404` | NotFoundPageComponent | MainLayout | Página não encontrada |
| `/` | - | - | Redireciona para `/medicamentos` |
| `/**` | - | - | Redireciona para `/404` |

---

## 🏗️ Arquitetura de Rotas

### Estrutura Hierárquica

```
app.routes.ts
├── /auth (AuthLayout)
│   └── /login → LoginPageComponent (lazy)
│
├── /login → redirect to /auth/login
│
└── / (MainLayout)
    ├── /medicamentos
    │   ├── '' → MedicamentosListPageComponent (lazy)
    │   ├── /novo → MedicamentosNewPageComponent (lazy)
    │   └── /:id → MedicamentosDetailPageComponent (lazy)
    │
    ├── /404 → NotFoundPageComponent (lazy)
    │
    └── '' → redirect to /medicamentos
```

### Layouts

#### AuthLayoutComponent
- **Uso:** Páginas de autenticação
- **Características:** Layout limpo, centrado, com gradiente de fundo
- **Aplicado em:** `/auth/*`

#### MainLayoutComponent
- **Uso:** Páginas autenticadas
- **Características:** Header, footer, área de conteúdo
- **Aplicado em:** Rotas principais (`/medicamentos/*`, `/404`)

---

## ⚡ Lazy Loading

Todas as páginas utilizam **lazy loading** através de `loadComponent`:

```typescript
{
  path: 'medicamentos',
  loadComponent: () =>
    import('./features/medicamentos/pages/medicamentos-list-page/medicamentos-list-page.component').then(
      m => m.MedicamentosListPageComponent
    )
}
```

**Benefícios:**
- ✅ Redução do bundle inicial
- ✅ Carregamento sob demanda
- ✅ Melhor performance

---

## 🔒 Segurança (Futuro)

### Guards Planejados

As rotas protegidas terão o guard `AuthGuard` aplicado:

```typescript
{
  path: '',
  component: MainLayoutComponent,
  canActivate: [AuthGuard], // TODO: Implementar
  children: [
    // Rotas protegidas
  ]
}
```

**Comportamento esperado:**
- ✅ Verificar se usuário está autenticado
- ✅ Redirecionar para `/login` se não autenticado
- ✅ Permitir acesso se autenticado

---

## 📝 Convenções

### Nomenclatura de Rotas

- **Rotas públicas:** `/login`, `/auth/*`
- **Rotas protegidas:** `/medicamentos/*`
- **Rotas de erro:** `/404`
- **Parâmetros:** `:id`, `:slug`

### Estrutura de Arquivos

```
features/
  auth/
    pages/
      login-page/
        login-page.component.ts
  medicamentos/
    pages/
      medicamentos-list-page/
        medicamentos-list-page.component.ts
      medicamentos-new-page/
        medicamentos-new-page.component.ts
      medicamentos-detail-page/
        medicamentos-detail-page.component.ts
```

---

## 🚀 Navegação

### Programática

```typescript
import { Router } from '@angular/router';

constructor(private router: Router) {}

navigateToMedicamentos() {
  this.router.navigate(['/medicamentos']);
}

navigateToNew() {
  this.router.navigate(['/medicamentos/novo']);
}

navigateToDetail(id: string) {
  this.router.navigate(['/medicamentos', id]);
}
```

### Template

```html
<a routerLink="/medicamentos">Medicamentos</a>
<a routerLink="/medicamentos/novo">Novo</a>
<a [routerLink]="['/medicamentos', medicamento.id]">Detalhes</a>
```

---

## 🔄 Fluxo de Navegação

### Usuário Não Autenticado

```
/ → /medicamentos → (AuthGuard) → /login
```

### Usuário Autenticado

```
/ → /medicamentos → ✅ Acesso permitido
/login → (AuthGuard) → /medicamentos (se já autenticado)
```

---

## 📚 Referências

- [Angular Router](https://angular.io/guide/router)
- [Lazy Loading](https://angular.io/guide/lazy-loading-ngmodules)
- [Route Guards](https://angular.io/guide/router#preventing-unauthorized-access)

---

**Última atualização:** Task 4 - Configuração de roteamento principal e layouts

