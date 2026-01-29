"use client";

import { useState } from "react";
import { format, formatDistanceToNow } from "date-fns";
import { Trash2, MessageCircle } from "lucide-react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";
import { useComments, useDeleteComment, type CommentWithAuthor } from "@/hooks/useComments";

interface CommentThreadProps {
  taskId: string;
  currentUserId?: string;
}

export function CommentThread({ taskId, currentUserId }: CommentThreadProps) {
  const { data: comments, isLoading } = useComments(taskId);
  const deleteComment = useDeleteComment(taskId);
  const [commentToDelete, setCommentToDelete] = useState<string | null>(null);

  const handleDeleteConfirm = async () => {
    if (!commentToDelete) return;

    try {
      await deleteComment.mutateAsync(commentToDelete);
      toast.success("Comment deleted");
    } catch (error) {
      toast.error("Failed to delete comment");
    } finally {
      setCommentToDelete(null);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const formatTimestamp = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    // If less than 24 hours ago, show relative time
    if (diffInHours < 24) {
      return formatDistanceToNow(date, { addSuffix: true });
    }

    // Otherwise show full date and time
    return format(date, "MMM d, yyyy 'at' h:mm a");
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8 text-muted-foreground">
        Loading comments...
      </div>
    );
  }

  if (!comments || comments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
        <MessageCircle className="h-8 w-8 mb-2 opacity-50" />
        <p className="text-sm">No comments yet</p>
        <p className="text-xs">Be the first to add a comment</p>
      </div>
    );
  }

  return (
    <>
      <ScrollArea className="h-[200px] pr-4">
        <div className="space-y-4">
          {comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              isOwnComment={comment.author_id === currentUserId}
              onDelete={() => setCommentToDelete(comment.id)}
              formatTimestamp={formatTimestamp}
              getInitials={getInitials}
            />
          ))}
        </div>
      </ScrollArea>

      <AlertDialog
        open={!!commentToDelete}
        onOpenChange={(open) => !open && setCommentToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Comment</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this comment? This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

interface CommentItemProps {
  comment: CommentWithAuthor;
  isOwnComment: boolean;
  onDelete: () => void;
  formatTimestamp: (date: string) => string;
  getInitials: (name: string) => string;
}

function CommentItem({
  comment,
  isOwnComment,
  onDelete,
  formatTimestamp,
  getInitials,
}: CommentItemProps) {
  return (
    <div className="group flex gap-3">
      <Avatar className="h-8 w-8 shrink-0">
        <AvatarImage src={comment.author?.avatar_url || undefined} />
        <AvatarFallback className="text-xs">
          {comment.author?.name ? getInitials(comment.author.name) : "?"}
        </AvatarFallback>
      </Avatar>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-medium text-sm truncate">
            {comment.author?.name || "Unknown"}
          </span>
          <span className="text-xs text-muted-foreground">
            {formatTimestamp(comment.created_at)}
          </span>
          {isOwnComment && (
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity ml-auto"
              onClick={onDelete}
            >
              <Trash2 className="h-3 w-3 text-muted-foreground hover:text-destructive" />
            </Button>
          )}
        </div>
        <p className="text-sm text-foreground whitespace-pre-wrap break-words mt-1">
          {comment.content}
        </p>
      </div>
    </div>
  );
}
