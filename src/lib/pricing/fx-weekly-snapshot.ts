import type { FxRatesSnapshot } from "@/lib/pricing/types";

export const fxWeeklySnapshot: FxRatesSnapshot = {
  baseCurrency: "CAD",
  fetchedAt: "2026-03-23T04:57:36.056Z",
  validUntil: "2026-03-30T04:57:36.056Z",
  provider: "lemon-squeezy",
  providerSupportedCurrencies: ["CAD","USD","EUR","GBP"],
  rates: {
    CAD: 1,
    USD: 0.729624,
    EUR: 0.631106,
    GBP: 0.54709,
  },
};
