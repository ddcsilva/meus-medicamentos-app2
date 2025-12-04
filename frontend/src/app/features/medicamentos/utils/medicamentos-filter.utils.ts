import { Medicamento } from "../models/medicamento.model";
import {
  MedicamentosFiltros,
  OrdenacaoCampo,
  OrdenacaoDirecao,
} from "../models/medicamento-filter.model";

/**
 * Funções utilitárias puras para filtrar e ordenar medicamentos.
 *
 * Estas funções são puras (sem side effects) e podem ser facilmente testadas.
 */

// ========================================
// FUNÇÕES DE FILTRO INDIVIDUAIS
// ========================================

/**
 * Filtra medicamentos por busca textual.
 *
 * Busca em: nome, droga, marca (se existir).
 *
 * @param medicamentos - Lista de medicamentos
 * @param busca - Texto de busca
 * @returns Lista filtrada
 */
export function filtrarPorBusca(
  medicamentos: Medicamento[],
  busca: string
): Medicamento[] {
  if (!busca || !busca.trim()) {
    return medicamentos;
  }

  const termoBusca = busca.toLowerCase().trim();

  return medicamentos.filter(
    (med) =>
      med.nome.toLowerCase().includes(termoBusca) ||
      med.droga.toLowerCase().includes(termoBusca) ||
      (med.marca && med.marca.toLowerCase().includes(termoBusca))
  );
}

/**
 * Filtra medicamentos por status de validade.
 *
 * @param medicamentos - Lista de medicamentos
 * @param status - Status de validade ('valido', 'prestes', 'vencido')
 * @returns Lista filtrada
 */
export function filtrarPorStatus(
  medicamentos: Medicamento[],
  status: string | null | undefined
): Medicamento[] {
  if (!status) {
    return medicamentos;
  }

  return medicamentos.filter((med) => med.statusValidade === status);
}

/**
 * Filtra medicamentos por tipo.
 *
 * @param medicamentos - Lista de medicamentos
 * @param tipo - Tipo de medicamento
 * @returns Lista filtrada
 */
export function filtrarPorTipo(
  medicamentos: Medicamento[],
  tipo: string | null | undefined
): Medicamento[] {
  if (!tipo) {
    return medicamentos;
  }

  return medicamentos.filter((med) => med.tipo === tipo);
}

/**
 * Filtra medicamentos por genérico/referência.
 *
 * @param medicamentos - Lista de medicamentos
 * @param generico - true = genérico, false = referência, null = todos
 * @returns Lista filtrada
 */
export function filtrarPorGenerico(
  medicamentos: Medicamento[],
  generico: boolean | null | undefined
): Medicamento[] {
  if (generico === null || generico === undefined) {
    return medicamentos;
  }

  return medicamentos.filter((med) => med.generico === generico);
}

/**
 * Filtra medicamentos por marca.
 *
 * @param medicamentos - Lista de medicamentos
 * @param marca - Nome da marca
 * @returns Lista filtrada
 */
export function filtrarPorMarca(
  medicamentos: Medicamento[],
  marca: string | null | undefined
): Medicamento[] {
  if (!marca) {
    return medicamentos;
  }

  const marcaBusca = marca.toLowerCase().trim();

  return medicamentos.filter(
    (med) => med.marca && med.marca.toLowerCase().includes(marcaBusca)
  );
}

/**
 * Filtra medicamentos com quantidade baixa.
 *
 * @param medicamentos - Lista de medicamentos
 * @param limite - Limite para considerar quantidade baixa (padrão: 5)
 * @returns Lista filtrada
 */
export function filtrarPorQuantidadeBaixa(
  medicamentos: Medicamento[],
  limite: number = 5
): Medicamento[] {
  return medicamentos.filter(
    (med) => med.quantidadeAtual < limite && med.quantidadeAtual > 0
  );
}

/**
 * Filtra medicamentos sem estoque.
 *
 * @param medicamentos - Lista de medicamentos
 * @returns Lista filtrada
 */
export function filtrarSemEstoque(medicamentos: Medicamento[]): Medicamento[] {
  return medicamentos.filter((med) => med.quantidadeAtual === 0);
}

// ========================================
// FUNÇÕES DE ORDENAÇÃO
// ========================================

/**
 * Ordena medicamentos por um campo específico.
 *
 * @param medicamentos - Lista de medicamentos
 * @param campo - Campo para ordenar
 * @param direcao - Direção da ordenação ('asc' ou 'desc')
 * @returns Lista ordenada (nova referência)
 */
export function ordenarMedicamentos(
  medicamentos: Medicamento[],
  campo: OrdenacaoCampo | null | undefined,
  direcao: OrdenacaoDirecao = "asc"
): Medicamento[] {
  if (!campo) {
    return medicamentos;
  }

  const multiplicador = direcao === "desc" ? -1 : 1;

  return [...medicamentos].sort((a, b) => {
    switch (campo) {
      case "nome":
        return a.nome.localeCompare(b.nome) * multiplicador;

      case "droga":
        return a.droga.localeCompare(b.droga) * multiplicador;

      case "validade":
        return (
          (new Date(a.validade).getTime() - new Date(b.validade).getTime()) *
          multiplicador
        );

      case "quantidadeAtual":
        return (a.quantidadeAtual - b.quantidadeAtual) * multiplicador;

      case "criadoEm":
        return (
          (new Date(a.criadoEm).getTime() - new Date(b.criadoEm).getTime()) *
          multiplicador
        );

      case "atualizadoEm":
        return (
          (new Date(a.atualizadoEm).getTime() -
            new Date(b.atualizadoEm).getTime()) *
          multiplicador
        );

      default:
        return 0;
    }
  });
}

