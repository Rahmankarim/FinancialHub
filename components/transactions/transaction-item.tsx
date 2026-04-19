import { Transaction } from '@/lib/types'
import { formatCurrency, formatDate } from '@/lib/utils'
import { ArrowUpRight, ArrowDownLeft } from 'lucide-react'

interface TransactionItemProps {
  transaction: Transaction
  onEdit?: (transaction: Transaction) => void
  onDelete?: (id: string) => void
}

export function TransactionItem({ transaction, onEdit, onDelete }: TransactionItemProps) {
  return (
    <tr className="border-b hover:bg-muted/50 transition-colors">
      <td className="px-4 py-3">
        <div
          className={`w-10 h-10 rounded-lg flex items-center justify-center ${
            transaction.type === 'income'
              ? 'bg-emerald-500/10 text-emerald-600'
              : 'bg-red-500/10 text-red-600'
          }`}
        >
          {transaction.type === 'income' ? (
            <ArrowUpRight className="w-5 h-5" />
          ) : (
            <ArrowDownLeft className="w-5 h-5" />
          )}
        </div>
      </td>
      <td className="px-4 py-3">
        <p className="font-medium text-sm">{transaction.description}</p>
        <p className="text-xs text-muted-foreground">{transaction.category}</p>
      </td>
      <td className="px-4 py-3 text-sm text-muted-foreground">{formatDate(new Date(transaction.date))}</td>
      <td className="px-4 py-3 text-sm capitalize">
        <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
          transaction.type === 'income'
            ? 'bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-200'
            : 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200'
        }`}>
          {transaction.type}
        </span>
      </td>
      <td className="px-4 py-3 text-right">
        <p
          className={`font-semibold text-sm ${
            transaction.type === 'income' ? 'text-emerald-600' : 'text-red-600'
          }`}
        >
          {transaction.type === 'income' ? '+' : '-'}
          {formatCurrency(transaction.amount)}
        </p>
      </td>
      <td className="px-4 py-3 text-right">
        <div className="flex gap-2 justify-end">
          {onEdit && (
            <button
              onClick={() => onEdit(transaction)}
              className="text-primary hover:underline text-sm"
            >
              Edit
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(transaction.id)}
              className="text-red-600 hover:underline text-sm"
            >
              Delete
            </button>
          )}
        </div>
      </td>
    </tr>
  )
}
