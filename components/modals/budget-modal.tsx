'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { BudgetForm } from '@/components/forms/budget-form'
import { Budget } from '@/lib/types'
import { useFinance } from '@/lib/context/finance-context'

interface BudgetModalProps {
  isOpen: boolean
  onClose: () => void
  initialData?: Budget
}

export function BudgetModal({
  isOpen,
  onClose,
  initialData,
}: BudgetModalProps) {
  const { addBudget, updateBudget } = useFinance()
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (data: Omit<Budget, 'id'>) => {
    setIsLoading(true)
    try {
      if (initialData) {
        await updateBudget(initialData.id, data)
      } else {
        await addBudget(data)
      }
      onClose()
    } catch (error) {
      console.error('Failed to save budget:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {initialData ? 'Edit Budget' : 'Add Budget'}
          </DialogTitle>
          <DialogDescription>
            {initialData
              ? 'Update your budget limit'
              : 'Create a new budget to control your spending'}
          </DialogDescription>
        </DialogHeader>
        <BudgetForm
          initialData={initialData}
          onSubmit={handleSubmit}
          isLoading={isLoading}
        />
      </DialogContent>
    </Dialog>
  )
}
