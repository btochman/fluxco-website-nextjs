"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

/**
 * Hook to add a dependency between tasks.
 * Creates a record indicating that taskId is blocked by blockedById.
 */
export function useAddDependency(projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      taskId,
      blockedById,
    }: {
      taskId: string;
      blockedById: string;
    }) => {
      const dependency = {
        task_id: taskId,
        blocked_by_id: blockedById,
      };

      const { data, error } = await (supabase as any)
        .from("portal_task_dependencies")
        .insert(dependency)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, { taskId }) => {
      // Invalidate both the project tasks list and the individual task
      queryClient.invalidateQueries({ queryKey: ["tasks", projectId] });
      queryClient.invalidateQueries({ queryKey: ["task", taskId] });
    },
  });
}

/**
 * Hook to remove a dependency between tasks.
 * Removes the record indicating that taskId is blocked by blockedById.
 */
export function useRemoveDependency(projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      taskId,
      blockedById,
    }: {
      taskId: string;
      blockedById: string;
    }) => {
      const { error } = await (supabase as any)
        .from("portal_task_dependencies")
        .delete()
        .eq("task_id", taskId)
        .eq("blocked_by_id", blockedById);

      if (error) throw error;
    },
    onSuccess: (_, { taskId }) => {
      // Invalidate both the project tasks list and the individual task
      queryClient.invalidateQueries({ queryKey: ["tasks", projectId] });
      queryClient.invalidateQueries({ queryKey: ["task", taskId] });
    },
  });
}

/**
 * Hook to remove a dependency by its ID.
 */
export function useRemoveDependencyById(projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (dependencyId: string) => {
      const { error } = await (supabase as any)
        .from("portal_task_dependencies")
        .delete()
        .eq("id", dependencyId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", projectId] });
    },
  });
}
