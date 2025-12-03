import { getApp, admin } from "./admin";
import { env } from "../config/env";

/**
 * Instância cacheada do Storage.
 */
let storageInstance: admin.storage.Storage | null = null;

/**
 * Obtém a instância do Firebase Storage.
 *
 * Inicializa o Firebase automaticamente se necessário.
 *
 * @example
 * const storage = getStorage();
 * const bucket = storage.bucket();
 */
export function getStorage(): admin.storage.Storage {
  if (!storageInstance) {
    const app = getApp();
    storageInstance = app.storage();
  }

  return storageInstance;
}

/**
 * Obtém o bucket padrão do Storage.
 *
 * @returns Bucket do Storage
 */
export function getBucket(): ReturnType<admin.storage.Storage["bucket"]> {
  const storage = getStorage();
  const bucketName = env.firebase.projectId
    ? `${env.firebase.projectId}.appspot.com`
    : undefined;

  return storage.bucket(bucketName);
}

/**
 * Faz upload de um arquivo para o Storage.
 *
 * @param filePath - Caminho do arquivo local
 * @param destination - Caminho de destino no Storage
 * @param metadata - Metadados opcionais
 * @returns URL pública do arquivo (se público) ou caminho no bucket
 *
 * @example
 * const url = await uploadFile('./foto.jpg', 'medicamentos/abc123/foto.jpg');
 */
export async function uploadFile(
  filePath: string,
  destination: string,
  metadata?: { contentType?: string; public?: boolean }
): Promise<string> {
  const bucket = getBucket();

  await bucket.upload(filePath, {
    destination,
    metadata: {
      contentType: metadata?.contentType,
    },
    public: metadata?.public ?? false,
  });

  if (metadata?.public) {
    return `https://storage.googleapis.com/${bucket.name}/${destination}`;
  }

  return destination;
}

/**
 * Faz upload de um buffer para o Storage.
 *
 * @param buffer - Buffer do arquivo
 * @param destination - Caminho de destino no Storage
 * @param metadata - Metadados opcionais
 * @returns URL pública do arquivo (se público) ou caminho no bucket
 *
 * @example
 * const url = await uploadBuffer(fileBuffer, 'medicamentos/abc123/foto.jpg', {
 *   contentType: 'image/jpeg',
 *   public: true
 * });
 */
export async function uploadBuffer(
  buffer: Buffer,
  destination: string,
  metadata?: { contentType?: string; public?: boolean }
): Promise<string> {
  const bucket = getBucket();
  const file = bucket.file(destination);

  await file.save(buffer, {
    contentType: metadata?.contentType,
    public: metadata?.public ?? false,
  });

  if (metadata?.public) {
    return `https://storage.googleapis.com/${bucket.name}/${destination}`;
  }

  return destination;
}

/**
 * Gera uma URL assinada para acesso temporário a um arquivo.
 *
 * @param filePath - Caminho do arquivo no Storage
 * @param expiresInMinutes - Tempo de expiração em minutos (padrão: 60)
 * @returns URL assinada
 *
 * @example
 * const signedUrl = await getSignedUrl('medicamentos/abc123/foto.jpg', 30);
 */
export async function getSignedUrl(
  filePath: string,
  expiresInMinutes: number = 60
): Promise<string> {
  const bucket = getBucket();
  const file = bucket.file(filePath);

  const [url] = await file.getSignedUrl({
    action: "read",
    expires: Date.now() + expiresInMinutes * 60 * 1000,
  });

  return url;
}

/**
 * Deleta um arquivo do Storage.
 *
 * @param filePath - Caminho do arquivo no Storage
 *
 * @example
 * await deleteFile('medicamentos/abc123/foto.jpg');
 */
export async function deleteFile(filePath: string): Promise<void> {
  const bucket = getBucket();
  const file = bucket.file(filePath);

  try {
    await file.delete();
  } catch (error) {
    // Ignora erro se o arquivo não existir
    const err = error as { code?: number };
    if (err.code !== 404) {
      throw error;
    }
  }
}

/**
 * Verifica se um arquivo existe no Storage.
 *
 * @param filePath - Caminho do arquivo no Storage
 * @returns true se o arquivo existe
 */
export async function fileExists(filePath: string): Promise<boolean> {
  const bucket = getBucket();
  const file = bucket.file(filePath);

  const [exists] = await file.exists();
  return exists;
}

