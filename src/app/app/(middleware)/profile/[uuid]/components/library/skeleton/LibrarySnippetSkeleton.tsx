import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
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
          <Carousel
            opts={{
              align: "start",
              slidesToScroll: "auto"
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-4">
              {Array.from({ length: 6 }).map((_, index) => (
                <CarouselItem key={index} className="basis-1/2 pl-4 md:basis-1/3">
                  <BookCoverSkeleton />
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </TabsContent>

        <TabsContent value="saved">
          <Carousel opts={{ align: "start", slidesToScroll: "auto" }} className="w-full">
            <CarouselContent className="-ml-4">
              {Array.from({ length: 6 }).map((_, index) => (
                <CarouselItem key={index} className="basis-1/2 pl-4 md:basis-1/3">
                  <BookCoverSkeleton />
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </TabsContent>
      </div>
    </Tabs>
  );
};

export default LibrarySnippetSkeleton;
