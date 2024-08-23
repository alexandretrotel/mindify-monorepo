import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { getFriendsData } from "@/actions/friends";
import { UUID } from "crypto";
import { getUserCustomAvatarFromUserId } from "@/actions/users";
import { Muted } from "@/components/typography/muted";
import Semibold from "@/components/typography/semibold";

const Friends = async ({ profileId, userId }: { profileId: UUID; userId: UUID }) => {
  const friends = await getFriendsData(profileId);

  const friendsPicture = await Promise.all(
    friends?.map(async (friend) => {
      const picture = await getUserCustomAvatarFromUserId(friend?.id as UUID);
      return picture;
    }) ?? []
  );

  if (!friends || friends.length === 0) {
    return (
      <div className="flex h-72 flex-col items-center justify-center gap-4 text-center text-2xl font-semibold">
        Aucun ami
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
      {friends
        ?.filter((friend) => friend?.id !== userId)
        ?.map((friend, index) => {
          return (
            <Card key={friend?.id}>
              <div className="flex h-full flex-col justify-between">
                <div>
                  <CardHeader>
                    <div className="flex items-center gap-4">
                      <Avatar>
                        <AvatarImage src={friendsPicture[index] ?? ""} />
                        <AvatarFallback />
                      </Avatar>

                      <CardTitle>
                        <Semibold size="lg">{friend?.user_metadata?.name}</Semibold>
                      </CardTitle>
                    </div>
                  </CardHeader>

                  <CardContent>
                    <Muted size="sm">
                      {friend?.user_metadata?.biography
                        ? friend?.user_metadata?.biography
                        : "Aucune biographie"}
                    </Muted>
                  </CardContent>
                </div>

                <CardFooter>
                  <div className="grid w-full grid-cols-1 gap-4">
                    <Button variant="secondary" size="sm" asChild>
                      <Link href={`/app/profile/${friend?.id}`}>Voir le profil</Link>
                    </Button>
                  </div>
                </CardFooter>
              </div>
            </Card>
          );
        })}
    </div>
  );
};

export default Friends;
