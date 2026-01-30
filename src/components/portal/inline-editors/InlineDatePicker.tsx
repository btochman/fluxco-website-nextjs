"use client";

import { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { format, isAfter, isBefore, startOfDay, isSameDay } from "date-fns";

interface InlineDatePickerProps {
  date: Date | null;
  onDateChange: (date: Date | null) => Promise<void>;
  label?: string;
  showClearButton?: boolean;
  disabled?: boolean;
}

export function InlineDatePicker({
  date,
  onDateChange,
  label = "Due",
  showClearButton = true,
  disabled = false,
}: InlineDatePickerProps) {
  const [open, setOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const today = startOfDay(new Date());
  const isOverdue = date && isBefore(startOfDay(date), today);
  const isToday = date && isSameDay(date, today);
  const isSoon = date && isAfter(date, today) && isBefore(date, new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000));

  const handleSelect = async (newDate: Date | undefined) => {
    if (!newDate) return;

    setIsUpdating(true);
    try {
      await onDateChange(newDate);
    } finally {
      setIsUpdating(false);
      setOpen(false);
    }
  };

  const handleClear = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsUpdating(true);
    try {
      await onDateChange(null);
    } finally {
      setIsUpdating(false);
      setOpen(false);
    }
  };

  const handleTodayClick = async () => {
    setIsUpdating(true);
    try {
      await onDateChange(today);
    } finally {
      setIsUpdating(false);
      setOpen(false);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild disabled={disabled || isUpdating}>
        <button
          className={cn(
            "inline-flex items-center gap-1.5 px-2 py-1 rounded text-xs",
            "transition-all duration-150",
            "focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-400",
            "hover:bg-muted",
            disabled && "opacity-50 cursor-not-allowed",
            isUpdating && "opacity-70",
            date ? (
              isOverdue
                ? "text-red-600 bg-red-50 hover:bg-red-100"
                : isToday
                ? "text-orange-600 bg-orange-50 hover:bg-orange-100"
                : isSoon
                ? "text-amber-600 bg-amber-50 hover:bg-amber-100"
                : "text-muted-foreground bg-muted/50"
            ) : "text-muted-foreground"
          )}
        >
          <CalendarIcon className="h-3 w-3" />
          {date ? (
            <>
              <span>{format(date, "MMM d")}</span>
              {showClearButton && (
                <X
                  className="h-3 w-3 hover:text-foreground"
                  onClick={handleClear}
                />
              )}
            </>
          ) : (
            <span className="italic">No date</span>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div className="p-2 border-b flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 text-xs"
            onClick={handleTodayClick}
          >
            Today
          </Button>
          {date && showClearButton && (
            <Button
              variant="outline"
              size="sm"
              className="text-xs text-muted-foreground"
              onClick={handleClear}
            >
              Clear
            </Button>
          )}
        </div>
        <Calendar
          mode="single"
          selected={date || undefined}
          onSelect={handleSelect}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}
