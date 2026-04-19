import { Category, Transaction, Budget, SavingsGoal, MonthlyMetrics, Settings } from './types'

// Category definitions with colors
export const CATEGORIES: Category[] = [
  { id: '1', name: 'Groceries', color: 'bg-blue-500', icon: '🛒' },
  { id: '2', name: 'Utilities', color: 'bg-yellow-500', icon: '⚡' },
  { id: '3', name: 'Entertainment', color: 'bg-purple-500', icon: '🎬' },
  { id: '4', name: 'Transportation', color: 'bg-orange-500', icon: '🚗' },
  { id: '5', name: 'Healthcare', color: 'bg-pink-500', icon: '🏥' },
  { id: '6', name: 'Dining', color: 'bg-red-500', icon: '🍽️' },
  { id: '7', name: 'Shopping', color: 'bg-cyan-500', icon: '🛍️' },
  { id: '8', name: 'Savings', color: 'bg-emerald-500', icon: '🏦' },
  { id: '9', name: 'Salary', color: 'bg-emerald-500', icon: '💰' },
]

// Transaction categories by type
export const TRANSACTION_CATEGORIES = {
  income: ['Salary', 'Freelance', 'Investments', 'Bonus', 'Gift', 'Other Income'],
  expense: ['Groceries', 'Utilities', 'Entertainment', 'Transportation', 'Healthcare', 'Dining', 'Shopping', 'Savings', 'Other'],
}

// Default settings
export const DEFAULT_SETTINGS: Settings = {
  currency: 'USD',
  notificationsEnabled: true,
  emailAlerts: true,
}

const MONTHS = ['2025-03', '2025-02', '2025-01']

const expenseTemplates = [
  { category: 'Groceries', description: 'Whole Foods run', amount: 300, recurring: false },
  { category: 'Dining', description: 'Coffee and brunch', amount: 150, recurring: false },
  { category: 'Entertainment', description: 'Streaming subscriptions', amount: 100, recurring: true },
  { category: 'Transportation', description: 'Fuel top-up', amount: 200, recurring: false },
  { category: 'Shopping', description: 'Household essentials', amount: 250, recurring: false },
  { category: 'Healthcare', description: 'Pharmacy pickup', amount: 80, recurring: false },
  { category: 'Utilities', description: 'Internet bill', amount: 450, recurring: true },
  { category: 'Other', description: 'Weekend ferry ticket', amount: 100, recurring: false },
  { category: 'Groceries', description: 'Weekend market haul', amount: 120, recurring: false },
  { category: 'Shopping', description: 'Workwear refresh', amount: 180, recurring: false },
  { category: 'Utilities', description: 'Apartment insurance', amount: 70, recurring: true },
]

const incomeTemplates = [
  { category: 'Salary', description: 'Biweekly salary', amount: 1500, recurring: true },
  { category: 'Freelance', description: 'Brand refresh project', amount: 1000, recurring: false },
  { category: 'Other Income', description: 'Cashback and rewards', amount: 500, recurring: false },
]

const monthlyExpenseOffsets = [
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
  [1, 3, 4, 0, 6, 2, 7, 5, 9, 8, 10],
  [2, 4, 6, 1, 7, 0, 5, 3, 10, 8, 9],
]

export const MOCK_TRANSACTIONS: Transaction[] = MONTHS.flatMap((month, monthIndex) => {
  const dayBase = 28 - monthIndex * 2

  const expenseRows = monthlyExpenseOffsets[monthIndex].map((templateIndex, index) => {
    const template = expenseTemplates[templateIndex]

    return {
      id: `exp-${monthIndex + 1}-${index + 1}`,
      date: `${month}-${String(dayBase - index).padStart(2, '0')}`,
      amount: Number((template.amount + monthIndex * 8 + index * 3).toFixed(2)),
      category: template.category,
      description: template.description,
      recurring: template.recurring,
      type: 'expense' as const,
    }
  })

  const incomeRows = incomeTemplates.map((template, index) => ({
    id: `inc-${monthIndex + 1}-${index + 1}`,
    date: `${month}-${String(27 - monthIndex * 2 - index * 6).padStart(2, '0')}`,
    amount: template.amount + monthIndex * 10 + index * 20,
    category: template.category,
    description: template.description,
    recurring: template.recurring,
    type: 'income' as const,
  }))

  return [...incomeRows, ...expenseRows]
})

// Mock budgets
export const MOCK_BUDGETS: Budget[] = [
  { id: '1', category: 'Groceries', limit: 400, spent: 235.50, color: 'bg-blue-500' },
  { id: '2', category: 'Dining', limit: 200, spent: 180, color: 'bg-red-500' },
  { id: '3', category: 'Entertainment', limit: 150, spent: 120, color: 'bg-purple-500' },
  { id: '4', category: 'Transportation', limit: 300, spent: 250, color: 'bg-orange-500' },
  { id: '5', category: 'Shopping', limit: 500, spent: 620, color: 'bg-cyan-500' },
  { id: '6', category: 'Healthcare', limit: 200, spent: 0, color: 'bg-pink-500' },
]

// Mock savings goals
export const MOCK_GOALS: SavingsGoal[] = [
  {
    id: '1',
    name: 'Emergency Fund',
    targetAmount: 10000,
    currentAmount: 7500,
    targetDate: '2025-12-31',
    color: 'bg-emerald-500',
  },
  {
    id: '2',
    name: 'Vacation',
    targetAmount: 5000,
    currentAmount: 2800,
    targetDate: '2025-08-01',
    color: 'bg-blue-500',
  },
  {
    id: '3',
    name: 'New Laptop',
    targetAmount: 2000,
    currentAmount: 1200,
    targetDate: '2025-06-30',
    color: 'bg-purple-500',
  },
]

// Monthly metrics for reports (last 12 months)
export const MOCK_MONTHLY_DATA: MonthlyMetrics[] = [
  { month: 'Mar 2024', income: 3000, expenses: 2100, net: 900 },
  { month: 'Apr 2024', income: 3000, expenses: 2250, net: 750 },
  { month: 'May 2024', income: 3500, expenses: 2400, net: 1100 },
  { month: 'Jun 2024', income: 3000, expenses: 2050, net: 950 },
  { month: 'Jul 2024', income: 3000, expenses: 2200, net: 800 },
  { month: 'Aug 2024', income: 3000, expenses: 2350, net: 650 },
  { month: 'Sep 2024', income: 3200, expenses: 2150, net: 1050 },
  { month: 'Oct 2024', income: 3000, expenses: 2400, net: 600 },
  { month: 'Nov 2024', income: 3000, expenses: 2000, net: 1000 },
  { month: 'Dec 2024', income: 3500, expenses: 2800, net: 700 },
  { month: 'Jan 2025', income: 3000, expenses: 2300, net: 700 },
  { month: 'Feb 2025', income: 3000, expenses: 2100, net: 900 },
]

// Calculate totals from mock transactions
export const calculateTransactionTotals = (transactions: Transaction[]) => {
  const income = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0)
  const expenses = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0)
  return { income, expenses }
}

// Calculate net worth
export const CURRENT_NET_WORTH = 54200
export const NET_WORTH_CHANGE = 900 // from previous month
export const NET_WORTH_CHANGE_PERCENT = 1.68

// Initial data for localStorage
export const INITIAL_TRANSACTIONS: Transaction[] = MOCK_TRANSACTIONS
export const INITIAL_BUDGETS: Budget[] = MOCK_BUDGETS
export const INITIAL_GOALS: SavingsGoal[] = MOCK_GOALS
