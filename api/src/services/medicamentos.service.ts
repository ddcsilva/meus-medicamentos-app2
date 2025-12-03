import {
  Medicamento,
  CreateMedicamentoDto,
  UpdateMedicamentoDto,
  UpdateQuantidadeDto,
  MedicamentoResponseDto,
  MedicamentosListResponseDto,
  MedicamentosFiltrosDto,
  StatusValidade,
  calcularStatusValidade,
  medicamentoToResponseDto,
  medicamentosToResponseDtos,
} from "../domain";
import {
  IMedicamentosRepository,
  getMedicamentosRepository,
  NotFoundError,
  isRepositoryError,
} from "../repositories";
import { uploadBuffer, deleteFile } from "../firebase";
import { ServiceError, ValidationError } from "./errors";

/**
 * Interface do serviço de medicamentos.
 *
 * Define as operações de negócio disponíveis.
 */
export interface IMedicamentosService {
  listar(
    userId: string,
    filtros?: MedicamentosFiltrosDto
  ): Promise<MedicamentosListResponseDto>;
  buscarPorId(id: string, userId: string): Promise<MedicamentoResponseDto>;
  criar(dto: CreateMedicamentoDto, userId: string): Promise<MedicamentoResponseDto>;
  atualizar(
    id: string,
    dto: UpdateMedicamentoDto,
    userId: string
  ): Promise<MedicamentoResponseDto>;
  atualizarQuantidade(
    id: string,
    dto: UpdateQuantidadeDto,
    userId: string
  ): Promise<MedicamentoResponseDto>;
  uploadFoto(
    id: string,
    file: UploadedFile,
    userId: string
  ): Promise<MedicamentoResponseDto>;
  removerFoto(id: string, userId: string): Promise<MedicamentoResponseDto>;
  remover(id: string, userId: string): Promise<void>;
  contarPorUsuario(userId: string): Promise<number>;
  obterEstatisticas(userId: string): Promise<MedicamentosEstatisticas>;
}

/**
 * Interface para arquivo de upload.
 */
export interface UploadedFile {
  buffer: Buffer;
  originalname: string;
  mimetype: string;
  size: number;
}

/**
 * Estatísticas de medicamentos do usuário.
 */
export interface MedicamentosEstatisticas {
  total: number;
  validos: number;
  prestes: number;
  vencidos: number;
  quantidadeBaixa: number;
}

/**
 * Serviço de domínio de medicamentos.
 *
 * Orquestra operações entre controllers e repositório,
 * aplicando regras de negócio e validações.
 */
export class MedicamentosService implements IMedicamentosService {
  constructor(
    private readonly repository: IMedicamentosRepository = getMedicamentosRepository()
  ) {}

  /**
   * Lista medicamentos do usuário com filtros opcionais.
   *
   * Aplica filtros de status de validade em memória após buscar do Firestore,
   * pois o status é calculado dinamicamente.
   *
   * @param userId - UID do usuário
   * @param filtros - Filtros de busca
   * @returns Lista paginada de medicamentos
   */
  async listar(
    userId: string,
    filtros?: MedicamentosFiltrosDto
  ): Promise<MedicamentosListResponseDto> {
    try {
      // Buscar medicamentos do repositório (com filtros que podem ser feitos no Firestore)
      const medicamentos = await this.repository.findAll(userId, filtros);

      // Aplicar filtros em memória (status, busca textual)
      let filtrados = medicamentos;

      // Filtro por status de validade (calculado dinamicamente)
      if (filtros?.status) {
        filtrados = this.filtrarPorStatus(filtrados, filtros.status);
      }

      // Filtro por busca textual
      if (filtros?.busca) {
        filtrados = this.filtrarPorBusca(filtrados, filtros.busca);
      }

      // Converter para DTOs de resposta
      const items = medicamentosToResponseDtos(filtrados);

      return {
        items,
        total: items.length,
        page: filtros?.page,
        pageSize: filtros?.pageSize,
      };
    } catch (error) {
      throw this.handleError(error, "listar medicamentos");
    }
  }

