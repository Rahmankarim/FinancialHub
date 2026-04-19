'use client'

import { useState } from 'react'
import { formatCurrency } from '@/lib/utils'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowDownToLine, Trash2 } from 'lucide-react'
import { GoalModal } from '@/components/modals/goal-modal'
import { useFinance } from '@/lib/context/finance-context'
import { FundTransferModal } from '@/components/modals/fund-transfer-modal'

interface GoalWithProgress {
  id: string
  name: string
  targetAmount: number
  currentAmount: number
  targetDate: string
  color: string
  percentage: number
  daysRemaining: number
  isCompleted: boolean
}

interface SavingsGoalCardProps {
  goal: GoalWithProgress
  availableBalance: number
}

export function SavingsGoalCard({ goal, availableBalance }: SavingsGoalCardProps) {
  const { deleteGoal, transferToGoal } = useFinance()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false)

  const handleDelete = () => {
    if (window.confirm(`Delete goal "${goal.name}"?`)) {
      deleteGoal(goal.id).catch((error) => console.error('Failed to delete goal:', error))
    }
  }

  return (
    <>
      <Card className={goal.isCompleted ? 'border-emerald-500/50 bg-emerald-50/30 dark:bg-emerald-950/20' : ''}>
        <CardContent className="pt-6">
          <div className="space-y-4">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="font-semibold text-lg">{goal.name}</p>
                <p className="text-sm text-muted-foreground">
                  {goal.isCompleted ? (
                    <span className="text-emerald-600 dark:text-emerald-400">✓ Completed</span>
                  ) : goal.daysRemaining > 0 ? (
                    <span>{goal.daysRemaining} days left</span>
                  ) : (
                    <span className="text-red-600 dark:text-red-400">Deadline passed</span>
                  )}
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setIsModalOpen(true)}
                >
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setIsTransferModalOpen(true)}
                  className="text-emerald-600 hover:text-emerald-700"
                >
                  <ArrowDownToLine className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleDelete}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Circular Progress */}
            <div className="flex items-center justify-center py-4">
              <div className="relative w-32 h-32">
                <svg className="transform -rotate-90 w-32 h-32">
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="none"
                    className="text-muted"
                  />
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray={`${(goal.percentage / 100) * 2 * Math.PI * 56} ${
                      2 * Math.PI * 56
                    }`}
                    className={`transition-all ${goal.isCompleted ? 'text-emerald-500' : 'text-primary'}`}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-2xl font-bold">{goal.percentage}%</p>
                    <p className="text-xs text-muted-foreground">Complete</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Progress Details */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Progress</span>
                <span className="font-semibold">
                  {formatCurrency(goal.currentAmount)} / {formatCurrency(goal.targetAmount)}
                </span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className={`h-full rounded-full transition-all ${goal.isCompleted ? 'bg-emerald-500' : 'bg-gradient-to-r from-primary to-accent'}`}
                  style={{ width: `${Math.min(goal.percentage, 100)}%` }}
                />
              </div>
            </div>

            {/* Deadline */}
            <p className="text-xs text-muted-foreground border-t pt-3">
              Target: {new Date(goal.targetDate).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>
        </CardContent>
      </Card>

      <GoalModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialData={{
          id: goal.id,
          name: goal.name,
          targetAmount: goal.targetAmount,
          currentAmount: goal.currentAmount,
          targetDate: goal.targetDate,
          color: goal.color,
        }}
      />

      <FundTransferModal
        isOpen={isTransferModalOpen}
        onClose={() => setIsTransferModalOpen(false)}
        title={`Fund ${goal.name}`}
        description="Transfer funds from your available balance directly into this savings goal."
        availableBalance={availableBalance}
        onTransfer={(amount) => transferToGoal(goal.id, amount)}
      />
    </>
  )
}
