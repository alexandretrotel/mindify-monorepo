"use client";
import "client-only";

import React from "react";
import type { User } from "@supabase/supabase-js";
import { useToast } from "@/components/ui/use-toast";
import { acceptFriendRequest, rejectFriendRequest } from "@/actions/friends";
import { UUID } from "crypto";
import Fuse from "fuse.js";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { TabsContent } from "@/components/ui/tabs";
import H3Span from "@/components/typography/h3AsSpan";
import H5Span from "@/components/typography/h5AsSpan";
import Span from "@/components/typography/span";
import type { Streaks } from "@/types/streaks";
import ResponsiveTooltip from "@/components/global/ResponsiveTooltip";
import { FlameIcon } from "lucide-react";
import { Muted } from "@/components/typography/muted";
import Semibold from "@/components/typography/semibold";

const MyFriendClient = ({
  userId,
  initialFriends,
  initialPendingFriends,
  friendsPicture,
  pendingFriendsPicture,
  friendsReadingStreak
}: {
  userId: UUID;
  initialFriends: User[];
  initialPendingFriends: User[];
  friendsPicture: string[];
  pendingFriendsPicture: string[];
  friendsReadingStreak: Streaks;
}) => {
  const [friends, setFriends] = React.useState<User[]>(initialFriends);
  const [pendingFriends, setPendingFriends] = React.useState<User[]>(initialPendingFriends);
  const [friendsFilter, setFriendsFilter] = React.useState<string | undefined>(undefined);

  const fuse = new Fuse(friends, {
    keys: ["user_metadata.name", "user_metadata.biography"]
  });

  const filteredFriends = friendsFilter
    ? fuse.search(friendsFilter).map((result) => result.item)
    : friends;

  const { toast } = useToast();

  const handleAcceptFriendRequest = async ({
    userId,
    profileId
  }: {
    userId: UUID;
    profileId: UUID;
  }) => {
    const initialFriends = friends;
    const initialPendingFriends = pendingFriends;

    setPendingFriends(pendingFriends.filter((friend) => friend.id !== profileId));
    setFriends([...friends, pendingFriends.find((friend) => friend.id === profileId) as User]);

    try {
      await acceptFriendRequest(userId, profileId);

      toast({
        title: "Demande d'ami acceptée",
        description: "La demande d'ami a été acceptée avec succès."
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Erreur",
        description: "Impossible d'accepter la demande d'ami.",
        variant: "destructive"
      });
      setPendingFriends(initialPendingFriends);
      setFriends(initialFriends);
    }
  };

  const handleRejectFriendRequest = async ({
    userId,
    profileId
  }: {
    userId: UUID;
    profileId: UUID;
  }) => {
    const initialPendingFriends = pendingFriends;

    setPendingFriends(pendingFriends.filter((friend) => friend.id !== profileId));

    try {
      await rejectFriendRequest(userId, profileId);

      toast({
        title: "Demande d'ami rejetée",
        description: "La demande d'ami a été rejetée avec succès."
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Erreur",
        description: "Impossible de rejeter la demande d'ami.",
        variant: "destructive"
      });
      setPendingFriends(initialPendingFriends);
    }
  };

  return (
    <>
      <TabsContent value="my-friends">
        <Card>
          <ScrollArea className="h-96 w-full">
            <CardHeader>
              <CardTitle>
                <div className="flex w-full items-center justify-between gap-4">
                  <div className="flex-shrink-0">
                    <H3Span>Mes amis</H3Span>
                  </div>

                  <div className="w-fit">
                    <Input
                      placeholder="Rechercher un ami"
                      value={friendsFilter ?? ""}
                      onChange={(e) => setFriendsFilter(e.target.value)}
                    />
                  </div>
                </div>
              </CardTitle>
            </CardHeader>

            <CardContent>
              {filteredFriends?.length > 0 ? (
                filteredFriends.map((friend, index) => {
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
                              {friend.user_metadata?.name
                                ? friend?.user_metadata?.name?.charAt(0)
                                : "J"}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col">
                            <div className="flex items-center gap-2">
                              <H5Span>
                                {friend?.user_metadata?.name ??
                                  friend?.user_metadata?.email?.split("@")[0]}
                              </H5Span>

                              {friendsReadingStreak[index]?.todayInStreak &&
                                friendsReadingStreak[index]?.currentStreak !== 0 && (
                                  <div className="flex items-center gap-2">
                                    <Span>•</Span>

                                    <Semibold>
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
                                    </Semibold>
                                  </div>
                                )}
                            </div>
                            <Muted size="xs">
                              {friend?.user_metadata?.biography ?? "Aucune biographie"}
                            </Muted>
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
                      {filteredFriends.indexOf(friend) !== friends.length - 1 && (
                        <Separator className="my-4" />
                      )}
                    </div>
                  );
                })
              ) : (
                <Muted size="sm">Aucun ami trouvé.</Muted>
              )}
            </CardContent>
          </ScrollArea>
        </Card>
      </TabsContent>

      <TabsContent value="friends-requests">
        <Card>
          <ScrollArea className="h-96 w-full">
            <CardHeader>
              <div className="flex w-full items-center justify-between">
                <CardTitle>
                  <H3Span>Demandes d&apos;amis</H3Span>
                </CardTitle>
              </div>
            </CardHeader>

            <CardContent>
              {pendingFriends.length > 0 ? (
                pendingFriends.map((friend, index) => {
                  return (
                    <div key={friend.id}>
                      <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-4">
                          <Avatar>
                            <AvatarImage
                              src={pendingFriendsPicture[index]}
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
                            <Muted size="xs">
                              {friend?.user_metadata?.biography ?? "Aucune biographie"}
                            </Muted>
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          <Button
                            size="sm"
                            onClick={() =>
                              handleAcceptFriendRequest({ userId, profileId: friend.id as UUID })
                            }
                          >
                            Accepter
                          </Button>
                          <Button
                            onClick={() =>
                              handleRejectFriendRequest({ userId, profileId: friend.id as UUID })
                            }
                            variant="outline"
                            size="sm"
                          >
                            Refuser
                          </Button>
                        </div>
                      </div>
                      {pendingFriends.indexOf(friend) !== pendingFriends.length - 1 && (
                        <Separator className="my-4" />
                      )}
                    </div>
                  );
                })
              ) : (
                <Muted size="sm">Vous n&apos;avez pas de demandes d&apos;amis en attente.</Muted>
              )}
            </CardContent>
          </ScrollArea>
        </Card>
      </TabsContent>
    </>
  );
};

export default MyFriendClient;
