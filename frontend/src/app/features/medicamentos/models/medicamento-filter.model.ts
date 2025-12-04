import { StatusValidade, TipoMedicamento } from "./medicamento.model";

/**
 * Campos disponíveis para ordenação.
 */
export type OrdenacaoCampo =
  | "nome"
  | "droga"
  | "validade"
  | "quantidadeAtual"
  | "criadoEm"
  | "atualizadoEm";

/**
 * Direção da ordenação.
 */
export type OrdenacaoDirecao = "asc" | "desc";

/**
 * Interface completa para filtros de medicamentos.
 *
 * Suporta:
 * - Busca textual (nome, droga, marca)
 * - Filtro por status de validade
 * - Filtro por tipo de medicamento
 * - Filtro por genérico/referência
 * - Filtro por marca
 * - Filtro por quantidade baixa
 * - Ordenação por campo e direção
 */
export interface MedicamentosFiltros {
  /** Busca textual (nome, droga, marca) */
  busca?: string;

  /** Filtro por status de validade */
  status?: StatusValidade | null;

  /** Filtro por tipo de medicamento */
  tipo?: TipoMedicamento | string | null;

  /** Filtro por genérico (true = genérico, false = referência, null = todos) */
  generico?: boolean | null;

  /** Filtro por marca */
  marca?: string | null;

  /** Filtro por quantidade baixa (< limite) */
  quantidadeBaixa?: boolean;

  /** Limite para considerar quantidade baixa (padrão: 5) */
  limiteQuantidadeBaixa?: number;

  /** Campo de ordenação */
  ordenarPor?: OrdenacaoCampo | null;

  /** Direção da ordenação */
  ordem?: OrdenacaoDirecao;
}

/**
 * Filtros padrão (sem filtros ativos).
 */
export const FILTROS_PADRAO: MedicamentosFiltros = {
  busca: "",
  status: null,
  tipo: null,
  generico: null,
  marca: null,
  quantidadeBaixa: false,
  limiteQuantidadeBaixa: 5,
  ordenarPor: null,
  ordem: "asc",
};

/**
 * Opções de ordenação pré-definidas.
 */
export const ORDENACAO_OPCOES: {
  valor: OrdenacaoCampo;
  label: string;
}[] = [
  { valor: "nome", label: "Nome" },
  { valor: "droga", label: "Princípio Ativo" },
  { valor: "validade", label: "Validade" },
  { valor: "quantidadeAtual", label: "Quantidade" },
  { valor: "criadoEm", label: "Data de Cadastro" },
  { valor: "atualizadoEm", label: "Última Atualização" },
];

