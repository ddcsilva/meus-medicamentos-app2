/**
 * Barrel file para módulos de notificação.
 *
 * @module notifications
 */

export { scheduledExpiryCheck } from "./expiry-check";
export type { MedicamentoComAlerta, ExpiryCheckResult } from "./expiry-check";

export { scheduledLowStockCheck } from "./low-stock-check";
export type { MedicamentoEstoqueBaixo, LowStockCheckResult } from "./low-stock-check";

export { scheduledMonthlyReview } from "./monthly-review";
export type { EstatisticasMensais, MonthlyReviewResult } from "./monthly-review";


