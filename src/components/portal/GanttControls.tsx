"use client";

import { format, addMonths, subMonths } from "date-fns";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Crosshair } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ZoomLevel } from "@/hooks/useGanttData";

interface GanttControlsProps {
  zoomLevel: ZoomLevel;
  onZoomLevelChange: (level: ZoomLevel) => void;
  startDate: Date;
  endDate: Date;
  onStartDateChange: (date: Date) => void;
  onEndDateChange: (date: Date) => void;
  onTodayClick: () => void;
}

export function GanttControls({
  zoomLevel,
  onZoomLevelChange,
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  onTodayClick,
}: GanttControlsProps) {
  const handlePrevious = () => {
    if (zoomLevel === "day") {
      onStartDateChange(subMonths(startDate, 1));
      onEndDateChange(subMonths(endDate, 1));
    } else if (zoomLevel === "week") {
      onStartDateChange(subMonths(startDate, 2));
      onEndDateChange(subMonths(endDate, 2));
    } else {
      onStartDateChange(subMonths(startDate, 3));
      onEndDateChange(subMonths(endDate, 3));
    }
  };

  const handleNext = () => {
    if (zoomLevel === "day") {
      onStartDateChange(addMonths(startDate, 1));
      onEndDateChange(addMonths(endDate, 1));
    } else if (zoomLevel === "week") {
      onStartDateChange(addMonths(startDate, 2));
      onEndDateChange(addMonths(endDate, 2));
    } else {
      onStartDateChange(addMonths(startDate, 3));
      onEndDateChange(addMonths(endDate, 3));
    }
  };

  return (
    <div className="flex items-center justify-between gap-4 p-3 bg-white border-b">
      <div className="flex items-center gap-2">
        {/* Zoom Level Selector */}
        <Select value={zoomLevel} onValueChange={(v) => onZoomLevelChange(v as ZoomLevel)}>
          <SelectTrigger className="w-[100px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="day">Day</SelectItem>
            <SelectItem value="week">Week</SelectItem>
            <SelectItem value="month">Month</SelectItem>
          </SelectContent>
        </Select>

        {/* Navigation buttons */}
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="icon"
            className="h-9 w-9"
            onClick={handlePrevious}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-9 w-9"
            onClick={handleNext}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Today button */}
        <Button variant="outline" onClick={onTodayClick} className="gap-2">
          <Crosshair className="h-4 w-4" />
          Today
        </Button>
      </div>

      {/* Date Range */}
      <div className="flex items-center gap-2 text-sm">
        <span className="text-muted-foreground">From:</span>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-[140px] justify-start text-left font-normal",
                !startDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {startDate ? format(startDate, "MMM d, yyyy") : "Pick a date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end">
            <Calendar
              mode="single"
              selected={startDate}
              onSelect={(date) => date && onStartDateChange(date)}
              initialFocus
            />
          </PopoverContent>
        </Popover>

        <span className="text-muted-foreground">To:</span>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-[140px] justify-start text-left font-normal",
                !endDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {endDate ? format(endDate, "MMM d, yyyy") : "Pick a date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end">
            <Calendar
              mode="single"
              selected={endDate}
              onSelect={(date) => date && onEndDateChange(date)}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
