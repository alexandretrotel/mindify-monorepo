import {
  acceptFriendRequest,
  askForFriend,
  cancelFriendRequest,
  getFriendStatus,
  removeFriend,
} from "@/actions/friends.action";
import { useSession } from "@/providers/SessionProvider";
import type { FriendStatus } from "@/types/friends";
import { useEffect, useState } from "react";
import { Alert } from "react-native";

/**
 * Hook to manage the friend status of a user
 *
 * @param friendId The id of the friend
 * @returns The friend status and the function to handle the friend status
 */
export default function useFriendState(friendId: string) {
  const { userId } = useSession();

  const [friendStatus, setFriendStatus] = useState<FriendStatus>("none");

  useEffect(() => {
    const fetchFriendStatus = async () => {
      try {
        const friendStatus = await getFriendStatus(userId as string, friendId);
        setFriendStatus(friendStatus);
      } catch (error) {
        console.error(error);
      }
    };

    fetchFriendStatus();
  }, [friendId, userId]);

  const handleAskFriend = async (friendId: string, friendStatus: FriendStatus) => {
    try {
      if (friendStatus === "none") {
        await askForFriend(userId as string, friendId);
        setFriendStatus("pending");
      } else if (friendStatus === "pending") {
        Alert.alert("Annuler la demande d'ami", "Tu es sûr de vouloir annuler la demande d'ami?", [
          {
            text: "Annuler",
            style: "cancel",
          },
          {
            text: "Annuler la demande",
            style: "destructive",
            onPress: async () => {
              await cancelFriendRequest(userId as string, friendId);
              setFriendStatus("none");
            },
          },
        ]);
      } else if (friendStatus === "requested") {
        await acceptFriendRequest(userId as string, friendId);
        setFriendStatus("accepted");
      } else if (friendStatus === "accepted") {
        Alert.alert("Retirer l'ami", "Tu es sûr de vouloir retirer l'ami?", [
          {
            text: "Annuler",
            style: "cancel",
          },
          {
            text: "Supprimer",
            style: "destructive",
            onPress: async () => {
              await removeFriend(userId as string, friendId);
              setFriendStatus("none");
            },
          },
        ]);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return {
    handleAskFriend,
    friendStatus,
  };
}
