import { createApp } from "./app";
import { env, validateEnv } from "./config/env";

/**
 * Inicializa o servidor da API.
 */
async function bootstrap(): Promise<void> {
  try {
    // Valida variáveis de ambiente
    validateEnv();

    // Cria a aplicação Express
    const app = createApp();

    // Inicia o servidor
    app.listen(env.port, () => {
      console.info("=".repeat(50));
      console.info(`🚀 Meus Medicamentos API`);
      console.info(`📍 Servidor rodando em: http://localhost:${env.port}`);
      console.info(`🌍 Ambiente: ${env.nodeEnv}`);
      console.info(`❤️  Health check: http://localhost:${env.port}/health`);
      console.info("=".repeat(50));
    });

    // Tratamento de sinais de encerramento
    process.on("SIGTERM", () => {
      console.info("SIGTERM recebido. Encerrando servidor...");
      process.exit(0);
    });

    process.on("SIGINT", () => {
      console.info("SIGINT recebido. Encerrando servidor...");
      process.exit(0);
    });
  } catch (error) {
    console.error("Erro ao iniciar servidor:", error);
    process.exit(1);
  }
}

// Inicia a aplicação
bootstrap();

