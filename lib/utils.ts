import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { getPreferredCurrency, normalizeCurrencyCode } from './currency'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Format currency
export const formatCurrency = (amount: number, currency?: string): string => {
  const resolvedCurrency = currency ? normalizeCurrencyCode(currency) : getPreferredCurrency()

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: resolvedCurrency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}

// Format date
export const formatDate = (date: Date | string): string => {
  const value = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(value)
}

// Format date short
export const formatDateShort = (date: Date | string): string => {
  const value = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
  }).format(value)
}

// Calculate percentage
export const calculatePercentage = (value: number, total: number): number => {
  return total === 0 ? 0 : Math.round((value / total) * 100)
}
