import * as React from "react";

import { convertCadCentsToCurrencyCents, formatMoneyFromCents } from "@/lib/pricing/money";
import { useDisplayCurrency } from "@/lib/pricing/use-display-currency";

export type PriceTextProps = {
  cadCents: number;
  prefixFrom?: boolean;
};

export default function PriceText({ cadCents, prefixFrom = false }: PriceTextProps) {
  const currency = useDisplayCurrency();
  const convertedCents = React.useMemo(
    () => convertCadCentsToCurrencyCents(cadCents, currency),
    [cadCents, currency]
  );
  const value = React.useMemo(() => formatMoneyFromCents(convertedCents, currency), [convertedCents, currency]);

  return <>{prefixFrom ? `from ${value}` : value}</>;
}
