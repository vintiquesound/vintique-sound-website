import type { FxRatesSnapshot } from "@/lib/pricing/types";

export const fxWeeklySnapshot: FxRatesSnapshot = {
  baseCurrency: "CAD",
  fetchedAt: "2026-03-09T04:46:32.942Z",
  validUntil: "2026-03-16T04:46:32.942Z",
  provider: "lemon-squeezy",
  providerSupportedCurrencies: ["CAD","USD","EUR","GBP"],
  rates: {
    CAD: 1,
    USD: 0.73526,
    EUR: 0.637008,
    GBP: 0.551773,
  },
};
