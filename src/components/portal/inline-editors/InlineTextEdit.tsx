"use client";

import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Pencil } from "lucide-react";
import { cn } from "@/lib/utils";

interface InlineTextEditProps {
  value: string;
  onSave: (value: string) => Promise<void>;
  placeholder?: string;
  className?: string;
  multiline?: boolean;
  maxLength?: number;
}

export function InlineTextEdit({
  value,
  onSave,
  placeholder = "Click to edit...",
  className,
  multiline = false,
  maxLength,
}: InlineTextEditProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const [isSaving, setIsSaving] = useState(false);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  // Sync draft with value when not editing
  useEffect(() => {
    if (!isEditing) {
      setDraft(value);
    }
  }, [value, isEditing]);

  // Auto-focus when entering edit mode
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleSave = async () => {
    const trimmed = draft.trim();
    if (trimmed !== value && trimmed !== "") {
      setIsSaving(true);
      try {
        await onSave(trimmed);
      } finally {
        setIsSaving(false);
      }
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setDraft(value);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !multiline) {
      e.preventDefault();
      handleSave();
    }
    if (e.key === "Escape") {
      e.preventDefault();
      handleCancel();
    }
  };

  if (isEditing) {
    const Component = multiline ? Textarea : Input;
    return (
      <Component
        ref={inputRef as any}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={handleSave}
        onKeyDown={handleKeyDown}
        maxLength={maxLength}
        disabled={isSaving}
        className={cn(
          "h-auto py-1 px-2 text-sm",
          multiline && "min-h-[80px] resize-none",
          className
        )}
        placeholder={placeholder}
      />
    );
  }

  return (
    <div
      className={cn(
        "group cursor-pointer rounded px-2 py-1 -mx-2 -my-1",
        "hover:bg-muted/50 transition-colors",
        "flex items-center gap-1",
        className
      )}
      onClick={() => setIsEditing(true)}
    >
      <span className={cn("flex-1", !value && "text-muted-foreground italic")}>
        {value || placeholder}
      </span>
      <Pencil className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
    </div>
  );
}