  /**
   * Busca um medicamento por ID.
   *
   * @param id - ID do medicamento
   * @param userId - UID do usuário
   * @returns Medicamento encontrado
   * @throws NotFoundError se não encontrado
   */
  async buscarPorId(id: string, userId: string): Promise<MedicamentoResponseDto> {
    try {
      this.validarId(id);

      const medicamento = await this.repository.findById(id, userId);

      if (!medicamento) {
        throw new NotFoundError("Medicamento não encontrado");
      }

      return medicamentoToResponseDto(medicamento);
    } catch (error) {
      throw this.handleError(error, "buscar medicamento");
    }
  }

  /**
   * Cria um novo medicamento.
   *
   * @param dto - Dados do medicamento
   * @param userId - UID do usuário criador
   * @returns Medicamento criado
   */
  async criar(
    dto: CreateMedicamentoDto,
    userId: string
  ): Promise<MedicamentoResponseDto> {
    try {
      // Validar dados de entrada
      this.validarCreateDto(dto);

      // Normalizar dados
      const dtoNormalizado = this.normalizarCreateDto(dto);

      // Criar no repositório
      const medicamento = await this.repository.create(dtoNormalizado, userId);

      return medicamentoToResponseDto(medicamento);
    } catch (error) {
      throw this.handleError(error, "criar medicamento");
    }
  }

  /**
   * Atualiza um medicamento existente.
   *
   * @param id - ID do medicamento
   * @param dto - Dados para atualização
   * @param userId - UID do usuário
   * @returns Medicamento atualizado
   */
  async atualizar(
    id: string,
    dto: UpdateMedicamentoDto,
    userId: string
  ): Promise<MedicamentoResponseDto> {
    try {
      this.validarId(id);
      this.validarUpdateDto(dto);

      // Normalizar dados
      const dtoNormalizado = this.normalizarUpdateDto(dto);

      // Atualizar no repositório
      const medicamento = await this.repository.update(id, dtoNormalizado, userId);

      return medicamentoToResponseDto(medicamento);
    } catch (error) {
      throw this.handleError(error, "atualizar medicamento");
    }
  }

  /**
   * Atualiza apenas a quantidade de um medicamento.
   *
   * @param id - ID do medicamento
   * @param dto - Nova quantidade
   * @param userId - UID do usuário
   * @returns Medicamento atualizado
   */
  async atualizarQuantidade(
    id: string,
    dto: UpdateQuantidadeDto,
    userId: string
  ): Promise<MedicamentoResponseDto> {
    try {
      this.validarId(id);
      this.validarQuantidade(dto.quantidadeAtual);

      // Buscar medicamento para validar quantidade máxima
      const medicamentoAtual = await this.repository.findById(id, userId);

      if (!medicamentoAtual) {
        throw new NotFoundError("Medicamento não encontrado");
      }

      // Validar que a quantidade não excede o total
      if (dto.quantidadeAtual > medicamentoAtual.quantidadeTotal) {
        throw new ValidationError(
          `Quantidade não pode exceder o total (${medicamentoAtual.quantidadeTotal})`
        );
      }

      // Atualizar no repositório
      const medicamento = await this.repository.updateQuantidade(
        id,
        dto.quantidadeAtual,
        userId
      );

      return medicamentoToResponseDto(medicamento);
    } catch (error) {
      throw this.handleError(error, "atualizar quantidade");
    }
  }

  /**
   * Remove um medicamento.
   *
   * @param id - ID do medicamento
   * @param userId - UID do usuário
   */
  async remover(id: string, userId: string): Promise<void> {
    try {
      this.validarId(id);

      await this.repository.delete(id, userId);
    } catch (error) {
      throw this.handleError(error, "remover medicamento");
    }
  }

  /**
   * Conta o total de medicamentos do usuário.
   *
   * @param userId - UID do usuário
   * @returns Total de medicamentos
   */
  async contarPorUsuario(userId: string): Promise<number> {
    try {
      return await this.repository.countByUser(userId);
    } catch (error) {
      throw this.handleError(error, "contar medicamentos");
    }
  }

