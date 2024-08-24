import { UUID } from "crypto";
import FriendshipButtonClient from "@/components/features/profile/header/client/FriendshipButtonClient";
import { getFriendStatus } from "@/actions/friends";

const FriendshipButton = async ({
  userId,
  profileId,
  size
}: {
  userId: UUID;
  profileId: UUID;
  size?: "default" | "sm" | "lg" | "icon";
}) => {
  const friendStatus = await getFriendStatus(userId, profileId);

  return (
    <FriendshipButtonClient
      userId={userId}
      profileId={profileId}
      initialFriendStatus={friendStatus}
      size={size}
    />
  );
};

export default FriendshipButton;
