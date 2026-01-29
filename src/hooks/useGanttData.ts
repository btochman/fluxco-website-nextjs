"use client";

import { useMemo } from "react";
import {
  startOfDay,
  addDays,
  differenceInDays,
  endOfWeek,
  endOfMonth,
  eachDayOfInterval,
  eachWeekOfInterval,
  eachMonthOfInterval,
  format,
  min,
  max,
  getWeek,
} from "date-fns";
import type { TaskWithDependencies } from "@/hooks/useTasks";

export type ZoomLevel = "day" | "week" | "month";

export interface DateColumn {
  date: Date;
  label: string;
  isToday: boolean;
  isWeekend: boolean;
}

export interface GanttTask extends TaskWithDependencies {
  barLeft: number;
  barWidth: number;
  row: number;
}

export interface GanttDependency {
  fromTaskId: string;
  toTaskId: string;
  fromTask: GanttTask;
  toTask: GanttTask;
  isComplete: boolean;
}

export interface GanttData {
  tasks: GanttTask[];
  dependencies: GanttDependency[];
  dateColumns: DateColumn[];
  totalWidth: number;
  columnWidth: number;
  startDate: Date;
  endDate: Date;
}

const COLUMN_WIDTHS: Record<ZoomLevel, number> = {
  day: 40,
  week: 120,
  month: 180,
};

/**
 * Topologically sort tasks by dependencies
 * Tasks that block others come before the tasks they block
 */
function sortTasksByDependencies(tasks: TaskWithDependencies[]): TaskWithDependencies[] {
  const taskMap = new Map<string, TaskWithDependencies>();
  const visited = new Set<string>();
  const result: TaskWithDependencies[] = [];

  tasks.forEach((task) => taskMap.set(task.id, task));

  function visit(taskId: string) {
    if (visited.has(taskId)) return;
    visited.add(taskId);

    const task = taskMap.get(taskId);
    if (!task) return;

    // Visit blockers first
    task.blocked_by?.forEach((dep) => {
      visit(dep.blocked_by_id);
    });

    result.push(task);
  }

  tasks.forEach((task) => visit(task.id));

  return result;
}

/**
 * Calculate date range from tasks, with padding
 */
function calculateDateRange(
  tasks: TaskWithDependencies[],
  customStartDate?: Date,
  customEndDate?: Date
): { start: Date; end: Date } {
  const today = startOfDay(new Date());

  if (customStartDate && customEndDate) {
    return { start: customStartDate, end: customEndDate };
  }

  const taskDates: Date[] = [];

  tasks.forEach((task) => {
    if (task.start_date) {
      taskDates.push(new Date(task.start_date));
    }
    if (task.due_date) {
      taskDates.push(new Date(task.due_date));
    }
  });

  if (taskDates.length === 0) {
    // Default to current month if no dates
    return {
      start: customStartDate || addDays(today, -7),
      end: customEndDate || addDays(today, 30),
    };
  }

  const minDate = min(taskDates);
  const maxDate = max(taskDates);

  return {
    start: customStartDate || addDays(minDate, -7),
    end: customEndDate || addDays(maxDate, 14),
  };
}

/**
 * Generate date columns based on zoom level
 */
function generateDateColumns(
  startDate: Date,
  endDate: Date,
  zoomLevel: ZoomLevel
): DateColumn[] {
  const today = startOfDay(new Date());
  const columns: DateColumn[] = [];

  if (zoomLevel === "day") {
    const days = eachDayOfInterval({ start: startDate, end: endDate });
    days.forEach((date) => {
      const dayOfWeek = date.getDay();
      columns.push({
        date,
        label: format(date, "d"),
        isToday: date.getTime() === today.getTime(),
        isWeekend: dayOfWeek === 0 || dayOfWeek === 6,
      });
    });
  } else if (zoomLevel === "week") {
    const weeks = eachWeekOfInterval(
      { start: startDate, end: endDate },
      { weekStartsOn: 1 }
    );
    weeks.forEach((weekStart) => {
      const weekEnd = endOfWeek(weekStart, { weekStartsOn: 1 });
      columns.push({
        date: weekStart,
        label: `W${getWeek(weekStart)}`,
        isToday:
          today >= weekStart && today <= weekEnd,
        isWeekend: false,
      });
    });
  } else {
    const months = eachMonthOfInterval({ start: startDate, end: endDate });
    months.forEach((monthStart) => {
      const monthEnd = endOfMonth(monthStart);
      columns.push({
        date: monthStart,
        label: format(monthStart, "MMM yyyy"),
        isToday:
          today >= monthStart && today <= monthEnd,
        isWeekend: false,
      });
    });
  }

  return columns;
}

