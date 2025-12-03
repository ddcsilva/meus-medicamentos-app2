import multer, { FileFilterCallback } from "multer";
import { Request } from "express";
import path from "path";
import { createAppError } from "./error.middleware";

/**
 * Tipos de arquivo permitidos para upload de imagens.
 */
const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/gif",
  "image/webp",
];

/**
 * Extensões de arquivo permitidas.
 */
const ALLOWED_EXTENSIONS = [".jpg", ".jpeg", ".png", ".gif", ".webp"];

/**
 * Tamanho máximo do arquivo (5MB).
 */
const MAX_FILE_SIZE = 5 * 1024 * 1024;

/**
 * Filtro de arquivos para aceitar apenas imagens.
 */
function imageFileFilter(
  _req: Request,
  file: Express.Multer.File,
  callback: FileFilterCallback
): void {
  // Verifica o MIME type
  if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    callback(
      createAppError(
        `Tipo de arquivo não permitido. Use: ${ALLOWED_EXTENSIONS.join(", ")}`,
        400,
        "INVALID_FILE_TYPE"
      )
    );
    return;
  }

  // Verifica a extensão
  const ext = path.extname(file.originalname).toLowerCase();
  if (!ALLOWED_EXTENSIONS.includes(ext)) {
    callback(
      createAppError(
        `Extensão de arquivo não permitida. Use: ${ALLOWED_EXTENSIONS.join(", ")}`,
        400,
        "INVALID_FILE_EXTENSION"
      )
    );
    return;
  }

  callback(null, true);
}

/**
 * Configuração do multer para upload de imagens.
 *
 * Usa memoryStorage para manter o arquivo em buffer,
 * permitindo envio direto para o Firebase Storage.
 */
const uploadConfig = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: MAX_FILE_SIZE,
    files: 1,
  },
  fileFilter: imageFileFilter,
});

/**
 * Middleware para upload de uma única imagem.
 *
 * O arquivo estará disponível em req.file.
 *
 * @example
 * router.post('/foto', uploadImage, (req, res) => {
 *   const file = req.file;
 *   // file.buffer contém os dados da imagem
 * });
 */
export const uploadImage = uploadConfig.single("foto");

/**
 * Middleware para tratar erros do multer.
 */
export function handleMulterError(
  error: Error,
  _req: Request,
  _res: Response,
  next: (error?: Error) => void
): void {
  if (error instanceof multer.MulterError) {
    switch (error.code) {
      case "LIMIT_FILE_SIZE":
        next(
          createAppError(
            `Arquivo muito grande. Tamanho máximo: ${MAX_FILE_SIZE / 1024 / 1024}MB`,
            400,
            "FILE_TOO_LARGE"
          )
        );
        break;
      case "LIMIT_FILE_COUNT":
        next(
          createAppError("Apenas um arquivo pode ser enviado por vez.", 400, "TOO_MANY_FILES")
        );
        break;
      case "LIMIT_UNEXPECTED_FILE":
        next(
          createAppError(
            'Campo de arquivo inválido. Use o campo "foto".',
            400,
            "INVALID_FIELD_NAME"
          )
        );
        break;
      default:
        next(createAppError("Erro no upload do arquivo.", 400, "UPLOAD_ERROR"));
    }
  } else {
    next(error);
  }
}

/**
 * Informações sobre limites de upload.
 */
export const UPLOAD_LIMITS = {
  maxFileSize: MAX_FILE_SIZE,
  maxFileSizeMB: MAX_FILE_SIZE / 1024 / 1024,
  allowedMimeTypes: ALLOWED_MIME_TYPES,
  allowedExtensions: ALLOWED_EXTENSIONS,
};

