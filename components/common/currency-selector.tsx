'use client'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { CURRENCIES } from '@/lib/currency'

interface CurrencySelectorProps {
  onCurrencyChange: (currency: string) => void
  currentCurrency?: string
}

export function CurrencySelector({
  onCurrencyChange,
  currentCurrency = 'USD',
}: CurrencySelectorProps) {
  return (
    <Select value={currentCurrency} onValueChange={onCurrencyChange}>
      <SelectTrigger className="w-40">
        <SelectValue placeholder="Select currency" />
      </SelectTrigger>
      <SelectContent>
        {CURRENCIES.map((currency) => (
          <SelectItem key={currency.code} value={currency.code}>
            {currency.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
