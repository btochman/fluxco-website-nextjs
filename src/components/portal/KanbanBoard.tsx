"use client";

import { useState, useMemo } from "react";
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragEndEvent,
  type DragOverEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useDroppable } from "@dnd-kit/core";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { ChevronDown, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { TaskCard, TaskCardOverlay } from "./TaskCard";
import { QuickAddTask } from "./kanban/QuickAddTask";
import { STATUS_CONFIG, KANBAN_COLUMNS } from "@/lib/kanban-constants";
import type { TaskWithDependencies } from "@/hooks/useTasks";
import type { TaskStatus } from "@/types/portal";

interface KanbanBoardProps {
  tasks: TaskWithDependencies[];
  projectId: string;
  onTaskClick: (task: TaskWithDependencies) => void;
  onTaskMove: (taskId: string, newStatus: TaskStatus) => void;
}

export function KanbanBoard({
  tasks,
  projectId,
  onTaskClick,
  onTaskMove,
}: KanbanBoardProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [overId, setOverId] = useState<string | null>(null);
  const [collapsedColumns, setCollapsedColumns] = useState<Set<TaskStatus>>(new Set());

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const tasksByStatus = useMemo(() => {
    const grouped: Record<TaskStatus, TaskWithDependencies[]> = {
      backlog: [],
      todo: [],
      in_progress: [],
      review: [],
      done: [],
    };

    tasks.forEach((task) => {
      if (grouped[task.status as TaskStatus]) {
        grouped[task.status as TaskStatus].push(task);
      }
    });

    // Sort each column by position
    Object.keys(grouped).forEach((status) => {
      grouped[status as TaskStatus].sort((a, b) => a.position - b.position);
    });

    return grouped;
  }, [tasks]);

  // Progress calculation
  const totalTasks = tasks.length;
  const doneTasks = tasks.filter((t) => t.status === "done").length;
  const progress = totalTasks > 0 ? (doneTasks / totalTasks) * 100 : 0;

  const activeTask = activeId ? tasks.find((t) => t.id === activeId) : null;

  const toggleColumnCollapse = (columnId: TaskStatus) => {
    setCollapsedColumns((prev) => {
      const next = new Set(prev);
      if (next.has(columnId)) {
        next.delete(columnId);
      } else {
        next.add(columnId);
      }
      return next;
    });
  };

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { over } = event;
    setOverId(over?.id as string | null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    setActiveId(null);
    setOverId(null);

    if (!over) return;

    const activeTask = tasks.find((t) => t.id === active.id);
    if (!activeTask) return;

    // Check if dropped on a column
    const targetColumn = KANBAN_COLUMNS.find((col) => col.id === over.id);
    if (targetColumn && activeTask.status !== targetColumn.id) {
      onTaskMove(activeTask.id, targetColumn.id);
      return;
    }

    // Check if dropped on another task
    const overTask = tasks.find((t) => t.id === over.id);
    if (overTask && activeTask.status !== overTask.status) {
      onTaskMove(activeTask.id, overTask.status as TaskStatus);
    }
  };

  return (
    <div className="space-y-4">
      {/* Progress bar */}
      {totalTasks > 0 && (
        <div className="flex items-center gap-4 px-1">
          <Progress value={progress} className="flex-1 h-2" />
          <span className="text-sm text-muted-foreground whitespace-nowrap">
            {doneTasks}/{totalTasks} completed
          </span>
        </div>
      )}

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="flex gap-3 h-[calc(100vh-280px)] min-h-[400px] overflow-x-auto pb-4">
          {KANBAN_COLUMNS.map((column) => (
            <KanbanColumn
              key={column.id}
              column={column}
              tasks={tasksByStatus[column.id]}
              projectId={projectId}
              onTaskClick={onTaskClick}
              isOver={overId === column.id}
              isCollapsed={collapsedColumns.has(column.id)}
              onToggleCollapse={() => toggleColumnCollapse(column.id)}
            />
          ))}
        </div>

        <DragOverlay>
          {activeTask && <TaskCardOverlay task={activeTask} />}
        </DragOverlay>
      </DndContext>
    </div>
  );
}

interface KanbanColumnProps {
  column: { id: TaskStatus; title: string };
  tasks: TaskWithDependencies[];
  projectId: string;
  onTaskClick: (task: TaskWithDependencies) => void;
  isOver: boolean;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

function KanbanColumn({
  column,
  tasks,
  projectId,
  onTaskClick,
  isOver,
  isCollapsed,
  onToggleCollapse,
}: KanbanColumnProps) {
  const { setNodeRef, isOver: isOverColumn } = useDroppable({
    id: column.id,
  });

  const config = STATUS_CONFIG[column.id];

  if (isCollapsed) {
    return (
      <div
        ref={setNodeRef}
        onClick={onToggleCollapse}
        className={cn(
          "flex-shrink-0 w-12 flex flex-col items-center py-3 rounded-lg cursor-pointer",
          "bg-muted/50 hover:bg-muted transition-colors",
          (isOver || isOverColumn) && "ring-2 ring-blue-400"
        )}
      >
        <div className={cn("w-2 h-2 rounded-full mb-2", config.bg)} />
        <span className="text-xs font-medium text-muted-foreground [writing-mode:vertical-lr] rotate-180">
          {column.title}
        </span>
        <span className="text-xs text-muted-foreground mt-2 bg-background px-1.5 py-0.5 rounded">
          {tasks.length}
        </span>
        <ChevronRight className="h-4 w-4 text-muted-foreground mt-2" />
      </div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "flex-shrink-0 w-72 flex flex-col rounded-lg overflow-hidden",
        "bg-muted/30 border border-border/50",
        (isOver || isOverColumn) && "ring-2 ring-blue-400 ring-offset-2"
      )}
    >
      {/* Color bar at top */}
      <div className={cn("h-1", config.bg)} />

      {/* Column Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-border/50">
        <div className="flex items-center gap-2">
          <button
            onClick={onToggleCollapse}
            className="p-0.5 hover:bg-muted rounded"
          >
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          </button>
          <h3 className={cn("font-medium text-sm", config.text)}>{column.title}</h3>
          <span className="text-xs text-muted-foreground bg-background px-1.5 py-0.5 rounded">
            {tasks.length}
          </span>
        </div>
      </div>

      {/* Tasks */}
      <ScrollArea className="flex-1">
        <div className="p-2 space-y-2">
          <SortableContext
            items={tasks.map((t) => t.id)}
            strategy={verticalListSortingStrategy}
          >
            {tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                projectId={projectId}
                onOpenDetails={() => onTaskClick(task)}
              />
            ))}
          </SortableContext>

          {tasks.length === 0 && (
            <div className="text-center py-8 text-sm text-muted-foreground">
              No tasks
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Quick Add at bottom */}
      <div className="border-t border-border/50 p-1">
        <QuickAddTask projectId={projectId} status={column.id} />
      </div>
    </div>
  );
}
