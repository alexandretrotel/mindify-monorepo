import React from "react";
import FlashcardSet from "@/components/features/learn/FlashcardSet";
import { createClient } from "@/utils/supabase/server";
import type { UUID } from "crypto";
import CreateFlashcardSet from "@/components/features/learn/CreateFlashcardSet";

export default async function flashcardGrid({ userId }: { userId: UUID }) {
  const supabase = createClient();

  const { count: savedMindsCount, error } = await supabase
    .from("saved_minds")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId);

  if (error) {
    console.error(error);
  }

  const savedMinds = {
    title: "Enregistrés",
    description: "Ce sont tous les minds que vous avez enregistrés.",
    totalLength: savedMindsCount as number,
    flashcardSetId: 0
  };

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
      <FlashcardSet
        title={savedMinds.title}
        description={savedMinds.description}
        flashcardSetId={savedMinds.flashcardSetId}
        userId={userId}
        heightFull
      />

      <CreateFlashcardSet disabled={false} heightFull />
    </div>
  );
}
