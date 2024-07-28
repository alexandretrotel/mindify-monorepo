"use client";
import "client-only";

import { askForFriend, cancelFriendRequest, removeFriend } from "@/src/actions/friends";
import React from "react";
import { Button } from "@/components/ui/button";
import { UUID } from "crypto";
import { useToast } from "@/components/ui/use-toast";
import type { FriendStatus } from "@/types/user";

const ClientFriendship = ({
  userId,
  profileId,
  initialFriendStatus
}: {
  userId: UUID;
  profileId: UUID;
  initialFriendStatus: FriendStatus;
}) => {
  const [isFriend, setIsFriend] = React.useState<boolean>(false);
  const [friendStatus, setFriendStatus] = React.useState<FriendStatus | undefined>(
    initialFriendStatus
  );

  React.useEffect(() => {
    if (friendStatus === "accepted") {
      setIsFriend(true);
    } else {
      setIsFriend(false);
    }
  }, [friendStatus]);

  const { toast } = useToast();

  const handleAskForFriend = async ({ userId, profileId }: { userId: UUID; profileId: UUID }) => {
    if (isFriend) {
      return;
    }

    if (friendStatus === "pending") {
      return;
    }

    setIsFriend(true);
    setFriendStatus("pending");

    try {
      await askForFriend({ userId, profileId });

      toast({
        title: "Demande envoyée",
        description: "La demande d'ami a été envoyée avec succès."
      });
    } catch (error) {
      console.error(error);
      setIsFriend(false);
      setFriendStatus(undefined);
      toast({
        title: "Erreur",
        description: "Impossible d'envoyer la demande d'ami.",
        variant: "destructive"
      });
    }
  };

  const handleCancelFriendRequest = async ({
    userId,
    profileId
  }: {
    userId: UUID;
    profileId: UUID;
  }) => {
    setIsFriend(false);
    setFriendStatus(undefined);

    try {
      await cancelFriendRequest({ userId, profileId });

      toast({
        title: "Demande annulée",
        description: "La demande d'ami a été annulée avec succès."
      });
    } catch (error) {
      console.error(error);
      setIsFriend(true);
      setFriendStatus("pending");
      toast({
        title: "Erreur",
        description: "Impossible d'annuler la demande d'ami.",
        variant: "destructive"
      });
    }
  };

  const handleRemoveFriend = async ({ userId, profileId }: { userId: UUID; profileId: UUID }) => {
    setIsFriend(false);

    try {
      await removeFriend({ userId, profileId });
      toast({
        title: "Ami retiré",
        description: "L'ami a été retiré avec succès."
      });
    } catch (error) {
      console.error(error);
      setIsFriend(true);
      toast({
        title: "Erreur",
        description: "Impossible de retirer l'ami.",
        variant: "destructive"
      });
    }
  };

  if (!isFriend && friendStatus === "pending") {
    return (
      <Button
        size="sm"
        variant="destructive"
        onClick={() => handleCancelFriendRequest({ userId, profileId })}
      >
        Annuler la demande d&apos;ami
      </Button>
    );
  }

  if (isFriend) {
    return (
      <Button
        size="sm"
        variant="destructive"
        onClick={() => handleRemoveFriend({ userId, profileId })}
      >
        Retirer de mes amis
      </Button>
    );
  }

  if (!isFriend) {
    return (
      <Button size="sm" onClick={() => handleAskForFriend({ userId, profileId })}>
        Demander en ami
      </Button>
    );
  }
};

export default ClientFriendship;
