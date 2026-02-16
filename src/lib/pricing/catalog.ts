export type BaseService = "mix" | "master" | "mixAndMaster" | "stemMaster";

export const MIXING_MASTERING_BASE_PRICES_CAD_CENTS: Record<BaseService, number> = {
  mix: 20000,
  master: 3000,
  mixAndMaster: 22000,
  stemMaster: 8000,
} as const;

export const TRACK_LENGTH_TIERS_CAD_CENTS = [
  { max: 1, surchargeCents: 0 },
  { max: 2, surchargeCents: 500 },
  { max: 4, surchargeCents: 1000 },
  { max: 6, surchargeCents: 1500 },
  { max: 8, surchargeCents: 2000 },
  { max: 12, surchargeCents: 3000 },
  { max: 16, surchargeCents: 4000 },
] as const;

export const EXTRAS_PRICING_CAD_CENTS = {
  rushService2Days: 10000,
  unlimitedRevisions1Month: 8000,
} as const;

export const EXPORTS_PRICING_CAD_CENTS = {
  multitrackExportFlat: 8000,
  additionalExports: {
    instrumental: 2000,
    acapella: 2000,
    radioEdit: 8000,
    cleanVersion: 8000,
  },
} as const;

export const EDITING_SERVICE_PER_TRACK_CAD_CENTS = {
  timeAlignment: 1000,
  comping: 1000,
  vocalTuning: 1000,
  instrumentTuning: 1000,
  cleanupNoiseRemoval: 1000,
} as const;

export const REPAIR_SERVICE_PER_TRACK_CAD_CENTS = {
  hissRemoval: 1000,
  cracklingRemoval: 1000,
  clicksPopsRemoval: 1000,
  plosiveReduction: 1000,
  reverbReduction: 1000,
} as const;

export function cadCentsToDollars(cents: number): number {
  return Math.round(cents) / 100;
}
