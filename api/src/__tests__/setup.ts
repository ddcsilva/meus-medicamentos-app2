/**
 * Setup global para testes da API.
 *
 * Este arquivo é executado antes de cada arquivo de teste.
 * Use-o para configurar mocks globais, variáveis de ambiente de teste, etc.
 *
 * @module __tests__/setup
 */

// Configurar variáveis de ambiente para testes
process.env.NODE_ENV = "test";
process.env.PORT = "3001"; // Porta diferente para testes
process.env.LOG_LEVEL = "error"; // Menos logs durante testes

// =============================================================================
// MOCKS GLOBAIS
// =============================================================================

/**
 * Mock do Firebase Admin.
 *
 * Descomente e configure quando precisar testar código que usa Firebase.
 */
// jest.mock("firebase-admin", () => ({
//   initializeApp: jest.fn(),
//   credential: {
//     cert: jest.fn(),
//     applicationDefault: jest.fn(),
//   },
//   firestore: jest.fn(() => ({
//     collection: jest.fn(),
//     doc: jest.fn(),
//   })),
//   auth: jest.fn(() => ({
//     verifyIdToken: jest.fn(),
//     getUser: jest.fn(),
//   })),
//   storage: jest.fn(() => ({
//     bucket: jest.fn(),
//   })),
// }));

// =============================================================================
// HOOKS GLOBAIS
// =============================================================================

/**
 * Executado antes de todos os testes.
 */
beforeAll(async () => {
  // Configurações globais antes dos testes
  // console.log("🧪 Iniciando testes da API...");
});

/**
 * Executado após todos os testes.
 */
afterAll(async () => {
  // Limpeza global após os testes
  // console.log("✅ Testes da API concluídos.");
});

// =============================================================================
// UTILITÁRIOS DE TESTE
// =============================================================================

/**
 * Helper para criar um mock de Request do Express.
 */
export function createMockRequest(overrides = {}): any {
  return {
    body: {},
    params: {},
    query: {},
    headers: {},
    user: undefined,
    ...overrides,
  };
}

/**
 * Helper para criar um mock de Response do Express.
 */
export function createMockResponse(): any {
  const res: any = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  res.set = jest.fn().mockReturnValue(res);
  return res;
}

/**
 * Helper para criar um mock de NextFunction do Express.
 */
export function createMockNext(): jest.Mock {
  return jest.fn();
}

