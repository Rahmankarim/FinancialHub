// Transaction types
export type TransactionType = 'income' | 'expense'

export interface Transaction {
  id: string
  date: string
  amount: number
  category: string
  description: string
  recurring: boolean
  type: TransactionType
}

// Budget types
export interface Budget {
  id: string
  category: string
  limit: number
  spent: number
  color: string
}

// Savings Goal types
export interface SavingsGoal {
  id: string
  name: string
  targetAmount: number
  currentAmount: number
  targetDate: string
  color: string
}

// Monthly data for reports
export interface MonthlyMetrics {
  month: string
  income: number
  expenses: number
  net: number
}

// Category type
export interface Category {
  id: string
  name: string
  color: string
  icon: string
}

// User settings
export interface Settings {
  currency: string
  notificationsEnabled: boolean
  emailAlerts: boolean
}
