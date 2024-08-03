import React from "react";
import H3 from "@/components/typography/h3";
import { Input } from "@/components/ui/input";
import { SearchIcon } from "lucide-react";
import { Select, SelectTrigger, SelectValue } from "@/components/ui/select";
import BookCoverSkeleton from "@/components/global/skeleton/BookCoverSkeleton";
import { Badge } from "@/components/ui/badge";

const LibrarySkeleton = async () => {
  return (
    <div className="flex w-full flex-col gap-4">
      <div className="flex items-center gap-2">
        <H3>Librairie</H3>
        <Badge>0 résumé</Badge>
      </div>

      <div className="flex w-full flex-col justify-between gap-4 md:flex-row">
        <div className="min-w-md relative max-w-md flex-1">
          <SearchIcon className="absolute left-2 top-3 flex h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Titre, auteur, mots-clés etc..."
            className="w-full rounded-lg bg-background pl-8"
            disabled
          />
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          {/* Catégories */}
          <Select disabled>
            <SelectTrigger className="w-full lg:min-w-[200px]">
              <SelectValue>Par catégorie</SelectValue>
            </SelectTrigger>
          </Select>

          {/* Source */}
          <Select disabled>
            <SelectTrigger className="w-full lg:min-w-[200px]">
              <SelectValue>Par source</SelectValue>
            </SelectTrigger>
          </Select>

          {/* Enregistrés, terminés, etc */}
          <Select disabled>
            <SelectTrigger className="w-full lg:min-w-[200px]">
              <SelectValue>Par statut</SelectValue>
            </SelectTrigger>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {[...Array(8)].map((_, index) => (
          <BookCoverSkeleton key={index} />
        ))}
      </div>
    </div>
  );
};

export default LibrarySkeleton;
