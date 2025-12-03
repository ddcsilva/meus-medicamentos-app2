# 🧪 Guia de Testes - Meus Medicamentos

Este documento descreve a abordagem de testes para o sistema Meus Medicamentos, incluindo estrutura, ferramentas e boas práticas.

---

## 📋 Visão Geral

| Camada | Framework | Comando | Cobertura |
|--------|-----------|---------|-----------|
| Frontend (Angular) | Karma + Jasmine | `npm run test:frontend` | Em desenvolvimento |
| API (Node.js) | Jest | `npm run test:api` | Em desenvolvimento |
| Cloud Functions | Jest | `cd functions && npm test` | Futuro |

---

## 🎯 Estratégia de Testes

### Pirâmide de Testes

```
        /\
       /  \      E2E (Cypress/Playwright) - Futuro
      /----\
     /      \    Integração (API + Firebase)
    /--------\
   /          \  Unidade (Services, Utils, Pipes)
  /------------\
```

### Prioridades (MVP)

1. **Testes Unitários** - Lógica de negócio isolada
2. **Testes de Integração** - Fluxos críticos
3. **Testes E2E** - Fluxo principal (futuro)

---

## 🖥️ Frontend (Angular)

### Estrutura de Arquivos

```
frontend/src/app/
├── features/
│   └── medicamentos/
│       ├── services/
│       │   ├── medicamentos.store.ts
│       │   └── medicamentos.store.spec.ts  # Teste do store
│       ├── utils/
│       │   ├── medicamentos-filter.utils.ts
│       │   └── medicamentos-filter.utils.spec.ts  # Já existente
│       └── components/
│           └── medicamento-card/
│               ├── medicamento-card.component.ts
│               └── medicamento-card.component.spec.ts
├── core/
│   └── services/
│       ├── auth.service.ts
│       └── auth.service.spec.ts
└── shared/
    └── ui/
        └── button/
            ├── button.component.ts
            └── button.component.spec.ts
```

### Executando Testes

```bash
# Todos os testes
npm run test:frontend

# Com watch mode
cd frontend && ng test

# Com cobertura
cd frontend && ng test --code-coverage

# Arquivo específico
cd frontend && ng test --include=**/medicamentos-filter.utils.spec.ts
```

### Exemplo: Teste de Serviço

```typescript
// auth.service.spec.ts
import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthService,
        // Mock do Firebase Auth
        { provide: Auth, useValue: mockAuth }
      ]
    });
    service = TestBed.inject(AuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return false when not authenticated', () => {
    expect(service.isAuthenticated()).toBeFalse();
  });
});
```

### Exemplo: Teste de Componente

```typescript
// medicamento-card.component.spec.ts
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MedicamentoCardComponent } from './medicamento-card.component';

describe('MedicamentoCardComponent', () => {
  let component: MedicamentoCardComponent;
  let fixture: ComponentFixture<MedicamentoCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MedicamentoCardComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(MedicamentoCardComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display medication name', () => {
    component.medicamento = { nome: 'Dipirona', ... };
    fixture.detectChanges();

    const element = fixture.nativeElement;
    expect(element.textContent).toContain('Dipirona');
  });
});
```

### Exemplo: Teste de Store (Signals)

```typescript
// medicamentos.store.spec.ts
import { TestBed } from '@angular/core/testing';
import { MedicamentosStore } from './medicamentos.store';

describe('MedicamentosStore', () => {
  let store: MedicamentosStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        MedicamentosStore,
        { provide: MedicamentosApiService, useValue: mockApiService }
      ]
    });
    store = TestBed.inject(MedicamentosStore);
  });

  it('should start with empty list', () => {
    expect(store.medicamentos()).toEqual([]);
  });

  it('should update loading state', async () => {
    expect(store.loading()).toBeFalse();
    
    const loadPromise = store.loadAll();
    expect(store.loading()).toBeTrue();
    
    await loadPromise;
    expect(store.loading()).toBeFalse();
  });
});
```

---

## 🖧 API (Node.js)

### Estrutura de Arquivos

```
api/src/
├── __tests__/
│   ├── setup.ts              # Configuração global
│   └── example.spec.ts       # Testes de exemplo
├── controllers/
│   ├── medicamentos.controller.ts
│   └── __tests__/
│       └── medicamentos.controller.spec.ts
├── services/
│   ├── medicamentos.service.ts
│   └── __tests__/
│       └── medicamentos.service.spec.ts
└── repositories/
    ├── medicamentos.repository.ts
    └── __tests__/
        └── medicamentos.repository.spec.ts
```

### Executando Testes

```bash
# Todos os testes
npm run test:api

# Com watch mode
cd api && npm run test:watch

# Com cobertura
cd api && npm run test:coverage

# Arquivo específico
cd api && npx jest medicamentos.service.spec.ts
```

### Exemplo: Teste de Serviço