  /**
   * Obtém estatísticas de medicamentos do usuário.
   *
   * @param userId - UID do usuário
   * @returns Estatísticas
   */
  async obterEstatisticas(userId: string): Promise<MedicamentosEstatisticas> {
    try {
      const medicamentos = await this.repository.findAll(userId);

      const estatisticas: MedicamentosEstatisticas = {
        total: medicamentos.length,
        validos: 0,
        prestes: 0,
        vencidos: 0,
        quantidadeBaixa: 0,
      };

      for (const med of medicamentos) {
        // Contar por status de validade
        const status = calcularStatusValidade(med.validade);

        switch (status) {
          case "valido":
            estatisticas.validos++;
            break;
          case "prestes":
            estatisticas.prestes++;
            break;
          case "vencido":
            estatisticas.vencidos++;
            break;
        }

        // Contar quantidade baixa (menos de 20% do total)
        if (med.quantidadeAtual <= med.quantidadeTotal * 0.2) {
          estatisticas.quantidadeBaixa++;
        }
      }

      return estatisticas;
    } catch (error) {
      throw this.handleError(error, "obter estatísticas");
    }
  }

  /**
   * Faz upload de foto para um medicamento.
   *
   * @param id - ID do medicamento
   * @param file - Arquivo de imagem
   * @param userId - UID do usuário
   * @returns Medicamento atualizado com a URL da foto
   */
  async uploadFoto(
    id: string,
    file: UploadedFile,
    userId: string
  ): Promise<MedicamentoResponseDto> {
    try {
      this.validarId(id);

      // Verifica se o medicamento existe e pertence ao usuário
      const medicamento = await this.repository.findById(id, userId);
      if (!medicamento) {
        throw new NotFoundError("Medicamento não encontrado");
      }

      // Gera o caminho do arquivo no Storage
      const ext = file.originalname.split(".").pop()?.toLowerCase() || "jpg";
      const filename = `medicamentos/${userId}/${id}/foto.${ext}`;

      // Remove foto anterior se existir
      if (medicamento.fotoUrl) {
        try {
          const oldPath = this.extractStoragePath(medicamento.fotoUrl);
          if (oldPath) {
            await deleteFile(oldPath);
          }
        } catch {
          // Ignora erro ao remover foto antiga
          console.warn("[MedicamentosService] Erro ao remover foto antiga");
        }
      }

      // Faz upload para o Storage
      const fotoUrl = await uploadBuffer(file.buffer, filename, {
        contentType: file.mimetype,
        public: true,
      });

      // Atualiza o medicamento com a nova URL
      const atualizado = await this.repository.update(
        id,
        { fotoUrl },
        userId
      );

      return medicamentoToResponseDto(atualizado);
    } catch (error) {
      throw this.handleError(error, "fazer upload de foto");
    }
  }

  /**
   * Remove a foto de um medicamento.
   *
   * @param id - ID do medicamento
   * @param userId - UID do usuário
   * @returns Medicamento atualizado sem foto
   */
  async removerFoto(id: string, userId: string): Promise<MedicamentoResponseDto> {
    try {
      this.validarId(id);

      // Verifica se o medicamento existe e pertence ao usuário
      const medicamento = await this.repository.findById(id, userId);
      if (!medicamento) {
        throw new NotFoundError("Medicamento não encontrado");
      }

      // Remove foto do Storage se existir
      if (medicamento.fotoUrl) {
        try {
          const storagePath = this.extractStoragePath(medicamento.fotoUrl);
          if (storagePath) {
            await deleteFile(storagePath);
          }
        } catch {
          console.warn("[MedicamentosService] Erro ao remover foto do Storage");
        }
      }

      // Atualiza o medicamento removendo a URL
      const atualizado = await this.repository.update(
        id,
        { fotoUrl: "" },
        userId
      );

      return medicamentoToResponseDto(atualizado);
    } catch (error) {
      throw this.handleError(error, "remover foto");
    }
  }

