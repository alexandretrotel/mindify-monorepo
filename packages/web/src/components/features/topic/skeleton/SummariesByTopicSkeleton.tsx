import { Input } from "@/components/ui/input";
import { SearchIcon } from "lucide-react";
import React from "react";
import BookCoverSkeleton from "@/components/global/skeleton/BookCoverSkeleton";

const itemsPerPage = 8;

const SummariesByTopicSkeleton = async () => {
  return (
    <React.Fragment>
      <div className="min-w-md relative max-w-md flex-1">
        <SearchIcon className="absolute left-2 top-3 flex h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Titre, auteur, mots-clés, etc..."
          className="w-full rounded-lg bg-background pl-8"
          disabled
        />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: itemsPerPage }).map((_, index) => (
          <BookCoverSkeleton key={index} heightFull />
        ))}
      </div>
    </React.Fragment>
  );
};

export default SummariesByTopicSkeleton;