```typescript
// medicamentos.service.spec.ts
import { MedicamentosService } from '../medicamentos.service';

// Mock do repositório
jest.mock('../../repositories/medicamentos.repository');

describe('MedicamentosService', () => {
  let service: MedicamentosService;
  let mockRepository: jest.Mocked<IMedicamentosRepository>;

  beforeEach(() => {
    mockRepository = {
      findAll: jest.fn(),
      findById: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    } as any;

    service = new MedicamentosService(mockRepository);
  });

  describe('listar', () => {
    it('deve retornar medicamentos do usuário', async () => {
      const mockData = [{ id: '1', nome: 'Dipirona' }];
      mockRepository.findAll.mockResolvedValue(mockData);

      const result = await service.listar('user123');

      expect(mockRepository.findAll).toHaveBeenCalledWith('user123', undefined);
      expect(result.items).toHaveLength(1);
    });
  });
});
```

### Exemplo: Teste de Controller

```typescript
// medicamentos.controller.spec.ts
import { MedicamentosController } from '../medicamentos.controller';
import { createMockRequest, createMockResponse, createMockNext } from '../../__tests__/setup';

describe('MedicamentosController', () => {
  describe('listar', () => {
    it('deve retornar 200 com lista de medicamentos', async () => {
      const req = createMockRequest({
        user: { uid: 'user123' },
      });
      const res = createMockResponse();
      const next = createMockNext();

      await MedicamentosController.listar(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalled();
    });

    it('deve chamar next com erro se usuário não autenticado', async () => {
      const req = createMockRequest({ user: undefined });
      const res = createMockResponse();
      const next = createMockNext();

      await MedicamentosController.listar(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(Error));
    });
  });
});
```

### Exemplo: Teste de Repository (com Mock do Firestore)

```typescript
// medicamentos.repository.spec.ts

// Mock completo do Firebase Admin
jest.mock('firebase-admin', () => ({
  firestore: jest.fn(() => ({
    collection: jest.fn(() => ({
      doc: jest.fn(() => ({
        get: jest.fn(),
        set: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      })),
      where: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      get: jest.fn(),
    })),
  })),
}));

describe('MedicamentosRepository', () => {
  // ... testes
});
```

---

## 🔧 Mocking

### Firebase Auth (Frontend)

```typescript
const mockAuth = {
  currentUser: null,
  onAuthStateChanged: jest.fn((callback) => {
    callback(null);
    return () => {};
  }),
  signInWithEmailAndPassword: jest.fn(),
  signOut: jest.fn(),
};
```

### Firebase Admin (API)

```typescript
jest.mock('firebase-admin', () => ({
  initializeApp: jest.fn(),
  credential: { cert: jest.fn() },
  firestore: jest.fn(() => mockFirestore),
  auth: jest.fn(() => mockAuth),
  storage: jest.fn(() => mockStorage),
}));
```

### HTTP Client (Angular)

```typescript
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

beforeEach(() => {
  TestBed.configureTestingModule({
    imports: [HttpClientTestingModule],
  });
  httpMock = TestBed.inject(HttpTestingController);
});

afterEach(() => {
  httpMock.verify();
});
```

---

## 📊 Cobertura de Código

### Frontend

```bash
cd frontend && ng test --code-coverage
# Relatório em: frontend/coverage/index.html
```

### API

```bash
cd api && npm run test:coverage
# Relatório em: api/coverage/lcov-report/index.html
```

### Metas de Cobertura (Futuro)

| Métrica | Meta Mínima |
|---------|-------------|
| Statements | 70% |
| Branches | 60% |
| Functions | 70% |
| Lines | 70% |

---

## 🚀 CI/CD (Futuro)

### GitHub Actions

```yaml
# .github/workflows/test.yml
name: Tests

on: [push, pull_request]

jobs:
  test-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm run install:frontend
      - run: npm run test:frontend -- --no-watch --no-progress

  test-api:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm run install:api
      - run: npm run test:api
```

---

## 📝 Boas Práticas

### Nomenclatura

- Arquivos de teste: `*.spec.ts` ou `*.test.ts`
- Descreva o comportamento, não a implementação
- Use `describe` para agrupar testes relacionados

### Isolamento

- Cada teste deve ser independente
- Use `beforeEach` para setup
- Limpe mocks com `jest.clearAllMocks()`

### Assertions

- Uma assertion principal por teste
- Use matchers específicos (`toHaveBeenCalledWith`, `toContain`)
- Evite `toBeTruthy()` quando possível

### Async

- Use `async/await` para código assíncrono
- Sempre aguarde promises
- Configure timeouts apropriados

---

## 🔗 Recursos

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Angular Testing Guide](https://angular.io/guide/testing)
- [Testing Library](https://testing-library.com/)
- [Firebase Testing](https://firebase.google.com/docs/rules/unit-tests)


