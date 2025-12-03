import { body, param, query, ValidationChain, validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";
import { TipoMedicamento } from "../domain";

/**
 * Tipos de medicamento válidos.
 */
const TIPOS_VALIDOS: TipoMedicamento[] = [
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
 * Status de validade válidos.
 */
const STATUS_VALIDOS = ["valido", "prestes", "vencido"];

/**
 * Campos de ordenação válidos.
 */
const ORDENACAO_VALIDA = ["nome", "validade", "quantidadeAtual", "criadoEm"];

/**
 * Middleware para processar erros de validação.
 *
 * Deve ser usado após as regras de validação.
 */
export function handleValidationErrors(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const formattedErrors: Record<string, string> = {};

    errors.array().forEach((error) => {
      if (error.type === "field") {
        formattedErrors[error.path] = error.msg;
      }
    });

    res.status(400).json({
      success: false,
      error: {
        code: "VALIDATION_ERROR",
        message: "Dados inválidos. Verifique os campos.",
        fields: formattedErrors,
      },
    });
    return;
  }

  next();
}

/**
 * Validação para criação de medicamento.
 */
export const createMedicamentoValidation: ValidationChain[] = [
  body("nome")
    .trim()
    .notEmpty()
    .withMessage("Nome é obrigatório")
    .isLength({ max: 200 })
    .withMessage("Nome deve ter no máximo 200 caracteres"),

  body("droga")
    .trim()
    .notEmpty()
    .withMessage("Droga/princípio ativo é obrigatório")
    .isLength({ max: 200 })
    .withMessage("Droga deve ter no máximo 200 caracteres"),

  body("generico")
    .isBoolean()
    .withMessage("Genérico deve ser true ou false"),

  body("marca")
    .trim()
    .notEmpty()
    .withMessage("Marca é obrigatória")
    .isLength({ max: 200 })
    .withMessage("Marca deve ter no máximo 200 caracteres"),

  body("laboratorio")
    .trim()
    .notEmpty()
    .withMessage("Laboratório é obrigatório")
    .isLength({ max: 200 })
    .withMessage("Laboratório deve ter no máximo 200 caracteres"),

  body("tipo")
    .trim()
    .notEmpty()
    .withMessage("Tipo é obrigatório")
    .isIn(TIPOS_VALIDOS)
    .withMessage(`Tipo deve ser um dos: ${TIPOS_VALIDOS.join(", ")}`),

  body("validade")
    .trim()
    .notEmpty()
    .withMessage("Validade é obrigatória")
    .isISO8601()
    .withMessage("Validade deve ser uma data válida (YYYY-MM-DD)"),

  body("quantidadeTotal")
    .isInt({ min: 1 })
    .withMessage("Quantidade total deve ser um número inteiro maior que 0"),

  body("quantidadeAtual")
    .isInt({ min: 0 })
    .withMessage("Quantidade atual deve ser um número inteiro maior ou igual a 0"),

  body("fotoUrl")
    .optional()
    .trim()
    .isURL()
    .withMessage("URL da foto deve ser uma URL válida"),

  body("observacoes")
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage("Observações devem ter no máximo 1000 caracteres"),
];

/**
 * Validação para atualização de medicamento.
 *
 * Todos os campos são opcionais.
 */
export const updateMedicamentoValidation: ValidationChain[] = [
  body("nome")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Nome não pode ser vazio")
    .isLength({ max: 200 })
    .withMessage("Nome deve ter no máximo 200 caracteres"),

  body("droga")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Droga não pode ser vazia")
    .isLength({ max: 200 })
    .withMessage("Droga deve ter no máximo 200 caracteres"),

  body("generico")
    .optional()
    .isBoolean()
    .withMessage("Genérico deve ser true ou false"),

  body("marca")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Marca não pode ser vazia")
    .isLength({ max: 200 })
    .withMessage("Marca deve ter no máximo 200 caracteres"),

  body("laboratorio")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Laboratório não pode ser vazio")
    .isLength({ max: 200 })
    .withMessage("Laboratório deve ter no máximo 200 caracteres"),

  body("tipo")
    .optional()
    .trim()
    .isIn(TIPOS_VALIDOS)
    .withMessage(`Tipo deve ser um dos: ${TIPOS_VALIDOS.join(", ")}`),

  body("validade")
    .optional()
    .trim()
    .isISO8601()
    .withMessage("Validade deve ser uma data válida (YYYY-MM-DD)"),

  body("quantidadeTotal")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Quantidade total deve ser um número inteiro maior que 0"),

  body("quantidadeAtual")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Quantidade atual deve ser um número inteiro maior ou igual a 0"),

  body("fotoUrl")
    .optional()
    .trim()
    .isURL()
    .withMessage("URL da foto deve ser uma URL válida"),

  body("observacoes")
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage("Observações devem ter no máximo 1000 caracteres"),
];

/**
 * Validação para atualização de quantidade.
 */
export const updateQuantidadeValidation: ValidationChain[] = [
  body("quantidadeAtual")
    .isInt({ min: 0 })
    .withMessage("Quantidade deve ser um número inteiro maior ou igual a 0"),
];

/**
 * Validação de ID nos parâmetros.
 */
export const idParamValidation: ValidationChain[] = [
  param("id")
    .trim()
    .notEmpty()
    .withMessage("ID é obrigatório")
    .isLength({ min: 20, max: 30 })
    .withMessage("ID inválido"),
];

/**
 * Validação de filtros de listagem.
 */
export const listFiltersValidation: ValidationChain[] = [
  query("busca")
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage("Busca deve ter no máximo 100 caracteres"),

  query("status")
    .optional()
    .isIn(STATUS_VALIDOS)
    .withMessage(`Status deve ser um dos: ${STATUS_VALIDOS.join(", ")}`),

  query("tipo")
    .optional()
    .isIn(TIPOS_VALIDOS)
    .withMessage(`Tipo deve ser um dos: ${TIPOS_VALIDOS.join(", ")}`),

  query("generico")
    .optional()
    .isIn(["true", "false"])
    .withMessage("Genérico deve ser true ou false"),

  query("laboratorio")
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage("Laboratório deve ter no máximo 200 caracteres"),

  query("ordenarPor")
    .optional()
    .isIn(ORDENACAO_VALIDA)
    .withMessage(`Ordenação deve ser um dos: ${ORDENACAO_VALIDA.join(", ")}`),

  query("ordem")
    .optional()
    .isIn(["asc", "desc"])
    .withMessage("Ordem deve ser asc ou desc"),

  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Página deve ser um número inteiro maior que 0"),

  query("pageSize")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Tamanho da página deve ser entre 1 e 100"),
];


