'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Budget } from '@/lib/types'
import { TRANSACTION_CATEGORIES } from '@/lib/constants'

const budgetSchema = z.object({
  category: z.string().min(1, 'Category is required'),
  limit: z.coerce.number().min(0.01, 'Limit must be greater than 0'),
})

type BudgetFormData = z.infer<typeof budgetSchema>

interface BudgetFormProps {
  initialData?: Budget
  onSubmit: (data: Omit<Budget, 'id'>) => void
  isLoading?: boolean
}

export function BudgetForm({
  initialData,
  onSubmit,
  isLoading = false,
}: BudgetFormProps) {
  const form = useForm<BudgetFormData>({
    resolver: zodResolver(budgetSchema),
    defaultValues: {
      category: initialData?.category || '',
      limit: initialData?.limit || 0,
    },
  })

  useEffect(() => {
    form.reset({
      category: initialData?.category || '',
      limit: initialData?.limit || 0,
    })
  }, [initialData, form])

  const handleSubmit = (data: BudgetFormData) => {
    onSubmit({
      ...data,
      spent: initialData?.spent ?? 0,
      color: initialData?.color ?? 'bg-blue-500',
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select value={field.value} onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {TRANSACTION_CATEGORIES.expense.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="limit"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Monthly Limit</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? 'Saving...' : 'Save Budget'}
        </Button>
      </form>
    </Form>
  )
}
