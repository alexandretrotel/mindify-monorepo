import type { User } from "@supabase/supabase-js";
import React from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Semibold from "@/components/typography/semibold";
import { Muted } from "@/components/typography/muted";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { UserRoundIcon } from "lucide-react";

const UserCard = ({ user, userPicture }: { user: User; userPicture: string }) => {
  return (
    <Card className="h-full">
      <div className="flex h-full flex-col justify-between">
        <div>
          <CardHeader>
            <div className="flex items-center gap-4">
              <Avatar>
                <AvatarImage src={userPicture ?? ""} alt={user?.user_metadata?.name} />
                <AvatarFallback>
                  {user?.user_metadata?.name ? (
                    user?.user_metadata?.name?.charAt(0)
                  ) : (
                    <UserRoundIcon className="h-4 w-4" />
                  )}
                </AvatarFallback>
              </Avatar>

              <CardTitle>
                <Semibold size="lg">{user?.user_metadata?.name}</Semibold>
              </CardTitle>
            </div>
          </CardHeader>

          <CardContent>
            <Muted size="sm">
              {user?.user_metadata?.biography
                ? user?.user_metadata?.biography
                : "Aucune biographie"}
            </Muted>
          </CardContent>
        </div>

        <CardFooter>
          <div className="grid w-full grid-cols-1 gap-4">
            <Button variant="secondary" size="sm" asChild>
              <Link href={`/profile/${user?.id}`}>Voir le profil</Link>
            </Button>
          </div>
        </CardFooter>
      </div>
    </Card>
  );
};

export default UserCard;
