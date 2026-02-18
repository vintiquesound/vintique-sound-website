import * as React from "react"
import { Check } from "lucide-react"

import { DropdownMenuItem } from "@/components/ui/dropdown-menu"
import {
  HeaderDropdownMenu,
  headerDropdownItemClass,
} from "@/components/ui/HeaderDropdownMenu"
import {
  getAllowedDisplayCurrencies,
  getDisplayCurrency,
  setDisplayCurrency,
  subscribeDisplayCurrency,
} from "@/lib/pricing/currency-preference"
import { formatCurrencyCodeWithSymbol } from "@/lib/pricing/money"
import type { CurrencyCode } from "@/lib/pricing/types"

export default function CurrencySelectorMenu() {
  const currencies = React.useMemo(() => getAllowedDisplayCurrencies(), [])
  const [currency, setCurrencyState] = React.useState<CurrencyCode>(() => getDisplayCurrency())

  const formatDropdownCurrencyLabel = React.useCallback((code: CurrencyCode) => {
    if (code === "CAD") return "CAD $"
    return formatCurrencyCodeWithSymbol(code)
  }, [])

  React.useEffect(() => {
    setCurrencyState(getDisplayCurrency())
    return subscribeDisplayCurrency(setCurrencyState)
  }, [])

  const onSelectCurrency = React.useCallback((next: CurrencyCode) => {
    setDisplayCurrency(next)
  }, [])

  return (
    <HeaderDropdownMenu
      ariaLabel="Currency"
      align="end"
      triggerClassName="text-sm font-medium"
      contentClassName="min-w-28"
      trigger={formatDropdownCurrencyLabel(currency)}
      content={currencies.map((item) => (
        <DropdownMenuItem
          key={item}
          className={headerDropdownItemClass}
          onSelect={() => onSelectCurrency(item)}
        >
          <span>{formatDropdownCurrencyLabel(item)}</span>
          {currency === item ? <Check className="size-4" aria-hidden="true" /> : null}
        </DropdownMenuItem>
      ))}
    />
  )
}
