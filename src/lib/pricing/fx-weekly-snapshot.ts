import type { FxRatesSnapshot } from "@/lib/pricing/types";

export const fxWeeklySnapshot: FxRatesSnapshot = {
  baseCurrency: "CAD",
  fetchedAt: "2026-03-02T04:43:32.191Z",
  validUntil: "2026-03-09T04:43:32.191Z",
  provider: "lemon-squeezy",
  providerSupportedCurrencies: ["CAD","USD","EUR","GBP"],
  rates: {
    CAD: 1,
    USD: 0.731857,
    EUR: 0.621702,
    GBP: 0.545203,
  },
};