  /**
   * Extrai o caminho do Storage de uma URL pública.
   */
  private extractStoragePath(url: string): string | null {
    try {
      // URL formato: https://storage.googleapis.com/bucket/path/to/file
      const match = url.match(/storage\.googleapis\.com\/[^/]+\/(.+)$/);
      return match ? match[1] : null;
    } catch {
      return null;
    }
  }

  // ============================================================================
  // Métodos privados - Regras de negócio
  // ============================================================================

  /**
   * Filtra medicamentos por status de validade.
   */
  private filtrarPorStatus(
    medicamentos: Medicamento[],
    status: StatusValidade
  ): Medicamento[] {
    return medicamentos.filter((med) => {
      const statusAtual = calcularStatusValidade(med.validade);
      return statusAtual === status;
    });
  }

  /**
   * Filtra medicamentos por busca textual.
   */
  private filtrarPorBusca(
    medicamentos: Medicamento[],
    busca: string
  ): Medicamento[] {
    const termoBusca = busca.toLowerCase().trim();

    if (!termoBusca) {
      return medicamentos;
    }

    return medicamentos.filter((med) => {
      const campos = [
        med.nome,
        med.droga,
        med.marca,
        med.laboratorio,
        med.observacoes,
      ];

      return campos.some(
        (campo) => campo && campo.toLowerCase().includes(termoBusca)
      );
    });
  }

  // ============================================================================
  // Métodos privados - Validação
  // ============================================================================

  /**
   * Valida um ID de medicamento.
   */
  private validarId(id: string): void {
    if (!id || typeof id !== "string" || id.trim().length === 0) {
      throw new ValidationError("ID do medicamento é obrigatório");
    }
  }

  /**
   * Valida um DTO de criação.
   */
  private validarCreateDto(dto: CreateMedicamentoDto): void {
    const erros: string[] = [];

    if (!dto.nome?.trim()) {
      erros.push("Nome é obrigatório");
    }

    if (!dto.droga?.trim()) {
      erros.push("Droga/princípio ativo é obrigatório");
    }

    if (!dto.marca?.trim()) {
      erros.push("Marca é obrigatória");
    }

    if (!dto.laboratorio?.trim()) {
      erros.push("Laboratório é obrigatório");
    }

    if (!dto.tipo) {
      erros.push("Tipo é obrigatório");
    }

    if (!dto.validade) {
      erros.push("Data de validade é obrigatória");
    } else if (!this.isValidDateString(dto.validade)) {
      erros.push("Data de validade inválida (formato: YYYY-MM-DD)");
    }

    if (dto.quantidadeTotal === undefined || dto.quantidadeTotal < 0) {
      erros.push("Quantidade total deve ser um número não negativo");
    }

    if (dto.quantidadeAtual === undefined || dto.quantidadeAtual < 0) {
      erros.push("Quantidade atual deve ser um número não negativo");
    }

    if (
      dto.quantidadeAtual !== undefined &&
      dto.quantidadeTotal !== undefined &&
      dto.quantidadeAtual > dto.quantidadeTotal
    ) {
      erros.push("Quantidade atual não pode exceder a quantidade total");
    }

    if (erros.length > 0) {
      throw new ValidationError(erros.join("; "));
    }
  }

  /**
   * Valida um DTO de atualização.
   */
  private validarUpdateDto(dto: UpdateMedicamentoDto): void {
    const erros: string[] = [];

    if (dto.nome !== undefined && !dto.nome.trim()) {
      erros.push("Nome não pode ser vazio");
    }

    if (dto.droga !== undefined && !dto.droga.trim()) {
      erros.push("Droga/princípio ativo não pode ser vazio");
    }

    if (dto.validade !== undefined && !this.isValidDateString(dto.validade)) {
      erros.push("Data de validade inválida (formato: YYYY-MM-DD)");
    }

    if (dto.quantidadeTotal !== undefined && dto.quantidadeTotal < 0) {
      erros.push("Quantidade total deve ser um número não negativo");
    }

    if (dto.quantidadeAtual !== undefined && dto.quantidadeAtual < 0) {
      erros.push("Quantidade atual deve ser um número não negativo");
    }

    if (erros.length > 0) {
      throw new ValidationError(erros.join("; "));
    }
  }

