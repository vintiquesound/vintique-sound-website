import * as React from "react";

import {
  getDisplayCurrency,
  subscribeDisplayCurrency,
} from "@/lib/pricing/currency-preference";
import type { CurrencyCode } from "@/lib/pricing/types";

export function useDisplayCurrency(): CurrencyCode {
  const [currency, setCurrency] = React.useState<CurrencyCode>(() => getDisplayCurrency());

  React.useEffect(() => {
    setCurrency(getDisplayCurrency());
    return subscribeDisplayCurrency(setCurrency);
  }, []);

  return currency;
}
