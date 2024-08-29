"use client";
import "client-only";

import {
  acceptFriendRequest,
  askForFriend,
  cancelFriendRequest,
  removeFriend
} from "@/actions/friends";
import React from "react";
import { Button } from "@/components/ui/button";
import { UUID } from "crypto";
import { useToast } from "@/components/ui/use-toast";
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
import { FriendStatus } from "@/types/friends";

const FriendshipButtonClient = ({
  userId,
  profileId,
  initialFriendStatus,
  size,
  isConnected
}: {
  userId: UUID;
  profileId: UUID;
  initialFriendStatus: FriendStatus;
  size?: "default" | "sm" | "lg" | "icon";
  isConnected: boolean;
}) => {
  const [friendStatus, setFriendStatus] = React.useState<FriendStatus>(initialFriendStatus);

  const { toast } = useToast();

  const handleAskForFriend = async (userId: UUID, profileId: UUID) => {
    if (friendStatus === "pending") {
      return;
    }

    setFriendStatus("pending");

    try {
      await askForFriend(userId, profileId);

      toast({
        title: "Demande envoyée",
        description: "La demande d'ami a été envoyée avec succès."
      });
    } catch (error) {
      console.error(error);
      setFriendStatus("none");
      toast({
        title: "Erreur",
        description: "Impossible d'envoyer la demande d'ami.",
        variant: "destructive"
      });
    }
  };

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

  const handleAcceptFriendRequest = async (userId: UUID, profileId: UUID) => {
    setFriendStatus("accepted");

    try {
      await acceptFriendRequest(userId, profileId);
      toast({
        title: "Demande acceptée",
        description: "La demande d'ami a été acceptée avec succès."
      });
    } catch (error) {
      console.error(error);
      setFriendStatus("requested");
      toast({
        title: "Erreur",
        description: "Impossible d'accepter la demande d'ami.",
        variant: "destructive"
      });
    }
  };

  const handleRemoveFriend = async (userId: UUID, profileId: UUID) => {
    setFriendStatus("none");

    try {
      await removeFriend(userId, profileId);
      toast({
        title: "Ami retiré",
        description: "L'ami a été retiré avec succès."
      });
    } catch (error) {
      console.error(error);
      setFriendStatus("accepted");
      toast({
        title: "Erreur",
        description: "Impossible de retirer l'ami.",
        variant: "destructive"
      });
    }
  };

  if (friendStatus === "pending") {
    return (
      <AlertDialog>
        <AlertDialogTrigger disabled={!isConnected} asChild>
          <Button variant="destructive" size={size}>
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
              <Button variant="secondary" size={size}>
                Annuler
              </Button>
            </AlertDialogCancel>

            <AlertDialogAction asChild>
              <Button onClick={() => handleCancelFriendRequest(userId, profileId)} size={size}>
                Confirmer
              </Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }

  if (friendStatus === "requested") {
    return (
      <Button
        onClick={() => handleAcceptFriendRequest(userId, profileId)}
        size={size}
        disabled={!isConnected}
      >
        Accepter en ami
      </Button>
    );
  }

  if (friendStatus === "accepted") {
    return (
      <AlertDialog>
        <AlertDialogTrigger disabled={!isConnected} asChild>
          <Button variant="destructive" size={size}>
            Retirer de mes amis
          </Button>
        </AlertDialogTrigger>

        <AlertDialogContent className="max-w-xs md:max-w-lg">
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr de vouloir retirer cet ami ?</AlertDialogTitle>

            <AlertDialogDescription>
              Vous ne pourrez plus voir les activités de cet ami. Vous devrez envoyer une nouvelle
              demande d&apos;ami pour être de nouveau amis.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel asChild>
              <Button variant="secondary" size={size}>
                Annuler
              </Button>
            </AlertDialogCancel>

            <AlertDialogAction asChild>
              <Button onClick={() => handleRemoveFriend(userId, profileId)} size={size}>
                Confirmer
              </Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }

  return (
    <Button
      onClick={() => handleAskForFriend(userId, profileId)}
      size={size}
      disabled={!isConnected}
    >
      Demander en ami
    </Button>
  );
};

export default FriendshipButtonClient;
