'use client'

import { useState } from 'react'
import { AppLayout } from '@/components/layout/app-layout'
import { NetWorthCard } from '@/components/dashboard/net-worth-card'
import { MetricSummaryCards } from '@/components/dashboard/metric-summary-cards'
import { RecentTransactionsSection } from '@/components/dashboard/recent-transactions-section'
import { SavingsGoalsProgress } from '@/components/dashboard/savings-goals-progress'
import { SpendingDonutChart } from '@/components/charts/spending-donut-chart'
import { TransactionModal } from '@/components/modals/transaction-modal'
import { Button } from '@/components/ui/button'
import { useFinance } from '@/lib/context/finance-context'
import { useFinanceCalculations } from '@/lib/hooks/use-finance-calculations'

export default function DashboardPage() {
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false)
  const { transactions, goals, isLoading } = useFinance()
  const calculations = useFinanceCalculations()

  if (isLoading) {
    return (
      <AppLayout>
        <div className="p-6 max-w-7xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-32 bg-card rounded-lg" />
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {Array(4).fill(0).map((_, i) => (
                <div key={i} className="h-24 bg-card rounded-lg" />
              ))}
            </div>
          </div>
        </div>
      </AppLayout>
    )
  }

  const recentTransactions = transactions.slice(0, 5)

  return (
    <AppLayout>
      <div className="mx-auto max-w-7xl space-y-8 px-4 py-6 sm:px-6 lg:px-8">
        <section className="relative overflow-hidden rounded-3xl border border-border/60 bg-gradient-to-br from-white via-white to-emerald-50/70 p-6 shadow-[0_18px_60px_-40px_rgba(15,23,42,0.45)] sm:p-8">
          <div className="absolute inset-0 opacity-70 [background-image:radial-gradient(circle_at_top_right,rgba(16,185,129,0.14),transparent_32%),radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.10),transparent_30%)]" />
          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-emerald-700">Personal finance cockpit</p>
              <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">A clearer view of money in motion.</h1>
              <p className="max-w-xl text-sm text-muted-foreground sm:text-base">
                Track net worth, watch spending drift, and stay on top of goals with a cleaner, more calm dashboard.
              </p>
            </div>
            <Button onClick={() => setIsTransactionModalOpen(true)} className="w-full rounded-full px-5 sm:w-auto">
              + Add Transaction
            </Button>
          </div>
        </section>

        {/* Net Worth Card */}
        <NetWorthCard
          totalNetWorth={calculations.netWorth}
          monthlyChange={calculations.monthlySavings}
          changePercent={calculations.savingsRate}
          trend={calculations.monthlyData.map((month) => month.net)}
        />

        {/* Metric Summary Cards */}
        <MetricSummaryCards
          balance={calculations.netWorth}
          income={calculations.monthlyIncome}
          expenses={calculations.monthlyExpenses}
          savingsRate={calculations.savingsRate}
        />

        {/* Charts and Transactions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <SpendingDonutChart data={calculations.expensesByCategory} />
          </div>
          <div>
            <SavingsGoalsProgress goals={calculations.goalsWithProgress} />
          </div>
        </div>

        {/* Recent Transactions */}
        <RecentTransactionsSection 
          transactions={recentTransactions}
          onAddNew={() => setIsTransactionModalOpen(true)}
        />

        {/* Transaction Modal */}
        <TransactionModal
          isOpen={isTransactionModalOpen}
          onClose={() => setIsTransactionModalOpen(false)}
        />
      </div>
    </AppLayout>
  )
}
