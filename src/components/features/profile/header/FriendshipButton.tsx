import { UUID } from "crypto";
import FriendshipButtonClient from "@/components/features/profile/header/client/FriendshipButtonClient";
import { getFriendStatus } from "@/actions/friends";
import type { FriendStatus } from "@/types/friends";

const FriendshipButton = async ({
  userId,
  profileId,
  size,
  isConnected
}: {
  userId: UUID;
  profileId: UUID;
  size?: "default" | "sm" | "lg" | "icon";
  isConnected: boolean;
}) => {
  let friendStatus: FriendStatus = "none";
  if (isConnected) {
    friendStatus = await getFriendStatus(userId, profileId);
  }

  return (
    <FriendshipButtonClient
      userId={userId}
      profileId={profileId}
      initialFriendStatus={friendStatus}
      size={size}
      isConnected={isConnected}
    />
  );
};

export default FriendshipButton;
