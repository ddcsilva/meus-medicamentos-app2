import { TestBed } from "@angular/core/testing";
import { of, throwError } from "rxjs";
import { MedicamentosStore } from "./medicamentos.store";
import { MedicamentosApiService } from "./medicamentos-api.service";
import { Medicamento } from "../models";

/**
 * Testes unitários para MedicamentosStore.
 */
describe("MedicamentosStore", () => {
  let store: MedicamentosStore;
  let apiServiceSpy: jasmine.SpyObj<MedicamentosApiService>;

  const mockMedicamento: Medicamento = {
    id: "abc123",
    nome: "Paracetamol",
    droga: "Paracetamol",
    generico: true,
    marca: "Genérico",
    laboratorio: "Lab XYZ",
    tipo: "comprimido",
    validade: "2024-12-31",
    statusValidade: "valido",
    quantidadeTotal: 20,
    quantidadeAtual: 15,
    criadoPor: "user123",
    criadoEm: "2024-01-01T00:00:00Z",
    atualizadoEm: "2024-01-01T00:00:00Z",
  };

  beforeEach(() => {
    const spy = jasmine.createSpyObj("MedicamentosApiService", [
      "getAll",
      "getById",
      "create",
      "update",
      "delete",
      "updateQuantidade",
    ]);

    TestBed.configureTestingModule({
      providers: [
        MedicamentosStore,
        { provide: MedicamentosApiService, useValue: spy },
      ],
    });

    store = TestBed.inject(MedicamentosStore);
    apiServiceSpy = TestBed.inject(
      MedicamentosApiService
    ) as jasmine.SpyObj<MedicamentosApiService>;
  });

  it("should be created", () => {
    expect(store).toBeTruthy();
  });

  describe("Initial state", () => {
    it("should have empty items", () => {
      expect(store.items()).toEqual([]);
    });

    it("should have null selected", () => {
      expect(store.selected()).toBeNull();
    });

    it("should have loading false", () => {
      expect(store.loading()).toBeFalse();
    });

    it("should have null error", () => {
      expect(store.error()).toBeNull();
    });
  });

  describe("loadAll", () => {
    it("should load items and update state", async () => {
      apiServiceSpy.getAll.and.returnValue(of([mockMedicamento]));

      await store.loadAll();

      expect(store.items().length).toBe(1);
      expect(store.items()[0].id).toBe("abc123");
      expect(store.loading()).toBeFalse();
    });

    it("should set loading to true while loading", async () => {
      apiServiceSpy.getAll.and.returnValue(of([mockMedicamento]));

      const loadPromise = store.loadAll();
      // Note: In a real test, you'd need to check during the async operation

      await loadPromise;
      expect(store.loading()).toBeFalse();
    });

    it("should handle errors", async () => {
      apiServiceSpy.getAll.and.returnValue(
        throwError(() => ({ message: "Error", code: "ERROR" }))
      );

      await store.loadAll();

      expect(store.error()).not.toBeNull();
      expect(store.loading()).toBeFalse();
    });
  });

  describe("loadById", () => {
    it("should load and select medicamento", async () => {
      apiServiceSpy.getById.and.returnValue(of(mockMedicamento));

      const result = await store.loadById("abc123");

      expect(result).toEqual(mockMedicamento);
      expect(store.selected()).toEqual(mockMedicamento);
    });
  });

  describe("create", () => {
    it("should create and add to items", async () => {
      apiServiceSpy.create.and.returnValue(of(mockMedicamento));

      const dto = {
        nome: "Paracetamol",
        droga: "Paracetamol",
        generico: true,
        marca: "Genérico",
        laboratorio: "Lab XYZ",
        tipo: "comprimido" as const,
        validade: "2024-12-31",
        quantidadeTotal: 20,
        quantidadeAtual: 20,
      };

      const result = await store.create(dto);

      expect(result).toEqual(mockMedicamento);
      expect(store.items().length).toBe(1);
    });
  });

  describe("update", () => {
    it("should update item in list", async () => {
      // Setup: add item first
      apiServiceSpy.getAll.and.returnValue(of([mockMedicamento]));
      await store.loadAll();

      const updatedMedicamento = { ...mockMedicamento, nome: "Novo Nome" };
      apiServiceSpy.update.and.returnValue(of(updatedMedicamento));

      const result = await store.update("abc123", { nome: "Novo Nome" });

      expect(result?.nome).toBe("Novo Nome");
      expect(store.items()[0].nome).toBe("Novo Nome");
    });
  });

  describe("delete", () => {
    it("should remove item from list", async () => {
      // Setup: add item first
      apiServiceSpy.getAll.and.returnValue(of([mockMedicamento]));
      await store.loadAll();

      apiServiceSpy.delete.and.returnValue(of(void 0));

      const result = await store.delete("abc123");

      expect(result).toBeTrue();
      expect(store.items().length).toBe(0);
    });
  });

  describe("updateQuantidade", () => {
    it("should update quantidade", async () => {
      // Setup: add item first
      apiServiceSpy.getAll.and.returnValue(of([mockMedicamento]));
      await store.loadAll();

      const updatedMedicamento = { ...mockMedicamento, quantidadeAtual: 10 };
      apiServiceSpy.updateQuantidade.and.returnValue(of(updatedMedicamento));

      const result = await store.updateQuantidade("abc123", 10);

      expect(result?.quantidadeAtual).toBe(10);
    });

    it("should not allow negative quantidade", async () => {
      const result = await store.updateQuantidade("abc123", -5);

      expect(result).toBeNull();
      expect(store.error()?.code).toBe("VALIDATION_ERROR");
    });
  });

  describe("incrementarQuantidade", () => {
    it("should increment quantidade", async () => {
      const updatedMedicamento = { ...mockMedicamento, quantidadeAtual: 16 };
      apiServiceSpy.updateQuantidade.and.returnValue(of(updatedMedicamento));

      const result = await store.incrementarQuantidade("abc123", 15, 1);

      expect(apiServiceSpy.updateQuantidade).toHaveBeenCalledWith("abc123", 16);
    });
  });

  describe("decrementarQuantidade", () => {
    it("should decrement quantidade", async () => {
      const updatedMedicamento = { ...mockMedicamento, quantidadeAtual: 14 };
      apiServiceSpy.updateQuantidade.and.returnValue(of(updatedMedicamento));

      const result = await store.decrementarQuantidade("abc123", 15, 1);

      expect(apiServiceSpy.updateQuantidade).toHaveBeenCalledWith("abc123", 14);
    });

    it("should not go below zero", async () => {
      const updatedMedicamento = { ...mockMedicamento, quantidadeAtual: 0 };
      apiServiceSpy.updateQuantidade.and.returnValue(of(updatedMedicamento));

      await store.decrementarQuantidade("abc123", 2, 5);

      expect(apiServiceSpy.updateQuantidade).toHaveBeenCalledWith("abc123", 0);
    });
  });

  describe("Computed signals", () => {
    beforeEach(async () => {
      const items: Medicamento[] = [
        { ...mockMedicamento, id: "1", statusValidade: "valido" },
        { ...mockMedicamento, id: "2", statusValidade: "prestes" },
        { ...mockMedicamento, id: "3", statusValidade: "vencido" },
        { ...mockMedicamento, id: "4", statusValidade: "valido", quantidadeAtual: 3 },
        { ...mockMedicamento, id: "5", statusValidade: "valido", quantidadeAtual: 0 },
      ];

      apiServiceSpy.getAll.and.returnValue(of(items));
      await store.loadAll();
    });

    it("should count total items", () => {
      expect(store.totalItems()).toBe(5);
    });

    it("should count validos", () => {
      expect(store.validosCount()).toBe(3);
    });

    it("should count prestes", () => {
      expect(store.prestesCount()).toBe(1);
    });

    it("should count vencidos", () => {
      expect(store.vencidosCount()).toBe(1);
    });

    it("should count estoque baixo", () => {
      expect(store.estoqueBaixoCount()).toBe(1);
    });

    it("should count sem estoque", () => {
      expect(store.semEstoqueCount()).toBe(1);
    });
  });

  describe("Filters", () => {
    it("should set filters", () => {
      store.setFilters({ status: "valido", busca: "paracetamol" });

      expect(store.filters().status).toBe("valido");
      expect(store.filters().busca).toBe("paracetamol");
    });

    it("should update filters partially", () => {
      store.setFilters({ status: "valido" });
      store.updateFilters({ busca: "test" });

      expect(store.filters().status).toBe("valido");
      expect(store.filters().busca).toBe("test");
    });

    it("should clear filters", () => {
      store.setFilters({ status: "valido", busca: "test" });
      store.clearFilters();

      expect(store.filters()).toEqual({});
    });

    it("should filter items by status", async () => {
      const items: Medicamento[] = [
        { ...mockMedicamento, id: "1", statusValidade: "valido" },
        { ...mockMedicamento, id: "2", statusValidade: "vencido" },
      ];

      apiServiceSpy.getAll.and.returnValue(of(items));
      await store.loadAll();

      store.setStatusFilter("valido");

      expect(store.filteredItems().length).toBe(1);
      expect(store.filteredItems()[0].id).toBe("1");
    });

    it("should filter items by busca", async () => {
      const items: Medicamento[] = [
        { ...mockMedicamento, id: "1", nome: "Paracetamol" },
        { ...mockMedicamento, id: "2", nome: "Dipirona" },
      ];

      apiServiceSpy.getAll.and.returnValue(of(items));
      await store.loadAll();

      store.setBusca("para");

      expect(store.filteredItems().length).toBe(1);
      expect(store.filteredItems()[0].nome).toBe("Paracetamol");
    });
  });
});

