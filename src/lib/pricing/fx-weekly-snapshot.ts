import type { FxRatesSnapshot } from "@/lib/pricing/types";

export const fxWeeklySnapshot: FxRatesSnapshot = {
  baseCurrency: "CAD",
  fetchedAt: "2026-02-16T00:00:00.000Z",
  validUntil: "2026-02-23T00:00:00.000Z",
  provider: "lemon-squeezy",
  providerSupportedCurrencies: ["CAD", "USD", "EUR", "GBP"],
  rates: {
    CAD: 1,
    USD: 0.74,
    EUR: 0.68,
    GBP: 0.58,
  },
};
