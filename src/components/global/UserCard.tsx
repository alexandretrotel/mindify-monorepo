"use client";
import "client-only";

import type { User } from "@supabase/supabase-js";
import React from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Semibold from "@/components/typography/semibold";
import { Muted } from "@/components/typography/muted";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { UserRoundIcon } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import type { UUID } from "crypto";
import { cancelFriendRequest } from "@/actions/friends";
import { useToast } from "@/components/ui/use-toast";
import type { FriendStatus } from "@/types/friends";

const UserCard = ({
  user,
  userPicture,
  heightFull,
  cancelFriendRequestObject
}: {
  user: User;
  userPicture: string;
  heightFull?: boolean;
  cancelFriendRequestObject?: {
    userId: UUID;
    profileId: UUID;
    isConnected: boolean;
    displayButton: boolean;
  };
}) => {
  const [friendStatus, setFriendStatus] = React.useState<FriendStatus>("none");

  const { toast } = useToast();

  const handleCancelFriendRequest = async (userId: UUID, profileId: UUID) => {
    setFriendStatus("none");

    try {
      await cancelFriendRequest(userId, profileId);

      toast({
        title: "Demande annulée",
        description: "La demande d'ami a été annulée avec succès."
      });
    } catch (error) {
      console.error(error);
      setFriendStatus("pending");
      toast({
        title: "Erreur",
        description: "Impossible d'annuler la demande d'ami.",
        variant: "destructive"
      });
    }
  };

  if (cancelFriendRequestObject?.displayButton && friendStatus !== "pending") {
    return null;
  }

  return (
    <Card className={`${heightFull ? "h-full" : ""}`}>
      <div className="flex h-full flex-col justify-between">
        <div>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={userPicture} alt={user?.user_metadata?.name} />
                <AvatarFallback>
                  <UserRoundIcon className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>

              <CardTitle>
                <Semibold size="lg">{user?.user_metadata?.name ?? "Inconnu"}</Semibold>
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
            {cancelFriendRequestObject?.displayButton ? (
              <AlertDialog>
                <AlertDialogTrigger disabled={!cancelFriendRequestObject?.isConnected} asChild>
                  <Button variant="destructive" size="sm">
                    Annuler la demande
                  </Button>
                </AlertDialogTrigger>

                <AlertDialogContent className="max-w-xs md:max-w-lg">
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Êtes-vous sûr de vouloir annuler cette demande ?
                    </AlertDialogTitle>

                    <AlertDialogDescription>
                      Vous ne pourrez plus voir les activités de cet ami. Vous devrez envoyer une
                      nouvelle demande d&apos;ami pour être de nouveau amis.
                    </AlertDialogDescription>
                  </AlertDialogHeader>

                  <AlertDialogFooter>
                    <AlertDialogCancel asChild>
                      <Button variant="secondary" size="sm">
                        Annuler
                      </Button>
                    </AlertDialogCancel>

                    <AlertDialogAction asChild>
                      <Button
                        onClick={() =>
                          handleCancelFriendRequest(
                            cancelFriendRequestObject?.userId,
                            cancelFriendRequestObject?.profileId
                          )
                        }
                        size="sm"
                      >
                        Confirmer
                      </Button>
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            ) : (
              <Button variant="secondary" size="sm" asChild>
                <Link href={`/profile/${user?.id}`}>Voir le profil</Link>
              </Button>
            )}
          </div>
        </CardFooter>
      </div>
    </Card>
  );
};

export default UserCard;
