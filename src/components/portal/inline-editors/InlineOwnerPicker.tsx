"use client";

import { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Check, User, UserX } from "lucide-react";
import { cn } from "@/lib/utils";

interface TeamMember {
  id: string;
  name: string;
  email: string;
  avatar_url: string | null;
}

interface InlineOwnerPickerProps {
  owner: { id: string; name: string; avatar_url: string | null } | null;
  onOwnerChange: (ownerId: string | null) => Promise<void>;
  teamMembers: TeamMember[];
  disabled?: boolean;
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function InlineOwnerPicker({
  owner,
  onOwnerChange,
  teamMembers,
  disabled = false,
}: InlineOwnerPickerProps) {
  const [open, setOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleSelect = async (memberId: string | null) => {
    if (memberId === owner?.id) {
      setOpen(false);
      return;
    }

    setIsUpdating(true);
    try {
      await onOwnerChange(memberId);
    } finally {
      setIsUpdating(false);
      setOpen(false);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild disabled={disabled || isUpdating}>
        <button
          className={cn(
            "flex items-center gap-1.5 rounded-full",
            "transition-all duration-150",
            "focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-400",
            "hover:ring-2 hover:ring-muted-foreground/20",
            disabled && "opacity-50 cursor-not-allowed",
            isUpdating && "opacity-70"
          )}
        >
          {owner ? (
            <Avatar className="h-6 w-6">
              <AvatarImage src={owner.avatar_url || undefined} alt={owner.name} />
              <AvatarFallback className="text-[10px] bg-primary/10 text-primary">
                {getInitials(owner.name)}
              </AvatarFallback>
            </Avatar>
          ) : (
            <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center">
              <User className="h-3.5 w-3.5 text-muted-foreground" />
            </div>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-56 p-0" align="start">
        <Command>
          <CommandInput placeholder="Search team..." />
          <CommandList>
            <CommandEmpty>No team member found.</CommandEmpty>
            <CommandGroup>
              {/* Unassigned option */}
              <CommandItem
                onSelect={() => handleSelect(null)}
                className="flex items-center gap-2"
              >
                <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center">
                  <UserX className="h-3.5 w-3.5 text-muted-foreground" />
                </div>
                <span className="flex-1 text-muted-foreground">Unassigned</span>
                {!owner && <Check className="h-4 w-4" />}
              </CommandItem>

              {/* Team members */}
              {teamMembers.map((member) => (
                <CommandItem
                  key={member.id}
                  onSelect={() => handleSelect(member.id)}
                  className="flex items-center gap-2"
                >
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={member.avatar_url || undefined} alt={member.name} />
                    <AvatarFallback className="text-[10px] bg-primary/10 text-primary">
                      {getInitials(member.name)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="flex-1">{member.name}</span>
                  {owner?.id === member.id && <Check className="h-4 w-4" />}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
