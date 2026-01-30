"use client";

import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCreateTask } from "@/hooks/useTasks";
import type { TaskStatus } from "@/types/portal";

interface QuickAddTaskProps {
  projectId: string;
  status: TaskStatus;
  onTaskCreated?: () => void;
}

export function QuickAddTask({ projectId, status, onTaskCreated }: QuickAddTaskProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const createTask = useCreateTask(projectId);

  useEffect(() => {
    if (isAdding && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isAdding]);

  const handleCreate = async () => {
    if (!title.trim()) {
      setIsAdding(false);
      setTitle("");
      return;
    }

    try {
      await createTask.mutateAsync({
        title: title.trim(),
        status,
        priority: "medium",
        description: null,
        owner_id: null,
        start_date: null,
        due_date: null,
        estimated_hours: null,
      });
      setTitle("");
      onTaskCreated?.();
      // Keep input open for adding more tasks
      inputRef.current?.focus();
    } catch (error) {
      console.error("Failed to create task:", error);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleCreate();
    }
    if (e.key === "Escape") {
      setIsAdding(false);
      setTitle("");
    }
  };

  if (!isAdding) {
    return (
      <button
        onClick={() => setIsAdding(true)}
        className={cn(
          "w-full p-2 text-sm text-muted-foreground",
          "hover:bg-muted/50 hover:text-foreground rounded-lg",
          "flex items-center gap-2 transition-colors"
        )}
      >
        <Plus className="h-4 w-4" />
        Add task
      </button>
    );
  }

  return (
    <div className="p-1">
      <Input
        ref={inputRef}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={() => {
          if (!title.trim()) {
            setIsAdding(false);
          }
        }}
        placeholder="Task title... (Enter to add)"
        className="text-sm h-9"
        disabled={createTask.isPending}
      />
    </div>
  );
}
