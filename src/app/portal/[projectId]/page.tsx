"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, LayoutGrid, GanttChart as GanttIcon, Plus, Users, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { KanbanBoard } from "@/components/portal/KanbanBoard";
import { GanttChart } from "@/components/portal/GanttChart";
import { TaskDialog } from "@/components/portal/TaskDialog";
import { useTasks, useCreateTask, useUpdateTask, useDeleteTask, type TaskWithDependencies } from "@/hooks/useTasks";
import type { Project, TeamMember, TaskStatus } from "@/types/portal";

interface PageProps {
  params: Promise<{ projectId: string }>;
}

export default function ProjectDetailPage({ params }: PageProps) {
  const { projectId } = use(params);
  const router = useRouter();
  const [project, setProject] = useState<Project | null>(null);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [currentMember, setCurrentMember] = useState<TeamMember | null>(null);
  const [viewMode, setViewMode] = useState<"company" | "my-tasks">("company");
  const [viewType, setViewType] = useState<"kanban" | "gantt">("kanban");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTask, setSelectedTask] = useState<TaskWithDependencies | null>(null);
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);
  const [newTaskStatus, setNewTaskStatus] = useState<TaskStatus>("backlog");

  // Use the tasks hook
  const { data: tasks = [], isLoading: tasksLoading, refetch: refetchTasks } = useTasks(projectId);
  const createTask = useCreateTask(projectId);
  const updateTask = useUpdateTask(projectId);
  const deleteTask = useDeleteTask(projectId);

  useEffect(() => {
    loadProjectData();
  }, [projectId]);

  const loadProjectData = async () => {
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();

      // Load project (cast to any since types haven't been regenerated yet)
      const { data: projectData, error: projectError } = await (supabase as any)
        .from("portal_projects")
        .select("*")
        .eq("id", projectId)
        .single();

      if (projectError) throw projectError;
      setProject(projectData);

      // Load team members
      const { data: membersData } = await (supabase as any)
        .from("team_members")
        .select("*");
      setTeamMembers(membersData || []);

      // Find current member
      if (user?.email && membersData) {
        const member = membersData.find((m: TeamMember) => m.email === user.email);
        setCurrentMember(member || null);
      }
    } catch (error) {
      console.error("Error loading project:", error);
      toast.error("Failed to load project");
      router.push("/portal");
    } finally {
      setIsLoading(false);
    }
  };

  const handleTaskMove = async (taskId: string, newStatus: TaskStatus) => {
    try {
      await updateTask.mutateAsync({ taskId, updates: { status: newStatus } });
    } catch (error) {
      console.error("Error moving task:", error);
      toast.error("Failed to move task");
    }
  };

  const handleAddTask = (status: TaskStatus) => {
    setNewTaskStatus(status);
    setSelectedTask(null);
    setIsTaskDialogOpen(true);
  };

  const handleTaskSave = async (taskData: any) => {
    try {
      // Extract only the fields that can be updated
      const { owner, blocked_by, blocks, ...updates } = taskData;

      if (selectedTask) {
        await updateTask.mutateAsync({ taskId: selectedTask.id, updates });
        toast.success("Task updated");
      } else {
        await createTask.mutateAsync({
          ...updates,
          status: newTaskStatus,
        });
        toast.success("Task created");
      }
      setIsTaskDialogOpen(false);
      setSelectedTask(null);
    } catch (error) {
      console.error("Error saving task:", error);
      toast.error("Failed to save task");
    }
  };

  const handleTaskDelete = async () => {
    if (!selectedTask) return;
    try {
      await deleteTask.mutateAsync(selectedTask.id);
      toast.success("Task deleted");
      setIsTaskDialogOpen(false);
      setSelectedTask(null);
    } catch (error) {
      console.error("Error deleting task:", error);
      toast.error("Failed to delete task");
    }
  };

  const filteredTasks = viewMode === "my-tasks" && currentMember
    ? tasks.filter((t) => t.owner_id === currentMember.id)
    : tasks;

  if (isLoading || tasksLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-pulse text-muted-foreground">Loading project...</div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Project not found</p>
        <Link href="/portal">
          <Button variant="link">Back to Dashboard</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/portal">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div className="flex items-center gap-3">
            <div
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: project.color }}
            />
            <h1 className="text-2xl font-bold">{project.name}</h1>
          </div>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {/* View Mode Toggle */}
          <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as "company" | "my-tasks")}>
            <TabsList>
              <TabsTrigger value="company" className="gap-2">
                <Users className="h-4 w-4" />
                <span className="hidden sm:inline">Company</span>
              </TabsTrigger>
              <TabsTrigger value="my-tasks" className="gap-2">
                <CheckCircle2 className="h-4 w-4" />
                <span className="hidden sm:inline">My Tasks</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {/* View Type Toggle */}
          <Tabs value={viewType} onValueChange={(v) => setViewType(v as "kanban" | "gantt")}>
            <TabsList>
              <TabsTrigger value="kanban" className="gap-2">
                <LayoutGrid className="h-4 w-4" />
                <span className="hidden sm:inline">Kanban</span>
              </TabsTrigger>
              <TabsTrigger value="gantt" className="gap-2">
                <GanttIcon className="h-4 w-4" />
                <span className="hidden sm:inline">Timeline</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <Button
            onClick={() => handleAddTask("backlog")}
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Task
          </Button>
        </div>
      </div>

      {/* Description */}
      {project.description && (
        <p className="text-muted-foreground">{project.description}</p>
      )}

      {/* Content */}
      {viewType === "kanban" ? (
        <KanbanBoard
          tasks={filteredTasks}
          onTaskClick={(task) => {
            setSelectedTask(task);
            setIsTaskDialogOpen(true);
          }}
          onTaskMove={handleTaskMove}
          onAddTask={handleAddTask}
        />
      ) : (
        <GanttChart
          tasks={filteredTasks}
          onTaskClick={(task) => {
            setSelectedTask(task);
            setIsTaskDialogOpen(true);
          }}
        />
      )}

      {/* Task Dialog */}
      <TaskDialog
        open={isTaskDialogOpen}
        onOpenChange={setIsTaskDialogOpen}
        task={selectedTask}
        allTasks={tasks}
        projectId={projectId}
        defaultStatus={newTaskStatus}
        onSave={handleTaskSave}
        onDelete={selectedTask ? handleTaskDelete : undefined}
      />
    </div>
  );
}
