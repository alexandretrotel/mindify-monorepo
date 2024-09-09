"use client";
import { useToast } from "@/components/ui/use-toast";
import "client-only";

import { PlusIcon } from "lucide-react";
import React from "react";

export default function CreateFlashcardSet({ disabled }: Readonly<{ disabled: boolean }>) {
  const { toast } = useToast();

  const handleCreate = async () => {
    toast({
      title: "Fonctionnalité à venir",
      description: "Cette fonctionnalité sera bientôt disponible."
    });
  };

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={handleCreate}
      className="flex h-48 items-center justify-center rounded-lg border border-dashed bg-muted hover:border-primary hover:bg-muted/80 active:border-black md:h-full"
    >
      <div className="rounded-full border bg-background p-4 text-center">
        <PlusIcon className="h-6 w-6 text-muted-foreground" />
      </div>
    </button>
  );
}
