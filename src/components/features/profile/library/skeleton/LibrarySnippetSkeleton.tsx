import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BookCoverSkeleton from "@/components/global/skeleton/BookCoverSkeleton";

const LibrarySnippetSkeleton = () => {
  return (
    <Tabs defaultValue="reads">
      <div className="flex flex-col gap-4">
        <div className="flex items-start justify-between gap-8">
          <TabsList>
            <TabsTrigger value="reads">Résumés lus</TabsTrigger>
            <TabsTrigger value="saved">Enregistrés</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="reads" className="w-full">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 6 }).map((_, index) => (
              <BookCoverSkeleton key={index} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="saved">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 6 }).map((_, index) => (
              <BookCoverSkeleton key={index} />
            ))}
          </div>
        </TabsContent>
      </div>
    </Tabs>
  );
};

export default LibrarySnippetSkeleton;
