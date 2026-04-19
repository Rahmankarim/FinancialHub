'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { GoalForm } from '@/components/forms/goal-form'
import { SavingsGoal } from '@/lib/types'
import { useFinance } from '@/lib/context/finance-context'

interface GoalModalProps {
  isOpen: boolean
  onClose: () => void
  initialData?: SavingsGoal
}

export function GoalModal({
  isOpen,
  onClose,
  initialData,
}: GoalModalProps) {
  const { addGoal, updateGoal } = useFinance()
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (data: Omit<SavingsGoal, 'id'>) => {
    setIsLoading(true)
    try {
      if (initialData) {
        await updateGoal(initialData.id, data)
      } else {
        await addGoal(data)
      }
      onClose()
    } catch (error) {
      console.error('Failed to save goal:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {initialData ? 'Edit Goal' : 'Add Savings Goal'}
          </DialogTitle>
          <DialogDescription>
            {initialData
              ? 'Update your savings goal'
              : 'Create a new goal to track your progress'}
          </DialogDescription>
        </DialogHeader>
        <GoalForm
          initialData={initialData}
          onSubmit={handleSubmit}
          isLoading={isLoading}
        />
      </DialogContent>
    </Dialog>
  )
}
