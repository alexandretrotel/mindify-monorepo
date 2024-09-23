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
import { acceptFriendRequest, cancelFriendRequest } from "@/actions/friends.action";
import { useToast } from "@/components/ui/use-toast";
import type { FriendStatus } from "@/types/friends";

type FriendRequestObjectWithDisplayButtons = {
  userId: UUID;
  friendId: UUID;
  isConnected: boolean;
  requestedFriends?: User[];
  pendingFriends?: User[];
  displayRequestButton: boolean;
  displayCancelButton: boolean;
  friendStatus?: FriendStatus;
};

const UserCard = ({
  user,
  userPicture,
  heightFull,
  friendRequestObject,
  setFriendStatuses
}: {
  user: User;
  userPicture: string;
  heightFull?: boolean;
  friendRequestObject?: FriendRequestObjectWithDisplayButtons;
  setFriendStatuses?: React.Dispatch<React.SetStateAction<FriendStatus[]>>;
}) => {
  const { toast } = useToast();

  if (friendRequestObject?.displayCancelButton && friendRequestObject?.friendStatus !== "pending") {
    return null;
  }

  if (
    friendRequestObject?.displayRequestButton &&
    friendRequestObject?.friendStatus !== "requested"
  ) {
    return null;
  }

  return (
    <Card className={`${heightFull ? "h-full max-h-64" : ""}`}>
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
            <RenderFriendRequestButton
              userId={user?.id as UUID}
              friendRequestObject={friendRequestObject as FriendRequestObjectWithDisplayButtons}
              setFriendStatuses={setFriendStatuses}
              toast={toast}
            />
          </div>
        </CardFooter>
      </div>
    </Card>
  );
};

function RenderFriendRequestButton({
  userId,
  friendRequestObject,
  setFriendStatuses,
  toast
}: Readonly<{
  userId: UUID;
  friendRequestObject: {
    userId: UUID;
    friendId: UUID;
    isConnected: boolean;
    requestedFriends?: User[];
    displayRequestButton: boolean;
    displayCancelButton: boolean;
  };
  setFriendStatuses: React.Dispatch<React.SetStateAction<FriendStatus[]>>;
  toast: ReturnType<typeof useToast>["toast"];
}>) {
  if (friendRequestObject?.displayCancelButton) {
    return (
      <CancelButton
        friendRequestObject={friendRequestObject}
        setFriendStatuses={setFriendStatuses}
        toast={toast}
      />
    );
  }

  if (friendRequestObject?.displayRequestButton) {
    return (
      <RequestedButtons
        friendRequestObject={friendRequestObject}
        setFriendStatuses={setFriendStatuses}
        toast={toast}
      />
    );
  }

  return (
    <Button variant="secondary" size="sm" asChild>
      <Link href={`/profile/${userId}`}>Voir le profil</Link>
    </Button>
  );
}

function CancelButton({
  friendRequestObject,
  setFriendStatuses,
  toast
}: Readonly<{
  friendRequestObject: {
    userId: UUID;
    friendId: UUID;
    isConnected: boolean;
    requestedFriends?: User[];
    displayRequestButton: boolean;
    displayCancelButton: boolean;
  };
  setFriendStatuses: React.Dispatch<React.SetStateAction<FriendStatus[]>>;
  toast: ReturnType<typeof useToast>["toast"];
}>) {
  const handleCancelFriendRequest = async (userId: UUID, profileId: UUID) => {
    setFriendStatuses((prev) => prev.filter((status) => status !== "pending"));

    try {
      await cancelFriendRequest(userId, profileId);

      toast({
        title: "Demande annulée",
        description: "La demande d'ami a été annulée avec succès."
      });
    } catch (error) {
      console.error(error);
      setFriendStatuses((prev) => [...prev, "pending"]);
      toast({
        title: "Erreur",
        description: "Impossible d'annuler la demande d'ami.",
        variant: "destructive"
      });
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger disabled={!friendRequestObject?.isConnected} asChild>
        <Button variant="destructive" size="sm">
          Annuler la demande
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent className="max-w-xs md:max-w-lg">
        <AlertDialogHeader>
          <AlertDialogTitle>Êtes-vous sûr de vouloir annuler cette demande ?</AlertDialogTitle>

          <AlertDialogDescription>
            Vous ne pourrez plus voir les activités de cet ami. Vous devrez envoyer une nouvelle
            demande d&apos;ami pour être de nouveau amis.
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
                  friendRequestObject?.userId,
                  friendRequestObject?.friendId
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
  );
}

function RequestedButtons({
  friendRequestObject,
  setFriendStatuses,
  toast
}: Readonly<{
  friendRequestObject: {
    userId: UUID;
    friendId: UUID;
    isConnected: boolean;
    requestedFriends?: User[];
    displayRequestButton: boolean;
    displayCancelButton: boolean;
  };
  setFriendStatuses: React.Dispatch<React.SetStateAction<FriendStatus[]>>;
  toast: ReturnType<typeof useToast>["toast"];
}>) {
  const handleAcceptFriendRequest = async (userId: UUID, profileId: UUID) => {
    setFriendStatuses((prev) => prev.filter((status) => status !== "pending"));

    try {
      await acceptFriendRequest(userId, profileId);

      toast({
        title: "Demande acceptée",
        description: "La demande d'ami a été acceptée avec succès."
      });
    } catch (error) {
      console.error(error);
      setFriendStatuses((prev) => [...prev, "pending"]);
      toast({
        title: "Erreur",
        description: "Impossible d'accepter la demande d'ami.",
        variant: "destructive"
      });
    }
  };

  const handleRejectFriendRequest = async (userId: UUID, profileId: UUID) => {
    setFriendStatuses((prev) => prev.filter((status) => status !== "pending"));

    try {
      await cancelFriendRequest(userId, profileId);

      toast({
        title: "Demande refusée",
        description: "La demande d'ami a été refusée avec succès."
      });
    } catch (error) {
      console.error(error);
      setFriendStatuses((prev) => [...prev, "pending"]);
      toast({
        title: "Erreur",
        description: "Impossible de refuser la demande d'ami.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="grid grid-cols-2 gap-4">
      <Button
        size="sm"
        disabled={!friendRequestObject?.isConnected}
        onClick={() =>
          handleAcceptFriendRequest(friendRequestObject?.userId, friendRequestObject?.friendId)
        }
      >
        Accepter
      </Button>

      <Button
        variant="destructive"
        size="sm"
        disabled={!friendRequestObject?.isConnected}
        onClick={() =>
          handleRejectFriendRequest(friendRequestObject?.userId, friendRequestObject?.friendId)
        }
      >
        Refuser
      </Button>
    </div>
  );
}

export default UserCard;
