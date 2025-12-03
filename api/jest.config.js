/**
 * Configuração do Jest para a API Node.js.
 *
 * @type {import('jest').Config}
 */
module.exports = {
  // Preset para TypeScript
  preset: "ts-jest",

  // Ambiente de teste
  testEnvironment: "node",

  // Diretório raiz para busca de testes
  roots: ["<rootDir>/src"],

  // Padrões de arquivos de teste
  testMatch: [
    "**/__tests__/**/*.ts",
    "**/*.spec.ts",
    "**/*.test.ts",
  ],

  // Extensões de arquivos a processar
  moduleFileExtensions: ["ts", "js", "json", "node"],

  // Transformações
  transform: {
    "^.+\\.ts$": ["ts-jest", {
      tsconfig: "tsconfig.json",
    }],
  },

  // Cobertura de código
  collectCoverageFrom: [
    "src/**/*.ts",
    "!src/**/*.d.ts",
    "!src/**/__tests__/**",
    "!src/**/*.spec.ts",
    "!src/**/*.test.ts",
    "!src/index.ts", // Ponto de entrada
  ],

  // Diretório de saída da cobertura
  coverageDirectory: "coverage",

  // Limites mínimos de cobertura (ajustar conforme necessário)
  coverageThreshold: {
    global: {
      branches: 0,
      functions: 0,
      lines: 0,
      statements: 0,
    },
  },

  // Limpar mocks automaticamente entre testes
  clearMocks: true,

  // Restaurar mocks automaticamente
  restoreMocks: true,

  // Timeout padrão para testes (em ms)
  testTimeout: 10000,

  // Verbose output
  verbose: true,

  // Setup files (executados antes de cada arquivo de teste)
  // setupFilesAfterEnv: ["<rootDir>/src/__tests__/setup.ts"],

  // Módulos a ignorar
  modulePathIgnorePatterns: ["<rootDir>/dist/"],

  // Aliases de módulos (se necessário)
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
};

