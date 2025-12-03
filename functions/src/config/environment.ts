/**
 * Configurações de ambiente para Cloud Functions.
 *
 * Centraliza a leitura de variáveis de ambiente e fornece valores padrão.
 * As configurações são acessíveis via Firebase Functions config ou variáveis de ambiente.
 *
 * @module config/environment
 */

import * as functions from "firebase-functions";

/**
 * Interface de configuração de email.
 */
export interface EmailConfig {
  /** Serviço de email (sendgrid, mailgun, etc.) */
  service: string;
  /** API Key do serviço */
  apiKey: string;
  /** Email remetente */
  from: string;
  /** Nome do remetente */
  fromName: string;
}

/**
 * Interface de configuração de limites de alerta.
 */
export interface AlertLimits {
  /** Dias antes da validade para alerta de aviso */
  daysBeforeExpiryWarning: number;
  /** Dias antes da validade para alerta crítico */
  daysBeforeExpiryCritical: number;
  /** Quantidade padrão para alerta de estoque baixo */
  defaultLowStockThreshold: number;
}

/**
 * Interface de configuração de agendamento.
 */
export interface ScheduleConfig {
  /** Hora do job diário */
  dailyCheckHour: number;
  /** Minuto do job diário */
  dailyCheckMinute: number;
  /** Dia do mês para revisão mensal */
  monthlyReviewDay: number;
}

/**
 * Interface principal de configuração.
 */
export interface AppConfig {
  /** Timezone para agendamentos */
  timezone: string;
  /** Configurações de email */
  email: EmailConfig;
  /** Limites de alerta */
  alerts: AlertLimits;
  /** Configurações de agendamento */
  schedule: ScheduleConfig;
  /** Ambiente (development, production) */
  environment: string;
}

/**
 * Obtém valor de configuração do Firebase Functions ou variável de ambiente.
 *
 * @param key - Chave da configuração (formato: "section.key")
 * @param defaultValue - Valor padrão se não encontrado
 * @returns Valor da configuração
 */
function getConfigValue(key: string, defaultValue: string): string {
  // Tenta obter do Firebase Functions config
  try {
    const parts = key.split(".");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let value: any = functions.config();

    for (const part of parts) {
      value = value?.[part];
    }

    if (value !== undefined && value !== null) {
      return String(value);
    }
  } catch {
    // Config não disponível, usar variáveis de ambiente
  }

  // Fallback para variáveis de ambiente
  const envKey = key.replace(/\./g, "_").toUpperCase();
  return process.env[envKey] || defaultValue;
}

/**
 * Obtém valor numérico de configuração.
 *
 * @param key - Chave da configuração
 * @param defaultValue - Valor padrão
 * @returns Valor numérico
 */
function getConfigNumber(key: string, defaultValue: number): number {
  const value = getConfigValue(key, String(defaultValue));
  const parsed = parseInt(value, 10);
  return isNaN(parsed) ? defaultValue : parsed;
}

/**
 * Configuração centralizada da aplicação.
 *
 * Valores são lidos de:
 * 1. Firebase Functions config (firebase functions:config:set)
 * 2. Variáveis de ambiente (process.env)
 * 3. Valores padrão
 */
export const config: AppConfig = {
  timezone: getConfigValue("timezone", "America/Sao_Paulo"),

  environment: getConfigValue("environment", "development"),

  email: {
    service: getConfigValue("email.service", "sendgrid"),
    apiKey: getConfigValue("email.api_key", ""),
    from: getConfigValue("email.from", "noreply@meusmedicamentos.com"),
    fromName: getConfigValue("email.from_name", "Meus Medicamentos"),
  },

  alerts: {
    daysBeforeExpiryWarning: getConfigNumber(
      "alerts.days_before_expiry_warning",
      30
    ),
    daysBeforeExpiryCritical: getConfigNumber(
      "alerts.days_before_expiry_critical",
      7
    ),
    defaultLowStockThreshold: getConfigNumber(
      "alerts.default_low_stock_threshold",
      5
    ),
  },

  schedule: {
    dailyCheckHour: getConfigNumber("schedule.daily_check_hour", 8),
    dailyCheckMinute: getConfigNumber("schedule.daily_check_minute", 0),
    monthlyReviewDay: getConfigNumber("schedule.monthly_review_day", 1),
  },
};

/**
 * Valida se as configurações obrigatórias estão presentes.
 *
 * @returns true se válido, false caso contrário
 */
export function validateConfig(): boolean {
  const warnings: string[] = [];

  // Verificar configurações de email (necessárias para notificações)
  if (!config.email.apiKey) {
    warnings.push("EMAIL_API_KEY não configurada - notificações por email desabilitadas");
  }

  // Log de warnings em desenvolvimento
  if (config.environment !== "production" && warnings.length > 0) {
    console.warn("[Config] Avisos de configuração:");
    warnings.forEach((w) => console.warn(`  - ${w}`));
  }

  return true; // Permite execução mesmo sem email configurado
}

/**
 * Exporta configuração para index.ts
 */
export default config;


