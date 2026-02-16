export const CURRENCY_CODES = ["CAD", "USD", "EUR", "GBP"] as const;

export type CurrencyCode = (typeof CURRENCY_CODES)[number];

export type Money = {
  amountCents: number;
  currency: CurrencyCode;
};

export type FxRatesSnapshot = {
  baseCurrency: "CAD";
  fetchedAt: string;
  validUntil: string;
  provider: "lemon-squeezy";
  providerSupportedCurrencies: readonly CurrencyCode[];
  rates: Record<CurrencyCode, number>;
};

export function isCurrencyCode(value: string): value is CurrencyCode {
  return CURRENCY_CODES.includes(value as CurrencyCode);
}
