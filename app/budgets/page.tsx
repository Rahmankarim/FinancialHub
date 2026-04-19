'use client'

import { useState } from 'react'
import { AppLayout } from '@/components/layout/app-layout'
import { CategoryBudgetCard } from '@/components/budgets/category-budget-card'
import { BudgetModal } from '@/components/modals/budget-modal'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { useFinance } from '@/lib/context/finance-context'
import { useFinanceCalculations } from '@/lib/hooks/use-finance-calculations'
import { formatCurrency } from '@/lib/utils'

export default function BudgetsPage() {
  const { isLoading } = useFinance()
  const { budgetStatus, totalBudget, totalSpent, overBudgetCount, netWorth } = useFinanceCalculations()
  const [isModalOpen, setIsModalOpen] = useState(false)

  if (isLoading) {
    return (
      <AppLayout>
        <div className="p-6 max-w-7xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-32 bg-card rounded-lg" />
            <div className="grid grid-cols-3 gap-4">
              {Array(3).fill(0).map((_, i) => (
                <div key={i} className="h-24 bg-card rounded-lg" />
              ))}
            </div>
          </div>
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      <div className="p-6 max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Budgets</h1>
            <p className="text-muted-foreground mt-2">Track your spending across categories</p>
          </div>
          <Button onClick={() => setIsModalOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Budget
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Budget
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{formatCurrency(totalBudget)}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Spent
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-amber-600">{formatCurrency(totalSpent)}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {Math.round((totalSpent / totalBudget) * 100)}% of budget
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Over Budget
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-red-600">{overBudgetCount}</p>
              <p className="text-xs text-muted-foreground mt-1">categories over limit</p>
            </CardContent>
          </Card>
        </div>

        {/* Budgets Grid */}
        {budgetStatus.length === 0 ? (
          <Card>
            <CardContent className="py-12">
              <div className="text-center text-muted-foreground">
                <p className="mb-4">No budgets yet. Create one to start tracking.</p>
                <Button onClick={() => setIsModalOpen(true)}>Create Budget</Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {budgetStatus.map((budget) => (
              <CategoryBudgetCard key={budget.id} budget={budget} availableBalance={Math.max(netWorth, 0)} />
            ))}
          </div>
        )}

        {/* Budget Modal */}
        <BudgetModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      </div>
    </AppLayout>
  )
}
