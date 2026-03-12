import {
  EXTRAS_PRICING_CAD_CENTS,
  EDITING_REPAIR_TRACK_LENGTH_TIERS_CAD_CENTS,
  cadCentsToDollars,
} from "@/lib/pricing/catalog";
import { getDisplayCurrency } from "@/lib/pricing/currency-preference";
import { convertCadCentsToCurrencyCents, formatMoneyFromCents } from "@/lib/pricing/money";

export type LengthTier = { max: number; surcharge: number };

export const TRACK_LENGTH_TIERS: readonly LengthTier[] = EDITING_REPAIR_TRACK_LENGTH_TIERS_CAD_CENTS.map(
  ({ max, surchargeCents }) => ({
    max,
    surcharge: cadCentsToDollars(surchargeCents),
  })
);

export const EXTRAS_PRICING = {
  rushService2Days: cadCentsToDollars(EXTRAS_PRICING_CAD_CENTS.rushService2Days),
  unlimitedRevisions1Month: cadCentsToDollars(EXTRAS_PRICING_CAD_CENTS.unlimitedRevisions1Month),
} as const;

export function clampInt(value: number, min: number, max: number) {
  if (!Number.isFinite(value)) return min;
  return Math.min(max, Math.max(min, Math.trunc(value)));
}

export function formatCurrency(amount: number) {
  const normalized = Number.isFinite(amount) ? amount : 0;
  const cadCents = Math.round(normalized * 100);
  const currency = getDisplayCurrency();
  const convertedCents = convertCadCentsToCurrencyCents(cadCents, currency);
  return formatMoneyFromCents(convertedCents, currency);
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
