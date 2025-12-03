import { Router } from "express";
import { MedicamentosController } from "../controllers/medicamentos.controller";
import { authMiddleware, uploadImage } from "../middlewares";

/**
 * Router para rotas de medicamentos.
 *
 * Todas as rotas são protegidas pelo middleware de autenticação.
 */
const router = Router();

/**
 * Aplica o middleware de autenticação em todas as rotas.
 *
 * Todas as requisições devem incluir o header:
 * Authorization: Bearer <firebase-id-token>
 */
router.use(authMiddleware);

/**
 * GET /medicamentos/estatisticas
 *
 * Retorna estatísticas agregadas dos medicamentos do usuário.
 *
 * @returns {MedicamentosEstatisticas} Estatísticas
 *
 * @example
 * Response:
 * {
 *   "success": true,
 *   "data": {
 *     "total": 10,
 *     "validos": 5,
 *     "prestes": 3,
 *     "vencidos": 2,
 *     "quantidadeBaixa": 4
 *   }
 * }
 */
router.get("/estatisticas", MedicamentosController.estatisticas);

/**
 * GET /medicamentos
 *
 * Lista todos os medicamentos do usuário autenticado.
 *
 * Query params:
 * - busca: string - busca textual (nome, droga, marca)
 * - status: 'valido' | 'prestes' | 'vencido' - filtro por status
 * - tipo: string - filtro por tipo de medicamento
 * - generico: 'true' | 'false' - filtro por genérico
 * - laboratorio: string - filtro por laboratório
 * - ordenarPor: 'nome' | 'validade' | 'quantidadeAtual' | 'criadoEm'
 * - ordem: 'asc' | 'desc'
 * - page: number - página atual (1-based)
 * - pageSize: number - itens por página (max 100)
 *
 * @returns {MedicamentosListResponseDto} Lista de medicamentos
 *
 * @example
 * GET /medicamentos?status=prestes&ordenarPor=validade&ordem=asc
 */
router.get("/", MedicamentosController.listar);

/**
 * GET /medicamentos/:id
 *
 * Busca um medicamento específico por ID.
 *
 * @param id - ID do medicamento
 * @returns {MedicamentoResponseDto} Medicamento encontrado
 *
 * @throws 404 - Medicamento não encontrado
 */
router.get("/:id", MedicamentosController.buscarPorId);

/**
 * POST /medicamentos
 *
 * Cria um novo medicamento.
 *
 * Body:
 * - nome: string (obrigatório)
 * - droga: string (obrigatório)
 * - generico: boolean (obrigatório)
 * - marca: string (obrigatório)
 * - laboratorio: string (obrigatório)
 * - tipo: TipoMedicamento (obrigatório)
 * - validade: string YYYY-MM-DD (obrigatório)
 * - quantidadeTotal: number (obrigatório)
 * - quantidadeAtual: number (obrigatório)
 * - fotoUrl: string (opcional)
 * - observacoes: string (opcional)
 *
 * @returns {MedicamentoResponseDto} Medicamento criado
 *
 * @throws 400 - Dados inválidos
 */
router.post("/", MedicamentosController.criar);

/**
 * PUT /medicamentos/:id
 *
 * Atualiza um medicamento existente.
 *
 * @param id - ID do medicamento
 *
 * Body (todos opcionais):
 * - nome: string
 * - droga: string
 * - generico: boolean
 * - marca: string
 * - laboratorio: string
 * - tipo: TipoMedicamento
 * - validade: string YYYY-MM-DD
 * - quantidadeTotal: number
 * - quantidadeAtual: number
 * - fotoUrl: string
 * - observacoes: string
 *
 * @returns {MedicamentoResponseDto} Medicamento atualizado
 *
 * @throws 400 - Dados inválidos
 * @throws 404 - Medicamento não encontrado
 */
router.put("/:id", MedicamentosController.atualizar);

/**
 * PATCH /medicamentos/:id/quantidade
 *
 * Atualiza apenas a quantidade de um medicamento.
 * Usado para operações rápidas de incremento/decremento.
 *
 * @param id - ID do medicamento
 *
 * Body:
 * - quantidadeAtual: number (obrigatório)
 *
 * @returns {MedicamentoResponseDto} Medicamento atualizado
 *
 * @throws 400 - Quantidade inválida ou excede o total
 * @throws 404 - Medicamento não encontrado
 */
router.patch("/:id/quantidade", MedicamentosController.atualizarQuantidade);

/**
 * DELETE /medicamentos/:id
 *
 * Remove um medicamento.
 *
 * @param id - ID do medicamento
 *
 * @returns {void} Sucesso sem conteúdo
 *
 * @throws 404 - Medicamento não encontrado
 */
router.delete("/:id", MedicamentosController.remover);

/**
 * POST /medicamentos/:id/foto
 *
 * Faz upload de uma foto para o medicamento.
 *
 * @param id - ID do medicamento
 *
 * Body: multipart/form-data com campo 'foto'
 *
 * @returns {MedicamentoResponseDto} Medicamento atualizado com fotoUrl
 *
 * @throws 400 - Arquivo inválido ou não enviado
 * @throws 404 - Medicamento não encontrado
 */
router.post("/:id/foto", uploadImage, MedicamentosController.uploadFoto);

/**
 * DELETE /medicamentos/:id/foto
 *
 * Remove a foto de um medicamento.
 *
 * @param id - ID do medicamento
 *
 * @returns {MedicamentoResponseDto} Medicamento atualizado sem foto
 *
 * @throws 404 - Medicamento não encontrado
 */
router.delete("/:id/foto", MedicamentosController.removerFoto);

export default router;

