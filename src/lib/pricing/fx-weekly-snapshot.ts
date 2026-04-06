import type { FxRatesSnapshot } from "@/lib/pricing/types";

export const fxWeeklySnapshot: FxRatesSnapshot = {
  baseCurrency: "CAD",
  fetchedAt: "2026-04-06T05:16:20.997Z",
  validUntil: "2026-04-13T05:16:20.997Z",
  provider: "lemon-squeezy",
  providerSupportedCurrencies: ["CAD","USD","EUR","GBP"],
  rates: {
    CAD: 1,
    USD: 0.717361,
    EUR: 0.622913,
    GBP: 0.543716,
  },
};
