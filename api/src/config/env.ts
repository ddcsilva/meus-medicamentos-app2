import dotenv from "dotenv";
import path from "path";

// Carrega variáveis de ambiente do arquivo .env
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

/**
 * Configuração de ambiente da aplicação.
 */
export const env = {
  /**
   * Ambiente de execução (development, production, test).
   */
  nodeEnv: process.env.NODE_ENV || "development",

  /**
   * Porta do servidor.
   */
  port: parseInt(process.env.PORT || "3000", 10),

  /**
   * Se está em modo de desenvolvimento.
   */
  isDevelopment: process.env.NODE_ENV === "development",

  /**
   * Se está em modo de produção.
   */
  isProduction: process.env.NODE_ENV === "production",

  /**
   * Se está em modo de teste.
   */
  isTest: process.env.NODE_ENV === "test",

  /**
   * Origem permitida para CORS.
   */
  corsOrigin: process.env.CORS_ORIGIN || "http://localhost:4200",

  /**
   * Nível de log.
   */
  logLevel: process.env.LOG_LEVEL || "debug",

  /**
   * Configuração do Firebase Admin.
   */
  firebase: {
    /**
     * Caminho para o arquivo de credenciais.
     */
    serviceAccountPath: process.env.FIREBASE_SERVICE_ACCOUNT_PATH,

    /**
     * ID do projeto (alternativa ao arquivo).
     */
    projectId: process.env.FIREBASE_PROJECT_ID,

    /**
     * Chave privada (alternativa ao arquivo).
     */
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),

    /**
     * Email do cliente (alternativa ao arquivo).
     */
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,

    /**
     * Storage bucket (opcional, derivado do projectId se não fornecido).
     */
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,

    /**
     * Se deve usar o emulador do Firebase.
     */
    useEmulator: process.env.FIREBASE_USE_EMULATOR === "true",

    /**
     * Host do emulador do Firestore.
     */
    firestoreEmulatorHost: process.env.FIRESTORE_EMULATOR_HOST,

    /**
     * Host do emulador do Auth.
     */
    authEmulatorHost: process.env.FIREBASE_AUTH_EMULATOR_HOST,
  },
};

/**
 * Valida as variáveis de ambiente obrigatórias.
 */
export function validateEnv(): void {
  const required: string[] = [];

  // Adicione variáveis obrigatórias aqui quando necessário
  // required.push('FIREBASE_PROJECT_ID');

  const missing = required.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    throw new Error(
      `Variáveis de ambiente obrigatórias não definidas: ${missing.join(", ")}`
    );
  }
}

