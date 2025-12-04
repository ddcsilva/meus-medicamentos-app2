/**
 * Status de validade do medicamento.
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

  /** Nome da marca (opcional) */
  marca?: string;

  /** Dosagem/concentração do medicamento (ex: 500mg, 10ml) - opcional */
  dosagem?: string;

  /** Tipo de medicamento (comprimido, cápsula, etc.) */
  tipo: TipoMedicamento | string;

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
 * DTO para criação de um novo medicamento.
 *
 * Campos obrigatórios para criar um medicamento.
 * Metadados (id, criadoPor, criadoEm, atualizadoEm) são gerados automaticamente.
 */
export interface CreateMedicamentoDto {
  nome: string;
  droga: string;
  generico: boolean;
  marca?: string;
  dosagem?: string;
  tipo: TipoMedicamento | string;
  validade: string; // ISO 8601 (YYYY-MM-DD)
  quantidadeTotal: number;
  quantidadeAtual: number;
  fotoUrl?: string;
  observacoes?: string;
}

/**
 * DTO para atualização de um medicamento existente.
 *
 * Todos os campos são opcionais, permitindo atualizações parciais.
 */
export interface UpdateMedicamentoDto {
  nome?: string;
  droga?: string;
  generico?: boolean;
  marca?: string;
  dosagem?: string;
  tipo?: TipoMedicamento | string;
  validade?: string; // ISO 8601 (YYYY-MM-DD)
  quantidadeTotal?: number;
  quantidadeAtual?: number;
  fotoUrl?: string;
  observacoes?: string;
}

/**
 * DTO para atualização apenas da quantidade de um medicamento.
 *
 * Usado para operações rápidas de incremento/decremento de estoque.
 */
export interface UpdateQuantidadeDto {
  quantidadeAtual: number;
}

/**
 * DTO de resposta da API para um medicamento.
 *
 * Representa o formato retornado pela API ao buscar medicamentos.
 * Pode incluir campos adicionais calculados pelo backend.
 */
export interface MedicamentoResponseDto {
  id: string;
  nome: string;
  droga: string;
  generico: boolean;
  marca?: string;
  dosagem?: string;
  tipo: TipoMedicamento | string;
  validade: string;
  statusValidade: StatusValidade;
  quantidadeTotal: number;
  quantidadeAtual: number;
  fotoUrl?: string;
  observacoes?: string;
  criadoPor: string;
  criadoEm: string;
  atualizadoEm: string;
}

/**
 * Converte um DTO de resposta da API para o modelo Medicamento.
 *
 * @param dto - DTO de resposta da API
 * @returns Instância do modelo Medicamento
 */
export function mapResponseToMedicamento(
  dto: MedicamentoResponseDto
): Medicamento {
  return {
    id: dto.id,
    nome: dto.nome,
    droga: dto.droga,
    generico: dto.generico,
    marca: dto.marca,
    dosagem: dto.dosagem,
    tipo: dto.tipo,
    validade: dto.validade,
    statusValidade: dto.statusValidade,
    quantidadeTotal: dto.quantidadeTotal,
    quantidadeAtual: dto.quantidadeAtual,
    fotoUrl: dto.fotoUrl,
    observacoes: dto.observacoes,
    criadoPor: dto.criadoPor,
    criadoEm: dto.criadoEm,
    atualizadoEm: dto.atualizadoEm,
  };
}

/**
 * Converte um modelo Medicamento para DTO de criação.
 *
 * Remove campos de metadados e mantém apenas os campos necessários para criação.
 *
 * @param medicamento - Modelo Medicamento
 * @returns DTO para criação
 */
export function mapMedicamentoToCreateDto(
  medicamento: Partial<Medicamento>
): CreateMedicamentoDto {
  return {
    nome: medicamento.nome!,
    droga: medicamento.droga!,
    generico: medicamento.generico ?? false,
    marca: medicamento.marca,
    dosagem: medicamento.dosagem,
    tipo: medicamento.tipo!,
    validade: medicamento.validade!,
    quantidadeTotal: medicamento.quantidadeTotal!,
    quantidadeAtual: medicamento.quantidadeAtual!,
    fotoUrl: medicamento.fotoUrl,
    observacoes: medicamento.observacoes,
  };
}

/**
 * Converte um modelo Medicamento para DTO de atualização.
 *
 * Remove campos de metadados e campos não editáveis.
 *
 * @param medicamento - Modelo Medicamento
 * @returns DTO para atualização
 */
export function mapMedicamentoToUpdateDto(
  medicamento: Partial<Medicamento>
): UpdateMedicamentoDto {
  return {
    nome: medicamento.nome,
    droga: medicamento.droga,
    generico: medicamento.generico,
    marca: medicamento.marca,
    dosagem: medicamento.dosagem,
    tipo: medicamento.tipo,
    validade: medicamento.validade,
    quantidadeTotal: medicamento.quantidadeTotal,
    quantidadeAtual: medicamento.quantidadeAtual,
    fotoUrl: medicamento.fotoUrl,
    observacoes: medicamento.observacoes,
  };
}

/**
 * Calcula o status de validade baseado na data de validade.
 *
 * Regras:
 * - vencido: validade < hoje
 * - prestes: validade entre hoje e +30 dias
 * - válido: validade > +30 dias
 *
 * @param validade - Data de validade em formato ISO 8601 (YYYY-MM-DD)
 * @returns Status de validade calculado
 */
export function calcularStatusValidade(validade: string): StatusValidade {
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);

  const dataValidade = new Date(validade);
  dataValidade.setHours(0, 0, 0, 0);

  const diffTime = dataValidade.getTime() - hoje.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return "vencido";
  }

  if (diffDays <= 30) {
    return "prestes";
  }

  return "valido";
}

/**
 * Valida se uma data de validade está no formato correto (YYYY-MM-DD).
 *
 * @param validade - String da data de validade
 * @returns true se o formato está correto
 */
export function isValidDate(validade: string): boolean {
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(validade)) {
    return false;
  }

  const date = new Date(validade);
  return date instanceof Date && !isNaN(date.getTime());
}
