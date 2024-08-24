import React from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

const UserCardSkeleton = () => {
  return (
    <Card>
      <div className="flex h-full flex-col justify-between">
        <div>
          <CardHeader>
            <div className="flex items-center gap-4">
              <Skeleton className="h-12 w-12 rounded-full" />

              <CardTitle>
                <Skeleton className="h-6 w-32" />
              </CardTitle>
            </div>
          </CardHeader>

          <CardContent>
            <Skeleton className="h-4 w-64" />
          </CardContent>
        </div>

        <CardFooter>
          <div className="grid w-full grid-cols-1 gap-4">
            <Button variant="secondary" size="sm" disabled>
              Voir le profil
            </Button>
          </div>
        </CardFooter>
      </div>
    </Card>
  );
};

export default UserCardSkeleton;
