import { DEFAULT_SETTINGS } from '@/lib/constants'
import { normalizeCurrencyCode } from '@/lib/currency'
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
    transactions: clone([] as Transaction[]),
    budgets: clone([] as Budget[]),
    goals: clone([] as SavingsGoal[]),
    settings: clone(DEFAULT_SETTINGS),
    version: 1,
  }
}

export function normalizeFinanceSnapshot(snapshot?: Partial<FinanceSnapshot> | null): FinanceSnapshot {
  const defaults = createDefaultFinanceSnapshot()
  const currency = normalizeCurrencyCode(snapshot?.settings?.currency ?? defaults.settings.currency)

  return {
    transactions: Array.isArray(snapshot?.transactions) ? snapshot.transactions : defaults.transactions,
    budgets: Array.isArray(snapshot?.budgets) ? snapshot.budgets : defaults.budgets,
    goals: Array.isArray(snapshot?.goals) ? snapshot.goals : defaults.goals,
    settings: snapshot?.settings
      ? { ...defaults.settings, ...snapshot.settings, currency }
      : { ...defaults.settings, currency },
    version: snapshot?.version ?? 1,
  }
}