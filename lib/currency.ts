export const DEFAULT_CURRENCY = 'USD'

export const CURRENCIES = [
  { code: 'USD', label: 'US Dollar ($)' },
  { code: 'EUR', label: 'Euro (€)' },
  { code: 'GBP', label: 'British Pound (£)' },
  { code: 'JPY', label: 'Japanese Yen (¥)' },
  { code: 'CAD', label: 'Canadian Dollar (C$)' },
  { code: 'AUD', label: 'Australian Dollar (A$)' },
  { code: 'PKR', label: 'Pakistani Rupee (Rs)' },
  { code: 'INR', label: 'Indian Rupee (₹)' },
  { code: 'SAR', label: 'Saudi Riyal (SAR)' },
  { code: 'AED', label: 'UAE Dirham (AED)' },
  { code: 'SGD', label: 'Singapore Dollar (S$)' },
  { code: 'CHF', label: 'Swiss Franc (CHF)' },
  { code: 'CNY', label: 'Chinese Yuan (¥)' },
  { code: 'MXN', label: 'Mexican Peso (MX$)' },
  { code: 'NZD', label: 'New Zealand Dollar (NZ$)' },
  { code: 'ZAR', label: 'South African Rand (R)' },
  { code: 'TRY', label: 'Turkish Lira (₺)' },
] as const

export type CurrencyCode = (typeof CURRENCIES)[number]['code']

const supportedCurrencies = new Set<string>(CURRENCIES.map((currency) => currency.code))

let preferredCurrency = DEFAULT_CURRENCY

export function normalizeCurrencyCode(currency?: string | null) {
  const nextCurrency = currency?.trim().toUpperCase()

  return nextCurrency && supportedCurrencies.has(nextCurrency) ? (nextCurrency as CurrencyCode) : DEFAULT_CURRENCY
}

export function getPreferredCurrency() {
  return preferredCurrency
}

export function setPreferredCurrency(currency?: string | null) {
  preferredCurrency = normalizeCurrencyCode(currency)

  if (typeof document !== 'undefined') {
    document.documentElement.dataset.currency = preferredCurrency
  }
}
