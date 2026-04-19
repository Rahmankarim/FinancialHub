'use client'

import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { Budget, SavingsGoal, Settings, Transaction } from '@/lib/types'
import { createDefaultFinanceSnapshot, normalizeFinanceSnapshot, type FinanceSnapshot } from '@/lib/finance-data'
import { useAuth } from '@/lib/context/auth-context'

interface FinanceContextType {
  transactions: Transaction[]
  addTransaction: (transaction: Omit<Transaction, 'id'>) => Promise<void>
  updateTransaction: (id: string, transaction: Omit<Transaction, 'id'>) => Promise<void>
  deleteTransaction: (id: string) => Promise<void>

  budgets: Budget[]
  addBudget: (budget: Omit<Budget, 'id'>) => Promise<void>
  updateBudget: (id: string, budget: Omit<Budget, 'id'>) => Promise<void>
  deleteBudget: (id: string) => Promise<void>

  goals: SavingsGoal[]
  addGoal: (goal: Omit<SavingsGoal, 'id'>) => Promise<void>
  updateGoal: (id: string, goal: Omit<SavingsGoal, 'id'>) => Promise<void>
  deleteGoal: (id: string) => Promise<void>
  transferToGoal: (goalId: string, amount: number) => Promise<void>
  transferToBudget: (budgetId: string, amount: number) => Promise<void>

  settings: Settings
  updateSettings: (settings: Partial<Settings>) => Promise<void>

  isLoading: boolean
  isSaving: boolean
  resetData: () => Promise<void>
}

const FinanceContext = createContext<FinanceContextType | undefined>(undefined)

