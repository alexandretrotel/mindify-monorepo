"use client";
import "client-only";

import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TypographyH3AsSpan from "@/components/typography/h3AsSpan";
import TypographyH5AsSpan from "@/components/typography/h5AsSpan";
import TypographyP from "@/components/typography/p";
import {
  acceptFriendRequest,
  getFriendsData,
  getPendingFriendsData,
  rejectFriendRequest,
  removeFriend
} from "@/actions/friends";
import { UUID } from "crypto";
import type { User } from "@supabase/supabase-js";
import { useToast } from "@/components/ui/use-toast";

const MyFriends = ({ userId }: { userId: UUID }) => {
  const [pendingFriends, setPendingFriends] = React.useState<User[]>([]);
  const [friends, setFriends] = React.useState<User[]>([]);

  const { toast } = useToast();

  React.useEffect(() => {
    const fetchFriends = async () => {
      const friends = await getFriendsData({ userId });

      setFriends(friends);
    };

    fetchFriends();
  }, [userId]);

  React.useEffect(() => {
    const fetchPendingFriends = async () => {
      const pendingFriends = await getPendingFriendsData({ userId });

      setPendingFriends(pendingFriends);
    };

    fetchPendingFriends();
  }, [userId]);

  const handleRemoveFriend = async (friendId: UUID) => {
    setFriends(friends.filter((friend) => friend.id !== friendId));

    try {
      await removeFriend({ userId, profileId: friendId });

      toast({
        title: "Ami supprimé",
        description: "L'ami a été supprimé avec succès."
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer l'ami.",
        variant: "destructive"
      });
      setFriends(friends);
    }
  };

  const handleAcceptFriendRequest = async ({
    userId,
    profileId
  }: {
    userId: UUID;
    profileId: UUID;
  }) => {
    setPendingFriends(pendingFriends.filter((friend) => friend.id !== profileId));
    setFriends([...friends, pendingFriends.find((friend) => friend.id === profileId) as User]);

    try {
      await acceptFriendRequest({ userId, profileId });

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
      setPendingFriends(pendingFriends);
      setFriends(friends);
    }
  };

  const handleRejectFriendRequest = async ({
    userId,
    profileId
  }: {
    userId: UUID;
    profileId: UUID;
  }) => {
    setPendingFriends(pendingFriends.filter((friend) => friend.id !== profileId));

    try {
      await rejectFriendRequest({ userId, profileId });

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
      setPendingFriends(pendingFriends);
    }
  };

  return (
    <Tabs defaultValue="my-friends">
      <div className="flex flex-col gap-4">
        <div className="flex w-full items-center justify-between gap-8">
          <TabsList>
            <TabsTrigger value="my-friends">Mes amis</TabsTrigger>
            <TabsTrigger value="friends-requests">
              Demandes d&apos;amis ({pendingFriends.length})
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="my-friends">
          <Card>
            <ScrollArea className="h-96 w-full">
              <CardHeader>
                <CardTitle>
                  <TypographyH3AsSpan>Mes amis</TypographyH3AsSpan>
                </CardTitle>
              </CardHeader>

              <CardContent>
                {friends?.length > 0 ? (
                  friends.map((friend) => {
                    return (
                      <div key={friend.id}>
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex items-center gap-4">
                            <Avatar>
                              <AvatarImage
                                src={friend.user_metadata.avatar_url}
                                alt={friend.user_metadata.name}
                              />
                              <AvatarFallback>{friend.user_metadata.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col">
                              <TypographyH5AsSpan>{friend.user_metadata.name}</TypographyH5AsSpan>
                              <TypographyP size="xs" muted>
                                {friend.user_metadata.biography ?? "Aucune biographie"}
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
                        {friends.indexOf(friend) !== friends.length - 1 && (
                          <Separator className="my-4" />
                        )}
                      </div>
                    );
                  })
                ) : (
                  <TypographyP size="sm" muted>
                    Vous n&apos;avez pas encore d&apos;amis.
                  </TypographyP>
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
                    <TypographyH3AsSpan>Demandes d&apos;amis</TypographyH3AsSpan>
                  </CardTitle>
                </div>
              </CardHeader>

              <CardContent>
                {pendingFriends.length > 0 ? (
                  pendingFriends.map((friend) => {
                    return (
                      <div key={friend.id}>
                        <div className="flex flex-col gap-4">
                          <div className="flex items-center gap-4">
                            <Avatar>
                              <AvatarImage
                                src={friend.user_metadata.avatar_url}
                                alt={friend.user_metadata.name}
                              />
                              <AvatarFallback>{friend.user_metadata.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col">
                              <TypographyH5AsSpan>{friend.user_metadata.name}</TypographyH5AsSpan>
                              <TypographyP size="xs" muted>
                                {friend.user_metadata.biography ?? "Aucune biographie"}
                              </TypographyP>
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
                  <TypographyP size="sm" muted>
                    Vous n&apos;avez pas de demandes d&apos;amis en attente.
                  </TypographyP>
                )}
              </CardContent>
            </ScrollArea>
          </Card>
        </TabsContent>
      </div>
    </Tabs>
  );
};

export default MyFriends;
