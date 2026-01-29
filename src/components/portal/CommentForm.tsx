"use client";

import { useState } from "react";
import { Loader2, Send } from "lucide-react";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useCreateComment } from "@/hooks/useComments";

interface CommentFormProps {
  taskId: string;
  authorId: string;
}

export function CommentForm({ taskId, authorId }: CommentFormProps) {
  const [content, setContent] = useState("");
  const createComment = useCreateComment(taskId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedContent = content.trim();
    if (!trimmedContent) return;

    try {
      await createComment.mutateAsync({
        content: trimmedContent,
        authorId,
      });
      setContent("");
      toast.success("Comment added");
    } catch (error) {
      toast.error("Failed to add comment");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Submit on Cmd/Ctrl + Enter
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const isSubmitting = createComment.isPending;
  const canSubmit = content.trim().length > 0 && !isSubmitting;

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <Textarea
        placeholder="Add a comment..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={isSubmitting}
        className="resize-none min-h-[80px]"
        rows={3}
      />
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">
          Press Cmd+Enter to submit
        </span>
        <Button type="submit" size="sm" disabled={!canSubmit}>
          {isSubmitting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              <Send className="h-4 w-4 mr-1" />
              Comment
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
