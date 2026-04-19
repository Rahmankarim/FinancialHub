'use client'

import { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { formatCurrency } from '@/lib/utils'

interface FundTransferModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  description: string
  availableBalance: number
  onTransfer: (amount: number) => Promise<void>
}

export function FundTransferModal({
  isOpen,
  onClose,
  title,
  description,
  availableBalance,
  onTransfer,
}: FundTransferModalProps) {
  const [amount, setAmount] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setAmount('')
      setError('')
      setIsSubmitting(false)
    }
  }, [isOpen])

  const handleTransfer = async () => {
    const parsed = Number(amount)

    if (!Number.isFinite(parsed) || parsed <= 0) {
      setError('Enter a valid transfer amount greater than 0.')
      return
    }

    if (parsed > availableBalance) {
      setError('Transfer amount exceeds available balance.')
      return
    }

    setError('')
    setIsSubmitting(true)

    try {
      await onTransfer(parsed)
      onClose()
    } catch (transferError) {
      setError(transferError instanceof Error ? transferError.message : 'Transfer failed. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="rounded-lg border border-border bg-muted/30 p-3 text-sm">
            Available to transfer: <span className="font-semibold">{formatCurrency(availableBalance)}</span>
          </div>

          <div className="space-y-2">
            <label htmlFor="fund-transfer-amount" className="text-sm font-medium">
              Amount
            </label>
            <Input
              id="fund-transfer-amount"
              type="number"
              min="0"
              step="0.01"
              placeholder="0.00"
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
            />
            {error && <p className="text-xs text-red-600">{error}</p>}
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="button" onClick={() => void handleTransfer()} disabled={isSubmitting}>
              {isSubmitting ? 'Transferring...' : 'Transfer Funds'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
