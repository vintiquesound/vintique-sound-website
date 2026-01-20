export type LengthTier = { max: number; surcharge: number };

// Reuses the same minute cutoffs as the mixing song-length tiers, but applied as a
// per-track surcharge for Editing/Repair.
export const TRACK_LENGTH_TIERS: readonly LengthTier[] = [
  { max: 1, surcharge: 0 },
  { max: 2, surcharge: 5 },
  { max: 4, surcharge: 10 },
  { max: 6, surcharge: 15 },
  { max: 8, surcharge: 20 },
  { max: 12, surcharge: 30 },
  { max: 16, surcharge: 40 },
] as const;

export const EXTRAS_PRICING = {
  rushService2Days: 100,
  unlimitedRevisions1Month: 80,
} as const;

export function clampInt(value: number, min: number, max: number) {
  if (!Number.isFinite(value)) return min;
  return Math.min(max, Math.max(min, Math.trunc(value)));
}

export function formatCurrency(amount: number) {
  const normalized = Number.isFinite(amount) ? amount : 0;
  return normalized.toLocaleString(undefined, {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });
}

export function getLengthSurcharge(
  lengthMinutes: number | null,
  tiers: readonly LengthTier[] = TRACK_LENGTH_TIERS
): number {
  if (lengthMinutes == null) return 0;
  for (const interval of tiers) {
    if (lengthMinutes <= interval.max) return interval.surcharge;
  }
  const last = tiers.at(-1);
  return last?.surcharge ?? 0;
}
