import type { CurrencyCode } from "@/lib/pricing/types";

export type PaymentProvider = "lemon-squeezy" | "stripe";

export const ACTIVE_PAYMENT_PROVIDER: PaymentProvider = "lemon-squeezy";

export const PROVIDER_SUPPORTED_CURRENCIES: Record<PaymentProvider, readonly CurrencyCode[]> = {
  "lemon-squeezy": ["CAD", "USD", "EUR", "GBP"],
  stripe: ["CAD", "USD", "EUR", "GBP"],
} as const;

export function getActiveProviderSupportedCurrencies(): readonly CurrencyCode[] {
  return PROVIDER_SUPPORTED_CURRENCIES[ACTIVE_PAYMENT_PROVIDER];
}
