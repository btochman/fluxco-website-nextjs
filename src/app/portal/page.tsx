"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, FolderKanban, Users, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import { toast } from "sonner";

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
  due_date: string | null;
}

interface TeamMember {
  id: string;
  name: string;
  email: string;
  user_id: string | null;
}

export default function PortalDashboard() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [currentMember, setCurrentMember] = useState<TeamMember | null>(null);
  const [viewMode, setViewMode] = useState<"company" | "my-tasks">("company");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        // Get or create team member record (cast to any since types haven't been regenerated)
        let { data: member } = await (supabase as any)
          .from("team_members")
          .select("*")
          .eq("email", user.email)
          .single();

        if (!member && user.email) {
          // Create team member if doesn't exist
          const { data: newMember } = await (supabase as any)
            .from("team_members")
            .insert({
              user_id: user.id,
              email: user.email,
              name: user.email.split("@")[0],
            })
            .select()
            .single();
          member = newMember;
        }

        setCurrentMember(member);
      }

      // Load projects (cast to any since types haven't been regenerated)
      const { data: projectsData, error: projectsError } = await (supabase as any)
        .from("portal_projects")
        .select("*")
        .order("position", { ascending: true });

      if (projectsError) throw projectsError;
      setProjects(projectsData || []);

      // Load tasks
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
    let filtered = tasks.filter((t) => t.project_id === projectId);
    if (viewMode === "my-tasks" && currentMember) {
      filtered = filtered.filter((t) => t.owner_id === currentMember.id);
    }
    return filtered;
  };

  const getTaskStats = (projectTasks: Task[]) => {
    const total = projectTasks.length;
    const done = projectTasks.filter((t) => t.status === "done").length;
    const inProgress = projectTasks.filter((t) => t.status === "in_progress").length;
    const blocked = projectTasks.filter((t) => t.status === "blocked").length;
    return { total, done, inProgress, blocked };
  };

  const allTasks = viewMode === "my-tasks" && currentMember
    ? tasks.filter((t) => t.owner_id === currentMember.id)
    : tasks;

  const totalStats = {
    total: allTasks.length,
    done: allTasks.filter((t) => t.status === "done").length,
    inProgress: allTasks.filter((t) => t.status === "in_progress").length,
    blocked: allTasks.filter((t) => t.status === "blocked").length,
  };

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
          <h1 className="text-2xl font-bold">Project Dashboard</h1>
          <p className="text-muted-foreground">
            Track deliverables across all company phases
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as "company" | "my-tasks")}>
            <TabsList>
              <TabsTrigger value="company" className="gap-2">
                <Users className="h-4 w-4" />
                Company
              </TabsTrigger>
              <TabsTrigger value="my-tasks" className="gap-2">
                <CheckCircle2 className="h-4 w-4" />
                My Tasks
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{totalStats.total}</div>
            <p className="text-xs text-muted-foreground">Total Tasks</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-green-600">{totalStats.done}</div>
            <p className="text-xs text-muted-foreground">Completed</p>
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
            <div className="text-2xl font-bold text-red-600">{totalStats.blocked}</div>
            <p className="text-xs text-muted-foreground">Blocked</p>
          </CardContent>
        </Card>
      </div>

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
                      {stats.blocked > 0 && (
                        <div className="flex items-center gap-1 text-red-600">
                          <AlertCircle className="h-3 w-3" />
                          {stats.blocked} blocked
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}

        {/* Add Project Card */}
        <Card className="border-dashed hover:border-primary/50 transition-colors cursor-pointer flex items-center justify-center min-h-[180px]">
          <CardContent className="flex flex-col items-center gap-2 text-muted-foreground">
            <Plus className="h-8 w-8" />
            <span>Add Phase</span>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
