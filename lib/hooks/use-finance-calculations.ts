'use client'

import { useMemo } from 'react'
import { useFinance } from '@/lib/context/finance-context'
import { TransactionType } from '@/lib/types'

function getLatestTransactionMonth(transactions: { date: string }[]) {
  if (transactions.length === 0) {
    return new Date()
  }

  return transactions.reduce((latest, transaction) => {
    const date = new Date(transaction.date)
    return date > latest ? date : latest
  }, new Date(transactions[0].date))
}

export function useFinanceCalculations() {
  const { transactions, budgets, goals } = useFinance()
  const referenceDate = useMemo(() => getLatestTransactionMonth(transactions), [transactions])

  const netWorth = useMemo(() => {
    return transactions.reduce((sum, t) => {
      return t.type === 'income' ? sum + t.amount : sum - t.amount
    }, 0)
  }, [transactions])

  const monthlyIncome = useMemo(() => {
    const currentMonth = referenceDate.getMonth()
    const currentYear = referenceDate.getFullYear()

    return transactions
      .filter((t) => {
        const date = new Date(t.date)
        return (
          t.type === 'income' &&
          date.getMonth() === currentMonth &&
          date.getFullYear() === currentYear
        )
      })
      .reduce((sum, t) => sum + t.amount, 0)
  }, [transactions, referenceDate])

  const monthlyExpenses = useMemo(() => {
    const currentMonth = referenceDate.getMonth()
    const currentYear = referenceDate.getFullYear()

    return transactions
      .filter((t) => {
        const date = new Date(t.date)
        return (
          t.type === 'expense' &&
          date.getMonth() === currentMonth &&
          date.getFullYear() === currentYear
        )
      })
      .reduce((sum, t) => sum + t.amount, 0)
  }, [transactions, referenceDate])

  const monthlySavings = useMemo(() => {
    return monthlyIncome - monthlyExpenses
  }, [monthlyIncome, monthlyExpenses])

  const savingsRate = useMemo(() => {
    if (monthlyIncome === 0) return 0
    return Math.round((monthlySavings / monthlyIncome) * 100)
  }, [monthlySavings, monthlyIncome])

  const expensesByCategory = useMemo(() => {
    const categoryMap = new Map<string, number>()

    transactions
      .filter((t) => t.type === 'expense')
      .forEach((t) => {
        const current = categoryMap.get(t.category) || 0
        categoryMap.set(t.category, current + t.amount)
      })

    return Array.from(categoryMap.entries()).map(([category, amount]) => ({
      category,
      amount,
    }))
  }, [transactions])

  const budgetStatus = useMemo(() => {
    return budgets.map((budget) => {
      const spent = transactions
        .filter(
          (t) =>
            t.type === 'expense' &&
            t.category === budget.category
        )
        .reduce((sum, t) => sum + t.amount, 0)

      const remaining = budget.limit - spent
      const percentage = Math.round((spent / budget.limit) * 100)

      return {
        ...budget,
        spent,
        remaining,
        percentage,
        isOverBudget: spent > budget.limit,
      }
    })
  }, [budgets, transactions])

  const totalBudget = useMemo(() => {
    return budgets.reduce((sum, b) => sum + b.limit, 0)
  }, [budgets])

  const totalSpent = useMemo(() => {
    return budgetStatus.reduce((sum, b) => sum + b.spent, 0)
  }, [budgetStatus])

  const overBudgetCount = useMemo(() => {
    return budgetStatus.filter((b) => b.isOverBudget).length
  }, [budgetStatus])

  const goalsWithProgress = useMemo(() => {
    return goals.map((goal) => {
      const goalTransactions = transactions.filter(
        (t) =>
          t.type === 'income' &&
          t.description?.toLowerCase().includes(goal.name.toLowerCase())
      )

      const currentAmount = goal.currentAmount
      const percentage = Math.round((currentAmount / goal.targetAmount) * 100)
      const remaining = goal.targetAmount - currentAmount
      const daysRemaining = Math.ceil(
        (new Date(goal.targetDate).getTime() - new Date().getTime()) /
          (1000 * 60 * 60 * 24)
      )

      return {
        ...goal,
        percentage,
        remaining,
        daysRemaining,
        isCompleted: currentAmount >= goal.targetAmount,
      }
    })
  }, [goals, transactions])

  const completedGoalsCount = useMemo(() => {
    return goalsWithProgress.filter((g) => g.isCompleted).length
  }, [goalsWithProgress])

  const totalGoalsTarget = useMemo(() => {
    return goals.reduce((sum, g) => sum + g.targetAmount, 0)
  }, [goals])

  const totalGoalsSaved = useMemo(() => {
    return goals.reduce((sum, g) => sum + g.currentAmount, 0)
  }, [goals])

  const monthlyData = useMemo(() => {
    const data: Record<string, { income: number; expenses: number }> = {}

    // Get last 12 months
    for (let i = 11; i >= 0; i--) {
      const date = new Date(referenceDate)
      date.setMonth(date.getMonth() - i)
      const key = date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
      })

      data[key] = { income: 0, expenses: 0 }
    }

    transactions.forEach((t) => {
      const date = new Date(t.date)
      const key = date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
      })

      if (data[key]) {
        if (t.type === 'income') {
          data[key].income += t.amount
        } else {
          data[key].expenses += t.amount
        }
      }
    })

    return Object.entries(data).map(([month, values]) => ({
      month,
      income: values.income,
      expenses: values.expenses,
      net: values.income - values.expenses,
    }))
  }, [transactions, referenceDate])

  return {
    netWorth,
    monthlyIncome,
    monthlyExpenses,
    monthlySavings,
    savingsRate,
    expensesByCategory,
    budgetStatus,
    totalBudget,
    totalSpent,
    overBudgetCount,
    goalsWithProgress,
    completedGoalsCount,
    totalGoalsTarget,
    totalGoalsSaved,
    monthlyData,
  }
}
