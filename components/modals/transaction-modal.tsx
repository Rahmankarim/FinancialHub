'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { TransactionForm } from '@/components/forms/transaction-form'
import { Transaction } from '@/lib/types'
import { useFinance } from '@/lib/context/finance-context'

interface TransactionModalProps {
  isOpen: boolean
  onClose: () => void
  initialData?: Transaction
}

export function TransactionModal({
  isOpen,
  onClose,
  initialData,
}: TransactionModalProps) {
  const { addTransaction, updateTransaction } = useFinance()
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (data: Omit<Transaction, 'id'>) => {
    setIsLoading(true)
    try {
      if (initialData) {
        await updateTransaction(initialData.id, data)
      } else {
        await addTransaction(data)
      }
      onClose()
    } catch (error) {
      console.error('Failed to save transaction:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {initialData ? 'Edit Transaction' : 'Add Transaction'}
          </DialogTitle>
          <DialogDescription>
            {initialData
              ? 'Update your transaction details'
              : 'Add a new transaction to track your finances'}
          </DialogDescription>
        </DialogHeader>
        <TransactionForm
          initialData={initialData}
          onSubmit={handleSubmit}
          isLoading={isLoading}
        />
      </DialogContent>
    </Dialog>
  )
}
