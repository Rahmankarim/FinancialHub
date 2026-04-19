'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface MonthPickerProps {
  onMonthChange: (date: Date) => void
  currentDate?: Date
}

export function MonthPicker({ onMonthChange, currentDate = new Date() }: MonthPickerProps) {
  const [date, setDate] = useState(currentDate)

  const handlePrevMonth = () => {
    const newDate = new Date(date.getFullYear(), date.getMonth() - 1, 1)
    setDate(newDate)
    onMonthChange(newDate)
  }

  const handleNextMonth = () => {
    const newDate = new Date(date.getFullYear(), date.getMonth() + 1, 1)
    setDate(newDate)
    onMonthChange(newDate)
  }

  const monthYear = date.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  })

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="icon"
        onClick={handlePrevMonth}
        className="h-8 w-8"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <span className="min-w-40 text-center font-semibold text-sm">{monthYear}</span>
      <Button
        variant="outline"
        size="icon"
        onClick={handleNextMonth}
        className="h-8 w-8"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  )
}
