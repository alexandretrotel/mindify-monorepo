"use client";
import "client-only";

import { askForFriend, getFriendStatus, removeFriend } from "@/actions/friends";
import React from "react";
import { Button } from "@/components/ui/button";
import { UUID } from "crypto";
import { useToast } from "@/components/ui/use-toast";

const Friendship = ({ userId, profileId }: { userId: UUID; profileId: UUID }) => {
  const [isFriend, setIsFriend] = React.useState<boolean>(false);
  const [friendStatus, setFriendStatus] = React.useState<string | undefined>(undefined);

  React.useEffect(() => {
    const fetchFriendStatus = async () => {
      const friendStatus = await getFriendStatus({ userId, profileId });
      setFriendStatus(friendStatus);
    };

    fetchFriendStatus();
  }, [profileId, userId]);

  React.useEffect(() => {
    if (friendStatus === "accepted") {
      setIsFriend(true);
    } else {
      setIsFriend(false);
    }
  }, [friendStatus]);

  const { toast } = useToast();

  const handleAskForFriend = async () => {
    if (isFriend) {
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
      toast({
        title: "Erreur",
        description: "Impossible d'envoyer la demande d'ami.",
        variant: "destructive"
      });
    }
  };

  const handleRemoveFriend = async () => {
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
      <Button size="sm" variant="outline" disabled>
        Demande d&apos;ami envoyée
      </Button>
    );
  }

  if (isFriend) {
    return (
      <Button size="sm" variant="outline" onClick={handleRemoveFriend}>
        Retirer de mes amis
      </Button>
    );
  }

  if (!isFriend) {
    return (
      <Button size="sm" onClick={handleAskForFriend}>
        Demander en ami
      </Button>
    );
  }
};

export default Friendship;
