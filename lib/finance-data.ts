import { DEFAULT_SETTINGS, INITIAL_BUDGETS, INITIAL_GOALS, INITIAL_TRANSACTIONS } from '@/lib/constants'
import { Budget, SavingsGoal, Settings, Transaction } from '@/lib/types'

export interface FinanceSnapshot {
  transactions: Transaction[]
  budgets: Budget[]
  goals: SavingsGoal[]
  settings: Settings
  version: number
}

const clone = <T,>(value: T): T => JSON.parse(JSON.stringify(value))

export function createDefaultFinanceSnapshot(): FinanceSnapshot {
  return {
    transactions: clone(INITIAL_TRANSACTIONS),
    budgets: clone(INITIAL_BUDGETS),
    goals: clone(INITIAL_GOALS),
    settings: clone(DEFAULT_SETTINGS),
    version: 1,
  }
}

export function normalizeFinanceSnapshot(snapshot?: Partial<FinanceSnapshot> | null): FinanceSnapshot {
  const defaults = createDefaultFinanceSnapshot()

  return {
    transactions: Array.isArray(snapshot?.transactions) ? snapshot.transactions : defaults.transactions,
    budgets: Array.isArray(snapshot?.budgets) ? snapshot.budgets : defaults.budgets,
    goals: Array.isArray(snapshot?.goals) ? snapshot.goals : defaults.goals,
    settings: snapshot?.settings ? { ...defaults.settings, ...snapshot.settings } : defaults.settings,
    version: snapshot?.version ?? 1,
  }
}