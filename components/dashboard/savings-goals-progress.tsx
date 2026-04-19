'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatCurrency } from '@/lib/utils'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

interface SavingsGoalProgress {
  id: string
  name: string
  targetAmount: number
  currentAmount: number
  targetDate: string
  percentage: number
  daysRemaining: number
  isCompleted: boolean
}

interface SavingsGoalsProgressProps {
  goals: SavingsGoalProgress[]
}

export function SavingsGoalsProgress({ goals }: SavingsGoalsProgressProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Savings Goals</CardTitle>
        <Link href="/goals">
          <Button size="sm" variant="outline">
            View All
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        {goals.length === 0 ? (
          <div className="h-20 flex items-center justify-center text-muted-foreground">
            No goals yet.
          </div>
        ) : (
          <div className="space-y-6">
            {goals.slice(0, 3).map((goal) => (
              <div key={goal.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm">{goal.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {goal.isCompleted 
                        ? '✓ Completed' 
                        : goal.daysRemaining > 0 
                          ? `${goal.daysRemaining} days left` 
                          : 'Deadline passed'}
                    </p>
                  </div>
                  <p className="font-semibold text-sm">{goal.percentage}%</p>
                </div>
                <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-full transition-all ${goal.isCompleted ? 'bg-emerald-500' : 'bg-gradient-to-r from-primary to-accent'}`}
                    style={{ width: `${Math.min(goal.percentage, 100)}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  {formatCurrency(goal.currentAmount)} of {formatCurrency(goal.targetAmount)}
                </p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
