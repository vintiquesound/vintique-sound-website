import type { FxRatesSnapshot } from "@/lib/pricing/types";

export const fxWeeklySnapshot: FxRatesSnapshot = {
  baseCurrency: "CAD",
  fetchedAt: "2026-03-16T05:09:09.081Z",
  validUntil: "2026-03-23T05:09:09.081Z",
  provider: "lemon-squeezy",
  providerSupportedCurrencies: ["CAD","USD","EUR","GBP"],
  rates: {
    CAD: 1,
    USD: 0.72902,
    EUR: 0.637728,
    GBP: 0.550657,
  },
};
