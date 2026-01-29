"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { TaskComment, TeamMember } from "@/types/portal";

export interface CommentWithAuthor extends TaskComment {
  author: Pick<TeamMember, "id" | "name" | "avatar_url"> | null;
}

export function useComments(taskId: string) {
  return useQuery({
    queryKey: ["comments", taskId],
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from("portal_task_comments")
        .select(`
          *,
          author:team_members!portal_task_comments_author_id_fkey (
            id,
            name,
            avatar_url
          )
        `)
        .eq("task_id", taskId)
        .order("created_at", { ascending: true });

      if (error) throw error;
      return data as CommentWithAuthor[];
    },
    enabled: !!taskId,
    staleTime: 30 * 1000,
  });
}

export function useCreateComment(taskId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      content,
      authorId,
    }: {
      content: string;
      authorId: string;
    }) => {
      const { data, error } = await (supabase as any)
        .from("portal_task_comments")
        .insert({
          task_id: taskId,
          author_id: authorId,
          content,
        })
        .select(`
          *,
          author:team_members!portal_task_comments_author_id_fkey (
            id,
            name,
            avatar_url
          )
        `)
        .single();

      if (error) throw error;
      return data as CommentWithAuthor;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", taskId] });
    },
  });
}

export function useDeleteComment(taskId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (commentId: string) => {
      const { error } = await (supabase as any)
        .from("portal_task_comments")
        .delete()
        .eq("id", commentId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", taskId] });
    },
  });
}
