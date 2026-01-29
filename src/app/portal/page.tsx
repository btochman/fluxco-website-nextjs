"use client";

import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Users } from "lucide-react";
import { toast } from "sonner";
import { format, differenceInDays, startOfDay, addDays, parseISO, isValid } from "date-fns";
import { CreateTaskDialog } from "@/components/portal/CreateTaskDialog";
import { TaskDialog } from "@/components/portal/TaskDialog";
import { TooltipProvider } from "@/components/ui/tooltip";

interface Project {
  id: string;
  name: string;
  description: string | null;
  color: string;
  status: string;
  position: number;
}

interface TeamMember {
  id: string;
  name: string;
  email: string;
  avatar_url: string | null;
}

interface Task {
  id: string;
  title: string;
  description: string | null;
  status: string;
  priority: string;
  project_id: string;
  owner_id: string | null;
  start_date: string | null;
  due_date: string | null;
  estimated_hours: number | null;
  position: number;
}

export default function PortalDashboard() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateTask, setShowCreateTask] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [ownerFilter, setOwnerFilter] = useState<string>("all");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [projectsRes, tasksRes, membersRes] = await Promise.all([
        (supabase as any).from("portal_projects").select("*").order("position"),
        (supabase as any).from("portal_tasks").select("*").order("position"),
        (supabase as any).from("team_members").select("*").order("name"),
      ]);

      if (projectsRes.error) throw projectsRes.error;
      if (tasksRes.error) throw tasksRes.error;

      setProjects(projectsRes.data || []);
      setTasks(tasksRes.data || []);
      setTeamMembers(membersRes.data || []);
    } catch (error) {
      console.error("Error loading data:", error);
      toast.error("Failed to load data");
    } finally {
      setIsLoading(false);
    }
  };

  // Filter tasks by owner
  const filteredTasks = useMemo(() => {
    if (ownerFilter === "all") return tasks;
    if (ownerFilter === "unassigned") return tasks.filter(t => !t.owner_id);
    return tasks.filter(t => t.owner_id === ownerFilter);
  }, [tasks, ownerFilter]);

  // Stats for filtered tasks
  const stats = useMemo(() => ({
    total: filteredTasks.length,
    done: filteredTasks.filter(t => t.status === "done").length,
    inProgress: filteredTasks.filter(t => t.status === "in_progress").length,
    todo: filteredTasks.filter(t => ["todo", "backlog"].includes(t.status)).length,
  }), [filteredTasks]);

  // Gantt chart data
  const ganttData = useMemo(() => {
    const tasksWithDates = filteredTasks.filter(t => t.start_date || t.due_date);
    if (tasksWithDates.length === 0) return null;

    const today = startOfDay(new Date());
    let minDate = today;
    let maxDate = addDays(today, 90);

    tasksWithDates.forEach(task => {
      if (task.start_date) {
        const start = parseISO(task.start_date);
        if (isValid(start) && start < minDate) minDate = start;
      }
      if (task.due_date) {
        const end = parseISO(task.due_date);
        if (isValid(end) && end > maxDate) maxDate = end;
      }
    });

    minDate = addDays(minDate, -7);
    maxDate = addDays(maxDate, 14);
    const totalDays = differenceInDays(maxDate, minDate);

    return { minDate, maxDate, totalDays, tasksWithDates };
  }, [filteredTasks]);

  const handleCreateTask = () => {
    if (projects.length > 0) {
      setSelectedProjectId(projects[0].id);
      setShowCreateTask(true);
    }
  };

  const handleTaskCreated = () => {
    loadData();
    setShowCreateTask(false);
    setSelectedProjectId(null);
  };

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
  };

  const handleTaskSave = async (taskData: any) => {
    if (!selectedTask) return;
    try {
      const { error } = await (supabase as any)
        .from("portal_tasks")
        .update({
          title: taskData.title,
          description: taskData.description,
          status: taskData.status,
          priority: taskData.priority,
          owner_id: taskData.owner_id,
          start_date: taskData.start_date?.toISOString().split("T")[0] || null,
          due_date: taskData.due_date?.toISOString().split("T")[0] || null,
          estimated_hours: taskData.estimated_hours,
        })
        .eq("id", selectedTask.id);

      if (error) throw error;
      toast.success("Task updated");
      setSelectedTask(null);
      loadData();
    } catch (error) {
      console.error("Error saving task:", error);
      toast.error("Failed to save task");
    }
  };

  const handleTaskDelete = async () => {
    if (!selectedTask) return;
    try {
      const { error } = await (supabase as any)
        .from("portal_tasks")
        .delete()
        .eq("id", selectedTask.id);

      if (error) throw error;
      toast.success("Task deleted");
      setSelectedTask(null);
      loadData();
    } catch (error) {
      console.error("Error deleting task:", error);
      toast.error("Failed to delete task");
    }
  };

  const getProjectById = (id: string) => projects.find(p => p.id === id);
  const getOwnerName = (ownerId: string | null) => {
    if (!ownerId) return null;
    return teamMembers.find(m => m.id === ownerId)?.name || null;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">FluxCo Task Tracker</h1>
            <p className="text-muted-foreground">
              {ownerFilter === "all" ? "All tasks" : ownerFilter === "unassigned" ? "Unassigned tasks" : `${getOwnerName(ownerFilter)}'s tasks`}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Owner Filter */}
            <Select value={ownerFilter} onValueChange={setOwnerFilter}>
              <SelectTrigger className="w-48">
                <Users className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by owner" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Tasks</SelectItem>
                <SelectItem value="unassigned">Unassigned</SelectItem>
                {teamMembers.map(member => (
                  <SelectItem key={member.id} value={member.id}>
                    {member.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button onClick={handleCreateTask} className="gap-2">
              <Plus className="h-4 w-4" />
              Add Task
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-xs text-muted-foreground">Total</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-slate-600">{stats.todo}</div>
              <p className="text-xs text-muted-foreground">To Do</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-blue-600">{stats.inProgress}</div>
              <p className="text-xs text-muted-foreground">In Progress</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-green-600">{stats.done}</div>
              <p className="text-xs text-muted-foreground">Done</p>
            </CardContent>
          </Card>
        </div>

        {/* Timeline */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            {ganttData && ganttData.tasksWithDates.length > 0 ? (
              <div className="overflow-x-auto">
                <div className="min-w-[700px]">
                  {/* Timeline header */}
                  <div className="flex border-b pb-2 mb-3 text-xs text-muted-foreground">
                    <div className="w-64 flex-shrink-0 font-medium">Task</div>
                    <div className="flex-1 flex justify-between px-2">
                      <span>{format(ganttData.minDate, "MMM d")}</span>
                      <span className="text-blue-600 font-medium">Today</span>
                      <span>{format(ganttData.maxDate, "MMM d")}</span>
                    </div>
                  </div>

                  {/* Tasks grouped by phase */}
                  {projects.map(project => {
                    const projectTasks = ganttData.tasksWithDates.filter(t => t.project_id === project.id);
                    if (projectTasks.length === 0) return null;

                    return (
                      <div key={project.id} className="mb-2">
                        {/* Phase divider */}
                        <div className="flex items-center gap-2 py-1 mb-1">
                          <div
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: project.color }}
                          />
                          <span className="text-xs text-muted-foreground">
                            {project.name}
                          </span>
                          <div className="flex-1 h-px bg-border" />
                        </div>

                        {/* Tasks */}
                        {projectTasks.map(task => {
                          const start = task.start_date ? parseISO(task.start_date) : null;
                          const end = task.due_date ? parseISO(task.due_date) : null;
                          const taskStart = start && isValid(start) ? start : end;
                          const taskEnd = end && isValid(end) ? end : start;
                          if (!taskStart || !taskEnd) return null;

                          const startOffset = differenceInDays(taskStart, ganttData.minDate);
                          const duration = Math.max(1, differenceInDays(taskEnd, taskStart) + 1);
                          const todayOffset = (differenceInDays(new Date(), ganttData.minDate) / ganttData.totalDays) * 100;
                          const ownerName = getOwnerName(task.owner_id);

                          return (
                            <div
                              key={task.id}
                              className="flex items-center py-1.5 hover:bg-muted/30 rounded cursor-pointer"
                              onClick={() => handleTaskClick(task)}
                            >
                              <div className="w-64 flex-shrink-0 pr-3">
                                <div className="text-sm font-medium truncate">{task.title}</div>
                                {ownerName && (
                                  <div className="text-xs text-muted-foreground truncate">{ownerName}</div>
                                )}
                              </div>
                              <div className="flex-1 h-7 relative mx-2">
                                {/* Today marker */}
                                <div
                                  className="absolute top-0 bottom-0 w-0.5 bg-blue-500/40"
                                  style={{ left: `${todayOffset}%` }}
                                />
                                {/* Task bar */}
                                <div
                                  className="absolute top-1 bottom-1 rounded flex items-center px-2 text-xs text-white font-medium overflow-hidden shadow-sm"
                                  style={{
                                    left: `${(startOffset / ganttData.totalDays) * 100}%`,
                                    width: `${Math.max((duration / ganttData.totalDays) * 100, 6)}%`,
                                    backgroundColor: project.color,
                                    opacity: task.status === "done" ? 0.5 : 1,
                                  }}
                                >
                                  <span className="truncate">{task.title}</span>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <p className="text-lg font-medium">No tasks with dates</p>
                <p className="text-sm mt-1">Add start and due dates to tasks to see them here</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Task List (tasks without dates) */}
        {filteredTasks.filter(t => !t.start_date && !t.due_date).length > 0 && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Tasks Without Dates</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                {filteredTasks
                  .filter(t => !t.start_date && !t.due_date)
                  .map(task => {
                    const project = getProjectById(task.project_id);
                    const ownerName = getOwnerName(task.owner_id);
                    return (
                      <div
                        key={task.id}
                        className="flex items-center gap-3 py-2 px-3 hover:bg-muted/30 rounded cursor-pointer"
                        onClick={() => handleTaskClick(task)}
                      >
                        <div
                          className="w-2 h-2 rounded-full flex-shrink-0"
                          style={{ backgroundColor: project?.color || "#888" }}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium truncate">{task.title}</div>
                          <div className="text-xs text-muted-foreground">
                            {project?.name}
                            {ownerName && ` · ${ownerName}`}
                          </div>
                        </div>
                        <span className={`text-xs px-2 py-0.5 rounded ${
                          task.status === "done" ? "bg-green-100 text-green-700" :
                          task.status === "in_progress" ? "bg-blue-100 text-blue-700" :
                          "bg-slate-100 text-slate-700"
                        }`}>
                          {task.status.replace("_", " ")}
                        </span>
                      </div>
                    );
                  })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Create Task Dialog */}
        {selectedProjectId && (
          <CreateTaskDialog
            projectId={selectedProjectId}
            projects={projects}
            open={showCreateTask}
            onOpenChange={(open) => {
              setShowCreateTask(open);
              if (!open) setSelectedProjectId(null);
            }}
            onSuccess={handleTaskCreated}
          />
        )}

        {/* Edit Task Dialog */}
        {selectedTask && (
          <TaskDialog
            open={!!selectedTask}
            onOpenChange={(open) => !open && setSelectedTask(null)}
            task={{
              ...selectedTask,
              status: selectedTask.status as "backlog" | "todo" | "in_progress" | "review" | "done",
              priority: selectedTask.priority as "low" | "medium" | "high" | "urgent",
              blocked_by: [],
              blocks: [],
              completed_at: null,
              created_at: "",
              updated_at: "",
            }}
            projectId={selectedTask.project_id}
            onSave={handleTaskSave}
            onDelete={handleTaskDelete}
          />
        )}
      </div>
    </TooltipProvider>
  );
}
