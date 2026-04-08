import { describe, expect, it } from "vitest";

import {
  BASE_SERVICE_PRICING,
  EDITING_SERVICE_PRICING,
  EXTRAS_PRICING,
  EXPORTS_PRICING,
  REPAIR_SERVICE_PRICING,
} from "@/lib/pricing/package-builder";

describe("package builder pricing data", () => {
  it("exposes base service prices in dollars", () => {
    expect(BASE_SERVICE_PRICING.mix.base).toBe(200);
    expect(BASE_SERVICE_PRICING.master.base).toBe(40);
    expect(BASE_SERVICE_PRICING.mixAndMaster.base).toBe(230);
    expect(BASE_SERVICE_PRICING.stemMaster.base).toBe(100);
  });

  it("includes expected track/song tiers for core services", () => {
    expect(BASE_SERVICE_PRICING.mix.trackTiers.length).toBeGreaterThan(0);
    expect(BASE_SERVICE_PRICING.mix.songLengthTiers.length).toBeGreaterThan(0);
  });

  it("exposes editing and repair per-track pricing", () => {
    expect(EDITING_SERVICE_PRICING.vocalTuning.perTrack).toBe(10);
    expect(REPAIR_SERVICE_PRICING.clicksPopsRemoval.perTrack).toBe(10);
  });

  it("exposes exports and extras pricing", () => {
    expect(EXPORTS_PRICING.multitrackExportFlat).toBe(80);
    expect(EXTRAS_PRICING.rushService2Days).toBe(100);
  });
});
