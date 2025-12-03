import express, { Application } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { env } from "./config/env";
import { errorMiddleware, notFoundMiddleware, apiRateLimiter } from "./middlewares";
import routes from "./routes";
import healthRoutes from "./routes/health.routes";

/**
 * Cria e configura a aplicação Express.
 */
export function createApp(): Application {
  const app = express();

  // ========================================
  // MIDDLEWARES DE SEGURANÇA
  // ========================================

  // Helmet - Headers de segurança
  app.use(helmet());

  // CORS - Cross-Origin Resource Sharing
  app.use(
    cors({
      origin: env.corsOrigin,
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
      credentials: true,
    })
  );

  // ========================================
  // MIDDLEWARES DE PARSING
  // ========================================

  // Parse JSON bodies
  app.use(express.json({ limit: "10mb" }));

  // Parse URL-encoded bodies
  app.use(express.urlencoded({ extended: true, limit: "10mb" }));

  // ========================================
  // MIDDLEWARES DE LOGGING
  // ========================================

  // Morgan - HTTP request logger
  if (env.isDevelopment) {
    app.use(morgan("dev"));
  } else {
    app.use(morgan("combined"));
  }

  // ========================================
  // RATE LIMITING
  // ========================================

  // Aplica rate limiting global na API
  app.use("/api", apiRateLimiter);

  // ========================================
  // ROTAS
  // ========================================

  // Rota raiz
  app.get("/", (_req, res) => {
    res.json({
      name: "Meus Medicamentos API",
      version: "1.0.0",
      description: "API REST para controle de estoque familiar de medicamentos",
      docs: "/health",
    });
  });

  // Rotas da API
  app.use("/api", routes);

  // Atalho para health check na raiz (sem prefixo /api)
  app.use("/health", healthRoutes);

  // ========================================
  // MIDDLEWARES DE ERRO
  // ========================================

  // Rota não encontrada
  app.use(notFoundMiddleware);

  // Tratamento de erros
  app.use(errorMiddleware);

  return app;
}

