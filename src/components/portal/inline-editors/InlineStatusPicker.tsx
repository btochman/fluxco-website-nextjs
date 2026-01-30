"use client";

import { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { STATUS_CONFIG, KANBAN_COLUMNS } from "@/lib/kanban-constants";
import type { TaskStatus } from "@/types/portal";

interface InlineStatusPickerProps {
  status: TaskStatus;
  onStatusChange: (status: TaskStatus) => Promise<void>;
  disabled?: boolean;
}

export function InlineStatusPicker({
  status,
  onStatusChange,
  disabled = false,
}: InlineStatusPickerProps) {
  const [open, setOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const config = STATUS_CONFIG[status];

  const handleSelect = async (newStatus: TaskStatus) => {
    if (newStatus === status) {
      setOpen(false);
      return;
    }

    setIsUpdating(true);
    try {
      await onStatusChange(newStatus);
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
            "inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium",
            "transition-all duration-150",
            "focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-400",
            config.bg,
            config.text,
            config.hoverBg,
            disabled && "opacity-50 cursor-not-allowed",
            isUpdating && "opacity-70"
          )}
        >
          {config.label}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-40 p-1" align="start">
        <div className="space-y-0.5">
          {KANBAN_COLUMNS.map((col) => {
            const colConfig = STATUS_CONFIG[col.id];
            const isSelected = col.id === status;
            return (
              <button
                key={col.id}
                onClick={() => handleSelect(col.id)}
                className={cn(
                  "w-full flex items-center gap-2 px-2 py-1.5 rounded text-sm",
                  "transition-colors",
                  colConfig.bg,
                  colConfig.text,
                  colConfig.hoverBg,
                  isSelected && "ring-1 ring-inset ring-current"
                )}
              >
                <span className="flex-1 text-left">{colConfig.label}</span>
                {isSelected && <Check className="h-3.5 w-3.5" />}
              </button>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
}