  /**
   * Valida uma quantidade.
   */
  private validarQuantidade(quantidade: number): void {
    if (quantidade === undefined || quantidade === null) {
      throw new ValidationError("Quantidade é obrigatória");
    }

    if (typeof quantidade !== "number" || isNaN(quantidade)) {
      throw new ValidationError("Quantidade deve ser um número");
    }

    if (quantidade < 0) {
      throw new ValidationError("Quantidade não pode ser negativa");
    }

    if (!Number.isInteger(quantidade)) {
      throw new ValidationError("Quantidade deve ser um número inteiro");
    }
  }

  /**
   * Valida se uma string é uma data válida no formato YYYY-MM-DD.
   */
  private isValidDateString(dateString: string): boolean {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

    if (!dateRegex.test(dateString)) {
      return false;
    }

    const date = new Date(dateString);
    return date instanceof Date && !isNaN(date.getTime());
  }

  // ============================================================================
  // Métodos privados - Normalização
  // ============================================================================

  /**
   * Normaliza um DTO de criação.
   */
  private normalizarCreateDto(dto: CreateMedicamentoDto): CreateMedicamentoDto {
    return {
      ...dto,
      nome: dto.nome.trim(),
      droga: dto.droga.trim(),
      marca: dto.marca.trim(),
      laboratorio: dto.laboratorio.trim(),
      fotoUrl: dto.fotoUrl?.trim(),
      observacoes: dto.observacoes?.trim(),
    };
  }

  /**
   * Normaliza um DTO de atualização.
   */
  private normalizarUpdateDto(dto: UpdateMedicamentoDto): UpdateMedicamentoDto {
    const normalizado: UpdateMedicamentoDto = { ...dto };

    if (dto.nome !== undefined) {
      normalizado.nome = dto.nome.trim();
    }

    if (dto.droga !== undefined) {
      normalizado.droga = dto.droga.trim();
    }

    if (dto.marca !== undefined) {
      normalizado.marca = dto.marca.trim();
    }

    if (dto.laboratorio !== undefined) {
      normalizado.laboratorio = dto.laboratorio.trim();
    }

    if (dto.fotoUrl !== undefined) {
      normalizado.fotoUrl = dto.fotoUrl.trim();
    }

    if (dto.observacoes !== undefined) {
      normalizado.observacoes = dto.observacoes.trim();
    }

    return normalizado;
  }

  // ============================================================================
  // Tratamento de erros
  // ============================================================================

  /**
   * Trata erros e converte para erros de serviço.
   */
  private handleError(error: unknown, operation: string): Error {
    // Se já é um erro conhecido, repassa
    if (error instanceof NotFoundError) {
      return error;
    }

    if (error instanceof ValidationError) {
      return error;
    }

    if (isRepositoryError(error)) {
      return error;
    }

    // Erro genérico
    console.error(`[MedicamentosService] Erro ao ${operation}:`, error);

    const err = error as { message?: string };
    return new ServiceError(err.message || `Erro ao ${operation}`);
  }
}

// ============================================================================
// Singleton e injeção de dependência
// ============================================================================

/**
 * Instância singleton do serviço.
 */
let serviceInstance: IMedicamentosService | null = null;

/**
 * Obtém a instância do serviço de medicamentos.
 */
export function getMedicamentosService(): IMedicamentosService {
  if (!serviceInstance) {
    serviceInstance = new MedicamentosService();
  }
  return serviceInstance;
}

/**
 * Define uma instância customizada do serviço (para testes).
 */
export function setMedicamentosService(
  service: IMedicamentosService | null
): void {
  serviceInstance = service;
}

