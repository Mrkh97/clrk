import { format, parse } from 'date-fns'
import { CalendarIcon } from 'lucide-react'
import { Button } from '#/components/ui/button'
import { Calendar } from '#/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '#/components/ui/popover'
import { cn } from '#/lib/utils'

interface DatePickerProps {
  /** ISO date string (YYYY-MM-DD) */
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

export default function DatePicker({
  value,
  onChange,
  placeholder = 'Pick a date',
  className,
}: DatePickerProps) {
  const date = value ? parse(value, 'yyyy-MM-dd', new Date()) : undefined

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            'w-full justify-start border-x-0 border-t-0 rounded-none border-b border-border bg-transparent px-0 text-sm font-normal hover:bg-transparent focus-visible:ring-0 focus-visible:border-foreground',
            !value && 'text-muted-foreground',
            className,
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4 text-muted-foreground" />
          {date ? format(date, 'MMM d, yyyy') : placeholder}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={(d) => {
            if (d) onChange(format(d, 'yyyy-MM-dd'))
          }}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  )
}
