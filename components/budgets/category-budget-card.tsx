'use client'

import { formatCurrency } from '@/lib/utils'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { AlertCircle, PiggyBank, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { BudgetModal } from '@/components/modals/budget-modal'
import { useFinance } from '@/lib/context/finance-context'
import { FundTransferModal } from '@/components/modals/fund-transfer-modal'

interface BudgetStatus {
  id: string
  category: string
  limit: number
  spent: number
  color: string
  remaining: number
  percentage: number
  isOverBudget: boolean
}

interface CategoryBudgetCardProps {
  budget: BudgetStatus
  availableBalance: number
}

export function CategoryBudgetCard({ budget, availableBalance }: CategoryBudgetCardProps) {
  const { deleteBudget, transferToBudget } = useFinance()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false)

  const handleDelete = () => {
    if (window.confirm(`Delete budget for ${budget.category}?`)) {
      deleteBudget(budget.id).catch((error) => console.error('Failed to delete budget:', error))
    }
  }

  return (
    <>
      <Card className={budget.isOverBudget ? 'border-red-500/50 bg-red-50/30 dark:bg-red-950/20' : ''}>
        <CardContent className="pt-6">
          <div className="space-y-4">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="font-semibold text-lg">{budget.category}</p>
                <p className="text-sm text-muted-foreground">
                  {budget.isOverBudget ? (
                    <span className="text-red-600 dark:text-red-400">
                      Over by {formatCurrency(Math.abs(budget.remaining))}
                    </span>
                  ) : (
                    <span className="text-emerald-600 dark:text-emerald-400">
                      {formatCurrency(budget.remaining)} remaining
                    </span>
                  )}
                </p>
              </div>
              <div className="flex gap-2">
                {budget.isOverBudget && <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />}
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
                  <PiggyBank className="w-4 h-4" />
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

            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
                <div
                  className={`h-full transition-all ${
                    budget.isOverBudget
                      ? 'bg-gradient-to-r from-red-500 to-red-600'
                      : 'bg-gradient-to-r from-primary to-accent'
                  }`}
                  style={{ width: `${Math.min(budget.percentage, 100)}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  {formatCurrency(budget.spent)} spent
                </span>
                <span className="font-semibold">{budget.percentage}%</span>
              </div>
            </div>

            {/* Budget Info */}
            <p className="text-xs text-muted-foreground">
              Budget: {formatCurrency(budget.limit)}
            </p>
          </div>
        </CardContent>
      </Card>

      <BudgetModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialData={{
          id: budget.id,
          category: budget.category,
          limit: budget.limit,
          spent: budget.spent,
          color: budget.color,
        }}
      />

      <FundTransferModal
        isOpen={isTransferModalOpen}
        onClose={() => setIsTransferModalOpen(false)}
        title={`Fund ${budget.category} Budget`}
        description="Transfer funds from your available balance to increase this category budget limit."
        availableBalance={availableBalance}
        onTransfer={(amount) => transferToBudget(budget.id, amount)}
      />
    </>
  )
}
