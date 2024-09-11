"use client";
import Semibold from "@/components/typography/semibold";
import { useToast } from "@/components/ui/use-toast";
import "client-only";

import { PlusIcon } from "lucide-react";
import React from "react";

export default function CreateFlashcardSet({
  disabled,
  heightFull
}: Readonly<{ disabled: boolean; heightFull?: boolean }>) {
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
      className={`flex h-48 items-center justify-center rounded-lg border border-dashed bg-muted hover:bg-muted/80 ${heightFull ? "max-h-56 md:h-full" : ""}`}
    >
      <div className="flex items-center justify-center gap-2 text-center">
        <PlusIcon className="h-6 w-6 text-muted-foreground" />{" "}
        <span className="font-semibold text-muted-foreground">Créer un set</span>
      </div>
    </button>
  );
}
