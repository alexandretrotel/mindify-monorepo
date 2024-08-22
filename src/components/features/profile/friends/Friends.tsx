import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import H3Span from "@/components/typography/h3AsSpan";
import { getFriendsData } from "@/actions/friends";
import { UUID } from "crypto";
import type { UserMetadata } from "@supabase/supabase-js";
import H5Span from "@/components/typography/h5AsSpan";
import { getUserCustomAvatarFromUserId } from "@/actions/users";
import { Muted } from "@/components/typography/muted";

const Friends = async ({
  profileId,
  profileMetadata
}: {
  profileId: UUID;
  profileMetadata: UserMetadata;
}) => {
  const friends = await getFriendsData(profileId);

  const friendsPicture = await Promise.all(
    friends?.map(async (friend) => {
      const picture = await getUserCustomAvatarFromUserId(friend?.id as UUID);
      return picture;
    }) ?? []
  );

  return (
    <Card>
      <ScrollArea className="h-96 w-full">
        <CardHeader>
          <CardTitle>
            <H3Span>Amis</H3Span>
          </CardTitle>
        </CardHeader>

        <CardContent>
          {friends?.length > 0 ? (
            friends?.map((friend, index) => {
              return (
                <div key={friend.id}>
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <Avatar>
                        <AvatarImage
                          src={friendsPicture[index]}
                          alt={
                            friend?.user_metadata?.name ??
                            friend?.user_metadata?.email?.split("@")[0]
                          }
                        />
                        <AvatarFallback>
                          {friend?.user_metadata?.name
                            ? friend?.user_metadata?.name?.charAt(0)
                            : "J"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <H5Span>
                          {friend?.user_metadata?.name ??
                            friend?.user_metadata?.email?.split("@")[0]}
                        </H5Span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <Button variant="secondary" size="sm" asChild>
                        <Link href={`/app/profile/${friend.id}`} className="flex items-center">
                          Voir le profil
                        </Link>
                      </Button>
                    </div>
                  </div>
                  {friends.indexOf(friend) !== friends.length - 1 && <Separator className="my-4" />}
                </div>
              );
            })
          ) : (
            <Muted size="sm">{profileMetadata?.name} n&apos;a pas encore d&apos;amis.</Muted>
          )}
        </CardContent>
      </ScrollArea>
    </Card>
  );
};

export default Friends;
