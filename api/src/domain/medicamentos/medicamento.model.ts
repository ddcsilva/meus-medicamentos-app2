/**
 * Status de validade do medicamento.
 *
 * - valido: validade > +30 dias
 * - prestes: validade entre hoje e +30 dias
 * - vencido: validade < hoje
 */
export type StatusValidade = "valido" | "prestes" | "vencido";

/**
 * Tipo de medicamento (comprimido, cápsula, líquido, etc.).
 */
export type TipoMedicamento =
  | "comprimido"
  | "capsula"
  | "liquido"
  | "spray"
  | "creme"
  | "pomada"
  | "gel"
  | "gotas"
  | "injetavel"
  | "outro";

/**
 * Lista de tipos de medicamento válidos.
 * Usada para validação.
 */
export const TIPOS_MEDICAMENTO: TipoMedicamento[] = [
  "comprimido",
  "capsula",
  "liquido",
  "spray",
  "creme",
  "pomada",
  "gel",
  "gotas",
  "injetavel",
  "outro",
];

/**
 * Interface principal do modelo Medicamento.
 *
 * Representa um medicamento no sistema, incluindo todas as informações
 * necessárias para controle de estoque e validade.
 */
export interface Medicamento {
  /** ID único do medicamento (gerado pelo Firestore) */
  id: string;

  /** Nome comercial do medicamento */
  nome: string;

  /** Nome da droga / princípio ativo */
  droga: string;

  /** Indica se é medicamento genérico */
  generico: boolean;

  /** Nome da marca */
  marca: string;

  /** Nome do laboratório */
  laboratorio: string;

  /** Tipo de medicamento (comprimido, cápsula, etc.) */
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

  /** Observações adicionais sobre o medicamento (opcional) */
  observacoes?: string;

  /** UID do usuário que criou o medicamento */
  criadoPor: string;

  /** Data de criação em formato ISO 8601 */
  criadoEm: string;

  /** Data da última atualização em formato ISO 8601 */
  atualizadoEm: string;
}

/**
 * Tipo parcial do medicamento (para atualizações parciais).
 */
export type MedicamentoPartial = Partial<Omit<Medicamento, "id">>;


