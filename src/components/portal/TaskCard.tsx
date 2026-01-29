"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Calendar, AlertTriangle, Link2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { format, isPast, isToday } from "date-fns";
import type { TaskWithDependencies } from "@/hooks/useTasks";

const priorityColors = {
  low: "bg-slate-100 text-slate-600",
  medium: "bg-blue-100 text-blue-600",
  high: "bg-orange-100 text-orange-600",
  urgent: "bg-red-100 text-red-600",
};

interface TaskCardProps {
  task: TaskWithDependencies;
  onClick?: () => void;
  isDragging?: boolean;
}

export function TaskCard({ task, onClick, isDragging }: TaskCardProps) {
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

  const isOverdue =
    task.due_date &&
    isPast(new Date(task.due_date)) &&
    !isToday(new Date(task.due_date)) &&
    task.status !== "done";

  const isDueToday = task.due_date && isToday(new Date(task.due_date));

  const ownerInitials = task.owner?.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <Card
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={onClick}
      className={cn(
        "cursor-pointer hover:shadow-md transition-shadow",
        isDragging || isSortableDragging ? "opacity-50 shadow-lg" : "",
        isBlocked && "border-red-300 bg-red-50/50"
      )}
    >
      <CardHeader className="p-3 pb-2">
        <div className="flex items-start justify-between gap-2">
          <h4 className="text-sm font-medium leading-tight line-clamp-2">
            {task.title}
          </h4>
          {task.owner && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Avatar className="h-6 w-6 flex-shrink-0">
                  <AvatarImage src={task.owner.avatar_url || undefined} />
                  <AvatarFallback className="text-[10px]">
                    {ownerInitials}
                  </AvatarFallback>
                </Avatar>
              </TooltipTrigger>
              <TooltipContent>{task.owner.name}</TooltipContent>
            </Tooltip>
          )}
        </div>
      </CardHeader>

      <CardContent className="p-3 pt-0 space-y-2">
        {/* Priority & Status badges */}
        <div className="flex flex-wrap gap-1">
          <Badge variant="secondary" className={priorityColors[task.priority]}>
            {task.priority}
          </Badge>

          {isBlocked && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge variant="destructive" className="gap-1">
                  <AlertTriangle className="h-3 w-3" />
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
                <Badge variant="outline" className="gap-1 text-orange-600 border-orange-300">
                  <Link2 className="h-3 w-3" />
                  Blocking
                </Badge>
              </TooltipTrigger>
              <TooltipContent>
                Blocking {task.blocks?.length} task(s)
              </TooltipContent>
            </Tooltip>
          )}
        </div>

        {/* Due date */}
        {task.due_date && (
          <div
            className={cn(
              "flex items-center gap-1 text-xs",
              isOverdue
                ? "text-red-600"
                : isDueToday
                ? "text-orange-600"
                : "text-muted-foreground"
            )}
          >
            <Calendar className="h-3 w-3" />
            <span>
              {isOverdue
                ? "Overdue"
                : isDueToday
                ? "Due today"
                : format(new Date(task.due_date), "MMM d")}
            </span>
          </div>
        )}

        {/* Description preview */}
        {task.description && (
          <p className="text-xs text-muted-foreground line-clamp-2">
            {task.description}
          </p>
        )}
      </CardContent>
    </Card>
  );
}

// Draggable overlay version (no interactions)
export function TaskCardOverlay({ task }: { task: TaskWithDependencies }) {
  return (
    <Card className="cursor-grabbing shadow-xl rotate-3">
      <CardHeader className="p-3 pb-2">
        <h4 className="text-sm font-medium leading-tight line-clamp-2">
          {task.title}
        </h4>
      </CardHeader>
      <CardContent className="p-3 pt-0">
        <Badge variant="secondary" className={priorityColors[task.priority]}>
          {task.priority}
        </Badge>
      </CardContent>
    </Card>
  );
}
