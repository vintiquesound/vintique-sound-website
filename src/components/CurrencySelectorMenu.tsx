import * as React from "react";
import { Check } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  getAllowedDisplayCurrencies,
  getDisplayCurrency,
  setDisplayCurrency,
  subscribeDisplayCurrency,
} from "@/lib/pricing/currency-preference";
import type { CurrencyCode } from "@/lib/pricing/types";

export default function CurrencySelectorMenu() {
  const currencies = React.useMemo(() => getAllowedDisplayCurrencies(), []);
  const [currency, setCurrencyState] = React.useState<CurrencyCode>(() => getDisplayCurrency());

  React.useEffect(() => {
    setCurrencyState(getDisplayCurrency());
    return subscribeDisplayCurrency(setCurrencyState);
  }, []);

  const onSelectCurrency = React.useCallback((next: CurrencyCode) => {
    setDisplayCurrency(next);
  }, []);

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="inline-flex items-center justify-center py-4 px-2 bg-transparent border-0 cursor-pointer text-(--text) hover:text-accent focus:text-accent border-b-4 border-transparent focus-visible:outline-none transition-colors text-sm font-medium"
          aria-haspopup="menu"
          aria-label="Currency"
        >
          {currency}
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="min-w-28 p-1 rounded-[10px] bg-background/95 supports-backdrop-filter:bg-background/80 backdrop-blur-lg border border-border shadow-md z-30 text-(--text)"
      >
        {currencies.map((item) => (
          <DropdownMenuItem
            key={item}
            className="flex items-center justify-between gap-3 py-[0.6rem] px-3 rounded-lg cursor-pointer"
            onSelect={() => onSelectCurrency(item)}
          >
            <span>{item}</span>
            {currency === item ? <Check className="size-4" aria-hidden="true" /> : null}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
