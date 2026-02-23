import type { FxRatesSnapshot } from "@/lib/pricing/types";

export const fxWeeklySnapshot: FxRatesSnapshot = {
  baseCurrency: "CAD",
  fetchedAt: "2026-02-23T04:52:47.626Z",
  validUntil: "2026-03-02T04:52:47.626Z",
  provider: "lemon-squeezy",
  providerSupportedCurrencies: ["CAD","USD","EUR","GBP"],
  rates: {
    CAD: 1,
    USD: 0.731945,
    EUR: 0.619715,
    GBP: 0.5417,
  },
};
