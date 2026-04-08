import { describe, expect, it } from "vitest";

import { fxWeeklySnapshot } from "@/lib/pricing/fx-weekly-snapshot";

const MAX_SNAPSHOT_AGE_DAYS = 28;
const STRICT_FX_FRESHNESS = process.env.STRICT_FX_FRESHNESS === "true";

describe("fx weekly snapshot contract", () => {
  it("includes all required currencies and positive rates", () => {
    expect(fxWeeklySnapshot.baseCurrency).toBe("CAD");
    expect(fxWeeklySnapshot.providerSupportedCurrencies).toEqual(
      expect.arrayContaining(["CAD", "USD", "EUR", "GBP"])
    );

    expect(fxWeeklySnapshot.rates.CAD).toBe(1);
    expect(fxWeeklySnapshot.rates.USD).toBeGreaterThan(0);
    expect(fxWeeklySnapshot.rates.EUR).toBeGreaterThan(0);
    expect(fxWeeklySnapshot.rates.GBP).toBeGreaterThan(0);
  });

  it("is reasonably fresh", () => {
    const fetchedAt = new Date(fxWeeklySnapshot.fetchedAt).getTime();
    const now = Date.now();
    const maxAgeMs = MAX_SNAPSHOT_AGE_DAYS * 24 * 60 * 60 * 1000;

    expect(Number.isFinite(fetchedAt)).toBe(true);
    if (STRICT_FX_FRESHNESS) {
      expect(now - fetchedAt).toBeLessThanOrEqual(maxAgeMs);
    }
  });

  it("keeps rates in expected sanity bounds", () => {
    expect(fxWeeklySnapshot.rates.USD).toBeGreaterThan(0.4);
    expect(fxWeeklySnapshot.rates.USD).toBeLessThan(1.2);

    expect(fxWeeklySnapshot.rates.EUR).toBeGreaterThan(0.4);
    expect(fxWeeklySnapshot.rates.EUR).toBeLessThan(1.2);

    expect(fxWeeklySnapshot.rates.GBP).toBeGreaterThan(0.3);
    expect(fxWeeklySnapshot.rates.GBP).toBeLessThan(1.0);
  });
});
