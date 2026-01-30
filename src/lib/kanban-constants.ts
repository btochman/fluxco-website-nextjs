import type { TaskStatus, TaskPriority } from "@/types/portal";

export const STATUS_CONFIG: Record<
  TaskStatus,
  {
    label: string;
    bg: string;
    text: string;
    border: string;
    columnBg: string;
    hoverBg: string;
  }
> = {
  backlog: {
    label: "Backlog",
    bg: "bg-slate-100",
    text: "text-slate-700",
    border: "border-slate-300",
    columnBg: "bg-slate-50/50",
    hoverBg: "hover:bg-slate-200",
  },
  todo: {
    label: "To Do",
    bg: "bg-slate-200",
    text: "text-slate-800",
    border: "border-slate-400",
    columnBg: "bg-slate-100/50",
    hoverBg: "hover:bg-slate-300",
  },
  in_progress: {
    label: "In Progress",
    bg: "bg-blue-100",
    text: "text-blue-700",
    border: "border-blue-400",
    columnBg: "bg-blue-50/50",
    hoverBg: "hover:bg-blue-200",
  },
  review: {
    label: "Review",
    bg: "bg-purple-100",
    text: "text-purple-700",
    border: "border-purple-400",
    columnBg: "bg-purple-50/50",
    hoverBg: "hover:bg-purple-200",
  },
  done: {
    label: "Done",
    bg: "bg-green-100",
    text: "text-green-700",
    border: "border-green-400",
    columnBg: "bg-green-50/50",
    hoverBg: "hover:bg-green-200",
  },
};

export const PRIORITY_CONFIG: Record<
  TaskPriority,
  {
    label: string;
    bg: string;
    text: string;
    hoverBg: string;
  }
> = {
  low: {
    label: "Low",
    bg: "bg-slate-100",
    text: "text-slate-600",
    hoverBg: "hover:bg-slate-200",
  },
  medium: {
    label: "Medium",
    bg: "bg-blue-100",
    text: "text-blue-700",
    hoverBg: "hover:bg-blue-200",
  },
  high: {
    label: "High",
    bg: "bg-orange-100",
    text: "text-orange-700",
    hoverBg: "hover:bg-orange-200",
  },
  urgent: {
    label: "Urgent",
    bg: "bg-red-100",
    text: "text-red-700",
    hoverBg: "hover:bg-red-200",
  },
};

export const KANBAN_COLUMNS: { id: TaskStatus; title: string }[] = [
  { id: "backlog", title: "Backlog" },
  { id: "todo", title: "To Do" },
  { id: "in_progress", title: "In Progress" },
  { id: "review", title: "Review" },
  { id: "done", title: "Done" },
];
