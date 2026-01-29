"use client";

import { useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Loader2, CalendarIcon, X, Link2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface Project {
  id: string;
  name: string;
  color: string;
}

interface Task {
  id: string;
  title: string;
  project_id: string;
  status: string;
}

interface CreateTaskDialogProps {
  projectId: string;
  projects: Project[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function CreateTaskDialog({
  projectId,
  projects,
  open,
  onOpenChange,
  onSuccess,
}: CreateTaskDialogProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedProjectId, setSelectedProjectId] = useState(projectId);
  const [priority, setPriority] = useState<"low" | "medium" | "high" | "urgent">("medium");
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [selectedDependencies, setSelectedDependencies] = useState<string[]>([]);
  const queryClient = useQueryClient();

  // Reset form when dialog opens/closes
  useEffect(() => {
    if (open) {
      setSelectedProjectId(projectId);
    } else {
      setTitle("");
      setDescription("");
      setPriority("medium");
      setStartDate(null);
      setDueDate(null);
      setSelectedDependencies([]);
    }
  }, [open, projectId]);

  // Fetch existing tasks for dependency selection
  const { data: existingTasks = [] } = useQuery({
    queryKey: ["all-tasks-for-deps"],
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from("portal_tasks")
        .select("id, title, project_id, status")
        .neq("status", "done")
        .order("title");
      if (error) throw error;
      return data as Task[];
    },
    enabled: open,
  });

  const createTask = useMutation({
    mutationFn: async () => {
      // Get max position for backlog in this project
      const { data: existingPositions } = await (supabase as any)
        .from("portal_tasks")
        .select("position")
        .eq("project_id", selectedProjectId)
        .eq("status", "backlog")
        .order("position", { ascending: false })
        .limit(1);

      const maxPosition = existingPositions?.[0]?.position ?? -1;

      // Create the task
      const { data: newTask, error: taskError } = await (supabase as any)
        .from("portal_tasks")
        .insert({
          project_id: selectedProjectId,
          title,
          description: description || null,
          status: "backlog",
          priority,
          position: maxPosition + 1,
          start_date: startDate ? startDate.toISOString().split("T")[0] : null,
          due_date: dueDate ? dueDate.toISOString().split("T")[0] : null,
        })
        .select()
        .single();

      if (taskError) throw taskError;

      // Add dependencies if any selected
      if (selectedDependencies.length > 0) {
        const dependencies = selectedDependencies.map((blockedById) => ({
          task_id: newTask.id,
          blocked_by_id: blockedById,
        }));

        const { error: depError } = await (supabase as any)
          .from("portal_task_dependencies")
          .insert(dependencies);

        if (depError) {
          console.error("Error adding dependencies:", depError);
          // Don't throw - task was created successfully
        }
      }

      return newTask;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["all-tasks"] });
      queryClient.invalidateQueries({ queryKey: ["all-tasks-for-deps"] });
      toast.success("Task created");
      onOpenChange(false);
      onSuccess?.();
    },
    onError: (error) => {
      console.error("Error creating task:", error);
      toast.error("Failed to create task");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error("Title is required");
      return;
    }
    createTask.mutate();
  };

  const toggleDependency = (taskId: string) => {
    setSelectedDependencies((prev) =>
      prev.includes(taskId)
        ? prev.filter((id) => id !== taskId)
        : [...prev, taskId]
    );
  };

  const availableDependencies = existingTasks.filter(
    (t) => t.project_id === selectedProjectId
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Task</DialogTitle>
          <DialogDescription>Add a new task to track work</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="Task title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              autoFocus
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Add details..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Phase</Label>
              <Select value={selectedProjectId} onValueChange={setSelectedProjectId}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {projects.map((project) => (
                    <SelectItem key={project.id} value={project.id}>
                      <div className="flex items-center gap-2">
                        <div
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: project.color }}
                        />
                        {project.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Priority</Label>
              <Select value={priority} onValueChange={(v) => setPriority(v as typeof priority)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Start Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !startDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? format(startDate, "MMM d, yyyy") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={startDate || undefined}
                    onSelect={(date) => setStartDate(date || null)}
                    initialFocus
                  />
                  {startDate && (
                    <div className="p-2 border-t">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="w-full"
                        onClick={() => setStartDate(null)}
                      >
                        <X className="mr-2 h-4 w-4" />
                        Clear
                      </Button>
                    </div>
                  )}
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label>Due Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !dueDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dueDate ? format(dueDate, "MMM d, yyyy") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={dueDate || undefined}
                    onSelect={(date) => setDueDate(date || null)}
                    initialFocus
                  />
                  {dueDate && (
                    <div className="p-2 border-t">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="w-full"
                        onClick={() => setDueDate(null)}
                      >
                        <X className="mr-2 h-4 w-4" />
                        Clear
                      </Button>
                    </div>
                  )}
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Dependencies */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Link2 className="h-4 w-4 text-muted-foreground" />
              <Label>Blocked By (Dependencies)</Label>
            </div>
            <p className="text-xs text-muted-foreground">
              Select tasks that must be completed before this one can start
            </p>
            {availableDependencies.length > 0 ? (
              <div className="border rounded-md p-2 max-h-32 overflow-y-auto space-y-1">
                {availableDependencies.map((task) => (
                  <div
                    key={task.id}
                    className={cn(
                      "flex items-center gap-2 p-2 rounded cursor-pointer hover:bg-muted",
                      selectedDependencies.includes(task.id) && "bg-muted"
                    )}
                    onClick={() => toggleDependency(task.id)}
                  >
                    <input
                      type="checkbox"
                      checked={selectedDependencies.includes(task.id)}
                      onChange={() => toggleDependency(task.id)}
                      className="pointer-events-none"
                    />
                    <span className="text-sm truncate flex-1">{task.title}</span>
                    <Badge variant="outline" className="text-xs">
                      {task.status.replace("_", " ")}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground italic">
                No other tasks in this phase yet
              </p>
            )}
            {selectedDependencies.length > 0 && (
              <p className="text-xs text-muted-foreground">
                {selectedDependencies.length} task(s) selected
              </p>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={createTask.isPending}>
              {createTask.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Task
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
