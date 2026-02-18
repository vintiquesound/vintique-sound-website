import { fxWeeklySnapshot } from "@/lib/pricing/fx-weekly-snapshot";
import type { CurrencyCode, FxRatesSnapshot } from "@/lib/pricing/types";

type MoneyFormatOptions = {
  locale?: string;
  maximumFractionDigits?: number;
};

const CURRENCY_SYMBOL_FALLBACK: Record<CurrencyCode, string> = {
  CAD: "$",
  USD: "$",
  EUR: "€",
  GBP: "£",
};

function normalizeCents(cents: number): number {
  if (!Number.isFinite(cents)) return 0;
  return Math.round(cents);
}

export function convertCadCentsToCurrencyCents(
  cadCents: number,
  currency: CurrencyCode,
  snapshot: FxRatesSnapshot = fxWeeklySnapshot
): number {
  const normalizedCadCents = normalizeCents(cadCents);
  if (currency === "CAD") return normalizedCadCents;
  const rate = snapshot.rates[currency];
  if (!Number.isFinite(rate) || rate <= 0) return normalizedCadCents;
  return Math.round(normalizedCadCents * rate);
}

export function formatMoneyFromCents(
  amountCents: number,
  currency: CurrencyCode,
  options: MoneyFormatOptions = {}
): string {
  const { locale, maximumFractionDigits = 0 } = options;
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits,
  }).format(normalizeCents(amountCents) / 100);
}

export function getCurrencySymbol(currency: CurrencyCode, locale?: string): string {
  const symbol = new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })
    .formatToParts(0)
    .find((part) => part.type === "currency")
    ?.value;

  return symbol?.trim() || CURRENCY_SYMBOL_FALLBACK[currency];
}

export function formatCurrencyCodeWithSymbol(currency: CurrencyCode, locale?: string): string {
  return `${currency} ${getCurrencySymbol(currency, locale)}`;
}

export function formatCadMoneyFromCents(
  cadCents: number,
  options: MoneyFormatOptions = {}
): string {
  return formatMoneyFromCents(cadCents, "CAD", options);
}

export function formatFromPriceFromCadCents(
  cadCents: number,
  currency: CurrencyCode,
  snapshot: FxRatesSnapshot = fxWeeklySnapshot,
  options: MoneyFormatOptions = {}
): string {
  const converted = convertCadCentsToCurrencyCents(cadCents, currency, snapshot);
  return `from ${formatMoneyFromCents(converted, currency, options)}`;
}

export function getSupportedCheckoutCurrencies(
  snapshot: FxRatesSnapshot = fxWeeklySnapshot
): readonly CurrencyCode[] {
  return snapshot.providerSupportedCurrencies;
}

export function getFxSnapshotMetadata(snapshot: FxRatesSnapshot = fxWeeklySnapshot) {
  return {
    fetchedAt: snapshot.fetchedAt,
    validUntil: snapshot.validUntil,
    provider: snapshot.provider,
  };
}
