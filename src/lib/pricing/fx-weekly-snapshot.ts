import type { FxRatesSnapshot } from "@/lib/pricing/types";

export const fxWeeklySnapshot: FxRatesSnapshot = {
  baseCurrency: "CAD",
  fetchedAt: "2026-03-30T05:17:14.033Z",
  validUntil: "2026-04-06T05:17:14.033Z",
  provider: "lemon-squeezy",
  providerSupportedCurrencies: ["CAD","USD","EUR","GBP"],
  rates: {
    CAD: 1,
    USD: 0.719761,
    EUR: 0.626034,
    GBP: 0.543291,
  },
};