// ========================================
// FUNÇÃO PRINCIPAL DE APLICAÇÃO DE FILTROS
// ========================================

/**
 * Aplica todos os filtros e ordenação sobre uma lista de medicamentos.
 *
 * Esta é a função principal que combina todos os filtros.
 *
 * @param medicamentos - Lista de medicamentos
 * @param filtros - Objeto com todos os filtros
 * @returns Lista filtrada e ordenada
 *
 * @example
 * const filtros: MedicamentosFiltros = {
 *   busca: 'paracetamol',
 *   status: 'valido',
 *   ordenarPor: 'nome',
 *   ordem: 'asc'
 * };
 *
 * const resultado = aplicarFiltros(medicamentos, filtros);
 */
export function aplicarFiltros(
  medicamentos: Medicamento[],
  filtros: MedicamentosFiltros
): Medicamento[] {
  let resultado = [...medicamentos];

  // Aplicar filtro de busca
  if (filtros.busca) {
    resultado = filtrarPorBusca(resultado, filtros.busca);
  }

  // Aplicar filtro de status
  if (filtros.status) {
    resultado = filtrarPorStatus(resultado, filtros.status);
  }

  // Aplicar filtro de tipo
  if (filtros.tipo) {
    resultado = filtrarPorTipo(resultado, filtros.tipo);
  }

  // Aplicar filtro de genérico
  if (filtros.generico !== null && filtros.generico !== undefined) {
    resultado = filtrarPorGenerico(resultado, filtros.generico);
  }

  // Aplicar filtro de quantidade baixa
  if (filtros.quantidadeBaixa) {
    resultado = filtrarPorQuantidadeBaixa(
      resultado,
      filtros.limiteQuantidadeBaixa || 5
    );
  }

  // Aplicar ordenação
  if (filtros.ordenarPor) {
    resultado = ordenarMedicamentos(
      resultado,
      filtros.ordenarPor,
      filtros.ordem || "asc"
    );
  }

  return resultado;
}

// ========================================
// FUNÇÕES AUXILIARES
// ========================================

/**
 * Extrai lista única de marcas dos medicamentos.
 *
 * Útil para popular dropdowns de filtro.
 *
 * @param medicamentos - Lista de medicamentos
 * @returns Lista de marcas únicas ordenadas
 */
export function extrairMarcas(medicamentos: Medicamento[]): string[] {
  const marcas = new Set(
    medicamentos
      .filter((med) => med.marca)
      .map((med) => med.marca as string)
  );
  return Array.from(marcas).sort();
}

/**
 * Extrai lista única de tipos dos medicamentos.
 *
 * Útil para popular dropdowns de filtro.
 *
 * @param medicamentos - Lista de medicamentos
 * @returns Lista de tipos únicos ordenados
 */
export function extrairTipos(medicamentos: Medicamento[]): string[] {
  const tipos = new Set(medicamentos.map((med) => med.tipo));
  return Array.from(tipos).sort();
}

/**
 * Conta medicamentos por status.
 *
 * @param medicamentos - Lista de medicamentos
 * @returns Objeto com contagens por status
 */
export function contarPorStatus(medicamentos: Medicamento[]): {
  valido: number;
  prestes: number;
  vencido: number;
} {
  return {
    valido: medicamentos.filter((m) => m.statusValidade === "valido").length,
    prestes: medicamentos.filter((m) => m.statusValidade === "prestes").length,
    vencido: medicamentos.filter((m) => m.statusValidade === "vencido").length,
  };
}

/**
 * Verifica se há filtros ativos.
 *
 * @param filtros - Objeto de filtros
 * @returns true se há pelo menos um filtro ativo
 */
export function temFiltrosAtivos(filtros: MedicamentosFiltros): boolean {
  return !!(
    filtros.busca ||
    filtros.status ||
    filtros.tipo ||
    (filtros.generico !== null && filtros.generico !== undefined) ||
    filtros.quantidadeBaixa ||
    filtros.ordenarPor
  );
}

/**
 * Cria um objeto de filtros limpo (sem valores undefined).
 *
 * @param filtros - Filtros parciais
 * @returns Filtros limpos
 */
export function limparFiltrosVazios(
  filtros: Partial<MedicamentosFiltros>
): MedicamentosFiltros {
  const resultado: MedicamentosFiltros = {};

  if (filtros.busca) resultado.busca = filtros.busca;
  if (filtros.status) resultado.status = filtros.status;
  if (filtros.tipo) resultado.tipo = filtros.tipo;
  if (filtros.generico !== null && filtros.generico !== undefined) {
    resultado.generico = filtros.generico;
  }
  if (filtros.quantidadeBaixa) resultado.quantidadeBaixa = true;
  if (filtros.limiteQuantidadeBaixa) {
    resultado.limiteQuantidadeBaixa = filtros.limiteQuantidadeBaixa;
  }
  if (filtros.ordenarPor) resultado.ordenarPor = filtros.ordenarPor;
  if (filtros.ordem) resultado.ordem = filtros.ordem;

  return resultado;
}
