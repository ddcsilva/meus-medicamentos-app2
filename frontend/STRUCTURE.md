# 📁 Estrutura do Projeto Angular - Meus Medicamentos

Este documento descreve a organização de pastas e arquivos do projeto frontend.

## 📂 Visão Geral

```
src/app/
├── core/              # Módulo central - serviços globais, guards, interceptors
├── shared/            # Componentes, diretivas, pipes e modelos reutilizáveis
├── features/          # Módulos de funcionalidades (auth, medicamentos)
├── layout/            # Componentes de layout (main, auth)
├── app.component.ts   # Componente raiz
├── app.config.ts      # Configuração da aplicação
└── app.routes.ts      # Rotas principais
```

---

## 🎯 Core (`src/app/core/`)

**Responsabilidade:** Serviços globais, guards, interceptors e configurações compartilhadas.

### Subpastas

| Pasta | Descrição | Exemplos |
|-------|-----------|----------|
| `services/` | Serviços globais da aplicação | AuthService, ErrorService, NotificationService, FirebaseService, ApiService |
| `guards/` | Guards de roteamento | AuthGuard, RoleGuard |
| `interceptors/` | Interceptors HTTP | AuthInterceptor, ErrorInterceptor, LoadingInterceptor |
| `api/` | Configuração e serviços de API HTTP | Base URL, configurações de requisição |
| `config/` | Configurações globais | Constantes, configurações de ambiente |

### Regras

- ✅ Todos os serviços são `providedIn: 'root'`
- ✅ Guards e interceptors são registrados em `app.config.ts`
- ✅ Configurações são tipadas e exportadas como constantes

---

## 🔄 Shared (`src/app/shared/`)

**Responsabilidade:** Componentes, diretivas, pipes e utilitários reutilizáveis compartilhados entre features.

### Subpastas

| Pasta | Descrição | Exemplos |
|-------|-----------|----------|
| `components/` | Componentes reutilizáveis | CardComponent, ButtonComponent, ModalComponent, LoadingComponent |
| `directives/` | Diretivas customizadas | ClickOutsideDirective, AutoFocusDirective |
| `pipes/` | Pipes de transformação | DateFormatPipe, CurrencyPipe, StatusPipe |
| `ui/` | Componentes de UI específicos | ButtonComponent, InputComponent, CardComponent, BadgeComponent |
| `models/` | Interfaces, tipos e modelos compartilhados | ApiResponse, Pagination, FilterOptions |

### Regras

- ✅ Todos os componentes são standalone
- ✅ Componentes devem ser genéricos e reutilizáveis
- ✅ Models são interfaces TypeScript exportadas
- ✅ Pipes e directives são standalone

---

## 🎨 Features (`src/app/features/`)

**Responsabilidade:** Módulos de funcionalidades auto-contidas. Cada feature possui suas próprias páginas, componentes, serviços e modelos.

### Estrutura por Feature

```
feature-name/
├── pages/          # Páginas/rotas da feature
├── components/     # Componentes específicos da feature
├── services/       # Serviços específicos da feature
└── models/         # Modelos e interfaces da feature
```

### Features Atuais

#### 🔐 Auth (`features/auth/`)

- **Páginas:** Login, Registro (futuro)
- **Componentes:** Formulários de autenticação
- **Serviços:** Lógica de autenticação específica
- **Models:** User, LoginRequest, LoginResponse

#### 💊 Medicamentos (`features/medicamentos/`)

- **Páginas:** Lista, Cadastro, Edição, Detalhes
- **Componentes:** Cards, Formulários, Filtros, Badges de status
- **Serviços:** CRUD de medicamentos, lógica de negócio
- **Models:** Medicamento, Filtros, Status, etc.

### Regras

- ✅ Cada feature é independente e pode ser lazy-loaded
- ✅ Componentes e serviços são standalone
- ✅ Models são interfaces TypeScript exportadas
- ✅ Páginas são componentes standalone que podem ser usados diretamente nas rotas

---

## 🎭 Layout (`src/app/layout/`)

**Responsabilidade:** Componentes de layout que envolvem as páginas da aplicação.

### Componentes

| Componente | Descrição | Uso |
|------------|-----------|-----|
| `MainLayoutComponent` | Layout principal para rotas autenticadas | Header, footer, sidebar, área de conteúdo |
| `AuthLayoutComponent` | Layout para páginas de autenticação | Layout limpo e centrado para login/registro |

### Estrutura

```
layout/
├── main-layout/      # Layout principal (autenticado)
└── auth-layout/      # Layout de autenticação
```

### Uso

Os layouts são aplicados nas rotas através do roteamento do Angular. Cada layout contém um `<router-outlet>` onde as páginas são renderizadas.

---

## 📝 Convenções de Nomenclatura

### Arquivos

- **Componentes:** `kebab-case.component.ts` (ex: `medicamento-card.component.ts`)
- **Serviços:** `kebab-case.service.ts` (ex: `medicamentos.service.ts`)
- **Models:** `kebab-case.model.ts` (ex: `medicamento.model.ts`)
- **Guards:** `kebab-case.guard.ts` (ex: `auth.guard.ts`)
- **Interceptors:** `kebab-case.interceptor.ts` (ex: `auth.interceptor.ts`)

### Classes

- **Componentes:** `PascalCaseComponent` (ex: `MedicamentoCardComponent`)
- **Serviços:** `PascalCaseService` (ex: `MedicamentosService`)
- **Models:** `PascalCase` (ex: `Medicamento`, `User`)
- **Guards:** `PascalCaseGuard` (ex: `AuthGuard`)

### Pastas

- **Todas em kebab-case:** `medicamentos/`, `main-layout/`, `login-page/`

---

## 🚀 Standalone Components

Todo o projeto utiliza **standalone components** do Angular 18. Isso significa:

- ✅ Não há módulos Angular tradicionais
- ✅ Cada componente importa suas próprias dependências
- ✅ Lazy loading é feito através de `loadComponent` ou `loadChildren`
- ✅ Providers são configurados em `app.config.ts` ou no próprio componente

---

## 📦 Imports e Dependências

### Core → Shared
- ✅ Core pode importar de Shared (models, pipes, etc.)

### Features → Core
- ✅ Features podem importar de Core (services, guards, etc.)

### Features → Shared
- ✅ Features podem importar de Shared (components, pipes, models)

### Features → Features
- ❌ Features NÃO devem importar de outras features diretamente

### Layout → Features
- ❌ Layout NÃO deve importar de Features (usa apenas router-outlet)

---

## 🔍 Busca Rápida

| O que você precisa | Onde encontrar |
|-------------------|----------------|
| Serviço de autenticação | `core/services/` |
| Guard de autenticação | `core/guards/` |
| Interceptor HTTP | `core/interceptors/` |
| Componente reutilizável | `shared/components/` ou `shared/ui/` |
| Pipe customizado | `shared/pipes/` |
| Modelo compartilhado | `shared/models/` |
| Página de login | `features/auth/pages/login-page/` |
| Página de medicamentos | `features/medicamentos/pages/` |
| Componente de card de medicamento | `features/medicamentos/components/` |
| Layout principal | `layout/main-layout/` |
| Layout de autenticação | `layout/auth-layout/` |

---

## 📚 Referências

- [Angular Standalone Components](https://angular.io/guide/standalone-components)
- [Angular Routing](https://angular.io/guide/router)
- [Angular Architecture](https://angular.io/guide/architecture)

---

**Última atualização:** Task 3 - Estruturação de pastas

