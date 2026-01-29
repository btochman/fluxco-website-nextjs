"use client";

import type { GanttDependency } from "@/hooks/useGanttData";
import { ROW_HEIGHT } from "./GanttBar";

const BAR_HEIGHT = 28; // h-7 = 28px

interface GanttDependencyLineProps {
  dependency: GanttDependency;
}

export function GanttDependencyLine({ dependency }: GanttDependencyLineProps) {
  const { fromTask, toTask, isComplete } = dependency;

  // Calculate start point (end of blocking task bar)
  const startX = fromTask.barLeft + fromTask.barWidth;
  const startY = fromTask.row * ROW_HEIGHT + 6 + BAR_HEIGHT / 2;

  // Calculate end point (start of blocked task bar)
  const endX = toTask.barLeft;
  const endY = toTask.row * ROW_HEIGHT + 6 + BAR_HEIGHT / 2;

  // Create a path that goes from the end of the first bar to the start of the second
  // Using a curved path for better visualization
  const controlOffset = Math.min(Math.abs(endX - startX) / 3, 30);

  // If the blocked task is to the left of the blocking task (overlap scenario)
  // we need a different path
  const isOverlap = endX < startX + 10;

  let pathD: string;

  if (isOverlap) {
    // Path goes around: right, down/up, left, to target
    const verticalOffset = 15;
    const yDirection = endY > startY ? 1 : -1;

    pathD = `
      M ${startX} ${startY}
      H ${startX + 15}
      V ${startY + (Math.abs(endY - startY) / 2 + verticalOffset) * yDirection}
      H ${endX - 15}
      V ${endY}
      H ${endX}
    `;
  } else {
    // Simple curved path
    pathD = `
      M ${startX} ${startY}
      C ${startX + controlOffset} ${startY},
        ${endX - controlOffset} ${endY},
        ${endX} ${endY}
    `;
  }

  return (
    <g>
      {/* Main path */}
      <path
        d={pathD}
        fill="none"
        stroke={isComplete ? "#9ca3af" : "#ef4444"}
        strokeWidth={isComplete ? 1.5 : 2}
        strokeDasharray={isComplete ? "4 2" : "none"}
        className="transition-colors"
      />

      {/* Arrow marker at the end */}
      <polygon
        points={`${endX},${endY} ${endX - 6},${endY - 4} ${endX - 6},${endY + 4}`}
        fill={isComplete ? "#9ca3af" : "#ef4444"}
        className="transition-colors"
      />

      {/* Start dot */}
      <circle
        cx={startX}
        cy={startY}
        r={3}
        fill={isComplete ? "#9ca3af" : "#ef4444"}
        className="transition-colors"
      />
    </g>
  );
}

interface GanttDependencyLayerProps {
  dependencies: GanttDependency[];
  width: number;
  height: number;
}

export function GanttDependencyLayer({
  dependencies,
  width,
  height,
}: GanttDependencyLayerProps) {
  if (dependencies.length === 0) return null;

  return (
    <svg
      className="absolute inset-0 pointer-events-none"
      width={width}
      height={height}
      style={{ overflow: "visible" }}
    >
      <defs>
        {/* Arrow marker definition */}
        <marker
          id="arrowhead-red"
          markerWidth="6"
          markerHeight="6"
          refX="5"
          refY="3"
          orient="auto"
        >
          <polygon points="0 0, 6 3, 0 6" fill="#ef4444" />
        </marker>
        <marker
          id="arrowhead-gray"
          markerWidth="6"
          markerHeight="6"
          refX="5"
          refY="3"
          orient="auto"
        >
          <polygon points="0 0, 6 3, 0 6" fill="#9ca3af" />
        </marker>
      </defs>

      {dependencies.map((dep) => (
        <GanttDependencyLine key={`${dep.fromTaskId}-${dep.toTaskId}`} dependency={dep} />
      ))}
    </svg>
  );
}
