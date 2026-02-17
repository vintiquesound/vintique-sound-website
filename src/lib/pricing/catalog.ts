export type BaseService = "mix" | "master" | "mixAndMaster" | "stemMaster";

export type TrackCountTierCadCents = { max: number; surchargeCents: number };
export type SongLengthTierCadCents = { max: number; surchargeCents: number };

export const MIXING_MASTERING_BASE_PRICES_CAD_CENTS: Record<BaseService, number> = {
  mix: 20000,
  master: 4000,
  mixAndMaster: 23000,
  stemMaster: 10000,
} as const;

export const MIXING_TRACK_TIERS_CAD_CENTS: readonly TrackCountTierCadCents[] = [
  { max: 4, surchargeCents: 0 },
  { max: 8, surchargeCents: 1000 },
  { max: 12, surchargeCents: 1500 },
  { max: 16, surchargeCents: 2000 },
  { max: 24, surchargeCents: 3000 },
  { max: 32, surchargeCents: 4000 },
  { max: 40, surchargeCents: 5000 },
  { max: 48, surchargeCents: 6000 },
  { max: 64, surchargeCents: 8000 },
  { max: 72, surchargeCents: 9000 },
] as const;

export const STEM_MASTERING_TRACK_TIERS_CAD_CENTS: readonly TrackCountTierCadCents[] = [
  { max: 4, surchargeCents: 0 },
  { max: 6, surchargeCents: 1000 },
  { max: 8, surchargeCents: 2000 },
  { max: 10, surchargeCents: 3000 },
  { max: 12, surchargeCents: 4000 },
] as const;

export const MIXING_SONG_LENGTH_TIERS_CAD_CENTS: readonly SongLengthTierCadCents[] = [
  { max: 2, surchargeCents: 0 },
  { max: 4, surchargeCents: 1000 },
  { max: 6, surchargeCents: 2000 },
  { max: 8, surchargeCents: 3000 },
  { max: 10, surchargeCents: 4000 },
  { max: 12, surchargeCents: 5000 },
  { max: 14, surchargeCents: 6000 },
  { max: 16, surchargeCents: 7000 },
  { max: 18, surchargeCents: 8000 },
  { max: 20, surchargeCents: 9000 },
] as const;

export const MASTERING_SONG_LENGTH_TIERS_CAD_CENTS: readonly SongLengthTierCadCents[] = [
  { max: 2, surchargeCents: 0 },
  { max: 4, surchargeCents: 500 },
  { max: 6, surchargeCents: 1000 },
  { max: 8, surchargeCents: 1500 },
  { max: 10, surchargeCents: 2000 },
  { max: 12, surchargeCents: 2500 },
  { max: 14, surchargeCents: 3000 },
  { max: 16, surchargeCents: 3500 },
  { max: 18, surchargeCents: 4000 },
  { max: 20, surchargeCents: 4500 },
] as const;

export const STEM_MASTERING_SONG_LENGTH_TIERS_CAD_CENTS: readonly SongLengthTierCadCents[] = [
  { max: 2, surchargeCents: 0 },
  { max: 4, surchargeCents: 1000 },
  { max: 6, surchargeCents: 2000 },
  { max: 8, surchargeCents: 3000 },
  { max: 10, surchargeCents: 4000 },
  { max: 12, surchargeCents: 5000 },
  { max: 14, surchargeCents: 6000 },
  { max: 16, surchargeCents: 7000 },
  { max: 18, surchargeCents: 8000 },
  { max: 20, surchargeCents: 9000 },
] as const;

export const SERVICE_PRICING_CAD_CENTS: Record<
  BaseService,
  {
    baseCents: number;
    trackTiers: readonly TrackCountTierCadCents[];
    songLengthTiers: readonly SongLengthTierCadCents[];
  }
> = {
  mix: {
    baseCents: MIXING_MASTERING_BASE_PRICES_CAD_CENTS.mix,
    trackTiers: MIXING_TRACK_TIERS_CAD_CENTS,
    songLengthTiers: MIXING_SONG_LENGTH_TIERS_CAD_CENTS,
  },
  master: {
    baseCents: MIXING_MASTERING_BASE_PRICES_CAD_CENTS.master,
    trackTiers: [{ max: 1, surchargeCents: 0 }],
    songLengthTiers: MASTERING_SONG_LENGTH_TIERS_CAD_CENTS,
  },
  mixAndMaster: {
    baseCents: MIXING_MASTERING_BASE_PRICES_CAD_CENTS.mixAndMaster,
    trackTiers: MIXING_TRACK_TIERS_CAD_CENTS,
    songLengthTiers: MIXING_SONG_LENGTH_TIERS_CAD_CENTS,
  },
  stemMaster: {
    baseCents: MIXING_MASTERING_BASE_PRICES_CAD_CENTS.stemMaster,
    trackTiers: STEM_MASTERING_TRACK_TIERS_CAD_CENTS,
    songLengthTiers: STEM_MASTERING_SONG_LENGTH_TIERS_CAD_CENTS,
  },
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
