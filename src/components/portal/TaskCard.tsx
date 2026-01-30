"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { AlertTriangle, Link2, MessageCircle, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  InlineTextEdit,
  InlineStatusPicker,
  InlinePriorityPicker,
  InlineOwnerPicker,
  InlineDatePicker,
} from "./inline-editors";
import { useUpdateTask, useTeamMembers, type TaskWithDependencies } from "@/hooks/useTasks";
import type { TaskStatus, TaskPriority } from "@/types/portal";

interface TaskCardProps {
  task: TaskWithDependencies;
  projectId: string;
  onOpenDetails?: () => void;
  isDragging?: boolean;
}

export function TaskCard({ task, projectId, onOpenDetails, isDragging }: TaskCardProps) {
  const updateTask = useUpdateTask(projectId);
  const { data: teamMembers = [] } = useTeamMembers();

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const isBlocked =
    task.blocked_by &&
    task.blocked_by.length > 0 &&
    task.status !== "done";

  const blocksOthers = task.blocks && task.blocks.length > 0;
  const isDone = task.status === "done";

  // Handlers for inline edits
  const handleTitleSave = async (title: string) => {
    await updateTask.mutateAsync({ taskId: task.id, updates: { title } });
  };

  const handleStatusChange = async (status: TaskStatus) => {
    await updateTask.mutateAsync({ taskId: task.id, updates: { status } });
  };

  const handlePriorityChange = async (priority: TaskPriority) => {
    await updateTask.mutateAsync({ taskId: task.id, updates: { priority } });
  };

  const handleOwnerChange = async (owner_id: string | null) => {
    await updateTask.mutateAsync({ taskId: task.id, updates: { owner_id } });
  };

  const handleDueDateChange = async (date: Date | null) => {
    await updateTask.mutateAsync({
      taskId: task.id,
      updates: { due_date: date?.toISOString().split("T")[0] || null },
    });
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={cn(
        "group transition-all duration-200",
        "hover:shadow-md hover:border-muted-foreground/20",
        isDragging || isSortableDragging ? "opacity-50 shadow-lg scale-[1.02]" : "",
        isBlocked && "border-l-4 border-l-red-400 bg-red-50/30",
        isDone && "opacity-60"
      )}
    >
      {/* Header: Drag handle + Title + Avatar */}
      <div className="flex items-start gap-2 p-3 pb-2">
        {/* Drag handle area */}
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing pt-0.5 -ml-1 px-1 touch-none"
        >
          <MoreHorizontal className="h-4 w-4 text-muted-foreground/40 hover:text-muted-foreground" />
        </div>

        {/* Title */}
        <div className="flex-1 min-w-0">
          <InlineTextEdit
            value={task.title}
            onSave={handleTitleSave}
            className={cn(
              "text-sm font-medium leading-tight",
              isDone && "line-through text-muted-foreground"
            )}
          />
        </div>

        {/* Owner Avatar */}
        <InlineOwnerPicker
          owner={task.owner || null}
          onOwnerChange={handleOwnerChange}
          teamMembers={teamMembers}
        />
      </div>

      {/* Body: Status, Priority, Date */}
      <div className="flex flex-wrap items-center gap-2 px-3 pb-2">
        <InlineStatusPicker
          status={task.status as TaskStatus}
          onStatusChange={handleStatusChange}
        />
        <InlinePriorityPicker
          priority={task.priority as TaskPriority}
          onPriorityChange={handlePriorityChange}
          compact
        />
        <InlineDatePicker
          date={task.due_date ? new Date(task.due_date) : null}
          onDateChange={handleDueDateChange}
        />
      </div>

      {/* Footer: Dependency indicators + Details button */}
      <div className="flex items-center justify-between px-3 pb-2 pt-1 border-t border-border/50">
        <div className="flex items-center gap-1">
          {isBlocked && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge variant="destructive" className="gap-1 text-[10px] px-1.5 py-0">
                  <AlertTriangle className="h-2.5 w-2.5" />
                  Blocked
                </Badge>
              </TooltipTrigger>
              <TooltipContent>
                Blocked by {task.blocked_by?.length} task(s)
              </TooltipContent>
            </Tooltip>
          )}

          {blocksOthers && !isBlocked && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge variant="outline" className="gap-1 text-[10px] px-1.5 py-0 text-orange-600 border-orange-300">
                  <Link2 className="h-2.5 w-2.5" />
                  Blocking
                </Badge>
              </TooltipTrigger>
              <TooltipContent>
                Blocking {task.blocks?.length} task(s)
              </TooltipContent>
            </Tooltip>
          )}
        </div>

        {/* Details button */}
        {onOpenDetails && (
          <Button
            variant="ghost"
            size="sm"
            className="h-6 px-2 text-xs text-muted-foreground hover:text-foreground"
            onClick={(e) => {
              e.stopPropagation();
              onOpenDetails();
            }}
          >
            <MessageCircle className="h-3 w-3 mr-1" />
            Details
          </Button>
        )}
      </div>
    </Card>
  );
}

// Draggable overlay version (no interactions, visual only)
export function TaskCardOverlay({ task }: { task: TaskWithDependencies }) {
  const isDone = task.status === "done";

  return (
    <Card className="cursor-grabbing shadow-xl rotate-2 scale-105 border-primary/50">
      <div className="p-3 pb-2">
        <h4 className={cn(
          "text-sm font-medium leading-tight line-clamp-2",
          isDone && "line-through text-muted-foreground"
        )}>
          {task.title}
        </h4>
      </div>
      <div className="flex flex-wrap items-center gap-2 px-3 pb-3">
        <span className={cn(
          "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium",
          task.status === "done" && "bg-green-100 text-green-700",
          task.status === "in_progress" && "bg-blue-100 text-blue-700",
          task.status === "review" && "bg-purple-100 text-purple-700",
          (task.status === "todo" || task.status === "backlog") && "bg-slate-100 text-slate-700"
        )}>
          {task.status.replace("_", " ")}
        </span>
      </div>
    </Card>
  );
}
