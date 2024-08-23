"use client";
import "client-only";

import { askForFriend, cancelFriendRequest, removeFriend } from "@/actions/friends";
import React from "react";
import { Button } from "@/components/ui/button";
import { UUID } from "crypto";
import { useToast } from "@/components/ui/use-toast";
import type { Enums } from "@/types/supabase";

const ClientFriendship = ({
  userId,
  profileId,
  initialFriendStatus,
  size
}: {
  userId: UUID;
  profileId: UUID;
  initialFriendStatus: Enums<"friends_status"> | undefined;
  size?: "default" | "sm" | "lg" | "icon";
}) => {
  const [friendStatus, setFriendStatus] = React.useState<Enums<"friends_status"> | undefined>(
    initialFriendStatus
  );

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
      setFriendStatus(undefined);
      toast({
        title: "Erreur",
        description: "Impossible d'envoyer la demande d'ami.",
        variant: "destructive"
      });
    }
  };

  const handleCancelFriendRequest = async (userId: UUID, profileId: UUID) => {
    setFriendStatus(undefined);

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

  const handleRemoveFriend = async (userId: UUID, profileId: UUID) => {
    setFriendStatus(undefined);

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
      <Button
        variant="destructive"
        onClick={() => handleCancelFriendRequest(userId, profileId)}
        size={size}
      >
        Annuler la demande d&apos;ami
      </Button>
    );
  }

  if (friendStatus === "accepted") {
    return (
      <Button
        variant="destructive"
        onClick={() => handleRemoveFriend(userId, profileId)}
        size={size}
      >
        Retirer de mes amis
      </Button>
    );
  }

  return (
    <Button onClick={() => handleAskForFriend(userId, profileId)} size={size}>
      Demander en ami
    </Button>
  );
};

export default ClientFriendship;
