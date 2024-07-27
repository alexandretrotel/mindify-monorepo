"use client";
import "client-only";

import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import TypographyH3AsSpan from "@/components/typography/h3AsSpan";
import TypographyP from "@/components/typography/p";
import { getFriendsData } from "@/actions/friends";
import { UUID } from "crypto";
import type { User, UserMetadata } from "@supabase/supabase-js";

const Friends = ({
  profileId,
  profileMetadata
}: {
  profileId: UUID;
  profileMetadata: UserMetadata;
}) => {
  const [friends, setFriends] = React.useState<User[]>([]);

  React.useEffect(() => {
    const fetchFriends = async () => {
      const friends = await getFriendsData({ userId: profileId });

      setFriends(friends);
    };

    fetchFriends();
  }, [profileId]);

  return (
    <Card>
      <ScrollArea className="h-96 w-full">
        <CardHeader>
          <CardTitle>
            <TypographyH3AsSpan>Amis</TypographyH3AsSpan>
          </CardTitle>
        </CardHeader>

        <CardContent>
          {friends?.length > 0 ? (
            friends?.map((friend) => {
              return (
                <>
                  <div key={friend.id} className="flex flex-col gap-4">
                    <div className="flex items-center gap-4">
                      <Avatar>
                        <AvatarImage
                          src={friend.user_metadata.avatar}
                          alt={friend.user_metadata.name}
                        />
                        <AvatarFallback>{friend.user_metadata.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <TypographyP size="xs" muted>
                          {friend.user_metadata.biography ?? "Pas de biographie"}
                        </TypographyP>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <Button variant="outline" size="sm" asChild>
                        <Link
                          href={`/app/profile?profileId=${friend.id}`}
                          className="flex items-center"
                        >
                          Voir le profil
                        </Link>
                      </Button>
                    </div>
                  </div>
                  {friends.indexOf(friend) !== friends.length - 1 && <Separator className="my-4" />}
                </>
              );
            })
          ) : (
            <TypographyP size="sm" muted>
              {profileMetadata?.name} n&apos;a pas encore d&apos;amis.
            </TypographyP>
          )}
        </CardContent>
      </ScrollArea>
    </Card>
  );
};

export default Friends;
