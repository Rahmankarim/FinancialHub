'use client'

import { useState } from 'react'
import { AppLayout } from '@/components/layout/app-layout'
import { SavingsGoalCard } from '@/components/goals/savings-goal-card'
import { GoalModal } from '@/components/modals/goal-modal'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { useFinance } from '@/lib/context/finance-context'
import { useFinanceCalculations } from '@/lib/hooks/use-finance-calculations'
import { formatCurrency } from '@/lib/utils'

export default function GoalsPage() {
  const { isLoading } = useFinance()
  const { goalsWithProgress, completedGoalsCount, totalGoalsTarget, totalGoalsSaved, netWorth } = useFinanceCalculations()
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
            <h1 className="text-3xl font-bold">Savings Goals</h1>
            <p className="text-muted-foreground mt-2">Track your progress towards your financial goals</p>
          </div>
          <Button onClick={() => setIsModalOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Goal
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Target
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{formatCurrency(totalGoalsTarget)}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Saved
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-emerald-600">{formatCurrency(totalGoalsSaved)}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {totalGoalsTarget > 0 ? Math.round((totalGoalsSaved / totalGoalsTarget) * 100) : 0}% overall
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Completed Goals
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-primary">{completedGoalsCount} of {goalsWithProgress.length}</p>
            </CardContent>
          </Card>
        </div>

        {/* Goals Grid */}
        {goalsWithProgress.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground mb-4">No savings goals yet</p>
              <Button onClick={() => setIsModalOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Goal
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {goalsWithProgress.map((goal) => (
              <SavingsGoalCard key={goal.id} goal={goal} availableBalance={Math.max(netWorth, 0)} />
            ))}
          </div>
        )}

        {/* Goal Modal */}
        <GoalModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      </div>
    </AppLayout>
  )
}
