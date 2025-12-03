import { Medicamento } from "../models/medicamento.model";
import {
  filtrarPorBusca,
  filtrarPorStatus,
  filtrarPorTipo,
  filtrarPorGenerico,
  filtrarPorLaboratorio,
  filtrarPorQuantidadeBaixa,
  filtrarSemEstoque,
  ordenarMedicamentos,
  aplicarFiltros,
  extrairLaboratorios,
  extrairTipos,
  contarPorStatus,
  temFiltrosAtivos,
} from "./medicamentos-filter.utils";

/**
 * Testes para as funções utilitárias de filtro de medicamentos.
 */
describe("MedicamentosFilterUtils", () => {
  // Dados de teste
  const mockMedicamentos: Medicamento[] = [
    {
      id: "1",
      nome: "Paracetamol 500mg",
      droga: "Paracetamol",
      generico: true,
      marca: "Genérico",
      laboratorio: "Medley",
      tipo: "comprimido",
      validade: "2025-12-31",
      statusValidade: "valido",
      quantidadeTotal: 20,
      quantidadeAtual: 15,
      criadoPor: "user1",
      criadoEm: "2024-01-01T00:00:00Z",
      atualizadoEm: "2024-01-01T00:00:00Z",
    },
    {
      id: "2",
      nome: "Dipirona 1g",
      droga: "Dipirona Sódica",
      generico: false,
      marca: "Novalgina",
      laboratorio: "Sanofi",
      tipo: "comprimido",
      validade: "2025-01-15",
      statusValidade: "prestes",
      quantidadeTotal: 10,
      quantidadeAtual: 3,
      criadoPor: "user1",
      criadoEm: "2024-02-01T00:00:00Z",
      atualizadoEm: "2024-02-01T00:00:00Z",
    },
    {
      id: "3",
      nome: "Omeprazol 20mg",
      droga: "Omeprazol",
      generico: true,
      marca: "Genérico",
      laboratorio: "EMS",
      tipo: "capsula",
      validade: "2024-06-01",
      statusValidade: "vencido",
      quantidadeTotal: 30,
      quantidadeAtual: 0,
      criadoPor: "user1",
      criadoEm: "2024-03-01T00:00:00Z",
      atualizadoEm: "2024-03-01T00:00:00Z",
    },
  ];

  describe("filtrarPorBusca", () => {
    it("deve retornar todos quando busca está vazia", () => {
      const resultado = filtrarPorBusca(mockMedicamentos, "");
      expect(resultado.length).toBe(3);
    });

    it("deve filtrar por nome", () => {
      const resultado = filtrarPorBusca(mockMedicamentos, "paracetamol");
      expect(resultado.length).toBe(1);
      expect(resultado[0].nome).toBe("Paracetamol 500mg");
    });

    it("deve filtrar por droga", () => {
      const resultado = filtrarPorBusca(mockMedicamentos, "dipirona");
      expect(resultado.length).toBe(1);
      expect(resultado[0].droga).toBe("Dipirona Sódica");
    });

    it("deve filtrar por marca", () => {
      const resultado = filtrarPorBusca(mockMedicamentos, "novalgina");
      expect(resultado.length).toBe(1);
    });

    it("deve filtrar por laboratório", () => {
      const resultado = filtrarPorBusca(mockMedicamentos, "medley");
      expect(resultado.length).toBe(1);
    });

    it("deve ser case insensitive", () => {
      const resultado = filtrarPorBusca(mockMedicamentos, "PARACETAMOL");
      expect(resultado.length).toBe(1);
    });
  });

  describe("filtrarPorStatus", () => {
    it("deve retornar todos quando status é null", () => {
      const resultado = filtrarPorStatus(mockMedicamentos, null);
      expect(resultado.length).toBe(3);
    });

    it("deve filtrar por status valido", () => {
      const resultado = filtrarPorStatus(mockMedicamentos, "valido");
      expect(resultado.length).toBe(1);
      expect(resultado[0].statusValidade).toBe("valido");
    });

    it("deve filtrar por status prestes", () => {
      const resultado = filtrarPorStatus(mockMedicamentos, "prestes");
      expect(resultado.length).toBe(1);
    });

    it("deve filtrar por status vencido", () => {
      const resultado = filtrarPorStatus(mockMedicamentos, "vencido");
      expect(resultado.length).toBe(1);
    });
  });

  describe("filtrarPorTipo", () => {
    it("deve retornar todos quando tipo é null", () => {
      const resultado = filtrarPorTipo(mockMedicamentos, null);
      expect(resultado.length).toBe(3);
    });

    it("deve filtrar por tipo comprimido", () => {
      const resultado = filtrarPorTipo(mockMedicamentos, "comprimido");
      expect(resultado.length).toBe(2);
    });

    it("deve filtrar por tipo capsula", () => {
      const resultado = filtrarPorTipo(mockMedicamentos, "capsula");
      expect(resultado.length).toBe(1);
    });
  });

  describe("filtrarPorGenerico", () => {
    it("deve retornar todos quando generico é null", () => {
      const resultado = filtrarPorGenerico(mockMedicamentos, null);
      expect(resultado.length).toBe(3);
    });

    it("deve filtrar apenas genéricos", () => {
      const resultado = filtrarPorGenerico(mockMedicamentos, true);
      expect(resultado.length).toBe(2);
      expect(resultado.every((m) => m.generico)).toBe(true);
    });

    it("deve filtrar apenas referência", () => {
      const resultado = filtrarPorGenerico(mockMedicamentos, false);
      expect(resultado.length).toBe(1);
      expect(resultado[0].generico).toBe(false);
    });
  });

  describe("filtrarPorLaboratorio", () => {
    it("deve retornar todos quando laboratório é null", () => {
      const resultado = filtrarPorLaboratorio(mockMedicamentos, null);
      expect(resultado.length).toBe(3);
    });

    it("deve filtrar por laboratório", () => {
      const resultado = filtrarPorLaboratorio(mockMedicamentos, "Sanofi");
      expect(resultado.length).toBe(1);
    });
  });

  describe("filtrarPorQuantidadeBaixa", () => {
    it("deve filtrar medicamentos com quantidade baixa", () => {
      const resultado = filtrarPorQuantidadeBaixa(mockMedicamentos, 5);
      expect(resultado.length).toBe(1);
      expect(resultado[0].quantidadeAtual).toBe(3);
    });

    it("deve excluir medicamentos sem estoque", () => {
      const resultado = filtrarPorQuantidadeBaixa(mockMedicamentos, 5);
      expect(resultado.every((m) => m.quantidadeAtual > 0)).toBe(true);
    });
  });

  describe("filtrarSemEstoque", () => {
    it("deve filtrar medicamentos sem estoque", () => {
      const resultado = filtrarSemEstoque(mockMedicamentos);
      expect(resultado.length).toBe(1);
      expect(resultado[0].quantidadeAtual).toBe(0);
    });
  });

  describe("ordenarMedicamentos", () => {
    it("deve retornar lista original quando campo é null", () => {
      const resultado = ordenarMedicamentos(mockMedicamentos, null);
      expect(resultado).toEqual(mockMedicamentos);
    });

    it("deve ordenar por nome ascendente", () => {
      const resultado = ordenarMedicamentos(mockMedicamentos, "nome", "asc");
      expect(resultado[0].nome).toBe("Dipirona 1g");
      expect(resultado[2].nome).toBe("Paracetamol 500mg");
    });

    it("deve ordenar por nome descendente", () => {
      const resultado = ordenarMedicamentos(mockMedicamentos, "nome", "desc");
      expect(resultado[0].nome).toBe("Paracetamol 500mg");
    });

    it("deve ordenar por validade", () => {
      const resultado = ordenarMedicamentos(mockMedicamentos, "validade", "asc");
      expect(resultado[0].statusValidade).toBe("vencido");
      expect(resultado[2].statusValidade).toBe("valido");
    });

    it("deve ordenar por quantidade", () => {
      const resultado = ordenarMedicamentos(
        mockMedicamentos,
        "quantidadeAtual",
        "asc"
      );
      expect(resultado[0].quantidadeAtual).toBe(0);
      expect(resultado[2].quantidadeAtual).toBe(15);
    });

    it("não deve modificar a lista original", () => {
      const original = [...mockMedicamentos];
      ordenarMedicamentos(mockMedicamentos, "nome", "asc");
      expect(mockMedicamentos).toEqual(original);
    });
  });

  describe("aplicarFiltros", () => {
    it("deve aplicar múltiplos filtros", () => {
      const resultado = aplicarFiltros(mockMedicamentos, {
        busca: "paracetamol",
        status: "valido",
      });
      expect(resultado.length).toBe(1);
    });

    it("deve aplicar filtros e ordenação", () => {
      const resultado = aplicarFiltros(mockMedicamentos, {
        tipo: "comprimido",
        ordenarPor: "nome",
        ordem: "asc",
      });
      expect(resultado.length).toBe(2);
      expect(resultado[0].nome).toBe("Dipirona 1g");
    });

    it("deve retornar todos quando não há filtros", () => {
      const resultado = aplicarFiltros(mockMedicamentos, {});
      expect(resultado.length).toBe(3);
    });
  });

  describe("extrairLaboratorios", () => {
    it("deve extrair laboratórios únicos", () => {
      const resultado = extrairLaboratorios(mockMedicamentos);
      expect(resultado).toEqual(["EMS", "Medley", "Sanofi"]);
    });
  });

  describe("extrairTipos", () => {
    it("deve extrair tipos únicos", () => {
      const resultado = extrairTipos(mockMedicamentos);
      expect(resultado).toEqual(["capsula", "comprimido"]);
    });
  });

  describe("contarPorStatus", () => {
    it("deve contar medicamentos por status", () => {
      const resultado = contarPorStatus(mockMedicamentos);
      expect(resultado.valido).toBe(1);
      expect(resultado.prestes).toBe(1);
      expect(resultado.vencido).toBe(1);
    });
  });

  describe("temFiltrosAtivos", () => {
    it("deve retornar false quando não há filtros", () => {
      expect(temFiltrosAtivos({})).toBe(false);
    });

    it("deve retornar true quando há busca", () => {
      expect(temFiltrosAtivos({ busca: "teste" })).toBe(true);
    });

    it("deve retornar true quando há status", () => {
      expect(temFiltrosAtivos({ status: "valido" })).toBe(true);
    });

    it("deve retornar true quando há ordenação", () => {
      expect(temFiltrosAtivos({ ordenarPor: "nome" })).toBe(true);
    });
  });
});

