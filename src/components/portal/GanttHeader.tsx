"use client";

import { cn } from "@/lib/utils";
import { format } from "date-fns";
import type { DateColumn, ZoomLevel } from "@/hooks/useGanttData";

interface GanttHeaderProps {
  dateColumns: DateColumn[];
  columnWidth: number;
  zoomLevel: ZoomLevel;
}

export function GanttHeader({
  dateColumns,
  columnWidth,
  zoomLevel,
}: GanttHeaderProps) {
  // Group columns by month for day/week view header
  const monthGroups =
    zoomLevel === "day" || zoomLevel === "week"
      ? groupByMonth(dateColumns)
      : null;

  return (
    <div className="sticky top-0 z-10 bg-white border-b">
      {/* Month row for day/week zoom */}
      {monthGroups && (
        <div className="flex border-b bg-slate-50">
          {monthGroups.map((group, index) => (
            <div
              key={`month-${index}`}
              className="text-xs font-medium text-slate-600 px-2 py-1 border-r last:border-r-0 truncate"
              style={{ width: group.count * columnWidth }}
            >
              {group.label}
            </div>
          ))}
        </div>
      )}

      {/* Date columns row */}
      <div className="flex">
        {dateColumns.map((column, index) => (
          <div
            key={index}
            className={cn(
              "flex-shrink-0 text-center text-xs py-2 border-r last:border-r-0",
              column.isToday && "bg-blue-50 font-semibold text-blue-600",
              column.isWeekend && !column.isToday && "bg-slate-50 text-slate-400"
            )}
            style={{ width: columnWidth }}
          >
            {zoomLevel === "day" && (
              <div>
                <div className="text-[10px] text-slate-400 uppercase">
                  {format(column.date, "EEE")}
                </div>
                <div>{column.label}</div>
              </div>
            )}
            {zoomLevel === "week" && <div>{column.label}</div>}
            {zoomLevel === "month" && (
              <div className="font-medium">{column.label}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

interface MonthGroup {
  label: string;
  count: number;
}

function groupByMonth(columns: DateColumn[]): MonthGroup[] {
  const groups: MonthGroup[] = [];
  let currentMonth = "";
  let currentCount = 0;

  columns.forEach((column) => {
    const monthLabel = format(column.date, "MMMM yyyy");
    if (monthLabel !== currentMonth) {
      if (currentMonth) {
        groups.push({ label: currentMonth, count: currentCount });
      }
      currentMonth = monthLabel;
      currentCount = 1;
    } else {
      currentCount++;
    }
  });

  if (currentMonth) {
    groups.push({ label: currentMonth, count: currentCount });
  }

  return groups;
}
