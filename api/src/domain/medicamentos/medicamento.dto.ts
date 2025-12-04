import { StatusValidade, TipoMedicamento } from "./medicamento.model";

/**
 * DTO para criação de um novo medicamento.
 *
 * Campos obrigatórios para criar um medicamento.
 * Metadados (id, criadoPor, criadoEm, atualizadoEm, statusValidade)
 * são gerados automaticamente pelo backend.
 */
export interface CreateMedicamentoDto {
  /** Nome comercial do medicamento */
  nome: string;

  /** Nome da droga / princípio ativo */
  droga: string;

  /** Indica se é medicamento genérico */
  generico: boolean;

  /** Nome da marca (opcional) */
  marca?: string;

  /** Dosagem/concentração do medicamento (ex: 500mg) - opcional */
  dosagem?: string;

  /** Tipo de medicamento */
  tipo: TipoMedicamento;

  /** Data de validade em formato ISO 8601 (YYYY-MM-DD) */
  validade: string;

  /** Quantidade total inicial do medicamento */
  quantidadeTotal: number;

  /** Quantidade atual disponível */
  quantidadeAtual: number;

  /** URL da foto do medicamento (opcional) */
  fotoUrl?: string;

  /** Observações adicionais (opcional) */
  observacoes?: string;
}

/**
 * DTO para atualização de um medicamento existente.
 *
 * Todos os campos são opcionais, permitindo atualizações parciais.
 */
export interface UpdateMedicamentoDto {
  /** Nome comercial do medicamento */
  nome?: string;

  /** Nome da droga / princípio ativo */
  droga?: string;

  /** Indica se é medicamento genérico */
  generico?: boolean;

  /** Nome da marca */
  marca?: string;

  /** Dosagem/concentração do medicamento (ex: 500mg) */
  dosagem?: string;

  /** Tipo de medicamento */
  tipo?: TipoMedicamento;

  /** Data de validade em formato ISO 8601 (YYYY-MM-DD) */
  validade?: string;

  /** Quantidade total inicial do medicamento */
  quantidadeTotal?: number;

  /** Quantidade atual disponível */
  quantidadeAtual?: number;

  /** URL da foto do medicamento */
  fotoUrl?: string;

  /** Observações adicionais */
  observacoes?: string;
}

/**
 * DTO para atualização apenas da quantidade de um medicamento.
 *
 * Usado para operações rápidas de incremento/decremento de estoque.
 */
export interface UpdateQuantidadeDto {
  /** Nova quantidade atual */
  quantidadeAtual: number;
}

/**
 * DTO de resposta da API para um medicamento.
 *
 * Representa o formato retornado pela API ao buscar medicamentos.
 * Inclui campos calculados pelo backend (statusValidade).
 */
export interface MedicamentoResponseDto {
  /** ID único do medicamento */
  id: string;

  /** Nome comercial do medicamento */
  nome: string;

  /** Nome da droga / princípio ativo */
  droga: string;

  /** Indica se é medicamento genérico */
  generico: boolean;

  /** Nome da marca (opcional) */
  marca?: string;

  /** Dosagem/concentração do medicamento (ex: 500mg) - opcional */
  dosagem?: string;

  /** Tipo de medicamento */
  tipo: TipoMedicamento;

  /** Data de validade em formato ISO 8601 (YYYY-MM-DD) */
  validade: string;

  /** Status calculado da validade */
  statusValidade: StatusValidade;

  /** Quantidade total inicial do medicamento */
  quantidadeTotal: number;

  /** Quantidade atual disponível */
  quantidadeAtual: number;

  /** URL da foto do medicamento (opcional) */
  fotoUrl?: string;

  /** Observações adicionais (opcional) */
  observacoes?: string;

  /** UID do usuário que criou o medicamento */
  criadoPor: string;

  /** Data de criação em formato ISO 8601 */
  criadoEm: string;

  /** Data da última atualização em formato ISO 8601 */
  atualizadoEm: string;
}

/**
 * DTO para listagem de medicamentos com paginação.
 */
export interface MedicamentosListResponseDto {
  /** Lista de medicamentos */
  items: MedicamentoResponseDto[];

  /** Total de itens (sem paginação) */
  total: number;

  /** Página atual */
  page?: number;

  /** Itens por página */
  pageSize?: number;
}

/**
 * DTO para filtros de busca de medicamentos.
 */
export interface MedicamentosFiltrosDto {
  /** Busca textual (nome, droga, marca) */
  busca?: string;

  /** Filtro por status de validade */
  status?: StatusValidade;

  /** Filtro por tipo de medicamento */
  tipo?: TipoMedicamento;

  /** Filtro por genérico */
  generico?: boolean;

  /** Ordenar por campo */
  ordenarPor?: "nome" | "validade" | "quantidadeAtual" | "criadoEm";

  /** Direção da ordenação */
  ordem?: "asc" | "desc";

  /** Página (para paginação) */
  page?: number;

  /** Itens por página */
  pageSize?: number;
}
