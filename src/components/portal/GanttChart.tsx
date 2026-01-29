"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { startOfDay, addDays, differenceInDays } from "date-fns";
import { cn } from "@/lib/utils";
import { useGanttData, type ZoomLevel } from "@/hooks/useGanttData";
import { GanttHeader } from "./GanttHeader";
import { GanttBar, ROW_HEIGHT } from "./GanttBar";
import { GanttDependencyLayer } from "./GanttDependencyLine";
import { GanttControls } from "./GanttControls";
import type { TaskWithDependencies } from "@/hooks/useTasks";

const TASK_PANEL_WIDTH = 250;

interface GanttChartProps {
  tasks: TaskWithDependencies[];
  onTaskClick: (task: TaskWithDependencies) => void;
  startDate?: Date;
  endDate?: Date;
  zoomLevel?: ZoomLevel;
}

export function GanttChart({
  tasks,
  onTaskClick,
  startDate: initialStartDate,
  endDate: initialEndDate,
  zoomLevel: initialZoomLevel = "day",
}: GanttChartProps) {
  const [zoomLevel, setZoomLevel] = useState<ZoomLevel>(initialZoomLevel);
  const [customStartDate, setCustomStartDate] = useState<Date | undefined>(
    initialStartDate
  );
  const [customEndDate, setCustomEndDate] = useState<Date | undefined>(
    initialEndDate
  );

  const timelineRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const ganttData = useGanttData(tasks, zoomLevel, customStartDate, customEndDate);
  const { tasks: ganttTasks, dependencies, dateColumns, totalWidth, columnWidth, startDate, endDate } = ganttData;

  const totalHeight = ganttTasks.length * ROW_HEIGHT + 20;

  // Scroll to today on mount
  const scrollToToday = useCallback(() => {
    if (scrollContainerRef.current) {
      const today = startOfDay(new Date());
      const daysFromStart = differenceInDays(today, startDate);

      let scrollPosition: number;
      if (zoomLevel === "day") {
        scrollPosition = daysFromStart * columnWidth - 200;
      } else if (zoomLevel === "week") {
        scrollPosition = (daysFromStart / 7) * columnWidth - 200;
      } else {
        scrollPosition = (daysFromStart / 30) * columnWidth - 200;
      }

      scrollContainerRef.current.scrollLeft = Math.max(0, scrollPosition);
    }
  }, [startDate, zoomLevel, columnWidth]);

  // Scroll to today on initial load
  useEffect(() => {
    const timer = setTimeout(scrollToToday, 100);
    return () => clearTimeout(timer);
  }, [scrollToToday]);

  const handleTodayClick = () => {
    // Reset to auto date range centered on today
    const today = startOfDay(new Date());
    setCustomStartDate(addDays(today, -14));
    setCustomEndDate(addDays(today, 30));

    // Scroll to today after a brief delay to let the data update
    setTimeout(scrollToToday, 100);
  };

  // Calculate today line position
  const today = startOfDay(new Date());
  const todayOffset = (() => {
    const daysFromStart = differenceInDays(today, startDate);
    if (zoomLevel === "day") {
      return daysFromStart * columnWidth + columnWidth / 2;
    } else if (zoomLevel === "week") {
      return (daysFromStart / 7) * columnWidth;
    } else {
      return (daysFromStart / 30) * columnWidth;
    }
  })();

  const showTodayLine = todayOffset >= 0 && todayOffset <= totalWidth;

  if (tasks.length === 0) {
    return (
      <div className="h-full flex items-center justify-center text-muted-foreground">
        <div className="text-center">
          <p className="text-lg font-medium">No tasks with dates</p>
          <p className="text-sm mt-1">
            Add start and due dates to tasks to see them in the Gantt chart
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-white rounded-lg border overflow-hidden">
      {/* Controls */}
      <GanttControls
        zoomLevel={zoomLevel}
        onZoomLevelChange={setZoomLevel}
        startDate={startDate}
        endDate={endDate}
        onStartDateChange={setCustomStartDate}
        onEndDateChange={setCustomEndDate}
        onTodayClick={handleTodayClick}
      />

      {/* Main content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Task names panel (fixed) */}
        <div
          className="flex-shrink-0 border-r bg-white z-20"
          style={{ width: TASK_PANEL_WIDTH }}
        >
          {/* Header */}
          <div className="h-[52px] border-b bg-slate-50 flex items-center px-3">
            <span className="font-medium text-sm text-slate-600">Task</span>
          </div>

          {/* Task list */}
          <div className="overflow-y-auto" style={{ height: `calc(100% - 52px)` }}>
            {ganttTasks.map((task) => (
              <div
                key={task.id}
                className={cn(
                  "flex items-center px-3 border-b cursor-pointer",
                  "hover:bg-slate-50 transition-colors"
                )}
                style={{ height: ROW_HEIGHT }}
                onClick={() => onTaskClick(task)}
              >
                <span className="text-sm truncate">{task.title}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Timeline panel (scrollable) */}
        <div className="flex-1 overflow-hidden">
          <div
            ref={scrollContainerRef}
            className="h-full overflow-auto"
          >
            <div style={{ width: totalWidth, minWidth: "100%" }}>
              {/* Date headers */}
              <GanttHeader
                dateColumns={dateColumns}
                columnWidth={columnWidth}
                zoomLevel={zoomLevel}
              />

              {/* Timeline grid and bars */}
              <div
                ref={timelineRef}
                className="relative"
                style={{ height: totalHeight }}
              >
                {/* Grid lines */}
                <div className="absolute inset-0 flex">
                  {dateColumns.map((column, index) => (
                    <div
                      key={index}
                      className={cn(
                        "flex-shrink-0 border-r h-full",
                        column.isToday && "bg-blue-50/50",
                        column.isWeekend && !column.isToday && "bg-slate-50/50"
                      )}
                      style={{ width: columnWidth }}
                    />
                  ))}
                </div>

                {/* Row lines */}
                <div className="absolute inset-0">
                  {ganttTasks.map((_, index) => (
                    <div
                      key={index}
                      className="border-b border-slate-100"
                      style={{ height: ROW_HEIGHT }}
                    />
                  ))}
                </div>

                {/* Today marker line */}
                {showTodayLine && (
                  <div
                    className="absolute top-0 bottom-0 w-0.5 bg-blue-500 z-10"
                    style={{ left: todayOffset }}
                  >
                    <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-blue-500 rounded-full" />
                  </div>
                )}

                {/* Dependency lines */}
                <GanttDependencyLayer
                  dependencies={dependencies}
                  width={totalWidth}
                  height={totalHeight}
                />

                {/* Task bars */}
                {ganttTasks.map((task) => (
                  <GanttBar
                    key={task.id}
                    task={task}
                    onClick={() => onTaskClick(task)}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