/**
 * Calculate bar position for a task
 */
function calculateBarPosition(
  task: TaskWithDependencies,
  startDate: Date,
  columnWidth: number,
  zoomLevel: ZoomLevel
): { left: number; width: number } {
  const taskStart = task.start_date
    ? new Date(task.start_date)
    : task.due_date
    ? addDays(new Date(task.due_date), -1)
    : new Date();

  const taskEnd = task.due_date
    ? new Date(task.due_date)
    : task.start_date
    ? addDays(new Date(task.start_date), 1)
    : addDays(new Date(), 1);

  let left: number;
  let width: number;

  if (zoomLevel === "day") {
    left = differenceInDays(taskStart, startDate) * columnWidth;
    width = Math.max((differenceInDays(taskEnd, taskStart) + 1) * columnWidth, columnWidth);
  } else if (zoomLevel === "week") {
    const daysFromStart = differenceInDays(taskStart, startDate);
    left = (daysFromStart / 7) * columnWidth;
    const taskDays = differenceInDays(taskEnd, taskStart) + 1;
    width = Math.max((taskDays / 7) * columnWidth, columnWidth / 3);
  } else {
    const daysFromStart = differenceInDays(taskStart, startDate);
    left = (daysFromStart / 30) * columnWidth;
    const taskDays = differenceInDays(taskEnd, taskStart) + 1;
    width = Math.max((taskDays / 30) * columnWidth, columnWidth / 4);
  }

  return { left: Math.max(0, left), width };
}

export function useGanttData(
  tasks: TaskWithDependencies[],
  zoomLevel: ZoomLevel = "day",
  customStartDate?: Date,
  customEndDate?: Date
): GanttData {
  return useMemo(() => {
    // Sort tasks by dependencies
    const sortedTasks = sortTasksByDependencies(tasks);

    // Calculate date range
    const { start, end } = calculateDateRange(
      tasks,
      customStartDate,
      customEndDate
    );

    // Generate date columns
    const dateColumns = generateDateColumns(start, end, zoomLevel);
    const columnWidth = COLUMN_WIDTHS[zoomLevel];
    const totalWidth = dateColumns.length * columnWidth;

    // Calculate bar positions and create GanttTasks
    const ganttTasks: GanttTask[] = sortedTasks.map((task, index) => {
      const { left, width } = calculateBarPosition(
        task,
        start,
        columnWidth,
        zoomLevel
      );

      return {
        ...task,
        barLeft: left,
        barWidth: width,
        row: index,
      };
    });

    // Create task map for dependency lookups
    const taskMap = new Map<string, GanttTask>();
    ganttTasks.forEach((task) => taskMap.set(task.id, task));

    // Generate dependencies
    const dependencies: GanttDependency[] = [];
    ganttTasks.forEach((task) => {
      task.blocked_by?.forEach((dep) => {
        const fromTask = taskMap.get(dep.blocked_by_id);
        if (fromTask) {
          dependencies.push({
            fromTaskId: fromTask.id,
            toTaskId: task.id,
            fromTask,
            toTask: task,
            isComplete: fromTask.status === "done",
          });
        }
      });
    });

    return {
      tasks: ganttTasks,
      dependencies,
      dateColumns,
      totalWidth,
      columnWidth,
      startDate: start,
      endDate: end,
    };
  }, [tasks, zoomLevel, customStartDate, customEndDate]);
}
