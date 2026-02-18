import {
  type BaseService,
  EDITING_SERVICE_PER_TRACK_CAD_CENTS,
  EXPORTS_PRICING_CAD_CENTS,
  EXTRAS_PRICING_CAD_CENTS,
  REPAIR_SERVICE_PER_TRACK_CAD_CENTS,
  SERVICE_PRICING_CAD_CENTS,
  cadCentsToDollars,
} from "@/lib/pricing/catalog";

export type TrackCountTier = { max: number; surcharge: number };
export type SongLengthTier = { max: number; surcharge: number };

export type BaseServicePricing = {
  base: number;
  trackTiers: readonly TrackCountTier[];
  songLengthTiers: readonly SongLengthTier[];
};

function mapTierSurchargesToDollars(
  tiers: readonly { max: number; surchargeCents: number }[]
): { max: number; surcharge: number }[] {
  return tiers.map((tier) => ({
    max: tier.max,
    surcharge: cadCentsToDollars(tier.surchargeCents),
  }));
}

export const BASE_SERVICE_PRICING: Record<BaseService, BaseServicePricing> = {
  mix: {
    base: cadCentsToDollars(SERVICE_PRICING_CAD_CENTS.mix.baseCents),
    trackTiers: mapTierSurchargesToDollars(SERVICE_PRICING_CAD_CENTS.mix.trackTiers),
    songLengthTiers: mapTierSurchargesToDollars(SERVICE_PRICING_CAD_CENTS.mix.songLengthTiers),
  },
  master: {
    base: cadCentsToDollars(SERVICE_PRICING_CAD_CENTS.master.baseCents),
    trackTiers: mapTierSurchargesToDollars(SERVICE_PRICING_CAD_CENTS.master.trackTiers),
    songLengthTiers: mapTierSurchargesToDollars(SERVICE_PRICING_CAD_CENTS.master.songLengthTiers),
  },
  mixAndMaster: {
    base: cadCentsToDollars(SERVICE_PRICING_CAD_CENTS.mixAndMaster.baseCents),
    trackTiers: mapTierSurchargesToDollars(SERVICE_PRICING_CAD_CENTS.mixAndMaster.trackTiers),
    songLengthTiers: mapTierSurchargesToDollars(SERVICE_PRICING_CAD_CENTS.mixAndMaster.songLengthTiers),
  },
  stemMaster: {
    base: cadCentsToDollars(SERVICE_PRICING_CAD_CENTS.stemMaster.baseCents),
    trackTiers: mapTierSurchargesToDollars(SERVICE_PRICING_CAD_CENTS.stemMaster.trackTiers),
    songLengthTiers: mapTierSurchargesToDollars(SERVICE_PRICING_CAD_CENTS.stemMaster.songLengthTiers),
  },
} as const;

export const EDITING_SERVICE_PRICING = {
  timeAlignment: { perTrack: cadCentsToDollars(EDITING_SERVICE_PER_TRACK_CAD_CENTS.timeAlignment) },
  comping: { perTrack: cadCentsToDollars(EDITING_SERVICE_PER_TRACK_CAD_CENTS.comping) },
  vocalTuning: { perTrack: cadCentsToDollars(EDITING_SERVICE_PER_TRACK_CAD_CENTS.vocalTuning) },
  instrumentTuning: { perTrack: cadCentsToDollars(EDITING_SERVICE_PER_TRACK_CAD_CENTS.instrumentTuning) },
  cleanupNoiseRemoval: { perTrack: cadCentsToDollars(EDITING_SERVICE_PER_TRACK_CAD_CENTS.cleanupNoiseRemoval) },
} as const;

export const REPAIR_SERVICE_PRICING = {
  clippingRepair: { perTrack: cadCentsToDollars(REPAIR_SERVICE_PER_TRACK_CAD_CENTS.clippingRepair) },
  clicksPopsRemoval: { perTrack: cadCentsToDollars(REPAIR_SERVICE_PER_TRACK_CAD_CENTS.clicksPopsRemoval) },
  hissRemoval: { perTrack: cadCentsToDollars(REPAIR_SERVICE_PER_TRACK_CAD_CENTS.hissRemoval) },
  cracklingRemoval: { perTrack: cadCentsToDollars(REPAIR_SERVICE_PER_TRACK_CAD_CENTS.cracklingRemoval) },
  plosiveReduction: { perTrack: cadCentsToDollars(REPAIR_SERVICE_PER_TRACK_CAD_CENTS.plosiveReduction) },
  reverbReduction: { perTrack: cadCentsToDollars(REPAIR_SERVICE_PER_TRACK_CAD_CENTS.reverbReduction) },
} as const;

export const EXPORTS_PRICING = {
  multitrackExportFlat: cadCentsToDollars(EXPORTS_PRICING_CAD_CENTS.multitrackExportFlat),
  additionalExports: {
    instrumental: cadCentsToDollars(EXPORTS_PRICING_CAD_CENTS.additionalExports.instrumental),
    acapella: cadCentsToDollars(EXPORTS_PRICING_CAD_CENTS.additionalExports.acapella),
    radioEdit: cadCentsToDollars(EXPORTS_PRICING_CAD_CENTS.additionalExports.radioEdit),
    cleanVersion: cadCentsToDollars(EXPORTS_PRICING_CAD_CENTS.additionalExports.cleanVersion),
  },
} as const;

export const EXTRAS_PRICING = {
  rushService2Days: cadCentsToDollars(EXTRAS_PRICING_CAD_CENTS.rushService2Days),
  unlimitedRevisions1Month: cadCentsToDollars(EXTRAS_PRICING_CAD_CENTS.unlimitedRevisions1Month),
} as const;
