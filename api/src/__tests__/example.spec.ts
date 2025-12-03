/**
 * Testes de exemplo para verificar a configuração do Jest.
 *
 * Este arquivo serve como template para criar novos testes.
 * Pode ser removido ou substituído por testes reais.
 *
 * @module __tests__/example
 */

describe("Configuração de Testes", () => {
  describe("Jest Setup", () => {
    it("deve executar testes corretamente", () => {
      expect(true).toBe(true);
    });

    it("deve ter acesso às variáveis de ambiente de teste", () => {
      expect(process.env.NODE_ENV).toBe("test");
    });

    it("deve suportar async/await", async () => {
      const result = await Promise.resolve(42);
      expect(result).toBe(42);
    });
  });

  describe("Matchers básicos", () => {
    it("deve comparar valores primitivos", () => {
      expect(1 + 1).toBe(2);
      expect("hello").toBe("hello");
      expect(null).toBeNull();
      expect(undefined).toBeUndefined();
    });

    it("deve comparar objetos", () => {
      const obj = { a: 1, b: 2 };
      expect(obj).toEqual({ a: 1, b: 2 });
      expect(obj).toHaveProperty("a");
      expect(obj).toHaveProperty("a", 1);
    });

    it("deve comparar arrays", () => {
      const arr = [1, 2, 3];
      expect(arr).toHaveLength(3);
      expect(arr).toContain(2);
      expect(arr).toEqual(expect.arrayContaining([1, 3]));
    });
  });

  describe("Mocks", () => {
    it("deve criar mock functions", () => {
      const mockFn = jest.fn();
      mockFn("arg1", "arg2");

      expect(mockFn).toHaveBeenCalled();
      expect(mockFn).toHaveBeenCalledWith("arg1", "arg2");
      expect(mockFn).toHaveBeenCalledTimes(1);
    });

    it("deve mockar valores de retorno", () => {
      const mockFn = jest.fn().mockReturnValue(42);
      expect(mockFn()).toBe(42);

      const asyncMock = jest.fn().mockResolvedValue("async result");
      return expect(asyncMock()).resolves.toBe("async result");
    });
  });
});

// =============================================================================
// TEMPLATE: Teste de Serviço
// =============================================================================

// import { MedicamentosService } from "../services/medicamentos.service";
// import { getMedicamentosRepository } from "../repositories/medicamentos.repository";
//
// jest.mock("../repositories/medicamentos.repository");
//
// describe("MedicamentosService", () => {
//   let service: MedicamentosService;
//   let mockRepository: jest.Mocked<ReturnType<typeof getMedicamentosRepository>>;
//
//   beforeEach(() => {
//     mockRepository = {
//       findAll: jest.fn(),
//       findById: jest.fn(),
//       create: jest.fn(),
//       update: jest.fn(),
//       delete: jest.fn(),
//     } as any;
//
//     (getMedicamentosRepository as jest.Mock).mockReturnValue(mockRepository);
//     service = new MedicamentosService();
//   });
//
//   describe("listar", () => {
//     it("deve retornar lista de medicamentos do usuário", async () => {
//       const userId = "user123";
//       const mockMedicamentos = [{ id: "1", nome: "Dipirona" }];
//
//       mockRepository.findAll.mockResolvedValue(mockMedicamentos);
//
//       const result = await service.listar(userId);
//
//       expect(mockRepository.findAll).toHaveBeenCalledWith(userId, undefined);
//       expect(result.items).toHaveLength(1);
//     });
//   });
// });

// =============================================================================
// TEMPLATE: Teste de Controller
// =============================================================================

// import { MedicamentosController } from "../controllers/medicamentos.controller";
// import { createMockRequest, createMockResponse, createMockNext } from "./setup";
//
// describe("MedicamentosController", () => {
//   describe("listar", () => {
//     it("deve retornar 200 com lista de medicamentos", async () => {
//       const req = createMockRequest({
//         user: { uid: "user123" },
//         query: {},
//       });
//       const res = createMockResponse();
//       const next = createMockNext();
//
//       await MedicamentosController.listar(req, res, next);
//
//       expect(res.status).toHaveBeenCalledWith(200);
//       expect(res.json).toHaveBeenCalled();
//     });
//   });
// });


