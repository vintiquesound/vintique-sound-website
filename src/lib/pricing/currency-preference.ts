import { getActiveProviderSupportedCurrencies } from "@/lib/payments/providers";
import { isCurrencyCode, type CurrencyCode } from "@/lib/pricing/types";

export const DISPLAY_CURRENCY_STORAGE_KEY = "display-currency";
export const DISPLAY_CURRENCY_EVENT = "display-currency-change";

export const DEFAULT_DISPLAY_CURRENCY: CurrencyCode = "CAD";

function getAllowedCurrencies(): readonly CurrencyCode[] {
  return getActiveProviderSupportedCurrencies();
}

function normalizeCurrency(input: unknown): CurrencyCode {
  if (typeof input !== "string") return DEFAULT_DISPLAY_CURRENCY;
  if (!isCurrencyCode(input)) return DEFAULT_DISPLAY_CURRENCY;
  const allowed = getAllowedCurrencies();
  return allowed.includes(input) ? input : DEFAULT_DISPLAY_CURRENCY;
}

export function getDisplayCurrency(): CurrencyCode {
  if (typeof window === "undefined") return DEFAULT_DISPLAY_CURRENCY;
  const saved = window.localStorage.getItem(DISPLAY_CURRENCY_STORAGE_KEY);
  return normalizeCurrency(saved);
}

export function setDisplayCurrency(currency: CurrencyCode) {
  if (typeof window === "undefined") return;
  const normalized = normalizeCurrency(currency);
  window.localStorage.setItem(DISPLAY_CURRENCY_STORAGE_KEY, normalized);
  document.documentElement.dataset.displayCurrency = normalized;
  window.dispatchEvent(new CustomEvent(DISPLAY_CURRENCY_EVENT, { detail: normalized }));
}

export function ensureInitialDisplayCurrency() {
  if (typeof window === "undefined") return;
  const normalized = getDisplayCurrency();
  window.localStorage.setItem(DISPLAY_CURRENCY_STORAGE_KEY, normalized);
  document.documentElement.dataset.displayCurrency = normalized;
}

export function subscribeDisplayCurrency(onChange: (currency: CurrencyCode) => void) {
  if (typeof window === "undefined") {
    return () => {};
  }

  const handler = (event: Event) => {
    const value = (event as CustomEvent<string>).detail;
    onChange(normalizeCurrency(value));
  };

  window.addEventListener(DISPLAY_CURRENCY_EVENT, handler);
  return () => window.removeEventListener(DISPLAY_CURRENCY_EVENT, handler);
}

export function getAllowedDisplayCurrencies(): readonly CurrencyCode[] {
  return getAllowedCurrencies();
}
