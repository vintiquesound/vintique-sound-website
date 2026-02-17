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
import type { CurrencyCode } from "@/lib/pricing/types"

export default function CurrencySelectorMenu() {
  const currencies = React.useMemo(() => getAllowedDisplayCurrencies(), [])
  const [currency, setCurrencyState] = React.useState<CurrencyCode>(() => getDisplayCurrency())

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
      trigger={currency}
      content={currencies.map((item) => (
        <DropdownMenuItem
          key={item}
          className={headerDropdownItemClass}
          onSelect={() => onSelectCurrency(item)}
        >
          <span>{item}</span>
          {currency === item ? <Check className="size-4" aria-hidden="true" /> : null}
        </DropdownMenuItem>
      ))}
    />
  )
}
