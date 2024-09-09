import React from "react";
import FlashcardSetSkeleton from "@/components/features/learn/skeleton/FlashcardSetSkeleton";
import CreateFlashcardSet from "../CreateFlashcardSet";

export default async function flashcardGridSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
      {[...Array(7)].map((_, index) => (
        <FlashcardSetSkeleton key={index} />
      ))}

      <CreateFlashcardSet disabled={true} />
    </div>
  );
}
