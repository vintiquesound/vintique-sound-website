import { afterEach, describe, expect, it, vi } from "vitest";

import {
  convertCadCentsToCurrencyCents,
  formatCadMoneyFromCents,
  formatCurrencyCodeWithSymbol,
  formatFromPriceFromCadCents,
  formatMoneyFromCents,
  getCurrencySymbol,
  getFxSnapshotMetadata,
  getSupportedCheckoutCurrencies,
} from "@/lib/pricing/money";
import type { FxRatesSnapshot } from "@/lib/pricing/types";

const testSnapshot: FxRatesSnapshot = {
  baseCurrency: "CAD",
  fetchedAt: "2026-04-01T00:00:00.000Z",
  validUntil: "2026-04-08T00:00:00.000Z",
  provider: "lemon-squeezy",
  providerSupportedCurrencies: ["CAD", "USD", "EUR", "GBP"],
  rates: {
    CAD: 1,
    USD: 0.75,
    EUR: 0.65,
    GBP: 0.55,
  },
};

afterEach(() => {
  vi.restoreAllMocks();
});

describe("money conversion", () => {
  it("converts CAD cents using snapshot rates", () => {
    expect(convertCadCentsToCurrencyCents(10000, "USD", testSnapshot)).toBe(7500);
    expect(convertCadCentsToCurrencyCents(10000, "EUR", testSnapshot)).toBe(6500);
    expect(convertCadCentsToCurrencyCents(10000, "GBP", testSnapshot)).toBe(5500);
    expect(convertCadCentsToCurrencyCents(12345, "CAD", testSnapshot)).toBe(12345);
  });

  it("falls back to CAD cents when rate is invalid", () => {
    const invalidRateSnapshot: FxRatesSnapshot = {
      ...testSnapshot,
      rates: {
        ...testSnapshot.rates,
        USD: 0,
      },
    };

    expect(convertCadCentsToCurrencyCents(12345, "USD", invalidRateSnapshot)).toBe(12345);
  });

  it("normalizes non-finite cents to zero", () => {
    expect(convertCadCentsToCurrencyCents(Number.NaN, "CAD", testSnapshot)).toBe(0);
    expect(formatMoneyFromCents(Number.POSITIVE_INFINITY, "CAD", { locale: "en-CA" })).toContain("0");
  });

  it("formats from-price labels", () => {
    expect(formatFromPriceFromCadCents(20000, "USD", testSnapshot)).toContain("from");
  });

  it("formats money values with and without defaults", () => {
    expect(formatMoneyFromCents(12345, "USD", { locale: "en-US", maximumFractionDigits: 2 })).toBe("$123.45");
    expect(formatCadMoneyFromCents(20000, { locale: "en-CA" })).toContain("200");
  });

  it("returns currency symbols and code-with-symbol labels", () => {
    expect(getCurrencySymbol("GBP", "en-GB")).toBe("£");
    expect(formatCurrencyCodeWithSymbol("GBP", "en-GB")).toBe("GBP £");
  });

  it("falls back to static symbols when Intl currency part is missing", () => {
    class NumberFormatMock {
      formatToParts() {
        return [{ type: "integer", value: "0" }];
      }

      format() {
        return "0";
      }
    }

    vi.stubGlobal("Intl", {
      ...Intl,
      NumberFormat: NumberFormatMock as unknown as typeof Intl.NumberFormat,
    });

    expect(getCurrencySymbol("EUR")).toBe("€");
    expect(formatCurrencyCodeWithSymbol("CAD")).toBe("CAD $");
  });

  it("returns supported checkout currencies from snapshot metadata", () => {
    expect(getSupportedCheckoutCurrencies(testSnapshot)).toEqual(["CAD", "USD", "EUR", "GBP"]);
  });

  it("returns fx snapshot metadata", () => {
    expect(getFxSnapshotMetadata(testSnapshot)).toEqual({
      fetchedAt: testSnapshot.fetchedAt,
      validUntil: testSnapshot.validUntil,
      provider: testSnapshot.provider,
    });
  });
});
