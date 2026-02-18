import * as React from "react";

import { convertCadCentsToCurrencyCents, formatMoneyFromCents } from "@/lib/pricing/money";
import { useDisplayCurrency } from "@/lib/pricing/use-display-currency";

export type PriceTextProps = {
  cadCents: number;
  prefixFrom?: boolean;
  suffixPerTrack?: boolean;
};

export default function PriceText({ cadCents, prefixFrom = false, suffixPerTrack = false }: PriceTextProps) {
  const currency = useDisplayCurrency();
  const convertedCents = React.useMemo(
    () => convertCadCentsToCurrencyCents(cadCents, currency),
    [cadCents, currency]
  );
  let valueText = React.useMemo(() => formatMoneyFromCents(convertedCents, currency), [convertedCents, currency]);

  valueText = prefixFrom ? `from ${valueText}` : valueText
  valueText = suffixPerTrack ? `${valueText} per track` : valueText

  return <>{valueText}</>;
}
