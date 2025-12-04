import { Request, Response, NextFunction } from "express";
import { getMedicamentosService } from "../services";
import {
  CreateMedicamentoDto,
  UpdateMedicamentoDto,
  UpdateQuantidadeDto,
  MedicamentosFiltrosDto,
  StatusValidade,
  TipoMedicamento,
} from "../domain";

/**
 * Controller para operações de medicamentos.
 *
 * Responsável por receber requisições HTTP, extrair dados,
 * chamar o serviço de domínio e formatar respostas.
 */
export class MedicamentosController {
  /**
   * Lista medicamentos do usuário autenticado.
   *
   * GET /medicamentos
   *
   * Query params:
   * - busca: string - busca textual
   * - status: StatusValidade - filtro por status
   * - tipo: TipoMedicamento - filtro por tipo
   * - generico: boolean - filtro por genérico
   * - ordenarPor: string - campo de ordenação
   * - ordem: 'asc' | 'desc' - direção da ordenação
   * - page: number - página atual
   * - pageSize: number - itens por página
   */
  static async listar(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.user!.uid;
      const filtros = MedicamentosController.parseFiltros(req.query);

      const service = getMedicamentosService();
      const resultado = await service.listar(userId, filtros);

      res.status(200).json({
        success: true,
        data: resultado,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Busca um medicamento por ID.
   *
   * GET /medicamentos/:id
   */
  static async buscarPorId(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.user!.uid;
      const { id } = req.params;

      const service = getMedicamentosService();
      const medicamento = await service.buscarPorId(id, userId);

      res.status(200).json({
        success: true,
        data: medicamento,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Cria um novo medicamento.
   *
   * POST /medicamentos
   */
  static async criar(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.user!.uid;
      const dto: CreateMedicamentoDto = req.body;

      const service = getMedicamentosService();
      const medicamento = await service.criar(dto, userId);

      res.status(201).json({
        success: true,
        data: medicamento,
        message: "Medicamento criado com sucesso",
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Atualiza um medicamento existente.
   *
   * PUT /medicamentos/:id
   */
  static async atualizar(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.user!.uid;
      const { id } = req.params;
      const dto: UpdateMedicamentoDto = req.body;

      const service = getMedicamentosService();
      const medicamento = await service.atualizar(id, dto, userId);

      res.status(200).json({
        success: true,
        data: medicamento,
        message: "Medicamento atualizado com sucesso",
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Atualiza apenas a quantidade de um medicamento.
   *
   * PATCH /medicamentos/:id/quantidade
   */
  static async atualizarQuantidade(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.user!.uid;
      const { id } = req.params;
      const dto: UpdateQuantidadeDto = req.body;

      const service = getMedicamentosService();
      const medicamento = await service.atualizarQuantidade(id, dto, userId);

      res.status(200).json({
        success: true,
        data: medicamento,
        message: "Quantidade atualizada com sucesso",
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Remove um medicamento.
   *
   * DELETE /medicamentos/:id
   */
  static async remover(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.user!.uid;
      const { id } = req.params;

      const service = getMedicamentosService();
      await service.remover(id, userId);

      res.status(200).json({
        success: true,
        message: "Medicamento removido com sucesso",
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Obtém estatísticas de medicamentos do usuário.
   *
   * GET /medicamentos/estatisticas
   */
  static async estatisticas(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.user!.uid;

      const service = getMedicamentosService();
      const estatisticas = await service.obterEstatisticas(userId);

      res.status(200).json({
        success: true,
        data: estatisticas,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Faz upload de foto para um medicamento.
   *
   * POST /medicamentos/:id/foto
   */
  static async uploadFoto(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.user!.uid;
      const { id } = req.params;

      if (!req.file) {
        res.status(400).json({
          success: false,
          error: {
            code: "NO_FILE",
            message: "Nenhum arquivo enviado. Use o campo 'foto'.",
          },
        });
        return;
      }

      const service = getMedicamentosService();
      const medicamento = await service.uploadFoto(
        id,
        {
          buffer: req.file.buffer,
          originalname: req.file.originalname,
          mimetype: req.file.mimetype,
          size: req.file.size,
        },
        userId
      );

      res.status(200).json({
        success: true,
        data: medicamento,
        message: "Foto enviada com sucesso",
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Remove a foto de um medicamento.
   *
   * DELETE /medicamentos/:id/foto
   */
  static async removerFoto(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.user!.uid;
      const { id } = req.params;

      const service = getMedicamentosService();
      const medicamento = await service.removerFoto(id, userId);

      res.status(200).json({
        success: true,
        data: medicamento,
        message: "Foto removida com sucesso",
      });
    } catch (error) {
      next(error);
    }
  }

  // ============================================================================
  // Métodos auxiliares
  // ============================================================================

  /**
   * Parseia os query params para o objeto de filtros.
   */
  private static parseFiltros(
    query: Record<string, unknown>
  ): MedicamentosFiltrosDto {
    const filtros: MedicamentosFiltrosDto = {};

    // Busca textual
    if (typeof query.busca === "string" && query.busca.trim()) {
      filtros.busca = query.busca.trim();
    }

    // Status de validade
    if (
      typeof query.status === "string" &&
      ["valido", "prestes", "vencido"].includes(query.status)
    ) {
      filtros.status = query.status as StatusValidade;
    }

    // Tipo de medicamento
    if (typeof query.tipo === "string" && query.tipo.trim()) {
      filtros.tipo = query.tipo as TipoMedicamento;
    }

    // Genérico
    if (query.generico === "true") {
      filtros.generico = true;
    } else if (query.generico === "false") {
      filtros.generico = false;
    }

    // Ordenação
    if (
      typeof query.ordenarPor === "string" &&
      ["nome", "validade", "quantidadeAtual", "criadoEm"].includes(
        query.ordenarPor
      )
    ) {
      filtros.ordenarPor = query.ordenarPor as
        | "nome"
        | "validade"
        | "quantidadeAtual"
        | "criadoEm";
    }

    if (
      typeof query.ordem === "string" &&
      ["asc", "desc"].includes(query.ordem)
    ) {
      filtros.ordem = query.ordem as "asc" | "desc";
    }

    // Paginação
    if (typeof query.page === "string") {
      const page = parseInt(query.page, 10);
      if (!isNaN(page) && page > 0) {
        filtros.page = page;
      }
    }

    if (typeof query.pageSize === "string") {
      const pageSize = parseInt(query.pageSize, 10);
      if (!isNaN(pageSize) && pageSize > 0 && pageSize <= 100) {
        filtros.pageSize = pageSize;
      }
    }

    return filtros;
  }
}

