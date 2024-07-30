import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import TypographyH3AsSpan from "@/components/typography/h3AsSpan";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";

const MyFriendsSkeleton = () => {
  return (
    <Tabs defaultValue="my-friends">
      <div className="flex flex-col gap-4">
        <div className="flex w-full items-center justify-between gap-8">
          <TabsList>
            <TabsTrigger value="my-friends">Mes amis</TabsTrigger>
            <TabsTrigger value="friends-requests">Demandes d&apos;amis (0)</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="my-friends">
          <Card>
            <ScrollArea className="h-72 w-full">
              <CardHeader>
                <CardTitle>
                  <div className="flex w-full items-center justify-between gap-4">
                    <div className="flex-shrink-0">
                      <TypographyH3AsSpan>Mes amis</TypographyH3AsSpan>
                    </div>

                    <div className="w-fit">
                      <Input placeholder="Rechercher un ami" disabled />
                    </div>
                  </div>
                </CardTitle>
              </CardHeader>

              <CardContent>
                {[...Array(5)].map((_, index) => (
                  <div key={index}>
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <Skeleton className="h-10 w-10 rounded-full" />
                        <div className="flex flex-col gap-2">
                          <Skeleton className="h-6 w-20" />
                          <Skeleton className="h-4 w-20" />
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <Skeleton className="h-8 w-20" />
                      </div>
                    </div>
                    {index < 4 && <Separator className="my-4" />}
                  </div>
                ))}
              </CardContent>
            </ScrollArea>
          </Card>
        </TabsContent>

        <TabsContent value="friends-requests">
          <Card>
            <ScrollArea className="h-72 w-full">
              <CardHeader>
                <div className="flex w-full items-center justify-between">
                  <CardTitle>
                    <TypographyH3AsSpan>Demandes d&apos;amis</TypographyH3AsSpan>
                  </CardTitle>
                </div>
              </CardHeader>

              <CardContent>
                {[...Array(5)].map((_, index) => (
                  <div key={index}>
                    <div className="flex flex-col gap-4">
                      <div className="flex items-center gap-4">
                        <Skeleton className="h-10 w-10 rounded-full" />
                        <div className="flex flex-col gap-2">
                          <Skeleton className="h-6 w-20" />
                          <Skeleton className="h-4 w-20" />
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <Skeleton className="h-8 w-20" />
                        <Skeleton className="h-8 w-20" />
                      </div>
                    </div>
                    {index < 4 && <Separator className="my-4" />}
                  </div>
                ))}
              </CardContent>
            </ScrollArea>
          </Card>
        </TabsContent>
      </div>
    </Tabs>
  );
};

export default MyFriendsSkeleton;
