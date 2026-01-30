"use client";

import { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check, Flag } from "lucide-react";
import { cn } from "@/lib/utils";
import { PRIORITY_CONFIG } from "@/lib/kanban-constants";
import type { TaskPriority } from "@/types/portal";

interface InlinePriorityPickerProps {
  priority: TaskPriority;
  onPriorityChange: (priority: TaskPriority) => Promise<void>;
  disabled?: boolean;
  compact?: boolean;
}

const PRIORITIES: TaskPriority[] = ["low", "medium", "high", "urgent"];

export function InlinePriorityPicker({
  priority,
  onPriorityChange,
  disabled = false,
  compact = false,
}: InlinePriorityPickerProps) {
  const [open, setOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const config = PRIORITY_CONFIG[priority];

  const handleSelect = async (newPriority: TaskPriority) => {
    if (newPriority === priority) {
      setOpen(false);
      return;
    }

    setIsUpdating(true);
    try {
      await onPriorityChange(newPriority);
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
            "inline-flex items-center gap-1 rounded text-xs font-medium",
            "transition-all duration-150",
            "focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-400",
            compact ? "p-1" : "px-2 py-1",
            config.bg,
            config.text,
            config.hoverBg,
            disabled && "opacity-50 cursor-not-allowed",
            isUpdating && "opacity-70"
          )}
        >
          <Flag className={cn("h-3 w-3", compact ? "" : "mr-0.5")} />
          {!compact && config.label}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-32 p-1" align="start">
        <div className="space-y-0.5">
          {PRIORITIES.map((p) => {
            const pConfig = PRIORITY_CONFIG[p];
            const isSelected = p === priority;
            return (
              <button
                key={p}
                onClick={() => handleSelect(p)}
                className={cn(
                  "w-full flex items-center gap-2 px-2 py-1.5 rounded text-sm",
                  "transition-colors",
                  pConfig.bg,
                  pConfig.text,
                  pConfig.hoverBg,
                  isSelected && "ring-1 ring-inset ring-current"
                )}
              >
                <Flag className="h-3 w-3" />
                <span className="flex-1 text-left">{pConfig.label}</span>
                {isSelected && <Check className="h-3.5 w-3.5" />}
              </button>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
}
