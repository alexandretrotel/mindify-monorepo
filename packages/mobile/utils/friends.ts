import type { FriendStatus } from "@/types/friends";

type Variants = {
  variant: "default" | "destructive";
  textVariant: "textDefault" | "textDestructive";
};

/**
 * Returns the button variant and text variant based on the friend's status.
 *
 * @param {FriendStatus} friendStatus - The current status of the friend.
 * @returns {Variants} An object containing the button and text variants.
 */
export const getFriendButtonVariant = (friendStatus: FriendStatus): Variants => {
  switch (friendStatus) {
    case "none":
      return { variant: "default", textVariant: "textDefault" };
    case "pending":
      return { variant: "destructive", textVariant: "textDestructive" };
    case "requested":
      return { variant: "default", textVariant: "textDefault" };
    case "accepted":
      return { variant: "destructive", textVariant: "textDestructive" };
    default:
      return { variant: "default", textVariant: "textDefault" };
  }
};

/**
 * Returns the appropriate text based on the friend's status.
 *
 * @param {FriendStatus} friendStatus - The current status of the friend.
 * @returns {string} A string message representing the action for the friend status.
 */
export const getFriendStatusText = (friendStatus: FriendStatus) => {
  switch (friendStatus) {
    case "none":
      return "Ajouter en ami";
    case "pending":
      return "Annuler la demande";
    case "requested":
      return "Accepter la demande";
    case "accepted":
      return "Supprimer l'ami";
    default:
      return "Ajouter en ami";
  }
};
