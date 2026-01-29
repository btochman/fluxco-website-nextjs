"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Calendar, ChevronRight, Plus } from "lucide-react";
import { toast } from "sonner";
import { format, differenceInDays, startOfDay, addDays, parseISO, isValid } from "date-fns";
import { CreateTaskDialog } from "@/components/portal/CreateTaskDialog";

interface Project {
  id: string;
  name: string;
  description: string | null;
  color: string;
  status: string;
  position: number;
}

interface Task {
  id: string;
  title: string;
  status: string;
  priority: string;
  project_id: string;
  owner_id: string | null;
  start_date: string | null;
  due_date: string | null;
}

export default function PortalDashboard() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateTask, setShowCreateTask] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // Load projects
      const { data: projectsData, error: projectsError } = await (supabase as any)
        .from("portal_projects")
        .select("*")
        .order("position", { ascending: true });

      if (projectsError) throw projectsError;
      setProjects(projectsData || []);

      // Load tasks with dates
      const { data: tasksData, error: tasksError } = await (supabase as any)
        .from("portal_tasks")
        .select("*");

      if (tasksError) throw tasksError;
      setTasks(tasksData || []);
    } catch (error) {
      console.error("Error loading data:", error);
      toast.error("Failed to load data");
    } finally {
      setIsLoading(false);
    }
  };

  const getTasksByProject = (projectId: string) => {
    return tasks.filter((t) => t.project_id === projectId);
  };

  const getTaskStats = (projectTasks: Task[]) => {
    const total = projectTasks.length;
    const done = projectTasks.filter((t) => t.status === "done").length;
    const inProgress = projectTasks.filter((t) => t.status === "in_progress").length;
    const todo = projectTasks.filter((t) => t.status === "todo" || t.status === "backlog").length;
    return { total, done, inProgress, todo };
  };

  const totalStats = {
    total: tasks.length,
    done: tasks.filter((t) => t.status === "done").length,
    inProgress: tasks.filter((t) => t.status === "in_progress").length,
    todo: tasks.filter((t) => t.status === "todo" || t.status === "backlog").length,
  };

  const handleCreateTask = (projectId: string) => {
    setSelectedProjectId(projectId);
    setShowCreateTask(true);
  };

  const handleTaskCreated = () => {
    loadData();
    setShowCreateTask(false);
    setSelectedProjectId(null);
  };

  // Calculate Gantt chart data
  const ganttData = useMemo(() => {
    const tasksWithDates = tasks.filter(t => t.start_date || t.due_date);
    if (tasksWithDates.length === 0) return null;

    const today = startOfDay(new Date());
    let minDate = today;
    let maxDate = addDays(today, 90); // Default 3 month view

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

    // Add padding
    minDate = addDays(minDate, -7);
    maxDate = addDays(maxDate, 14);

    const totalDays = differenceInDays(maxDate, minDate);

    return { minDate, maxDate, totalDays, tasksWithDates };
  }, [tasks]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-pulse text-muted-foreground">Loading projects...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">FluxCo Task Tracker</h1>
          <p className="text-muted-foreground">
            Manage tasks across all company phases
          </p>
        </div>

        <div className="flex gap-2">
          {projects.length > 0 && (
            <Button onClick={() => handleCreateTask(projects[0].id)} className="gap-2">
              <Plus className="h-4 w-4" />
              Add Task
            </Button>
          )}
          <Link href="/portal/timeline">
            <Button variant="outline" className="gap-2">
              <Calendar className="h-4 w-4" />
              Timeline
            </Button>
          </Link>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{totalStats.total}</div>
            <p className="text-xs text-muted-foreground">Total Tasks</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-blue-600">{totalStats.inProgress}</div>
            <p className="text-xs text-muted-foreground">In Progress</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-green-600">{totalStats.done}</div>
            <p className="text-xs text-muted-foreground">Completed</p>
          </CardContent>
        </Card>
      </div>

      {/* Summary Gantt Chart */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Project Timeline</CardTitle>
            <Link href="/portal/timeline">
              <Button variant="ghost" size="sm" className="gap-1 text-muted-foreground">
                View Full Timeline
                <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          {ganttData && ganttData.tasksWithDates.length > 0 ? (
            <div className="overflow-x-auto">
              <div className="min-w-[600px]">
                {/* Timeline header */}
                <div className="flex border-b pb-2 mb-3 text-xs text-muted-foreground">
                  <div className="w-56 flex-shrink-0 font-medium">Task</div>
                  <div className="flex-1 flex justify-between px-2">
                    <span>{format(ganttData.minDate, "MMM d")}</span>
                    <span className="text-blue-600 font-medium">Today</span>
                    <span>{format(ganttData.maxDate, "MMM d")}</span>
                  </div>
                </div>

                {/* Tasks grouped by phase */}
                {projects.map((project) => {
                  const projectTasks = tasks.filter(t => t.project_id === project.id);
                  const tasksWithDates = projectTasks.filter(t => t.start_date || t.due_date);

                  if (tasksWithDates.length === 0) return null;

                  return (
                    <div key={project.id} className="mb-1">
                      {/* Phase divider - subtle */}
                      <div className="flex items-center gap-2 py-1 mb-1">
                        <div
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: project.color }}
                        />
                        <span className="text-xs text-muted-foreground font-medium">
                          {project.name}
                        </span>
                        <div className="flex-1 h-px bg-border" />
                      </div>

                      {/* All tasks in this phase */}
                      {tasksWithDates.map((task) => {
                        const start = task.start_date ? parseISO(task.start_date) : null;
                        const end = task.due_date ? parseISO(task.due_date) : null;
                        const taskStart = start && isValid(start) ? start : end;
                        const taskEnd = end && isValid(end) ? end : start;

                        if (!taskStart || !taskEnd) return null;

                        const startOffset = differenceInDays(taskStart, ganttData.minDate);
                        const duration = Math.max(1, differenceInDays(taskEnd, taskStart) + 1);
                        const todayOffset = (differenceInDays(new Date(), ganttData.minDate) / ganttData.totalDays) * 100;

                        return (
                          <div key={task.id} className="flex items-center py-1 hover:bg-muted/30 rounded group">
                            <div className="w-56 flex-shrink-0 text-sm truncate pr-2">
                              {task.title}
                            </div>
                            <div className="flex-1 h-6 relative mx-2">
                              {/* Today marker */}
                              <div
                                className="absolute top-0 bottom-0 w-0.5 bg-blue-500/50"
                                style={{ left: `${todayOffset}%` }}
                              />
                              {/* Task bar */}
                              <div
                                className="absolute top-1 bottom-1 rounded flex items-center px-2 text-xs text-white font-medium overflow-hidden"
                                style={{
                                  left: `${(startOffset / ganttData.totalDays) * 100}%`,
                                  width: `${Math.max((duration / ganttData.totalDays) * 100, 8)}%`,
                                  backgroundColor: project.color,
                                  opacity: task.status === "done" ? 0.5 : 1,
                                }}
                              >
                                <span className="truncate drop-shadow-sm">
                                  {task.title}
                                </span>
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
            <div className="text-center py-8 text-muted-foreground">
              <Calendar className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>No tasks with dates yet</p>
              <p className="text-sm">Add start and due dates to tasks to see the timeline</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Project Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => {
          const projectTasks = getTasksByProject(project.id);
          const stats = getTaskStats(projectTasks);
          const progress = stats.total > 0 ? Math.round((stats.done / stats.total) * 100) : 0;

          return (
            <Link key={project.id} href={`/portal/${project.id}`}>
              <Card className="hover:border-primary/50 transition-colors cursor-pointer h-full">
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: project.color }}
                      />
                      <CardTitle className="text-lg">{project.name}</CardTitle>
                    </div>
                    <Badge variant={project.status === "active" ? "default" : "secondary"}>
                      {project.status}
                    </Badge>
                  </div>
                  {project.description && (
                    <CardDescription className="line-clamp-2">
                      {project.description}
                    </CardDescription>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {/* Progress bar */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>{progress}% complete</span>
                        <span>{stats.done}/{stats.total} tasks</span>
                      </div>
                      <div className="h-2 bg-secondary rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary transition-all"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>

                    {/* Task counts */}
                    <div className="flex gap-4 text-sm">
                      {stats.inProgress > 0 && (
                        <div className="flex items-center gap-1 text-blue-600">
                          <Clock className="h-3 w-3" />
                          {stats.inProgress} active
                        </div>
                      )}
                      {stats.todo > 0 && (
                        <div className="flex items-center gap-1 text-muted-foreground">
                          {stats.todo} to do
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

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
    </div>
  );
}
