import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import TypographyH3AsSpan from "@/components/typography/h3AsSpan";
import { getFriendsData } from "@/actions/friends";
import { UUID } from "crypto";
import type { UserMetadata } from "@supabase/supabase-js";
import TypographyH5AsSpan from "@/components/typography/h5AsSpan";
import TypographySpan from "@/components/typography/span";
import { getUserCustomAvatarFromUserId, getUserReadingStreak } from "@/actions/users";
import ResponsiveTooltip from "@/components/global/ResponsiveTooltip";
import { FlameIcon } from "lucide-react";

export const revalidate = 0;

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

  const friendsReadingStreak = await Promise.all(
    friends?.map(async (friend) => {
      const readingStreak = await getUserReadingStreak(friend?.id as UUID);
      return readingStreak;
    }) ?? []
  );

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
                        <div className="flex items-center gap-2">
                          <TypographyH5AsSpan>
                            {friend?.user_metadata?.name ??
                              friend?.user_metadata?.email?.split("@")[0]}
                          </TypographyH5AsSpan>

                          {friendsReadingStreak[index]?.todayInStreak &&
                            friendsReadingStreak[index]?.currentStreak !== 0 && (
                              <div className="flex items-center gap-2">
                                <TypographySpan isDefaultColor>•</TypographySpan>

                                <TypographySpan isDefaultColor semibold>
                                  <ResponsiveTooltip
                                    text="Nombre de jours consécutifs de lecture."
                                    side="bottom"
                                    align="center"
                                    cursor="help"
                                  >
                                    <div className="flex items-center">
                                      {friendsReadingStreak[index]?.currentStreak}
                                      <FlameIcon className="h-4 w-4" />
                                    </div>
                                  </ResponsiveTooltip>
                                </TypographySpan>
                              </div>
                            )}
                        </div>
                        <TypographySpan size="xs" muted>
                          {friend?.user_metadata?.biography ?? "Pas de biographie"}
                        </TypographySpan>
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
            <TypographySpan size="sm" muted>
              {profileMetadata?.name} n&apos;a pas encore d&apos;amis.
            </TypographySpan>
          )}
        </CardContent>
      </ScrollArea>
    </Card>
  );
};

export default Friends;