function createFinanceId(prefix: string) {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`
}

function calculateNetWorth(transactions: Transaction[]) {
  return transactions.reduce((total, transaction) => {
    return transaction.type === 'income' ? total + transaction.amount : total - transaction.amount
  }, 0)
}

export function FinanceProvider({ children }: { children: React.ReactNode }) {
  const { user, isLoading: isAuthLoading } = useAuth()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [budgets, setBudgets] = useState<Budget[]>([])
  const [goals, setGoals] = useState<SavingsGoal[]>([])
  const [settings, setSettings] = useState<Settings>(createDefaultFinanceSnapshot().settings)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const snapshotRef = useRef<FinanceSnapshot>(createDefaultFinanceSnapshot())

  const applySnapshot = (snapshot: FinanceSnapshot) => {
    snapshotRef.current = snapshot
    setTransactions(snapshot.transactions)
    setBudgets(snapshot.budgets)
    setGoals(snapshot.goals)
    setSettings(snapshot.settings)
  }

  const saveSnapshot = async (snapshot: FinanceSnapshot) => {
    if (!user) {
      return
    }

    setIsSaving(true)

    try {
      const response = await fetch('/api/finance', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(snapshot),
      })

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}))
        throw new Error(payload.error || 'Failed to save finance data')
      }
    } finally {
      setIsSaving(false)
    }
  }

  const commitSnapshot = async (nextSnapshot: FinanceSnapshot, previousSnapshot: FinanceSnapshot) => {
    applySnapshot(nextSnapshot)

    try {
      await saveSnapshot(nextSnapshot)
    } catch (error) {
      applySnapshot(previousSnapshot)
      throw error
    }
  }

  useEffect(() => {
    if (isAuthLoading) {
      return
    }

    if (!user) {
      const emptySnapshot = createDefaultFinanceSnapshot()
      applySnapshot(emptySnapshot)
      setIsLoading(false)
      return
    }

    let active = true

    const loadData = async () => {
      setIsLoading(true)

      try {
        const response = await fetch('/api/finance', { cache: 'no-store' })

        if (!response.ok) {
          throw new Error('Failed to load finance data')
        }

        const data = (await response.json()) as Partial<FinanceSnapshot>

        if (active) {
          applySnapshot(normalizeFinanceSnapshot(data))
        }
      } catch (error) {
        console.error('Failed to load finance data:', error)

        if (active) {
          applySnapshot(createDefaultFinanceSnapshot())
        }
      } finally {
        if (active) {
          setIsLoading(false)
        }
      }
    }

    loadData()

    return () => {
      active = false
    }
  }, [user, isAuthLoading])

  useEffect(() => {
    snapshotRef.current = {
      transactions,
      budgets,
      goals,
      settings,
      version: 1,
    }
  }, [transactions, budgets, goals, settings])

  const addTransaction = async (transaction: Omit<Transaction, 'id'>) => {
    const current = snapshotRef.current
    const nextSnapshot: FinanceSnapshot = {
      ...current,
      transactions: [
        {
          ...transaction,
          id: createFinanceId('txn'),
        },
        ...current.transactions,
      ],
    }

    await commitSnapshot(nextSnapshot, current)
  }

  const updateTransaction = async (id: string, transaction: Omit<Transaction, 'id'>) => {
    const current = snapshotRef.current
    const nextSnapshot: FinanceSnapshot = {
      ...current,
      transactions: current.transactions.map((item) => (item.id === id ? { ...transaction, id } : item)),
    }

    await commitSnapshot(nextSnapshot, current)
  }

  const deleteTransaction = async (id: string) => {
    const current = snapshotRef.current
    const nextSnapshot: FinanceSnapshot = {
      ...current,
      transactions: current.transactions.filter((item) => item.id !== id),
    }

    await commitSnapshot(nextSnapshot, current)
  }

  const addBudget = async (budget: Omit<Budget, 'id'>) => {
    const current = snapshotRef.current
    const nextSnapshot: FinanceSnapshot = {
      ...current,
      budgets: [
        {
          ...budget,
          id: createFinanceId('bgt'),
        },
        ...current.budgets,
      ],
    }

    await commitSnapshot(nextSnapshot, current)
  }

  const updateBudget = async (id: string, budget: Omit<Budget, 'id'>) => {
    const current = snapshotRef.current
    const nextSnapshot: FinanceSnapshot = {
      ...current,
      budgets: current.budgets.map((item) => (item.id === id ? { ...budget, id } : item)),
    }

    await commitSnapshot(nextSnapshot, current)
  }

  const deleteBudget = async (id: string) => {
    const current = snapshotRef.current
    const nextSnapshot: FinanceSnapshot = {
      ...current,
      budgets: current.budgets.filter((item) => item.id !== id),
    }

    await commitSnapshot(nextSnapshot, current)
  }

  const addGoal = async (goal: Omit<SavingsGoal, 'id'>) => {
    const current = snapshotRef.current
    const nextSnapshot: FinanceSnapshot = {
      ...current,
      goals: [
        {
          ...goal,
          id: createFinanceId('goal'),
        },
        ...current.goals,
      ],
    }

    await commitSnapshot(nextSnapshot, current)
  }

  const updateGoal = async (id: string, goal: Omit<SavingsGoal, 'id'>) => {
    const current = snapshotRef.current
    const nextSnapshot: FinanceSnapshot = {
      ...current,
      goals: current.goals.map((item) => (item.id === id ? { ...goal, id } : item)),
    }

    await commitSnapshot(nextSnapshot, current)
  }

  const deleteGoal = async (id: string) => {
    const current = snapshotRef.current
    const nextSnapshot: FinanceSnapshot = {
      ...current,
      goals: current.goals.filter((item) => item.id !== id),
    }

    await commitSnapshot(nextSnapshot, current)
  }

  const transferToGoal = async (goalId: string, amount: number) => {
    if (!Number.isFinite(amount) || amount <= 0) {
      throw new Error('Transfer amount must be greater than 0')
    }

    const current = snapshotRef.current
    const netWorth = calculateNetWorth(current.transactions)

    if (amount > netWorth) {
      throw new Error('Insufficient available balance')
    }

    const goal = current.goals.find((item) => item.id === goalId)

    if (!goal) {
      throw new Error('Goal not found')
    }

    const transferAmount = Number(amount.toFixed(2))
    const now = new Date().toISOString().split('T')[0]

    const nextSnapshot: FinanceSnapshot = {
      ...current,
      goals: current.goals.map((item) =>
        item.id === goalId
          ? {
              ...item,
              currentAmount: Number((item.currentAmount + transferAmount).toFixed(2)),
            }
          : item
      ),
      transactions: [
        {
          id: createFinanceId('txn'),
          date: now,
          amount: transferAmount,
          category: 'Savings',
          description: `Transfer to goal: ${goal.name}`,
          recurring: false,
          type: 'expense',
        },
        ...current.transactions,
      ],
    }

    await commitSnapshot(nextSnapshot, current)
  }

  const transferToBudget = async (budgetId: string, amount: number) => {
    if (!Number.isFinite(amount) || amount <= 0) {
      throw new Error('Transfer amount must be greater than 0')
    }

    const current = snapshotRef.current
    const netWorth = calculateNetWorth(current.transactions)

    if (amount > netWorth) {
      throw new Error('Insufficient available balance')
    }

    const budget = current.budgets.find((item) => item.id === budgetId)

    if (!budget) {
      throw new Error('Budget not found')
    }

    const transferAmount = Number(amount.toFixed(2))
    const now = new Date().toISOString().split('T')[0]

    const nextSnapshot: FinanceSnapshot = {
      ...current,
      budgets: current.budgets.map((item) =>
        item.id === budgetId
          ? {
              ...item,
              limit: Number((item.limit + transferAmount).toFixed(2)),
            }
          : item
      ),
      transactions: [
        {
          id: createFinanceId('txn'),
          date: now,
          amount: transferAmount,
          category: 'Other',
          description: `Transfer to budget: ${budget.category}`,
          recurring: false,
          type: 'expense',
        },
        ...current.transactions,
      ],
    }

    await commitSnapshot(nextSnapshot, current)
  }

  const updateSettings = async (newSettings: Partial<Settings>) => {
    const current = snapshotRef.current
    const nextSnapshot: FinanceSnapshot = {
      ...current,
      settings: { ...current.settings, ...newSettings },
    }

    await commitSnapshot(nextSnapshot, current)
  }

  const resetData = async () => {
    const current = snapshotRef.current
    const nextSnapshot = createDefaultFinanceSnapshot()
    await commitSnapshot(nextSnapshot, current)
  }

  const value: FinanceContextType = useMemo(
    () => ({
      transactions,
      addTransaction,
      updateTransaction,
      deleteTransaction,
      budgets,
      addBudget,
      updateBudget,
      deleteBudget,
      goals,
      addGoal,
      updateGoal,
      deleteGoal,
      transferToGoal,
      transferToBudget,
      settings,
      updateSettings,
      isLoading,
      isSaving,
      resetData,
    }),
    [transactions, budgets, goals, settings, isLoading, isSaving]
  )

  return <FinanceContext.Provider value={value}>{children}</FinanceContext.Provider>
}

export function useFinance() {
  const context = useContext(FinanceContext)

  if (!context) {
    throw new Error('useFinance must be used within FinanceProvider')
  }

  return context
}